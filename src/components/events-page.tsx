"use client"

import { useState, useEffect } from "react";
import { CountdownTimer } from "@/components/countdown-timer"
import { EventCard } from "@/components/event-card"
import { SearchFilters } from "@/components/search-filter"
import { StatsSection } from "@/components/stats-section"
import { ContactSection } from "@/components/contact-section"
import { Calendar, MapPin, Users } from "lucide-react"
import { getAllEvents } from "../app/api/event";

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

export function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const eventsResponse = await getAllEvents();

        if (eventsResponse && eventsResponse.events) {
          // Sort events by date to show upcoming events first
          const sortedEvents = eventsResponse.events.sort((a, b) =>
            new Date(a.date) - new Date(b.date)
          );
          setEvents(sortedEvents);
        }

      } catch (error) {
        console.log("Error fetching events data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get only upcoming events (assuming the API returns events with date field)
  const upcomingEvents = events
    .filter(event => new Date(event.date) > new Date()) // Only future events
    .slice(0, 6); // Get first 6 upcoming events

  console.log("Events Data:", events);

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
          <a href="events" className="text-primary hover:underline">
            View All →
          </a>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : upcomingEvents.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event, index) => (
              <EventCard
                key={index}
                title={event.eventName || event.title}
                date={`${new Date(event.date).toLocaleDateString()}${event.time ? ` at ${event.time}` : ''}`}
                location={event.venue || event.location}
                attendees={event.ticketStatus?.maximumOccupancy || "0"}
                price={event.perTicketPrice ? `LKR ${event.perTicketPrice}` : "0"}
                image={event.image || "/default-event-image.jpg"}
                category={event.category}
                type="event"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No upcoming events found.</p>
          </div>
        )}
      </section>

      {/* Stats Section */}
      <StatsSection
        stats={[
          { value: `${events.length}+`, label: "Events", icon: Calendar },
          { value: "50K+", label: "Attendees", icon: Users },
          { value: "100+", label: "Venues", icon: MapPin },
        ]}
      />

      {/* Contact Section */}
      <ContactSection />
    </main>
  )
}