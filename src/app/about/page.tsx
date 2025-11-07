"use client"

import type React from "react"

import { Heart, Clock, CheckCircle, Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"

const HeroImage = () => (
  <div className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-lg">
    <Image src="/images/marathon-runners-sports-event-city.jpg" alt="Sports event participants" fill className="object-cover" priority />
  </div>
)

const TeamMember = ({ name, title, image }: { name: string; title: string; image: string }) => (
  <div className="text-center">
    <div className="relative w-full h-48 md:h-56 mb-4 rounded-lg overflow-hidden">
      <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
    </div>
    <h3 className="text-lg md:text-xl font-bold text-foreground">{name}</h3>
    <p className="text-sm md:text-base text-muted-foreground">{title}</p>
  </div>
)

const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: { icon: React.ComponentType<any>; title: string; description: string }) => (
  <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border border-border hover:border-primary transition-colors">
    <Icon className="w-12 h-12 text-primary mb-4" />
    <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
)

export default function AboutPage() {
  return (
    <main className="bg-background text-foreground min-h-screen">
      {/* Navigation Header */}
     <Header/>

      {/* About Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">About GoSports</h1>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed max-w-3xl">
            GoSports delivers a dynamic sports event and tournament company based in Kuala Lumpur, Malaysia. We are
            driving innovation in sports organization and competitive participation across the region.
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-muted-foreground leading-relaxed">
            <div>
              <p className="mb-4">
                Driven by a passion for athletics, our dedicated team has built a comprehensive platform that connects
                athletes, organizers, and enthusiasts through professionally managed sporting events.
              </p>
            </div>
            <div>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span>Sport Marathon & Tourism</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span>Dedicated Sports Events</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">•</span>
                  <span>Professional Organization</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <HeroImage />
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-card p-8 rounded-lg border border-border">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                To establish Malaysia with sports finest— where athletes discover opportunity, innovation fuels
                competition, and our collective passion elevates sports participation and experience across the region
                and beyond.
              </p>
            </div>
            <div className="bg-card p-8 rounded-lg border border-border">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our mission is to craft athletic experiences that inspire athletes of all levels by delivering
                world-class sporting events with innovative technology, dedicated community support, and strategic
                partnerships that make competitive sports accessible and unforgettable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Heart}
              title="Secure Platform"
              description="Your data and registrations are protected with enterprise-grade security and encryption."
            />
            <FeatureCard
              icon={Clock}
              title="24/7 Access"
              description="Access event information, manage registrations, and track progress anytime, anywhere."
            />
            <FeatureCard
              icon={CheckCircle}
              title="Verified Organizers"
              description="All events are organized by verified professionals ensuring quality and authenticity."
            />
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <TeamMember name="Shankar Retinam" title="Managing Director" image="/professional-male-businessman-portrait.jpg" />
            <TeamMember name="Azam Syed" title="Sports Director" image="/professional-male-sports-director-portrait.jpg" />
            <TeamMember name="Mariam Aziz" title="Events Manager" image="/professional-female-manager-portrait.jpg" />
          </div>
        </div>
      </section>

      {/* Contact & Footer */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-secondary/50 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            {/* Contact Info */}
            <div>
              <h3 className="text-2xl font-bold mb-8">Contact us or visit us</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-foreground">Malaysia</p>
                    <p className="text-sm text-muted-foreground">Kuala Lumpur, Malaysia</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Phone className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-foreground">Phone</p>
                    <p className="text-sm text-muted-foreground">+60 (123) 456-7890</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-foreground">Email</p>
                    <p className="text-sm text-muted-foreground">info@gosports.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card p-8 rounded-lg border border-border">
              <h3 className="text-xl font-bold mb-6">Send us a Message</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full bg-secondary border border-border rounded px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full bg-secondary border border-border rounded px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                  <textarea
                    rows={4}
                    className="w-full bg-secondary border border-border rounded px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                    placeholder="Your message..."
                  />
                </div>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Send Message</Button>
              </form>
            </div>
          </div>

          {/* Footer Links */}
          <div className="border-t border-border pt-8 grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold mb-4 text-foreground">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-primary transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-primary transition-colors">
                    Events
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-foreground">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-primary transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <h4 className="font-bold mb-4 text-foreground">Newsletter</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Subscribe to stay updated with latest events and news.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  className="flex-1 bg-secondary border border-border rounded px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="your@email.com"
                />
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Subscribe</Button>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 GoSports. All rights reserved.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
