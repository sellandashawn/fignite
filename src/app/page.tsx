"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Calendar, MapPin, Users, Trophy, Mail, Phone, Zap, BarChart3, Heart } from "lucide-react"
import { Header } from "@/components/header"

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({ days: 45, hours: 12, minutes: 30, seconds: 45 })
  const [visibleEvents, setVisibleEvents] = useState(6)

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

  const events = [
    {
      id: 1,
      title: "Urban Marathon",
      location: "New York City",
      date: "APR 15-16",
      month: "April",
      participants: "2,400",
      image: "/images/marathon-race-urban-city.jpg",
    },
    {
      id: 2,
      title: "Beach Volleyball",
      location: "Miami Beach",
      date: "MAY 2-4",
      month: "May",
      participants: "1,800",
      image: "/images/beach-volleyball-tournament.jpg",
    },
    {
      id: 3,
      title: "Mountain Bike Challenge",
      location: "Colorado Springs",
      date: "MAY 31-JUN 1",
      month: "May",
      participants: "980",
      image: "/images/mountain-bike-trail-race.jpg",
    },
    {
      id: 4,
      title: "Triathlon Series",
      location: "San Francisco",
      date: "JUN 10-12",
      month: "June",
      participants: "1,200",
      image: "/images/triathlon-swimming-cycling-running.jpg",
    },
    {
      id: 5,
      title: "Tennis Championship",
      location: "Los Angeles",
      date: "JUN 15-20",
      month: "June",
      participants: "640",
      image: "/images/tennis-championship-court.jpg",
    },
    {
      id: 6,
      title: "CrossFit Games",
      location: "Austin, Texas",
      date: "JUL 1-3",
      month: "July",
      participants: "1,500",
      image: "/images/crossfit-competition-athletes.jpg",
    },
  ]

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
      {/* Navigation */}
      <Header />
      {/* Hero Section with Integrated Countdown */}
      <section className="relative min-h-screen bg-gradient-to-b from-card to-background overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-20">
          <div className="text-center mb-12">
            <div className="inline-block mb-6 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
              <p className="text-primary font-semibold text-sm">
                ANNUAL CHAMPIONSHIP EVENT
              </p>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight text-balance">
              The Biggest Championship Starts Soon
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Join thousands of athletes worldwide for the most prestigious
              sports championship. Limited spots available.
            </p>

            {/* Countdown in Hero */}
            <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-12">
              <div className="bg-card rounded-lg p-6 border border-border hover:border-primary transition">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {String(timeLeft.days).padStart(2, "0")}
                </div>
                <div className="text-sm text-muted-foreground">Days</div>
              </div>
              <div className="bg-card rounded-lg p-6 border border-border hover:border-primary transition">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {String(timeLeft.hours).padStart(2, "0")}
                </div>
                <div className="text-sm text-muted-foreground">Hours</div>
              </div>
              <div className="bg-card rounded-lg p-6 border border-border hover:border-primary transition">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </div>
                <div className="text-sm text-muted-foreground">Minutes</div>
              </div>
              <div className="bg-card rounded-lg p-6 border border-border hover:border-primary transition">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </div>
                <div className="text-sm text-muted-foreground">Seconds</div>
              </div>
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
              <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:opacity-90 transition font-semibold flex items-center gap-2 justify-center">
                Register Now <ArrowRight size={20} />
              </button>
              <button className="border border-primary text-primary px-8 py-3 rounded-lg hover:bg-primary hover:text-primary-foreground transition font-semibold">
                Learn More
              </button>
            </div>
          </div>

          {/* Community Stats */}
          <div className="grid md:grid-cols-4 gap-8 mt-24">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">50K+</div>
              <p className="text-muted-foreground text-sm">Active Athletes</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">200+</div>
              <p className="text-muted-foreground text-sm">Events Yearly</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">85</div>
              <p className="text-muted-foreground text-sm">Countries</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">4.9★</div>
              <p className="text-muted-foreground text-sm">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section id="how" className="py-24 px-8 bg-card border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
              What We Do
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              GoSports connects athletes with extraordinary sporting
              experiences. We empower participants to discover, register, and
              excel at events worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6 border border-primary/20 group-hover:bg-primary/20 transition">
                <Zap className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Discover Events</h3>
              <p className="text-muted-foreground">
                Browse thousands of sporting events from marathons to
                championships. Filter by location, date, and sport type to find
                your perfect match.
              </p>
            </div>

            <div className="group">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6 border border-primary/20 group-hover:bg-primary/20 transition">
                <Users className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Connect & Compete</h3>
              <p className="text-muted-foreground">
                Join a vibrant community of athletes from around the world.
                Network, share experiences, and find training partners for your
                next challenge.
              </p>
            </div>

            <div className="group">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6 border border-primary/20 group-hover:bg-primary/20 transition">
                <BarChart3 className="text-primary" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-3">Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor your performance across events. Analyze stats, earn
                achievements, and watch yourself improve with our comprehensive
                analytics dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events - Next 3 Months */}
      <section id="events" className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-2 text-balance">
                Upcoming Events
              </h2>
              <p className="text-muted-foreground">
                Next 3 months of amazing sporting experiences
              </p>
            </div>
            <a
              href="#"
              className="text-primary hover:text-primary/80 transition flex items-center gap-2 font-semibold whitespace-nowrap"
            >
              View All <ArrowRight size={20} />
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {events.slice(0, visibleEvents).map((event) => (
              <div
                key={event.id}
                className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary transition group cursor-pointer"
              >
                <div className="relative h-64 overflow-hidden bg-muted">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    {event.date}
                  </div>
                  <div className="absolute top-4 left-4 bg-background/80 text-foreground px-3 py-1 rounded-full text-xs font-semibold">
                    {event.month}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3">{event.title}</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin size={16} />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users size={16} />
                      <span className="text-sm">
                        {event.participants} participants
                      </span>
                    </div>
                  </div>
                  <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition font-semibold text-sm">
                    Register Event
                  </button>
                </div>
              </div>
            ))}
          </div>

          {visibleEvents < events.length && (
            <div className="text-center mt-12">
              <button
                onClick={() => setVisibleEvents(events.length)}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:opacity-90 transition font-semibold"
              >
                View All Events
              </button>
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
      <section className="py-24 px-8 bg-primary text-primary-foreground">
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
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Security
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
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Careers
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
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex justify-between items-center text-muted-foreground text-sm">
            <p>&copy; 2025 GoSports. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition">
                Twitter
              </a>
              <a href="#" className="hover:text-primary transition">
                Instagram
              </a>
              <a href="#" className="hover:text-primary transition">
                Facebook
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
