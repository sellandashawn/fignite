"use client";

import { useState, useEffect } from "react";
import { MapPin, Calendar, Users, Share2, Clock, Trophy, Plus, Minus, Mail, Phone, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { getEventById } from "../../api/event";

export default function EventDetailPage({ params }: { params: { id: string }; }) {
  const [quantity, setQuantity] = useState(1);
  const [eventData, setEventData] = useState<any>(null);
  const [eventId, setEventId] = useState<string | null>(null);
  const [shouldShowTicketBooking, setShouldShowTicketBooking] = useState(false);

  const events: { [key: string]: any } = {
    "1": {
      id: 1,
      title: "Urban Marathon Carnival 2025 - Walkers & Juniors",
      location: "Stadium Park, Malaysia",
      date: "April 20, 2025",
      time: "6:00 AM - 2:00 PM",
      participants: "2,400",
      image: "/marathon-race-urban-city.jpg",
      price: "$45",
      description:
        "Join the most exciting urban marathon of the year! Whether you're a seasoned runner or this is your first marathon, the Urban Marathon Carnival welcomes all fitness levels. This event features multiple categories including the 42km full marathon, 21km half marathon, 10km run, and 5km walk, making it perfect for families and individuals alike.",
      details: [
        "Multiple race categories for all fitness levels",
        "Professional timing and results tracking",
        "Post-race celebration with live music and food",
        "Free race kit and commemorative medal",
        "Hydration and nutrition stations throughout the route",
      ],
      schedule: [
        { time: "5:30 AM", activity: "Event Registration Opens" },
        { time: "6:00 AM", activity: "Warm-up and Stretching Session" },
        { time: "6:30 AM", activity: "National Anthem & Safety Briefing" },
        { time: "7:00 AM", activity: "Marathon Start" },
        { time: "9:00 AM", activity: "Half Marathon Start" },
        { time: "10:00 AM", activity: "10K Run Start" },
        { time: "2:00 PM", activity: "Award Ceremony & Closing" },
      ],
    },
    "2": {
      id: 2,
      title: "Beach Volleyball Championship Series",
      location: "Miami Beach, USA",
      date: "May 2-4, 2025",
      time: "9:00 AM - 6:00 PM",
      participants: "1,800",
      image: "/beach-volleyball-tournament.jpg",
      price: "$55",
      description:
        "Compete in the prestigious Beach Volleyball Championship where top teams from across the nation gather to battle for glory. Experience the perfect blend of competitive play and beach atmosphere. This championship features both professional and amateur divisions.",
      details: [
        "Professional-grade sand courts",
        "Live commentary and streaming",
        "VIP spectator seating",
        "Complimentary food and beverages",
        "Professional photography coverage",
      ],
      schedule: [
        { time: "9:00 AM", activity: "Team Registration & Warm-up" },
        { time: "10:00 AM", activity: "Group Stage Matches Begin" },
        { time: "2:00 PM", activity: "Quarterfinals" },
        { time: "4:00 PM", activity: "Semifinals" },
        { time: "6:00 PM", activity: "Championship Final & Awards" },
      ],
    },
    "3": {
      id: 3,
      title: "Mountain Bike Challenge Pro Circuit",
      location: "Colorado Springs, USA",
      date: "May 31 - June 1, 2025",
      time: "7:00 AM - 5:00 PM",
      participants: "980",
      image: "/mountain-bike-trail-race.jpg",
      price: "$75",
      description:
        "The ultimate mountain biking experience! Navigate challenging terrain through Colorado's breathtaking mountain landscapes. This two-day event features cross-country, downhill, and enduro categories with courses for all skill levels.",
      details: [
        "Multiple difficulty levels and track options",
        "Professional medical team on site",
        "Bike repair stations throughout course",
        "Live tracking and leaderboards",
        "Weekend camping and social events",
      ],
      schedule: [
        { time: "7:00 AM", activity: "Registration Opens" },
        { time: "8:00 AM", activity: "Beginner Course Starts" },
        { time: "9:00 AM", activity: "Intermediate Course Starts" },
        { time: "10:00 AM", activity: "Advanced/Pro Course Starts" },
        { time: "5:00 PM", activity: "Daily Awards & Social Gathering" },
      ],
    },
  };

  const event = events[params.id] || events["1"];

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

  // Calculate if ticket booking should be shown
  useEffect(() => {
    if (eventData) {
      const eventDate = new Date(eventData.date);
      const today = new Date();
      const isUpcomingOrOngoing = eventDate >= today;

      setShouldShowTicketBooking(isUpcomingOrOngoing);
    }
  }, [eventData]);

  // Calculate available tickets
  const getAvailableTickets = () => {
    if (!eventData || !eventData.ticketStatus) return 0;

    const maxOccupancy = eventData.ticketStatus.maximumOccupancy || 0;
    const totalPlayers = eventData.ticketStatus.totalNumberOfPlayers || 0;

    return Math.max(0, maxOccupancy - totalPlayers);
  };

  const availableTickets = getAvailableTickets();

  // Update quantity when available tickets change
  useEffect(() => {
    if (availableTickets > 0 && quantity > availableTickets) {
      setQuantity(availableTickets);
    }
  }, [availableTickets, quantity]);

  console.log("Event Data:", eventData);

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

  const totalPrice = (
    Number.parseFloat(eventData.perTicketPrice) * quantity
  ).toFixed(2);

  // Helper function to handle quantity changes
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > availableTickets) newQuantity = availableTickets;
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
      <div className="px-8 py-4 border-b border-border flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/events" className="hover:text-primary transition">
          Events
        </Link>
        <span>/</span>
        <span>Event Registration</span>
      </div>

      {/* Event Detail Content */}
      <section className="py-12 px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div
            className={`${
              shouldShowTicketBooking ? "md:col-span-2" : "md:col-span-3"
            }`}
          >
            {/* Hero Image */}
            <div className="relative h-96 md:h-[500px] rounded-xl overflow-hidden mb-8 bg-muted">
              <img
                src={eventData.image || "/placeholder.svg"}
                alt={eventData.eventName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Event Title & Meta */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {eventData.eventName}
              </h1>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-card p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <MapPin size={16} />
                    <span className="text-xs font-semibold">LOCATION</span>
                  </div>
                  <p className="font-bold">{eventData.venue}</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Calendar size={16} />
                    <span className="text-xs font-semibold">DATE</span>
                  </div>
                  <p className="font-bold text-sm">
                    {new Date(eventData.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Clock size={16} />
                    <span className="text-xs font-semibold">TIME</span>
                  </div>
                  <p className="font-bold text-sm">{eventData.time}</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Users size={16} />
                    <span className="text-xs font-semibold">PARTICIPANTS</span>
                  </div>
                  <p className="font-bold">
                    {eventData.ticketStatus.maximumOccupancy}
                  </p>
                </div>
              </div>

              {/* Ticket Availability Badge */}
              {shouldShowTicketBooking && (
                <div className="mb-8">
                  <div
                    className={`inline-flex items-center px-4 py-2 rounded-lg font-semibold ${
                      availableTickets > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {availableTickets > 0 ? (
                      <>Available Tickets : {availableTickets}</>
                    ) : (
                      <>Sold Out</>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">About This Event</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {eventData.description}
              </p>

              {/* <h3 className="text-xl font-bold mb-4">What to Expect</h3>
              <ul className="space-y-3">
                {eventData?.agenda?.map((detail: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Trophy size={20} className="text-primary flex-shrink-0 mt-1" />
                    <span className="text-muted-foreground">{detail.time} {detail.activity}</span>
                  </li>
                ))}
              </ul> */}
            </div>

            {/* Schedule */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Event Schedule</h2>
              <div className="space-y-3">
                {eventData?.agenda?.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border"
                  >
                    <div className="text-primary font-bold whitespace-nowrap">
                      {item.time}
                    </div>
                    <div className="text-muted-foreground">
                      {item.activity} {}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Ticket Booking (Conditional) */}
          {shouldShowTicketBooking && availableTickets > 0 && (
            <div className="md:col-span-1">
              {/* Ticket Card */}
              <div className="bg-card rounded-xl border border-border p-8 sticky top-24 space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Tickets</h3>
                  <p className="text-muted-foreground text-sm">
                    {eventData.eventName}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Ticket Price</span>
                    <span className="font-bold text-lg">
                      $ {eventData.perTicketPrice}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Available</span>
                    <span className="font-bold">
                      {availableTickets} tickets
                    </span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between items-center">
                    <span className="text-muted-foreground font-semibold">
                      Sub Total
                    </span>
                    <span className="font-bold text-lg text-primary">
                      $ {totalPrice}
                    </span>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div>
                  <label className="block text-sm font-semibold mb-3">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4 bg-background rounded-lg p-3">
                    <button
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className={`w-8 h-8 rounded-lg border transition flex items-center justify-center ${
                        quantity <= 1
                          ? "border-border/50 text-muted-foreground/50 cursor-not-allowed"
                          : "border-border hover:border-primary hover:bg-primary/10"
                      }`}
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={handleInputChange}
                      min="1"
                      max={availableTickets}
                      className="flex-1 bg-transparent text-center font-bold outline-none"
                    />
                    <button
                      onClick={incrementQuantity}
                      disabled={quantity >= availableTickets}
                      className={`w-8 h-8 rounded-lg border transition flex items-center justify-center ${
                        quantity >= availableTickets
                          ? "border-border/50 text-muted-foreground/50 cursor-not-allowed"
                          : "border-border hover:border-primary hover:bg-primary/10"
                      }`}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Get Tickets Button */}
                <Link
                  href={`/events/${eventData.id}/get-tickets?quantity=${quantity}`}
                >
                  <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition font-bold text-lg">
                    GET TICKETS
                  </button>
                </Link>
                {/* Add to Calendar */}
                <button className="w-full border-2 border-primary text-primary py-2 mt-3 rounded-lg hover:bg-primary/10 transition font-semibold flex items-center justify-center gap-2">
                  <Calendar size={18} />
                  Add To Calendar
                </button>

                {/* Share */}
                <button className="w-full border border-border text-foreground py-2 rounded-lg hover:border-primary transition font-semibold flex items-center justify-center gap-2">
                  <Share2 size={18} />
                  Share Event
                </button>
              </div>
            </div>
          )}

          {/* Event Ended/Sold Out Message */}
          {!shouldShowTicketBooking && (
            <div className="md:col-span-3 mt-8">
              <div className="bg-card border border-border rounded-xl p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Calendar size={24} className="text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Event Has Ended</h3>
                <p className="text-muted-foreground mb-4">
                  This event has already taken place. Registration is no longer
                  available.
                </p>
                <Link href="/events">
                  <button className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition font-semibold">
                    Browse Upcoming Events
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* Sold Out Message (if upcoming but no tickets) */}
          {shouldShowTicketBooking && availableTickets === 0 && (
            <div className="md:col-span-1">
              <div className="bg-card rounded-xl border border-border p-8 sticky top-24 space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Tickets</h3>
                  <p className="text-muted-foreground text-sm">
                    {eventData.eventName}
                  </p>
                </div>

                <div className="text-center py-8">
                  <h4 className="font-bold text-lg mb-2">Sold Out</h4>
                  <p className="text-muted-foreground text-sm">
                    All tickets for this event have been sold.
                  </p>
                </div>

                {/* Add to Calendar */}
                <button className="w-full border-2 border-primary text-primary py-2 rounded-lg hover:bg-primary/10 transition font-semibold flex items-center justify-center gap-2">
                  <Calendar size={18} />
                  Add To Calendar
                </button>

                {/* Share */}
                <button className="w-full border border-border text-foreground py-2 rounded-lg hover:border-primary transition font-semibold flex items-center justify-center gap-2">
                  <Share2 size={18} />
                  Share Event
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-8 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Have Questions?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-bold mb-1">Call Us</h3>
                <p className="text-muted-foreground">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-bold mb-1">Email Us</h3>
                <p className="text-muted-foreground">support@gosports.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageSquare className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-bold mb-1">Live Chat</h3>
                <p className="text-muted-foreground">Available 9 AM - 6 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h4 className="font-bold mb-4">GoSports</h4>
              <p className="text-muted-foreground text-sm">
                Connecting athletes and events worldwide
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Events
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
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
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
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
          <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
            <p>&copy; 2025 GoSports. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}