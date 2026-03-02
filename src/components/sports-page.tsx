"use client"
 
import { useState, useEffect } from "react";
import Link from "next/link";
import { CountdownTimer } from "@/components/countdown-timer"
import { EventCard } from "@/components/event-card"
import { SearchFilters } from "@/components/search-filter"
import { StatsSection } from "@/components/stats-section"
import { ContactSection } from "@/components/contact-section"
import { Trophy, Users, Target } from "lucide-react"
import { getAllSports } from "../app/api/sports";

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

export function SportsPage() {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const sportsResponse = await getAllSports();

        if (sportsResponse && sportsResponse.sports) {
          const sortedSports = sportsResponse.sports.sort((a, b) =>
            new Date(a.date) - new Date(b.date)
          );
          setSports(sortedSports);
        }

      } catch (error) {
        console.log("Error fetching sports data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const upcomingSports = sports
    .filter(sport => new Date(sport.date) > new Date())
    .slice(0, 6);

  console.log("Sports Data:", sports);

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
          <a href="/sports" className="text-accent hover:underline">
            View All →
          </a>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        ) : upcomingSports.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingSports.map((sport, index) => (
              <Link
                key={sport.id || index}
                href={`/sports/${sport.id}`}
                className="block"
              >
                <EventCard
                  title={sport.sportName}
                  date={`${new Date(sport.date).toLocaleDateString()} at ${sport.time}`}
                  location={sport.venue}
                  attendees={`${sport.participationStatus?.confirmedParticipants || 0} / ${sport.participationStatus?.maximumParticipants || 0}`}
                  price={`LKR ${sport.registrationFee || "0"}`}
                  image={sport.image || "/default-sport-image.jpg"}
                  category={sport.category}
                  type="sport"
                />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No upcoming sports events found.</p>
          </div>
        )}
      </section>

      {/* Stats Section */}
      <StatsSection
        stats={[
          { value: `${sports.length}+`, label: "Sports Events", icon: Trophy },
          { value: "100K+", label: "Fans", icon: Users },
          { value: "50+", label: "Stadiums", icon: Target },
        ]}
      />

      {/* Contact Section */}
      <ContactSection />
    </main>
  )
}