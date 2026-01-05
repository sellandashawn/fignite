"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Users,
  Calendar,
  Search,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { getAllEvents } from "../api/event";
import { getCategoriesByType } from "../api/category";
import { Navbar } from "@/components/navbar";


export default function SportsEventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("upcoming");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState("all");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const eventsResponse = await getAllEvents();
        if (eventsResponse && eventsResponse.events) {
          setEvents(eventsResponse.events);
        }

        const categoriesResponse = await getCategoriesByType("event");
        if (categoriesResponse && categoriesResponse.categories) {
          setCategories(categoriesResponse.categories);
        }

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log("Events ", events);

  const allEvents = [
    {
      id: 1,
      title: "Urban Marathon Carnival 2025 - Walkers & Juniors",
      location: "Stadium Park, Malaysia",
      date: "Apr 20, 2025",
      participants: "2,400",
      image: "/images/marathon-race-urban-city.jpg",
      isSpecial: true,
      sport: "Running",
      price: "$45",
    },
    {
      id: 2,
      title: "Beach Volleyball Championship Series",
      location: "Miami Beach, USA",
      date: "May 2, 2025",
      participants: "1,800",
      image: "/images/beach-volleyball-tournament.jpg",
      isSpecial: false,
      sport: "Volleyball",
      price: "$55",
    },
    {
      id: 3,
      title: "Mountain Bike Challenge Pro Circuit",
      location: "Colorado Springs, USA",
      date: "May 31, 2025",
      participants: "980",
      image: "/images/mountain-bike-trail-race.jpg",
      isSpecial: true,
      sport: "Cycling",
      price: "$75",
    },
    {
      id: 4,
      title: "Triathlon Series Grand Finale",
      location: "San Francisco, USA",
      date: "Jun 10, 2025",
      participants: "1,200",
      image: "/images/triathlon-swimming-cycling-running.jpg",
      isSpecial: false,
      sport: "Triathlon",
      price: "$85",
    },
    {
      id: 5,
      title: "Tennis Championship Elite Tournament",
      location: "Los Angeles, USA",
      date: "Jun 15, 2025",
      participants: "640",
      image: "/images/tennis-championship-court.jpg",
      isSpecial: true,
      sport: "Tennis",
      price: "$65",
    },
    {
      id: 6,
      title: "CrossFit Games National Qualifier",
      location: "Austin, Texas, USA",
      date: "Jul 1, 2025",
      participants: "1,500",
      image: "/images/crossfit-competition-athletes.jpg",
      isSpecial: false,
      sport: "CrossFit",
      price: "$95",
    },
  ];

  const getCategoryName = (categoryIdentifier) => {
    if (!categoryIdentifier) return "N/A";

    if (typeof categoryIdentifier === "string") {
      const foundCategory = categories.find(
        (cat) => cat.name === categoryIdentifier
      );
      if (foundCategory) return categoryIdentifier;
    }

    if (typeof categoryIdentifier === "object" && categoryIdentifier !== null) {
      return categoryIdentifier.name || "N/A";
    }

    const category = categories.find(
      (cat) =>
        cat.id === categoryIdentifier ||
        cat._id === categoryIdentifier ||
        cat.name === categoryIdentifier
    );

    return category ? category.name : "N/A";
  };

  const filteredEvents = events
    .filter((event) => {
      const matchesSearch =
        event.eventName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getCategoryName(event.category)?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSport =
        selectedSport === "all" || getCategoryName(event.category)?.toLowerCase() === selectedSport.toLowerCase();

      return matchesSearch && matchesSport;
    })
    .sort((a, b) => {
      if (sortBy === "upcoming") {
        const now = new Date();
        const aDate = new Date(a.date);
        const bDate = new Date(b.date);

        if (aDate >= now && bDate >= now) {
          return aDate - bDate;
        }
        if (aDate >= now) return -1;
        if (bDate >= now) return 1;
        return bDate - aDate;
      }
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });


  const sports = [
    "all",
    ...categories.map(category => category.name)
  ];

  return (
    <main className="bg-background text-foreground">
      {/* Navigation */}
      <Navbar />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary/10 to-transparent py-12 px-8 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Explore Sports Events
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover and register for amazing sports events happening near you
          </p>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-8 px-8 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search Sport Type ... or Search Events"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary transition"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary transition appearance-none pr-10 cursor-pointer"
              >
                <option value="upcoming">Sort by: Upcoming</option>
                <option value="newest">Sort by: Newest</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg border border-border hover:border-primary transition font-semibold"
            >
              <SlidersHorizontal size={20} />
              Filter
            </button>
          </div>

          {/* Sport Filter Tags */}
          {filterOpen && (
            <div className="flex flex-wrap gap-3 p-4 bg-card rounded-lg border border-border">
              {sports.map((sport) => (
                <button
                  key={sport}
                  onClick={() => setSelectedSport(sport)}
                  className={`px-4 py-2 rounded-full font-semibold transition ${selectedSport === sport
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border hover:border-primary text-foreground"
                    }`}
                >
                  {sport.charAt(0).toUpperCase() + sport.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Events Grid */}
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        </div>
      ) : (
        <section className="py-12 px-8">
          <div className="max-w-7xl mx-auto">
            {filteredEvents.length > 0 ? (
              <>
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  {filteredEvents.map((event) => (
                    <Link
                      key={event.id}
                      href={`/events/${event.id}`}
                      className={`bg-card rounded-xl overflow-hidden border border-border hover:border-primary transition group cursor-pointer ${event.status === "cancelled" || event.status === "postponed" ? "opacity-50 pointer-events-none" : ""
                        }`}
                    >
                      <div className="relative h-56 overflow-hidden bg-muted">
                        <img
                          src={event.image || "/placeholder.svg"}
                          alt={event.eventName}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                        <div
                          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${event.status === "completed"
                            ? "bg-green-500 text-white"
                            : event.status === "ongoing"
                              ? "bg-blue-500 text-white"
                              : event.status === "cancelled"
                                ? "bg-red-500 text-white"
                                : event.status === "postponed"
                                  ? "bg-yellow-500 text-white"
                                  : "bg-primary text-primary-foreground"
                            }`}
                        >
                          {event.status?.charAt(0).toUpperCase() +
                            event.status?.slice(1) || "Upcoming"}
                        </div>
                        {(event.status === "cancelled" || event.status === "postponed") && (
                          <div className="absolute inset-0 bg-black opacity-50 flex items-center justify-center">
                            <span className="text-white font-bold text-xl">
                              Event {event.status?.charAt(0).toUpperCase() + event.status?.slice(1)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-primary transition">
                          {event.eventName}
                        </h3>
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <MapPin size={16} className="flex-shrink-0" />
                            <span>{event.venue}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Calendar size={16} className="flex-shrink-0" />
                            <span>
                              {new Date(event.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Users size={16} className="flex-shrink-0" />
                            <span>
                              {event.ticketStatus.maximumOccupancy} participating
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-border">
                          <span className="font-bold text-primary">
                            $ {event.perTicketPrice}
                          </span>
                          <button className="text-primary hover:text-primary/80 transition font-semibold text-sm">
                            ATTEND
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {filteredEvents.length > 6 && (
                  <div className="text-center">
                    <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:opacity-90 transition font-semibold">
                      View More
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground mb-4">
                  No events found matching your criteria
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedSport("all");
                  }}
                  className="text-primary hover:text-primary/80 transition font-semibold"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      {/* <section className="py-24 px-8 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Can't Find Your Event?</h2>
          <p className="text-lg mb-8 opacity-95">Contact us to suggest events or become an event organizer</p>
          <button className="bg-primary-foreground text-primary px-8 py-3 rounded-lg hover:opacity-90 transition font-semibold">
            Get in Touch
          </button>
        </div>
      </section> */}

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
                    Pricing
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
                    Blog
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
