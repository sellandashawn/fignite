"use client"

import { CountdownTimer } from "@/components/countdown-timer"
import { EventCard } from "@/components/event-card"
import { SearchFilters } from "@/components/search-filter"
import { StatsSection } from "@/components/stats-section"
import { ContactSection } from "@/components/contact-section"
import { Trophy, Users, Target } from "lucide-react"

const popularSports = [
  {
    title: "Championship Finals",
    location: "Madison Square Garden",
    category: "Basketball",
    icon: "🏀",
  },
  {
    title: "World Cup Qualifier",
    location: "Wembley Stadium",
    category: "Soccer",
    icon: "⚽",
  },
  {
    title: "Grand Slam Tennis",
    location: "Australian Open",
    category: "Tennis",
    icon: "🎾",
  },
]

const upcomingSports = [
  {
    title: "NBA Finals Game 7",
    date: "June 20, 2025",
    location: "Los Angeles, CA",
    attendees: 20000,
    price: "$350",
    image: "/basketball-game-arena-packed-crowd-action-shot.jpg",
  },
  {
    title: "Champions League Final",
    date: "May 28, 2025",
    location: "Munich, Germany",
    attendees: 75000,
    price: "$280",
    image: "/soccer-stadium-champions-league-night-match.jpg",
  },
  {
    title: "Super Bowl LX",
    date: "February 8, 2026",
    location: "Miami, FL",
    attendees: 65000,
    price: "$450",
    image: "/american-football-super-bowl-stadium-aerial-view.jpg",
  },
  {
    title: "Wimbledon Finals",
    date: "July 12, 2025",
    location: "London, UK",
    attendees: 15000,
    price: "$220",
    image: "/wimbledon-tennis-match-grass-court-sunny-day.jpg",
  },
  {
    title: "World Series Game 1",
    date: "October 21, 2025",
    location: "New York, NY",
    attendees: 50000,
    price: "$195",
    image: "/baseball-world-series-stadium-night-game.jpg",
  },
  {
    title: "UFC Championship",
    date: "December 12, 2025",
    location: "Las Vegas, NV",
    attendees: 18000,
    price: "$380",
    image: "/ufc-octagon-championship-fight-arena-lights.jpg",
  },
]

export function SportsPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="container mx-auto py-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center">
            <div className="inline-block rounded-full bg-accent/10 px-3 py-1 text-sm text-accent mb-4 w-fit">
              Thrilling Sports Events
            </div>
            <h1 className="text-4xl font-bold tracking-tight lg:text-6xl text-balance mb-4">
              Experience Live Sports Like Never Before
            </h1>
            <p className="text-lg text-muted-foreground text-pretty mb-8">
              From championship games to local tournaments, discover sports events that get your adrenaline pumping.
            </p>
            <CountdownTimer targetDate="2025-05-28T00:00:00" />
          </div>
          <div className="relative aspect-square overflow-hidden rounded-2xl">
            <img src="/images/marathon-race-urban-city.jpg" alt="Sports hero" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* Search Filters */}
      <section className="container mx-auto py-8">
        <SearchFilters />
      </section>

      {/* Popular Sports Events */}
      <section className="container mx-auto py-12">
        <h2 className="text-3xl font-bold mb-8">Popular Sports Events</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {popularSports.map((event, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-card p-6 transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-3xl">
                  {event.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{event.location}</p>
                  <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                    {event.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Sports Events Grid */}
      <section className="container mx-auto py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Upcoming Matches</h2>
          <a href="#" className="text-accent hover:underline">
            View All →
          </a>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {upcomingSports.map((event, index) => (
            <EventCard key={index} {...event} type="sport" />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection
        stats={[
          { value: "200+", label: "Sports Events", icon: Trophy },
          { value: "100K+", label: "Fans", icon: Users },
          { value: "50+", label: "Stadiums", icon: Target },
        ]}
      />

      {/* Contact Section */}
      <ContactSection />
    </main>
  )
}
