"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Users,
  Calendar,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { getAllSports } from "../api/sports";
import { getCategoriesByType } from "../api/category";

export default function SportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("upcoming");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const sportsResponse = await getAllSports();
        if (sportsResponse && sportsResponse.sports) {
          setSports(sportsResponse.sports);
        }

        const categoriesResponse = await getCategoriesByType("sports");
        if (categoriesResponse && categoriesResponse.categories) {
          setCategories(categoriesResponse.categories);
        }

      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log("Sports ", sports);

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

  const filteredSports = sports
    .filter((sport) => {
      const matchesSearch =
        sport.sportName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sport.venue?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getCategoryName(sport.category)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sport.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || getCategoryName(sport.category)?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
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
      if (sortBy === "registration") {
        return (b.participationStatus?.confirmedParticipants || 0) - (a.participationStatus?.confirmedParticipants || 0);
      }
      return 0;
    });

  const sportCategories = [
    "all",
    ...categories.map(category => category.name)
  ];

  return (
    <main className="bg-background text-foreground">
      {/* Navigation */}
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary/10 to-transparent py-12 px-8 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Explore Sports Events
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover and register for exciting sports competitions and tournaments
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
                placeholder="Search sports, venues, or categories..."
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
                <option value="registration">Sort by: Most Registered</option>
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
            <div className="space-y-6 p-4 bg-card rounded-lg border border-border">
              {/* Category Filter */}
              <div>
                <h4 className="font-semibold mb-3 text-sm text-muted-foreground">CATEGORIES</h4>
                <div className="flex flex-wrap gap-3">
                  {sportCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full font-semibold transition ${selectedCategory === category
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border hover:border-primary text-foreground"
                        }`}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Sports Grid */}
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading sports events...</p>
          </div>
        </div>
      ) : (
        <section className="py-12 px-8">
          <div className="max-w-7xl mx-auto">
            {filteredSports.length > 0 ? (
              <>
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  {filteredSports.map((sport) => (
                    <Link
                      key={sport.id}
                      href={`/sports/${sport.id}`}
                      className={`bg-card rounded-xl overflow-hidden border border-border hover:border-primary transition group cursor-pointer ${sport.status === "cancelled" || sport.status === "postponed" ? "opacity-50 pointer-events-none" : ""
                        }`}
                    >
                      <div className="relative h-56 overflow-hidden bg-muted">
                        <img
                          src={sport.image || "/placeholder.svg"}
                          alt={sport.sportName}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                        <div
                          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${sport.status === "completed"
                            ? "bg-green-500 text-white"
                            : sport.status === "ongoing"
                              ? "bg-blue-500 text-white"
                              : sport.status === "cancelled"
                                ? "bg-red-500 text-white"
                                : sport.status === "postponed"
                                  ? "bg-yellow-500 text-white"
                                  : "bg-primary text-primary-foreground"
                            }`}
                        >
                          {sport.status?.charAt(0).toUpperCase() +
                            sport.status?.slice(1) || "Upcoming"}
                        </div>
                        {(sport.status === "cancelled" || sport.status === "postponed") && (
                          <div className="absolute inset-0 bg-black opacity-50 flex items-center justify-center">
                            <span className="text-white font-bold text-xl">
                              Sport {sport.status?.charAt(0).toUpperCase() + sport.status?.slice(1)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-primary transition">
                          {sport.sportName}
                        </h3>
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <MapPin size={16} className="flex-shrink-0" />
                            <span>{sport.venue}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Calendar size={16} className="flex-shrink-0" />
                            <span>
                              {new Date(sport.date).toLocaleDateString()} at {sport.time}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Users size={16} className="flex-shrink-0" />
                            <span>
                              {sport.participationStatus?.confirmedParticipants || 0} / {sport.participationStatus?.maximumParticipants || 0} participants
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <Trophy size={16} className="flex-shrink-0" />
                            <span className="capitalize">
                              {getCategoryName(sport.category)}
                              {sport.teamSize && sport.teamSize > 1 && ` • Team of ${sport.teamSize}`}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-border">
                          <div>
                            <span className="font-bold text-primary">
                              $ {sport.registrationFee || "0.00"}
                            </span>
                            <span className="text-xs text-muted-foreground ml-2">
                              registration fee
                            </span>
                          </div>
                          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition font-semibold text-sm">
                            REGISTER
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {filteredSports.length > 6 && (
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
                  No sports events found matching your criteria
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
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

      {/* Footer */}
      <footer className="bg-card border-t border-border py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h4 className="font-bold mb-4">GoSports</h4>
              <p className="text-muted-foreground text-sm">
                Connecting athletes and sports events worldwide
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