"use client"

import { useState } from "react"
import { MapPin, Calendar, Users, Share2, Clock, Trophy, Plus, Minus, Mail, Phone, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1)

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
  }

  const event = events[params.id] || events["1"]

  const totalPrice = (Number.parseFloat(event.price.replace("$", "")) * quantity).toFixed(2)

  return (
    <main className="bg-background text-foreground">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-border sticky top-0 bg-background/95 backdrop-blur z-50">
        <Link href="/" className="text-2xl font-bold text-primary">
          GoSports
        </Link>
        <div className="hidden md:flex gap-8 items-center">
          <Link href="/events" className="text-sm hover:text-primary transition">
            Events
          </Link>
          <a href="/about" className="text-sm hover:text-primary transition">
            About Us
          </a>
          <a href="/#contact" className="text-sm hover:text-primary transition">
            Contact
          </a>
        </div>
        <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:opacity-90 transition text-sm font-semibold">
          Buy Tickets
        </button>
      </nav>

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
          <div className="md:col-span-2">
            {/* Hero Image */}
            <div className="relative h-96 md:h-[500px] rounded-xl overflow-hidden mb-8 bg-muted">
              <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
            </div>

            {/* Event Title & Meta */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-card p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <MapPin size={16} />
                    <span className="text-xs font-semibold">LOCATION</span>
                  </div>
                  <p className="font-bold">{event.location}</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Calendar size={16} />
                    <span className="text-xs font-semibold">DATE</span>
                  </div>
                  <p className="font-bold text-sm">{event.date}</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Clock size={16} />
                    <span className="text-xs font-semibold">TIME</span>
                  </div>
                  <p className="font-bold text-sm">{event.time}</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Users size={16} />
                    <span className="text-xs font-semibold">PARTICIPANTS</span>
                  </div>
                  <p className="font-bold">{event.participants}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">About This Event</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">{event.description}</p>

              <h3 className="text-xl font-bold mb-4">What to Expect</h3>
              <ul className="space-y-3">
                {event.details.map((detail: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Trophy size={20} className="text-primary flex-shrink-0 mt-1" />
                    <span className="text-muted-foreground">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Schedule */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Event Schedule</h2>
              <div className="space-y-3">
                {event.schedule.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border">
                    <div className="text-primary font-bold whitespace-nowrap">{item.time}</div>
                    <div className="text-muted-foreground">{item.activity}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Ticket Booking */}
          <div className="md:col-span-1">
            {/* Ticket Card */}
            <div className="bg-card rounded-xl border border-border p-8 sticky top-24 space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-2">Tickets</h3>
                <p className="text-muted-foreground text-sm">{event.title}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Ticket Price</span>
                  <span className="font-bold text-lg">{event.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Ticket Price</span>
                  <span className="font-bold text-lg">{event.price}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between items-center">
                  <span className="text-muted-foreground font-semibold">Sub Total</span>
                  <span className="font-bold text-lg text-primary">${totalPrice}</span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="block text-sm font-semibold mb-3">Quantity</label>
                <div className="flex items-center gap-4 bg-background rounded-lg p-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg border border-border hover:border-primary hover:bg-primary/10 transition flex items-center justify-center"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    className="flex-1 bg-transparent text-center font-bold outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg border border-border hover:border-primary hover:bg-primary/10 transition flex items-center justify-center"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Get Tickets Button */}
              <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition font-bold text-lg">
                GET TICKETS
              </button>

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
              <p className="text-muted-foreground text-sm">Connecting athletes and events worldwide</p>
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
  )
}
