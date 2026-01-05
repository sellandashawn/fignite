"use client";

import { useState, useEffect } from "react";
import { Search, ImageIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default function GalleryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Gallery images
  const images = [
    { url: "/images/marathon-race-urban-city.jpg", category: "Running" },
    { url: "/images/beach-volleyball-tournament.jpg", category: "Volleyball" },
    { url: "/images/mountain-bike-trail-race.jpg", category: "Cycling" },
    { url: "/images/triathlon-swimming-cycling-running.jpg", category: "Triathlon" },
    { url: "/images/tennis-championship-court.jpg", category: "Tennis" },
    { url: "/images/crossfit-competition-athletes.jpg", category: "CrossFit" },
  ];

  const categories = ["all", "Running", "Volleyball", "Cycling", "Triathlon", "Tennis", "CrossFit"];

  const filteredImages = images.filter((img) => {
    const matchesCategory = category === "all" || img.category === category;
    const matchesSearch = img.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // ----------------------------
  // 🖼 CAROUSEL LOGIC
  // ----------------------------
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    "/images/marathon-race-urban-city.jpg",
    "/images/triathlon-swimming-cycling-running.jpg",
    "/images/beach-volleyball-tournament.jpg",
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => nextSlide(), 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="bg-background text-foreground">
      <Navbar />

      {/* ===========================
          HERO CAROUSEL
      ============================ */}
      <div className="relative w-full h-[380px] md:h-[480px] overflow-hidden border-b border-border">
        {heroSlides.map((src, index) => (
          <img
            key={index}
            src={src}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700
              ${
                index === currentSlide
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105"
              }
            `}
          />
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-end p-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            GoSports Gallery
          </h1>
        </div>

        {/* Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
        >
          <ChevronRight size={20} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full cursor-pointer transition 
                ${
                  index === currentSlide
                    ? "bg-primary"
                    : "bg-white/60 hover:bg-white"
                }
              `}
            />
          ))}
        </div>
      </div>

      {/* HEADER TEXT */}
      <section className="py-10 px-8 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <p className="text-lg text-muted-foreground">
            Explore unforgettable photos from our premium sporting events
          </p>
        </div>
      </section>

      {/* SEARCH & FILTER */}
      <section className="py-8 px-8 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:border-primary transition"
              />
            </div>

            {/* Filter button */}
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg border border-border hover:border-primary transition font-semibold"
            >
              <ImageIcon size={20} />
              Filter
            </button>
          </div>

          {/* Categories */}
          {filterOpen && (
            <div className="p-4 bg-card rounded-lg border border-border flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    category === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border hover:border-primary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* GALLERY GRID */}
      <section className="py-12 px-8">
        <div className="max-w-7xl mx-auto">
          {filteredImages.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">
                No images found
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {filteredImages.map((img, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(img.url)}
                  className="relative group cursor-pointer rounded-xl overflow-hidden border border-border bg-muted"
                >
                  <img
                    src={img.url}
                    alt="Gallery IMG"
                    className="w-full h-64 object-cover group-hover:scale-110 transition duration-300"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-black/40 flex items-center justify-center">
                    <p className="text-white font-semibold">{img.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
          <div className="relative max-w-3xl w-full">
            <img
              src={selectedImage}
              className="w-full rounded-xl shadow-xl"
              alt="Preview"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-4 -right-4 bg-white text-black rounded-full p-2 shadow-lg hover:bg-gray-200 transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
