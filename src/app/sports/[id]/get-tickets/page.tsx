"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { MapPin, Calendar } from "lucide-react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { getEventById } from "../../../api/event"
import { createCheckout } from "@/app/api/stripe"
import { Footer } from "@/components/footer"

export default function GetTicketsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [eventData, setEventData] = useState<any>(null);
  const [eventId, setEventId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const quantity = parseInt(searchParams.get("quantity") || "1");
  const [attendees, setAttendees] = useState<any[]>([]);

  useEffect(() => {
    const fetchEventData = async () => {
      const resolvedParams = await params;
      const eventId = resolvedParams.id;
      setEventId(eventId);
    };

    fetchEventData();
  }, [params]);

  useEffect(() => {
    if (eventId) {
      const fetchEventData = async () => {
        try {
          const data = await getEventById(eventId);
          setEventData(data.event);
        } catch (error) {
          console.error("Error fetching event data:", error);
        }
      };
      fetchEventData();
    }
  }, [eventId]);

  useEffect(() => {
    if (quantity && !isNaN(quantity)) {
      const initial = Array.from({ length: quantity }, () => ({
        name: "",
        idNumber: "",
        age: "",
        gender: "",
        attendeeEmail: "",
        tshirtSize: "",
        raceCategory: "",
        teamName: "",
      }));
      setAttendees(initial);
    }
  }, [quantity, eventData]);

  console.log("events data", eventData);

  // State
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    name: "",
    idNumber: "",
    age: "",
    gender: "",
    attendeeEmail: "",
    tshirtSize: "",
    raceCategory: "",
    teamName: "",
    agree: false,
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
    const updated = [...attendees];
    updated[index][field] = value;
    setAttendees(updated);
  };

  // Function to save registration with pending status
  const saveRegistration = async () => {
    const registrationData = {
      eventId: eventId,
      eventName: eventData.eventName,
      eventDate: eventData.date,
      eventvenue: eventData.venue,
      eventtime: eventData.time,
      eventimage: eventData.image,
      quantity: quantity,
      totalAmount: total,
      status: "pending",
      billingInfo: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
      },
      attendeeInfo: {
        name: form.name,
        idNumber: form.idNumber,
        age: form.age,
        gender: form.gender,
        email: form.attendeeEmail,
        tshirtSize: form.tshirtSize,
        raceCategory: form.raceCategory,
        teamName: form.teamName,
      },
      paymentInfo: {
        subtotal: eventData.perTicketPrice * quantity,
        total: total,
        status: "pending",
      },
      createdAt: new Date().toISOString(),
    };

    try {
      // Generate a unique registration ID
      const registrationId = `${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Save to localStorage
      const newRegistration = {
        id: registrationId,
        ...registrationData,
      };

      localStorage.setItem(
        "currentRegistration",
        JSON.stringify(newRegistration)
      );

      console.log("Registration saved with ID:", registrationId);
      return registrationId;
    } catch (error) {
      console.error("Error saving registration:", error);
      throw error;
    }
  };

  const handleProceedToPayment = async () => {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.phone ||
      !form.agree
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save registration locally
      const registrationId = await saveRegistration();

      const checkoutData = {
        eventId: eventId,
        eventName: eventData.eventName,
        quantity: quantity,
        totalAmount: total,
        participantId: registrationId, // OPTIONAL but useful
      };

      const res = await createCheckout(checkoutData);

      // Call Stripe backend
      if (res.data?.session?.url) {
        window.location.href = res.data.session.url;
      } else {
        alert("Payment session failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to payment gateway");
    } finally {
      setIsSubmitting(false);
    }
  };

  const event = {
    title: "Fun Run Larian Perpaduan Malaysia Madani",
    date: "October 13, 2025, 9:00 am",
    location: "Sunway Ipoh, Malaysia",
    ticketQty: 2,
    ticketPrice: 100,
  };

  if (!eventData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading event...</p>
        </div>
      </div>
    );
  }

  const total = quantity * eventData.perTicketPrice;

  return (
    <main className="bg-background text-foreground">
      <Header />

      {/* Breadcrumb */}
      <div className="px-8 py-4 border-b border-border text-sm text-muted-foreground flex items-center gap-2">
        <Link href="/events" className="hover:text-primary transition">
          Events
        </Link>
        <span>/</span>
        <span>Event Registration</span>
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

            {/* Attendee Info */}
            <div>
              <h2 className="text-xl font-bold mb-4">
                Attendees Information (Total: {quantity})
              </h2>

              {attendees.map((att, index) => (
                <div
                  key={index}
                  className="mb-6 border border-border rounded-lg p-4"
                >
                  <h4 className="font-semibold mb-3">Attendee {index + 1}</h4>

                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      placeholder="Name"
                      value={att.name}
                      onChange={(e) =>
                        handleAttendeeChange(index, "name", e.target.value)
                      }
                      className="border border-border rounded-md px-4 py-2 bg-background"
                      required
                    />

                    <input
                      placeholder="Identification Number"
                      value={att.idNumber}
                      onChange={(e) =>
                        handleAttendeeChange(index, "idNumber", e.target.value)
                      }
                      className="border border-border rounded-md px-4 py-2 bg-background"
                      required
                    />

                    <input
                      placeholder="Age"
                      value={att.age}
                      type="number"
                      onChange={(e) =>
                        handleAttendeeChange(index, "age", e.target.value)
                      }
                      className="border border-border rounded-md px-4 py-2 bg-background"
                    />

                    <select
                      value={att.gender}
                      onChange={(e) =>
                        handleAttendeeChange(index, "gender", e.target.value)
                      }
                      className="border border-border rounded-md px-4 py-2 bg-background"
                    >
                      <option value="">Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>

                    <input
                      placeholder="Email Address"
                      value={att.attendeeEmail}
                      onChange={(e) =>
                        handleAttendeeChange(
                          index,
                          "attendeeEmail",
                          e.target.value
                        )
                      }
                      className="border border-border rounded-md px-4 py-2 bg-background"
                    />
{/* 
                    <select
                      value={att.tshirtSize}
                      onChange={(e) =>
                        handleAttendeeChange(
                          index,
                          "tshirtSize",
                          e.target.value
                        )
                      }
                      className="border border-border rounded-md px-4 py-2 bg-background"
                    >
                      <option value="">Select T shirt Size</option>
                      {eventData?.availableTshirtSizes?.map((size: string) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select> */}

                    {/* <select
                      value={att.raceCategory}
                      onChange={(e) =>
                        handleAttendeeChange(
                          index,
                          "raceCategory",
                          e.target.value
                        )
                      }
                      className="border border-border rounded-md px-4 py-2 bg-background"
                    >
                      <option value="">Select Race Category</option>
                      {eventData?.raceCategories?.map((cat: string) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select> */}

                    <input
                      placeholder="Team Name"
                      value={att.teamName}
                      onChange={(e) =>
                        handleAttendeeChange(index, "teamName", e.target.value)
                      }
                      className="border border-border rounded-md px-4 py-2 bg-background"
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
                  I agree to the event terms and waive all liabilities
                </label>
              </div>
            </div>
          </form>

          {/* Right: Booking Summary */}
          <div className="bg-card border border-border rounded-xl p-8 space-y-6 h-fit sticky top-24">
            <div>
              <h3 className="text-lg font-bold mb-1">{eventData.eventName}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar size={14} />
                <span>
                  {new Date(eventData.date).toLocaleDateString()}{" "}
                  {eventData.time}{" "}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <MapPin size={14} />
                <span>{eventData.venue}</span>
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>
                  {eventData.eventName} x {quantity}
                </span>
                <span>${eventData.perTicketPrice * quantity}</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t border-border">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>

            <Button
              onClick={handleProceedToPayment}
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                "Proceed To Payment"
              )}
            </Button>

            {isSubmitting && (
              <p className="text-xs text-muted-foreground text-center">
                Saving your registration details...
              </p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
