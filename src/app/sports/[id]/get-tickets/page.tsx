"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { MapPin, Calendar } from "lucide-react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { getSportById } from "../../../api/sports";
import { createCheckout } from "@/app/api/stripe";
import { Footer } from "@/components/footer";

export default function GetTicketsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [sportData, setSportData] = useState<any>(null);
  const [sportId, setSportId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const quantity = parseInt(searchParams.get("quantity") || "1");
  const [attendees, setAttendees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSportData = async () => {
      const resolvedParams = await params;
      const id = resolvedParams.id;
      setSportId(id);
    };

    fetchSportData();
  }, [params]);

  useEffect(() => {
    if (sportId) {
      const fetchSportData = async () => {
        try {
          setLoading(true);
          const data = await getSportById(sportId);
          console.log("Sport data received:", data);

          if (data && data.sport) {
            setSportData(data.sport);
          } else if (data) {
            setSportData(data);
          } else {
            console.error("No sport data found");
          }
        } catch (error) {
          console.error("Error fetching sport data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchSportData();
    }
  }, [sportId]);

  useEffect(() => {
    if (quantity && !isNaN(quantity) && sportData) {
      const initial = Array.from({ length: quantity }, () => ({
        name: "",
        idNumber: "",
        age: "",
        gender: "",
        attendeeEmail: "",
      }));
      setAttendees(initial);
    }
  }, [quantity, sportData]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    agree: false,
    teamName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleAttendeeChange = (
    index: number,
    field: string,
    value: string
  ) => {
    if (field === "age") {
      const ageValue = parseInt(value);
      if (ageValue < 0) {
        alert("Age must be greater than 0");
        return;
      }
      if (isNaN(ageValue)) {
        value = "";
      }
    }

    const updated = [...attendees];
    updated[index][field] = value;
    setAttendees(updated);
  };

  const validateAttendees = () => {
    for (let i = 0; i < attendees.length; i++) {
      const attendee = attendees[i];
      const age = parseInt(attendee.age);

      if (!attendee.name.trim() || !attendee.idNumber.trim() || isNaN(age) || age <= 0) {
        alert(`Please fill in all required fields for Attendee ${i + 1} and ensure age is a valid number greater than 0`);
        return false;
      }
    }
    return true;
  };

  const saveRegistration = async () => {
    const registrationData = {
      sportId: sportId,
      sportName: sportData.sportName,
      sportDate: sportData.date,
      sportVenue: sportData.venue,
      sportTime: sportData.time,
      sportImage: sportData.image,
      quantity: quantity,
      perTicketPrice: sportData.registrationFee,
      totalAmount: total,
      status: "pending",
      billingInfo: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
      },
      attendeeInfo: attendees.map((attendee) => ({
        name: attendee.name,
        idNumber: attendee.idNumber,
        age: attendee.age,
        gender: attendee.gender,
        email: attendee.attendeeEmail,
        teamName: form.teamName,
      })),
      paymentInfo: {
        subtotal: sportData.registrationFee * quantity,
        total: total,
        status: "pending",
      },
      createdAt: new Date().toISOString(),
    };

    try {
      const registrationId = `sport-reg-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      const newRegistration = {
        id: registrationId,
        ...registrationData,
      };

      localStorage.setItem("currentRegistration", JSON.stringify(newRegistration));
      console.log("Registration saved:", newRegistration);
      return registrationId;
    } catch (error) {
      console.error("Error saving registration:", error);
      throw error;
    }
  };

  const handleProceedToPayment = async () => {
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.agree ||
      !form.teamName.trim()
    ) {
      alert("Please fill in all required billing fields.");
      return;
    }

    if (!validateAttendees()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const registrationId = await saveRegistration();

      const checkoutData = {
        sportId: sportId,
        sportName: sportData.sportName,
        quantity: quantity,
        totalAmount: total,
        participantId: registrationId,
      };

      console.log("Checkout data:", checkoutData);

      const res = await createCheckout(checkoutData);

      if (res.data?.session?.url) {
        window.location.href = res.data.session.url;
      } else {
        alert("Payment session failed. Please try again.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Error connecting to payment gateway. Please check your internet connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading sport details...</p>
        </div>
      </div>
    );
  }

  if (!sportData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load sport data</p>
          <Link href="/sports">
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
              Back to Sports
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const total = quantity * (sportData.registrationFee || 0);

  return (
    <main className="bg-background text-foreground">
      <Header />

      {/* Breadcrumb */}
      <div className="px-8 py-4 border-b border-border text-sm text-muted-foreground flex items-center gap-2">
        <Link href="/sports" className="hover:text-primary transition">
          Sports
        </Link>
        <span>/</span>
        <span>Sport Registration</span>
      </div>

      {/* Form Section */}
      <section className="py-12 px-6 md:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
          {/* Left: Form */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="md:col-span-2 bg-card border border-border rounded-xl p-8 space-y-8"
          >
            {/* Billing Info */}
            <div>
              <h2 className="text-xl font-bold mb-4">Billing Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  name="firstName"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={handleChange}
                  className="border border-border rounded-md px-4 py-2 bg-background"
                  required
                />
                <input
                  name="lastName"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={handleChange}
                  className="border border-border rounded-md px-4 py-2 bg-background"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="border border-border rounded-md px-4 py-2 bg-background"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="border border-border rounded-md px-4 py-2 bg-background"
                  required
                />
              </div>
            </div>

            {/* Team Name */}
            <div>
              <h2 className="text-xl font-bold mb-4">Team Information</h2>
              <div className="mb-4">
                <input
                  name="teamName"
                  placeholder="Team Name"
                  value={form.teamName}
                  onChange={handleChange}
                  required
                  className="border border-border rounded-md px-4 py-2 bg-background"
                />
              </div>
            </div>

            {/* Attendee Info */}
            <div>
              <h2 className="text-xl font-bold mb-4">
                Participants Information (Total: {quantity})
              </h2>

              {attendees.map((att, index) => (
                <div
                  key={index}
                  className="mb-6 border border-border rounded-lg p-4"
                >
                  <h4 className="font-semibold mb-3">Participant {index + 1}</h4>

                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      placeholder="Full Name *"
                      value={att.name}
                      onChange={(e) =>
                        handleAttendeeChange(index, "name", e.target.value)
                      }
                      className="border border-border rounded-md px-4 py-2 bg-background"
                      required
                    />

                    <input
                      placeholder="Identification Number *"
                      value={att.idNumber}
                      onChange={(e) =>
                        handleAttendeeChange(index, "idNumber", e.target.value)
                      }
                      className="border border-border rounded-md px-4 py-2 bg-background"
                      required
                    />

                    <input
                      placeholder="Age *"
                      value={att.age}
                      type="number"
                      min="1"
                      onChange={(e) =>
                        handleAttendeeChange(index, "age", e.target.value)
                      }
                      className="border border-border rounded-md px-4 py-2 bg-background"
                      required
                    />

                    <select
                      value={att.gender}
                      onChange={(e) =>
                        handleAttendeeChange(index, "gender", e.target.value)
                      }
                      className="border border-border rounded-md px-4 py-2 bg-background"
                      required
                    >
                      <option value="">Select Gender *</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>

                    <input
                      type="email"
                      placeholder="Email Address (Optional)"
                      value={att.attendeeEmail}
                      onChange={(e) =>
                        handleAttendeeChange(
                          index,
                          "attendeeEmail",
                          e.target.value
                        )
                      }
                      className="border border-border rounded-md px-4 py-2 bg-background col-span-2"
                    />
                  </div>
                </div>
              ))}

              {/* Agreement */}
              <div className="flex items-start gap-3 mt-4">
                <input
                  type="checkbox"
                  name="agree"
                  checked={form.agree}
                  onChange={handleChange}
                  className="mt-1 accent-primary"
                  required
                />
                <label className="text-sm text-muted-foreground">
                  I agree to the sport event terms and waive all liabilities
                </label>
              </div>
            </div>
          </form>

          {/* Right: Booking Summary */}
          <div className="bg-card border border-border rounded-xl p-8 space-y-6 h-fit sticky top-24">
            <div>
              <h3 className="text-lg font-bold mb-1">{sportData.sportName}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar size={14} />
                <span>
                  {new Date(sportData.date).toLocaleDateString()}{" "}
                  {sportData.time}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <MapPin size={14} />
                <span>{sportData.venue}</span>
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>
                  {sportData.sportName} x {quantity}
                </span>
                <span>${(sportData.registrationFee || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t border-border">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={handleProceedToPayment}
              disabled={isSubmitting || !sportData}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                "Proceed To Payment"
              )}
            </Button>

            {isSubmitting && (
              <p className="text-xs text-muted-foreground text-center">
                Processing your registration...
              </p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}