"use client";

import { useState, useEffect } from "react";
import { MapPin, Calendar, Users, Share2, Clock, Trophy, Plus, Minus, Mail, Phone, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { getSportById } from "../../api/sports";

export default function SportDetailPage({ params }: { params: { id: string }; }) {
  const [quantity, setQuantity] = useState(1);
  const [sportData, setSportData] = useState<any>(null);
  const [sportId, setSportId] = useState<string | null>(null);
  const [shouldShowParticipation, setShouldShowParticipation] = useState(false);

  useEffect(() => {
    const fetchSportData = async () => {
      const resolvedParams = await params;
      const sportId = resolvedParams.id;
      setSportId(sportId);
    };

    fetchSportData();
  }, [params]);

  useEffect(() => {
    if (sportId) {
      const fetchSportData = async () => {
        try {
          const data = await getSportById(sportId);
          setSportData(data.sport);
        } catch (error) {
          console.error("Error fetching sport data:", error);
        }
      };
      fetchSportData();
    }
  }, [sportId]);

  useEffect(() => {
    if (sportData) {
      const sportDate = new Date(sportData.date);
      const today = new Date();
      const isUpcomingOrOngoing = sportDate >= today;

      setShouldShowParticipation(isUpcomingOrOngoing);
    }
  }, [sportData]);

  const getAvailableSpots = () => {
    if (!sportData || !sportData.participationStatus) return 0;

    const maximumParticipants = sportData.participationStatus.maximumParticipants || 0;
    const totalParticipants = sportData.participationStatus.totalParticipants || 0;

    return Math.max(0, maximumParticipants - totalParticipants);
  };

  const availableSpots = getAvailableSpots();

  useEffect(() => {
    if (availableSpots > 0 && quantity > availableSpots) {
      setQuantity(availableSpots);
    }
  }, [availableSpots, quantity]);

  console.log("Sport Data:", sportData);

  if (!sportData) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading sport details...</p>
      </div>
    </div>;
  }

  const totalPrice = (
    Number.parseFloat(sportData.registrationFee) * quantity
  ).toFixed(2);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > availableSpots) newQuantity = availableSpots;
    setQuantity(newQuantity);
  };

  const incrementQuantity = () => {
    handleQuantityChange(quantity + 1);
  };

  const decrementQuantity = () => {
    handleQuantityChange(quantity - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 0;
    handleQuantityChange(value);
  };

  return (
    <main className="bg-background text-foreground">
      {/* Navigation */}
      <Header />

      {/* Breadcrumb */}
      <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 border-b border-border flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
        <Link href="/sports" className="hover:text-primary transition">
          Sports
        </Link>
        <span>/</span>
        <span>Sport Registration</span>
      </div>

      {/* Sport Detail Content */}
      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Sport Details */}
          <div className={`${shouldShowParticipation ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            {/* Hero Image */}
            <div className="relative h-64 sm:h-80 lg:h-96 xl:h-[500px] rounded-xl overflow-hidden mb-6 sm:mb-8 bg-muted">
              <img
                src={sportData.image || "/placeholder.svg"}
                alt={sportData.sportName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Sport Title & Meta */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
                {sportData.sportName}
              </h1>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="bg-card p-3 sm:p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1 sm:mb-2">
                    <MapPin size={14} />
                    <span className="text-xs font-semibold">LOCATION</span>
                  </div>
                  <p className="font-bold text-xs sm:text-sm">{sportData.venue}</p>
                </div>
                <div className="bg-card p-3 sm:p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1 sm:mb-2">
                    <Calendar size={14} />
                    <span className="text-xs font-semibold">DATE</span>
                  </div>
                  <p className="font-bold text-xs sm:text-sm">{new Date(sportData.date).toLocaleDateString()}</p>
                </div>
                <div className="bg-card p-3 sm:p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1 sm:mb-2">
                    <Clock size={14} />
                    <span className="text-xs font-semibold">TIME</span>
                  </div>
                  <p className="font-bold text-xs sm:text-sm">{sportData.time}</p>
                </div>
                <div className="bg-card p-3 sm:p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1 sm:mb-2">
                    <Users size={14} />
                    <span className="text-xs font-semibold">PARTICIPANTS</span>
                  </div>
                  <p className="font-bold text-xs sm:text-sm">{sportData.participationStatus?.maximumParticipants || 0}</p>
                </div>
              </div>

              {/* Participation Availability Badge */}
              {shouldShowParticipation && (
                <div className="mb-6 sm:mb-8">
                  <div className={`inline-flex items-center px-3 sm:px-4 py-1 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm ${availableSpots > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {availableSpots > 0 ? (
                      <>
                        Available Spots : {availableSpots}
                      </>
                    ) : (
                      <>
                        Fully Booked
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">About This Sport</h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 sm:mb-6">
                {sportData.description || "Join this exciting sport event and challenge yourself!"}
              </p>

              {sportData.features && sportData.features.length > 0 && (
                <>
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Features</h3>
                  <ul className="space-y-2 sm:space-y-3">
                    {sportData.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Trophy size={18} className="text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm sm:text-base text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* Schedule */}
            {sportData.schedule && sportData.schedule.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Event Schedule</h2>
                <div className="space-y-2 sm:space-y-3">
                  {sportData.schedule.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-card rounded-lg border border-border"
                    >
                      <div className="text-primary font-bold whitespace-nowrap text-sm sm:text-base">
                        {item.time}
                      </div>
                      <div className="text-sm sm:text-base text-muted-foreground">{item.activity}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Participation Booking (Conditional) */}
          {shouldShowParticipation && availableSpots > 0 && (
            <div className="lg:col-span-1">
              {/* Participation Card */}
              <div className="bg-card rounded-xl border border-border p-4 sm:p-6 lg:p-8 sticky top-6 sm:top-8 space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">Tickets</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{sportData.sportName}</p>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base text-muted-foreground">Price per Person</span>
                    <span className="font-bold text-base sm:text-lg">$ {sportData.registrationFee || "0.00"}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-muted-foreground">Available Spots</span>
                    <span className="font-bold">{availableSpots} spots</span>
                  </div>
                  <div className="border-t border-border pt-2 sm:pt-3 flex justify-between items-center">
                    <span className="text-sm sm:text-base text-muted-foreground font-semibold">
                      Sub Total
                    </span>
                    <span className="font-bold text-base sm:text-lg text-primary">
                      $ {totalPrice}
                    </span>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold mb-2 sm:mb-3">Participants</label>
                  <div className="flex items-center gap-3 sm:gap-4 bg-background rounded-lg p-2 sm:p-3">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border transition flex items-center justify-center ${quantity <= 1 ? 'border-border/50 text-muted-foreground/50 cursor-not-allowed' : 'border-border hover:border-primary hover:bg-primary/10'}`}
                    >
                      <Minus size={14} />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={handleInputChange}
                      min="1"
                      max={availableSpots}
                      className="flex-1 bg-transparent text-center font-bold outline-none text-sm sm:text-base"
                    />
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= availableSpots}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border transition flex items-center justify-center ${quantity >= availableSpots ? 'border-border/50 text-muted-foreground/50 cursor-not-allowed' : 'border-border hover:border-primary hover:bg-primary/10'}`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Join Button */}
                <Link href={`/sports/${sportData.id}/get-tickets?quantity=${quantity}`}>
                  <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition font-bold text-lg">
                    JOIN NOW
                  </button>
                </Link>

                {/* Add to Calendar */}
                <button className="w-full border-2 border-primary text-primary py-2 mt-3 rounded-lg hover:bg-primary/10 transition font-semibold flex items-center justify-center gap-2">
                  <Calendar size={16} />
                  Add To Calendar
                </button>

                {/* Share */}
                <button className="w-full border border-border text-foreground py-2 rounded-lg hover:border-primary transition font-semibold text-sm sm:text-base flex items-center justify-center gap-2">
                  <Share2 size={16} />
                  Share Sport
                </button>
              </div>
            </div>
          )}

          {/* Sport Ended/Booked Out Message */}
          {!shouldShowParticipation && (
            <div className="lg:col-span-3 mt-6 sm:mt-8">
              <div className="bg-card border border-border rounded-xl p-6 sm:p-8 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Calendar size={20} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">Sport Event Has Ended</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                  This sport event has already taken place. Registration is no longer available.
                </p>
                <Link href="/sports">
                  <button className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition font-semibold text-sm sm:text-base">
                    Browse Available Sports
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* Fully Booked Message (if upcoming but no spots) */}
          {shouldShowParticipation && availableSpots === 0 && (
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl border border-border p-4 sm:p-6 lg:p-8 sticky top-6 sm:top-8 space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">Join This Sport</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{sportData.sportName}</p>
                </div>

                <div className="text-center py-4 sm:py-6">
                  <h4 className="font-bold text-base sm:text-lg mb-2">Fully Booked</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    All spots for this sport have been filled.
                  </p>
                </div>

                {/* Add to Calendar */}
                <button className="w-full border-2 border-primary text-primary py-2 rounded-lg hover:bg-primary/10 transition font-semibold text-sm sm:text-base flex items-center justify-center gap-2">
                  <Calendar size={16} />
                  Add To Calendar
                </button>

                {/* Share */}
                <button className="w-full border border-border text-foreground py-2 rounded-lg hover:border-primary transition font-semibold text-sm sm:text-base flex items-center justify-center gap-2">
                  <Share2 size={16} />
                  Share Sport
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Have Questions?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="text-primary" size={20} />
              </div>
              <div>
                <h3 className="font-bold mb-1 text-sm sm:text-base">Call Us</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="text-primary" size={20} />
              </div>
              <div>
                <h3 className="font-bold mb-1 text-sm sm:text-base">Email Us</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">support@gosports.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageSquare className="text-primary" size={20} />
              </div>
              <div>
                <h3 className="font-bold mb-1 text-sm sm:text-base">Live Chat</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Available 9 AM - 6 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12">
            <div>
              <h4 className="font-bold mb-2 sm:mb-4 text-sm sm:text-base">GoSports</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Connecting athletes and sports worldwide
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-2 sm:mb-4 text-sm sm:text-base">Sports</h4>
              <ul className="space-y-1 sm:space-y-2 text-muted-foreground text-xs sm:text-sm">
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Available Sports
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Popular Sports
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2 sm:mb-4 text-sm sm:text-base">Company</h4>
              <ul className="space-y-1 sm:space-y-2 text-muted-foreground text-xs sm:text-sm">
                <li>
                  <a href="#" className="hover:text-primary transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-2 sm:mb-4 text-sm sm:text-base">Legal</h4>
              <ul className="space-y-1 sm:space-y-2 text-muted-foreground text-xs sm:text-sm">
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-4 sm:pt-8 text-center text-muted-foreground text-xs sm:text-sm">
            <p>&copy; 2025 GoSports. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}