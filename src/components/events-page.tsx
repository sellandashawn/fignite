"use client"

import { CountdownTimer } from "@/components/countdown-timer"
import { EventCard } from "@/components/event-card"
import { SearchFilters } from "@/components/search-filter"
import { StatsSection } from "@/components/stats-section"
import { ContactSection } from "@/components/contact-section"
import { Calendar, MapPin, Users } from "lucide-react"

const popularEvents = [
  {
    title: "DJ Carolina",
    location: "Los Angeles, CA",
    category: "Music",
    icon: "🎵",
  },
  {
    title: "Kabing DJ Smirnoff",
    location: "Miami Beach, FL",
    category: "Nightlife",
    icon: "🎧",
  },
  {
    title: "Winter Musubi",
    location: "New York, NY",
    category: "Festival",
    icon: "❄️",
  },
]

const upcomingEvents = [
  {
    title: "Summer Music Festival 2025",
    date: "June 15, 2025",
    location: "Central Park, NY",
    attendees: 5000,
    price: "$89",
    image: "/music-festival-outdoor-stage-crowd-sunset.jpg",
  },
  {
    title: "Tech Conference 2025",
    date: "July 22, 2025",
    location: "San Francisco, CA",
    attendees: 2500,
    price: "$299",
    image: "/tech-conference-keynote-stage-modern-auditorium.jpg",
  },
  {
    title: "Food & Wine Expo",
    date: "August 10, 2025",
    location: "Chicago, IL",
    attendees: 3200,
    price: "$125",
    image: "/food-wine-expo-gourmet-dishes-elegant-setup.jpg",
  },
  {
    title: "Art Gallery Opening",
    date: "September 5, 2025",
    location: "Boston, MA",
    attendees: 800,
    price: "Free",
    image: "/art-gallery-modern-paintings-white-walls.jpg",
  },
  {
    title: "Marathon Challenge",
    date: "October 12, 2025",
    location: "Seattle, WA",
    attendees: 10000,
    price: "$45",
    image: "/marathon-runners-city-streets-sunrise.jpg",
  },
  {
    title: "Jazz Night Live",
    date: "November 18, 2025",
    location: "New Orleans, LA",
    attendees: 1500,
    price: "$65",
    image: "/jazz-concert-saxophone-stage-dim-lights.jpg",
  },
]

export function EventsPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="container mx-auto py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center">
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-4 w-fit">
              Discover Amazing Events
            </div>
            <h1 className="text-4xl font-bold tracking-tight lg:text-6xl text-balance mb-4">
              Find Events That Match Your Passion
            </h1>
            <p className="text-lg text-muted-foreground text-pretty mb-8">
              World events, concerts, and activities near you. Book your tickets now and create unforgettable memories.
            </p>
            <CountdownTimer targetDate="2025-06-15T00:00:00" />
          </div>
          <div className="relative aspect-square overflow-hidden rounded-2xl">
            <img src="https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?cs=srgb&dl=pexels-wolfgang-1002140-2747449.jpg&fm=jpg" alt="Event hero" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* Search Filters */}
      <section className="container mx-auto py-8">
        <SearchFilters />
      </section>

      {/* Popular New Events */}
      <section className="container mx-auto py-12">
        <h2 className="text-3xl font-bold mb-8">Popular New Events</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {popularEvents.map((event, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-card p-6 transition-all hover:shadow-lg hover:shadow-primary/20"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
                  {event.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{event.location}</p>
                  <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs text-accent">
                    {event.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events Grid */}
      <section className="container mx-auto py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Upcoming Events</h2>
          <a href="#" className="text-primary hover:underline">
            View All →
          </a>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {upcomingEvents.map((event, index) => (
            <EventCard key={index} {...event} />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection
        stats={[
          { value: "500+", label: "Events", icon: Calendar },
          { value: "50K+", label: "Attendees", icon: Users },
          { value: "100+", label: "Venues", icon: MapPin },
        ]}
      />

      {/* Contact Section */}
      <ContactSection />
    </main>
  )
}
