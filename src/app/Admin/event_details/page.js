"use client";

import React, { useState, useEffect } from "react";
import {
  Upload,
  Calendar,
  MapPin,
  FileText,
  Tag,
  Edit,
  Trash2,
  Plus,
  Search,
  ChevronDown,
  Clock,
  Users,
  Ticket,
  Shirt,
  X,
} from "lucide-react";
import {
  createEvent,
  getAllEvents,
  deleteEvent,
  updateEvent,
  getEventById,
} from "../../api/event";
import { getCategories } from "../../api/category";

export default function EventDetails() {
  const [showForm, setShowForm] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [categoryFilter, setCategoryFilter] = useState("All Category");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [eventToEdit, setEventToEdit] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const initialFormData = {
    eventName: "",
    venue: "",
    date: "",
    time: "",
    category: "",
    description: "",
    perTicketPrice: "",
    maximumOccupancy: "",
    raceCategories: ["Race A", "Race B"],
    availableTshirtSizes: ["XS", "S", "M", "L", "XL", "XXL"],
    agenda: [{ time: "", activity: "" }],
    status: "upcoming",
  };

  const [formData, setFormData] = useState(initialFormData);

  const statusOptions = [
    { value: "upcoming", label: "Upcoming" },
    { value: "ongoing", label: "Ongoing" },
    { value: "completed", label: "Completed" },
  ];

  // Helper function to determine event status based on date
  const determineEventStatus = (eventDate, eventTime) => {
    if (!eventDate) return "upcoming";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventDateTime = new Date(eventDate);

    // If there's a time, add it to the event date
    if (eventTime) {
      const [hours, minutes] = eventTime.split(":");
      eventDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(23, 59, 59, 999);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    // If event date is before today (and time has passed if specified)
    if (eventDateTime < yesterday) {
      return "completed";
    }
    // If event date is today
    else if (
      eventDateTime.getDate() === today.getDate() &&
      eventDateTime.getMonth() === today.getMonth() &&
      eventDateTime.getFullYear() === today.getFullYear()
    ) {
      return "ongoing";
    }
    // If event date is tomorrow or later
    else if (eventDateTime >= tomorrow) {
      return "upcoming";
    }
    // For events that started yesterday but ended today (edge case)
    else {
      return "completed";
    }
  };

  // getCategoryName function
  const getCategoryName = (categoryIdentifier) => {
    if (!categoryIdentifier) return "N/A";

    // If it's a string, try to match by name first
    if (typeof categoryIdentifier === "string") {
      const foundCategory = categories.find(
        (cat) => cat.name === categoryIdentifier
      );
      if (foundCategory) return categoryIdentifier;
    }

    // If it's an object , extract the name
    if (typeof categoryIdentifier === "object" && categoryIdentifier !== null) {
      return categoryIdentifier.name || "N/A";
    }

    // Fallback: try to find by id/_id
    const category = categories.find(
      (cat) =>
        cat.id === categoryIdentifier ||
        cat._id === categoryIdentifier ||
        cat.name === categoryIdentifier
    );

    return category ? category.name : "N/A";
  };

  const fetchEventById = async (eventId) => {
    try {
      const response = await getEventById(eventId);

      if (response.event) {
        const event = response.event;
        const formattedDate = event.date
          ? new Date(event.date).toISOString().split("T")[0]
          : "";

        const updatedFormData = {
          eventName: event.eventName || "",
          venue: event.venue || "",
          date: formattedDate,
          time: event.time || "",
          category: event.category || "",
          description: event.description || "",
          perTicketPrice: event.perTicketPrice || event.perlicketPrice || "",
          maximumOccupancy: event.ticketStatus?.maximumOccupancy || "",
          raceCategories:
            event.raceCategories && event.raceCategories.length > 0
              ? event.raceCategories
              : [""],
          availableTshirtSizes:
            event.availableTshirtSizes || event.availableFshirtSizes || [],
          agenda:
            event.agenda && event.agenda.length > 0
              ? event.agenda
              : [{ time: "", activity: "" }],
          status: event.status || "upcoming",
        };

        if (event.image) {
          setImagePreview(event.image);
        }
        setSelectedImage(null);

        setFormData(updatedFormData);

        setShowForm(true);
        setEventToEdit(eventId);
        setError("");
      }
    } catch (err) {
      console.error("Error fetching event:", err);
      setError("Failed to fetch event details");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      console.log("Fetched categories:", response.categories);
      setCategories(response.categories || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to fetch categories");
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageSelect(e.dataTransfer.files[0]);
    }
  };

  const handleImageSelect = (file) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageSelect(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (index, value, field) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeArrayItem = (index, field) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const handleAgendaChange = (index, field, value) => {
    const newAgenda = [...formData.agenda];
    newAgenda[index] = { ...newAgenda[index], [field]: value };
    setFormData((prev) => ({ ...prev, agenda: newAgenda }));
  };

  const addAgendaItem = () => {
    setFormData((prev) => ({
      ...prev,
      agenda: [...prev.agenda, { time: "", activity: "" }],
    }));
  };

  const removeAgendaItem = (index) => {
    const newAgenda = formData.agenda.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, agenda: newAgenda }));
  };

  const handleTshirtSizeChange = (size) => {
    const currentSizes = formData.availableTshirtSizes;
    const newSizes = currentSizes.includes(size)
      ? currentSizes.filter((s) => s !== size)
      : [...currentSizes, size];
    setFormData((prev) => ({ ...prev, availableTshirtSizes: newSizes }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.eventName ||
      !formData.venue ||
      !formData.date ||
      !formData.time ||
      !formData.category ||
      !formData.perTicketPrice ||
      !formData.maximumOccupancy
    ) {
      setError("Please fill in all required fields");
      return;
    }

    const invalidAgendaItems = formData.agenda.some(
      (item) => !item.time || !item.activity
    );
    if (invalidAgendaItems) {
      setError(
        "Please fill out both time and activity for all agenda items or remove empty ones."
      );
      return;
    }

    const emptyRaceCategories = formData.raceCategories.some(
      (category) => !category
    );
    if (emptyRaceCategories) {
      setError("Please fill out all race categories or remove empty ones.");
      return;
    }
    setIsLoading(true);

    try {
      const submitData = new FormData();

      submitData.append("eventName", formData.eventName);
      submitData.append("venue", formData.venue);
      submitData.append("date", formData.date);
      submitData.append("time", formData.time);
      submitData.append("category", formData.category);
      submitData.append("description", formData.description);
      submitData.append("perTicketPrice", formData.perTicketPrice);
      submitData.append("maximumOccupancy", formData.maximumOccupancy);
      const autoStatus = determineEventStatus(formData.date, formData.time);

      submitData.append("status", autoStatus);
      submitData.append("agenda", JSON.stringify(formData.agenda));
      submitData.append(
        "raceCategories",
        JSON.stringify(
          formData.raceCategories.filter((cat) => cat.trim() !== "")
        )
      );
      submitData.append(
        "availableTshirtSizes",
        JSON.stringify(formData.availableTshirtSizes)
      );

      if (selectedImage) {
        submitData.append("image", selectedImage);
      }

      let response;
      if (eventToEdit) {
        response = await updateEvent(eventToEdit, submitData);
        console.log("Event updated:", response);
      } else {
        response = await createEvent(submitData);
        console.log("Event created:", response);
      }

      await fetchEvents();
      resetForm();
    } catch (err) {
      console.error("Error creating/updating event:", err);
      setError("Failed to create/update event. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await getAllEvents();
      const updatedEvents = (response.events || []).map((event) => {
        if (
          !event.status ||
          (event.status !== "cancelled" && event.status !== "postponed")
        ) {
          const autoStatus = determineEventStatus(event.date, event.time);
          return { ...event, status: autoStatus };
        }
        return event;
      });

      setEvents(updatedEvents);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to fetch events");
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([fetchEvents(), fetchCategories()]);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchAllData();
  }, []);

  const resetForm = () => {
    setFormData(initialFormData);
    setShowForm(false);
    setEventToEdit(null);
    setSelectedImage(null);
    setImagePreview("");
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }
    try {
      await deleteEvent(id);
      console.log(`Event with ID ${id} deleted successfully.`);
      await fetchEvents();
    } catch (err) {
      console.error("Error deleting event:", err);
      setError("Failed to delete event. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status) => {
    return status
      ? status.charAt(0).toUpperCase() + status.slice(1)
      : "Unknown";
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, categoryFilter]);

  const filteredEvents = events.filter((event) => {
    if (!event) return false;

    const eventName = event.eventName || "";
    const eventStatus = event.status || "";
    const eventCategoryName = getCategoryName(event.category || "");
    const matchesSearch = eventName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" || eventStatus === statusFilter;
    const matchesCategory =
      categoryFilter === "All Category" || eventCategoryName === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const currentPageEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const tshirtSizes = ["XS", "S", "M", "L", "XL", "XXL"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {!showForm ? (
          <>
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary/90 to-primary/70 bg-clip-text text-transparent mb-2">
                  Event Details
                </h1>
                <p className="text-slate-600">
                  Manage and track all your events
                </p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="flex items-center gap-2 px-6 py-3 bg-primary/90 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all hover:bg-primary/80"
              >
                <Plus size={20} />
                Create Event
              </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                  <Search
                    className="absolute left-3 top-3 text-slate-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search events..."
                    className="text-black w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="text-black appearance-none px-4 py-2 pr-8 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 cursor-pointer"
                  >
                    <option>All Status</option>
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-2 top-2.5 text-slate-400 pointer-events-none"
                    size={18}
                  />
                </div>
                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="text-black appearance-none px-4 py-2 pr-8 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 cursor-pointer"
                  >
                    <option>All Category</option>
                    {categories.map((category) => (
                      <option
                        key={category.id || category._id || category.name}
                        value={category.name}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-2 top-2.5 text-slate-400 pointer-events-none"
                    size={18}
                  />
                </div>
              </div>
            </div>

            {/* Events Table */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        Event
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        Date & Time
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        Ticket Price
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        Venue
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {currentPageEvents.length > 0 ? (
                      currentPageEvents.map((event) => (
                        <tr
                          key={event.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/80 rounded-lg flex items-center justify-center">
                                <FileText size={20} className="text-white" />
                              </div>
                              <div>
                                <span className="text-sm font-medium text-slate-900 block">
                                  {event.eventName}
                                </span>
                                <div className="flex items-center gap-2 mt-1">
                                  <Users size={14} className="text-slate-400" />
                                  <span className="text-xs text-slate-500">
                                    {event.ticketStatus?.totalNumberOfPlayers ||
                                      0}
                                    /{event.ticketStatus?.maximumOccupancy || 0}{" "}
                                    players
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-slate-600">
                              <div>
                                {event.date
                                  ? new Date(event.date).toLocaleDateString()
                                  : "N/A"}
                              </div>
                              <div className="text-slate-500">
                                {event.time || "N/A"}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {getCategoryName(event.category)}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                event.status
                              )}`}
                            >
                              {formatStatus(event.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            <div className="flex items-center gap-1">
                              ${" "}
                              {event.perTicketPrice ||
                                event.perlicketPrice ||
                                "0.00"}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {event.venue || "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                className="p-2 text-slate-400 hover:text-primary/90 hover:bg-primary/10 rounded-lg transition-colors"
                                onClick={() => fetchEventById(event.id)}
                                title="Edit Event"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(event.id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Event"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-6 py-8 text-center text-slate-500"
                        >
                          No events found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            {filteredEvents.length > 0 && (
              <div className="mt-6 flex justify-between items-center">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-slate-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Create or Update Event Form */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary/90 to-primary/70 bg-clip-text text-transparent mb-2">
                {eventToEdit ? "Update Event" : "Create Event"}
              </h1>
              <p className="text-slate-600">
                Fill in the details to {eventToEdit ? "update" : "create"} the
                event
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
              {/* Error Display */}
              {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              {/* Event Name */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Event Name *
                </label>
                <div className="relative">
                  <FileText
                    className="absolute left-3 top-3.5 text-slate-400"
                    size={20}
                  />
                  <input
                    type="text"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleChange}
                    placeholder="Enter event name"
                    className="text-black w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              {/* Venue */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Venue *
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-3.5 text-slate-400"
                    size={20}
                  />
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    placeholder="Enter venue"
                    className="text-black w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              {/* Date & Time Row */}
              <div className="grid grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Date *
                  </label>
                  <div className="relative">
                    <Calendar
                      className="absolute left-3 top-3.5 text-slate-400"
                      size={20}
                    />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="text-black w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Time *
                  </label>
                  <div className="relative">
                    <Clock
                      className="absolute left-3 top-3.5 text-slate-400"
                      size={20}
                    />
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="text-black w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Category & Status Row */}
              <div className="grid grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Category *
                  </label>
                  <div className="relative">
                    <Tag
                      className="absolute left-3 top-3.5 text-slate-400"
                      size={20}
                    />
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="text-black w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 focus:bg-white transition-all appearance-none cursor-pointer"
                      required
                    >
                      <option value="">Select a Category</option>
                      {categories.map((category) => (
                        <option
                          key={category.id || category._id || category.name}
                          value={category.name}
                        >
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Status *
                  </label>
                  <div className="relative">
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="text-black w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 focus:bg-white transition-all appearance-none cursor-pointer"
                      required
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="absolute right-3 top-3.5 text-slate-400 pointer-events-none"
                      size={18}
                    />
                  </div>
                </div> */}
              </div>

              {/* Ticket Price & Maximum Occupancy Row */}
              <div className="grid grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Ticket Price ($) *
                  </label>
                  <div className="relative">
                    <Ticket
                      className="absolute left-3 top-3.5 text-slate-400"
                      size={20}
                    />
                    <input
                      type="number"
                      name="perTicketPrice"
                      value={formData.perTicketPrice}
                      onChange={handleChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="text-black w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Maximum Occupancy *
                  </label>
                  <div className="relative">
                    <Users
                      className="absolute left-3 top-3.5 text-slate-400"
                      size={20}
                    />
                    <input
                      type="number"
                      name="maximumOccupancy"
                      value={formData.maximumOccupancy}
                      onChange={handleChange}
                      placeholder="Enter maximum number of participants"
                      min="1"
                      className="text-black w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Race Categories */}
              {/* <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Race Categories
                  </label>
                  {formData.raceCategories.map((category, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={category}
                        onChange={(e) =>
                          handleArrayChange(
                            index,
                            e.target.value,
                            "raceCategories"
                          )
                        }
                        placeholder="Enter race category"
                        className="text-black flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 focus:bg-white transition-all"
                      />
                      {formData.raceCategories.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem(index, "raceCategories")}
                          className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem("raceCategories")}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all"
                  >
                    <Plus size={16} />
                    Add Race Category
                  </button>
                </div> */}

              {/* Available T-Shirt Sizes */}
              {/* <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Available T-Shirt Sizes
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {tshirtSizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleTshirtSizeChange(size)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                          formData.availableTshirtSizes.includes(size)
                            ? "bg-primary/90 text-white border-primary/90"
                            : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        <Shirt size={16} />
                        {size}
                      </button>
                    ))}
                  </div>
                </div> */}

              {/* Agenda */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Event Agenda
                </label>
                {formData.agenda.map((item, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                    <input
                      type="time"
                      value={item.time}
                      onChange={(e) =>
                        handleAgendaChange(index, "time", e.target.value)
                      }
                      className="text-black px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 focus:bg-white transition-all"
                    />
                    <input
                      type="text"
                      value={item.activity}
                      onChange={(e) =>
                        handleAgendaChange(index, "activity", e.target.value)
                      }
                      placeholder="Activity description"
                      className="text-black col-span-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 focus:bg-white transition-all"
                    />
                    {formData.agenda.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAgendaItem(index)}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addAgendaItem}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all"
                >
                  <Plus size={16} />
                  Add Agenda Item
                </button>
              </div>

              {/* Image Upload */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Event Image
                </label>
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative p-8 border-2 border-dashed rounded-xl transition-all ${
                    dragActive
                      ? "border-primary/80 bg-primary/10"
                      : "border-slate-300 bg-slate-50 hover:border-slate-400"
                  }`}
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto max-h-48 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                      {!selectedImage && eventToEdit && (
                        <span className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                          Existing Image
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload
                        className={`mx-auto mb-3 ${
                          dragActive ? "text-primary/80" : "text-slate-400"
                        }`}
                        size={32}
                      />
                      <p className="text-sm font-medium text-slate-700">
                        Drag and drop your image here
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        or click to browse (Max: 5MB)
                      </p>
                      {eventToEdit && (
                        <p className="text-xs text-blue-500 mt-2">
                          Current image will be kept if no new image is selected
                        </p>
                      )}
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  About The Event
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter event description"
                  rows="4"
                  className="text-black w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 focus:bg-white transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`flex-1 py-3 bg-primary/90 text-white font-semibold rounded-lg transition-all ${
                    isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-lg hover:shadow-primary/30 hover:bg-primary/80 active:scale-95"
                  }`}
                >
                  {isLoading
                    ? "Processing..."
                    : eventToEdit
                    ? "Update Event"
                    : "Create Event"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
