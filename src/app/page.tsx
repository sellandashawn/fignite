"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Calendar, MapPin, Users, Trophy, Mail, Phone, Zap, BarChart3, Heart } from "lucide-react"
import { Header } from "@/components/header"
import { getAllEvents } from "../app/api/event"
import { getAllSports } from "./api/sports"
import Link from "next/link"

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({ days: 45, hours: 12, minutes: 30, seconds: 45 })
  const [visibleEvents, setVisibleEvents] = useState(6)
  const [visibleSports, setVisibleSports] = useState(6)
  const [events, setEvents] = useState([])
  const [sports, setSports] = useState([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [loadingSports, setLoadingSports] = useState(true)
  const [errorEvents, setErrorEvents] = useState(null)
  const [errorSports, setErrorSports] = useState(null)
  const [activeTab, setActiveTab] = useState("events")

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoadingEvents(true)
        setErrorEvents(null)
        const response = await getAllEvents()
        console.log("Fetched events:", response)

        if (response && response.events) {
          setEvents(response.events)
        } else {
          console.error("Unexpected response structure:", response)
          setEvents([])
        }
      } catch (error) {
        console.error("Error fetching events:", error)
        setErrorEvents("Failed to load events. Please try again later.")
        setEvents([])
      } finally {
        setLoadingEvents(false)
      }
    }

    fetchEvents()
  }, [])

  useEffect(() => {
    const fetchSports = async () => {
      try {
        setLoadingSports(true)
        setErrorSports(null)
        const response = await getAllSports()
        console.log("Fetched Sports:", response)

        if (response && response.sports) {
          setSports(response.sports)
        } else {
          console.error("Unexpected response structure:", response)
          setSports([])
        }
      } catch (error) {
        console.error("Error fetching sports:", error)
        setErrorSports("Failed to load sports. Please try again later.")
        setSports([])
      } finally {
        setLoadingSports(false)
      }
    }

    fetchSports()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        }
        if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  const futureEvents = events
    .filter(event => {
      if (!event.date) return false
      const eventDate = new Date(event.date)
      return eventDate >= tomorrow
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marathon Runner",
      quote:
        "GoSports made it so easy to find and register for events. The platform is intuitive and the community is amazing!",
      image: "/images/professional-woman-athlete.jpg",
    },
    {
      name: "Michael Chen",
      role: "Triathlon Coach",
      quote:
        "Best platform for organizing sports events. The analytics and participant management tools are exceptional.",
      image: "/images/professional-man-coach.jpg",
    },
    {
      name: "Emma Rodriguez",
      role: "Sports Organizer",
      quote: "We've grown our event participation by 300% using GoSports. Highly recommended!",
      image: "/images/professional-woman-organizer.jpg",
    },
  ]

  return (
    <main className="bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-b from-card to-background overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
          <div className="text-center mb-12">
            <div className="inline-block mb-6 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
              <p className="text-primary font-semibold text-sm">
                ANNUAL CHAMPIONSHIP EVENT
              </p>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight text-balance">
              The Biggest Championship Starts Soon
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto">
              Join thousands of athletes worldwide for the most prestigious
              sports championship. Limited spots available.
            </p>

            {/* Countdown in Hero */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto mb-8 sm:mb-12">
              <div className="bg-card rounded-lg p-4 sm:p-6 border border-border hover:border-primary transition">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-1 sm:mb-2">
                  {String(timeLeft.days).padStart(2, "0")}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">Days</div>
              </div>
              <div className="bg-card rounded-lg p-4 sm:p-6 border border-border hover:border-primary transition">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-1 sm:mb-2">
                  {String(timeLeft.hours).padStart(2, "0")}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">Hours</div>
              </div>
              <div className="bg-card rounded-lg p-4 sm:p-6 border border-border hover:border-primary transition">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-1 sm:mb-2">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">Minutes</div>
              </div>
              <div className="bg-card rounded-lg p-4 sm:p-6 border border-border hover:border-primary transition">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-1 sm:mb-2">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">Seconds</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button className="bg-primary text-primary-foreground px-6 sm:px-8 py-3 rounded-lg hover:opacity-90 transition font-semibold flex items-center gap-2 justify-center">
                Register Now <ArrowRight size={20} />
              </button>
              <button className="border border-primary text-primary px-6 sm:px-8 py-3 rounded-lg hover:bg-primary hover:text-primary-foreground transition font-semibold">
                Learn More
              </button>
            </div>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-12 sm:mt-16 lg:mt-24">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">50K+</div>
              <p className="text-xs sm:text-sm text-muted-foreground">Active Athletes</p>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">200+</div>
              <p className="text-xs sm:text-sm text-muted-foreground">Events Yearly</p>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">85</div>
              <p className="text-xs sm:text-sm text-muted-foreground">Countries</p>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">4.9★</div>
              <p className="text-xs sm:text-sm text-muted-foreground">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance">
              What We Do
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              GoSports connects athletes with extraordinary sporting
              experiences. We empower participants to discover, register, and
              excel at events worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="group">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4 sm:mb-6 border border-primary/20 group-hover:bg-primary/20 transition">
                <Zap className="text-primary" size={28} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Discover Events</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Browse thousands of sporting events from marathons to
                championships. Filter by location, date, and sport type to find
                your perfect match.
              </p>
            </div>

            <div className="group">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4 sm:mb-6 border border-primary/20 group-hover:bg-primary/20 transition">
                <Users className="text-primary" size={28} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Connect & Compete</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Join a vibrant community of athletes from around the world.
                Network, share experiences, and find training partners for your
                next challenge.
              </p>
            </div>

            <div className="group">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4 sm:mb-6 border border-primary/20 group-hover:bg-primary/20 transition">
                <BarChart3 className="text-primary" size={28} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Track Progress</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Monitor your performance across events. Analyze stats, earn
                achievements, and watch yourself improve with our comprehensive
                analytics dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center mb-8 sm:mb-12">
            <div className="flex items-center bg-card border border-border rounded-lg p-1">
              <button
                onClick={() => setActiveTab("events")}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-md text-sm font-medium transition-all ${activeTab === "events"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Events
              </button>
              <button
                onClick={() => setActiveTab("sports")}
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-md text-sm font-medium transition-all ${activeTab === "sports"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Sports
              </button>
            </div>
          </div>

          {/* Events Tab Content */}
          {activeTab === "events" && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-12">
                <div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-balance">
                    Upcoming Events
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Next 3 months of amazing sporting experiences
                  </p>
                </div>
                <Link
                  href="/events"
                  className="text-primary hover:text-primary/80 transition flex items-center gap-2 font-semibold whitespace-nowrap"
                >
                  View All <ArrowRight size={20} />
                </Link>
              </div>

              {loadingEvents ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                  <p className="text-muted-foreground">Loading events...</p>
                </div>
              ) : errorEvents ? (
                <div className="text-center py-12">
                  <p className="text-red-500 mb-4">{errorEvents}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-primary text-primary-foreground px-4 sm:px-6 py-2 rounded-lg hover:opacity-90 transition font-semibold text-sm"
                  >
                    Try Again
                  </button>
                </div>
              ) : futureEvents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No upcoming events found.</p>
                  <p className="text-muted-foreground text-sm mt-2">
                    Check back soon for new events!
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {futureEvents.slice(0, visibleEvents).map((event) => (
                      <div
                        key={event.id}
                        className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary transition group cursor-pointer"
                      >
                        <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden bg-muted">
                          <img
                            src={event.image || "/placeholder.svg"}
                            alt={event.eventName}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                          />
                          <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                            {new Date(event.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="absolute top-3 left-3 bg-background/80 text-foreground px-2 sm:px-3 py-1 rounded-full text-xs font-semibold">
                            {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                          </div>
                        </div>
                        <div className="p-4 sm:p-6">
                          <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{event.eventName}</h3>
                          <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin size={16} />
                              <span className="text-xs sm:text-sm">{event.venue || "Location TBA"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar size={16} />
                              <span className="text-xs sm:text-sm">
                                {new Date(event.date).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Users size={16} />
                              <span className="text-xs sm:text-sm">
                                {event.ticketStatus?.maximumOccupancy || 'N/A'} participants
                              </span>
                            </div>
                          </div>
                          <Link
                            href={`/events/${event.id}`}
                            className="block"
                          >
                            <button className="w-full bg-primary text-primary-foreground py-2 sm:py-3 rounded-lg hover:opacity-90 transition font-semibold text-sm">
                              View Details
                            </button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>

                  {visibleEvents < futureEvents.length && (
                    <div className="text-center mt-8 sm:mt-12">
                      <button
                        onClick={() => setVisibleEvents(futureEvents.length)}
                        className="bg-primary text-primary-foreground px-6 sm:px-8 py-3 rounded-lg hover:opacity-90 transition font-semibold text-sm sm:text-base"
                      >
                        View All Events ({futureEvents.length})
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Sports Tab Content */}
          {activeTab === "sports" && (
            <div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-12">
                <div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-balance">
                    Available Sports
                  </h2>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Discover various sports you can participate in
                  </p>
                </div>
                <Link
                  href="/sports"
                  className="text-primary hover:text-primary/80 transition flex items-center gap-2 font-semibold whitespace-nowrap"
                >
                  View All <ArrowRight size={20} />
                </Link>
              </div>

              {loadingSports ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
                  <p className="text-muted-foreground">Loading sports...</p>
                </div>
              ) : errorSports ? (
                <div className="text-center py-12">
                  <p className="text-red-500 mb-4">{errorSports}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-primary text-primary-foreground px-4 sm:px-6 py-2 rounded-lg hover:opacity-90 transition font-semibold text-sm"
                  >
                    Try Again
                  </button>
                </div>
              ) : sports.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No sports found.</p>
                  <p className="text-muted-foreground text-sm mt-2">
                    Check back soon for available sports!
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {sports.slice(0, visibleSports).map((sport) => (
                      <div
                        key={sport.id}
                        className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary transition group cursor-pointer"
                      >
                        <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden bg-muted">
                          <img
                            src={sport.image || "/placeholder.svg"}
                            alt={sport.sportName}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                          />
                          <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                            {new Date(sport.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                        <div className="p-4 sm:p-6">
                          <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{sport.sportName}</h3>
                          <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin size={16} className="flex-shrink-0" />
                              <span className="text-xs sm:text-sm">{sport.venue}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar size={16} className="flex-shrink-0" />
                              <span className="text-xs sm:text-sm">
                                {new Date(sport.date).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Users size={16} className="flex-shrink-0" />
                              <span className="text-xs sm:text-sm">
                                {sport.participationStatus?.maximumParticipants || 0} participants
                              </span>
                            </div>
                          </div>
                          <Link
                            href={`/sports/${sport.id}`}
                            className="block"
                          >
                            <button className="w-full bg-primary text-primary-foreground py-2 sm:py-3 rounded-lg hover:opacity-90 transition font-semibold text-sm">
                              View Details
                            </button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>

                  {visibleSports < sports.length && (
                    <div className="text-center mt-8 sm:mt-12">
                      <button
                        onClick={() => setVisibleSports(sports.length)}
                        className="bg-primary text-primary-foreground px-6 sm:px-8 py-3 rounded-lg hover:opacity-90 transition font-semibold text-sm sm:text-base"
                      >
                        View All Sports ({sports.length})
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </section>
      {/* Why Choose GoSports */}
      <section className="py-24 px-8 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Why Choose GoSports?
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <Trophy className="text-primary" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Premium Events</h3>
              <p className="text-muted-foreground">
                Access to curated, high-quality sporting events
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <Calendar className="text-primary" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Easy Registration</h3>
              <p className="text-muted-foreground">
                Simple one-click registration for all events
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <Heart className="text-primary" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Global Community</h3>
              <p className="text-muted-foreground">
                Connect with athletes from around the world
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <BarChart3 className="text-primary" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor your performance and achievements
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            What Athletes Say
          </h2>
          <p className="text-center text-muted-foreground mb-16">
            Join thousands of satisfied participants
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-8 border border-border hover:border-primary transition"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "{testimonial.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Message from Director */}
      <section
        id="about"
        className="py-24 px-8 bg-gradient-to-r from-primary/5 to-transparent border-y border-border"
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                A Message from Our Founder
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                "At GoSports, we believe in the transformative power of sports.
                Our mission is to break down barriers between athletes and
                opportunities, creating a world where anyone can discover their
                next challenge, connect with like-minded competitors, and
                achieve their personal best."
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                "Whether you're a seasoned marathoner or trying your first
                triathlon, GoSports is built for you. We're not just a
                platform—we're a community of champions pushing each other to
                greatness."
              </p>
              <div>
                <p className="font-bold text-lg">Shankar Retinam</p>
                <p className="text-muted-foreground">Founder & CEO, GoSports</p>
              </div>
            </div>
            <div className="relative">
              <img
                src="/images/shankar.png"
                alt="Founder John Anderson"
                className="rounded-xl w-full object-cover"
              />
              <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-lg">
                <p className="font-bold">10+ Years</p>
                <p className="text-sm">Sports Industry Experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-24 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
              Get in Touch
            </h2>
            <p className="text-lg text-muted-foreground">
              Have questions? Our team is here to help you find the perfect
              event.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-card rounded-xl p-8 border border-border text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <Mail className="text-primary" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Email</h3>
              <p className="text-muted-foreground mb-4">support@gosports.com</p>
              <a
                href="mailto:support@gosports.com"
                className="text-primary hover:text-primary/80 transition font-semibold text-sm"
              >
                Send Email
              </a>
            </div>

            <div className="bg-card rounded-xl p-8 border border-border text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <Phone className="text-primary" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Phone</h3>
              <p className="text-muted-foreground mb-4">+1 (555) 123-4567</p>
              <a
                href="tel:+15551234567"
                className="text-primary hover:text-primary/80 transition font-semibold text-sm"
              >
                Call Us
              </a>
            </div>

            <div className="bg-card rounded-xl p-8 border border-border text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <MapPin className="text-primary" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Office</h3>
              <p className="text-muted-foreground mb-4">
                123 Sports Ave, NY 10001
              </p>
              <a
                href="#"
                className="text-primary hover:text-primary/80 transition font-semibold text-sm"
              >
                Get Directions
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card rounded-xl p-12 border border-border">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="How can we help?"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Message
                </label>
                <textarea
                  placeholder="Tell us more about your inquiry..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary transition"
                ></textarea>
              </div>
              <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:opacity-90 transition font-semibold">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-24 px-8 bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Join the Action?</h2>
          <p className="text-lg mb-8 opacity-95">
            Sign up today and start your sports journey. Access exclusive events
            and connect with athletes worldwide.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="bg-primary-foreground text-primary px-8 py-3 rounded-lg hover:opacity-90 transition font-semibold">
              Get Started Now
            </button>
            <button className="border-2 border-primary-foreground text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary-foreground hover:text-primary transition font-semibold">
              Learn More
            </button>
          </div>
        </div>
      </section> */}

      {/* Footer */}
    </main>
  );
}