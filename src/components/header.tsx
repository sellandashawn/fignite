"use client"

import Link from "next/link";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-secondary/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-white font-bold">GS</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">
              GoSports
            </span>
          </Link>
          <nav className="hidden md:flex gap-8 items-center">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link
              href="/about"
              className="hover:text-primary transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/events"
              className="hover:text-primary transition-colors"
            >
              Events
            </Link>
            <Link
              href="/sports"
              className="hover:text-primary transition-colors"
            >
              Sports
            </Link>
            <Link
              href="/gallery"
              className="hover:text-primary transition-colors"
            >
              Gallery
            </Link>
            <Link
              href="/#contact"
              className="hover:text-primary transition-colors"
            >
              Contact Us
            </Link>
            <Link href="/events">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Buy Tickets
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}