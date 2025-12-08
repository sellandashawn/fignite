"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  FileText,
  Eye,
  ArrowLeft,
  DollarSign,
  Users,
} from "lucide-react";
import { getAllEvents } from "../../api/event";
import { getPaymentsByEvent } from "../../api/payment";
import { getCategories } from "../../api/category";

export default function EventPaymentDashboard() {
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [categoryFilter, setCategoryFilter] = useState("All Category");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [paymentPage, setPaymentPage] = useState(1);
  const [paymentsPerPage] = useState(5);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  //     const [events, setEvents] = useState([
  //     { id: 1, name: 'Silver State Table Tennis Open Championship', date: '8/11/2025', category: 'Table Tennis', status: 'Ongoing', venue: 'IUKM Sultan Azizan Shah' },
  //     { id: 2, name: 'Fun Run Larian Perpaduan Malaysia Madani', date: '8/11/2025', category: 'Road Race', status: 'Upcoming', venue: 'Sunway Ipoh, Malaysia' },
  //     { id: 3, name: 'Rakan Muda Kolokium Pemerkasaan Sukan', date: '8/11/2025', category: 'Symposium', status: 'Upcoming', venue: 'M Roof Hotel' },
  //     { id: 4, name: 'Table Tennis State Championship', date: '10/11/2025', category: 'Table Tennis', status: 'Upcoming', venue: 'IUKM Sultan Azizan Shah' },
  //     { id: 5, name: 'Charity Marathon', date: '11/11/2025', category: 'Road Race', status: 'Ongoing', venue: 'Kuala Lumpur, Malaysia' },
  //     { id: 6, name: 'International Symposium on AI', date: '12/11/2025', category: 'Symposium', status: 'Upcoming', venue: 'M Roof Hotel' },
  //     { id: 7, name: 'National Basketball Championship', date: '13/11/2025', category: 'Sports', status: 'Ongoing', venue: 'Stadium A' },
  //     { id: 8, name: 'Global Tech Conference', date: '14/11/2025', category: 'Symposium', status: 'Upcoming', venue: 'Tech Hall B' },
  // ]);

  // const [payments, setPayments] = useState([
  //     { id: 1, eventId: 1, firstName: 'John', lastName: 'Doe', phone: '55469852', ticketsBooked: 2, paymentMade: 400, paymentType: 'Card' },
  //     { id: 2, eventId: 1, firstName: 'Jane', lastName: 'Smith', phone: '55469852', ticketsBooked: 4, paymentMade: 800, paymentType: 'Bank' },
  //     { id: 3, eventId: 1, firstName: 'Robert', lastName: 'Johnson', phone: '55469852', ticketsBooked: 1, paymentMade: 200, paymentType: 'PayPal' },
  //     { id: 4, eventId: 1, firstName: 'Emily', lastName: 'Williams', phone: '55469852', ticketsBooked: 5, paymentMade: 1000, paymentType: 'Stripe' },
  //     { id: 5, eventId: 2, firstName: 'Michael', lastName: 'Brown', phone: '55469852', ticketsBooked: 1, paymentMade: 200, paymentType: 'PayPal' },
  //     { id: 6, eventId: 2, firstName: 'Sarah', lastName: 'Davis', phone: '55469852', ticketsBooked: 1, paymentMade: 200, paymentType: 'Bank' },
  //     { id: 7, eventId: 3, firstName: 'David', lastName: 'Miller', phone: '55469852', ticketsBooked: 6, paymentMade: 1200, paymentType: 'Card' },
  //     { id: 8, eventId: 3, firstName: 'Lisa', lastName: 'Wilson', phone: '55469852', ticketsBooked: 8, paymentMade: 1600, paymentType: 'PayPal' },
  //     { id: 9, eventId: 4, firstName: 'James', lastName: 'Moore', phone: '55469852', ticketsBooked: 8, paymentMade: 1600, paymentType: 'PayPal' },
  //     { id: 10, eventId: 4, firstName: 'Patricia', lastName: 'Taylor', phone: '55469852', ticketsBooked: 4, paymentMade: 800, paymentType: 'Stripe' },
  //         ]);

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
    // For events that started yesterday but ended today
    else {
      return "completed";
    }
  };

  // Helper function to get category name from category object
  const getCategoryName = (categoryIdentifier) => {
    if (!categoryIdentifier) return "General";

    // If it's a string, try to match by name
    if (typeof categoryIdentifier === "string") {
      const foundCategory = categories.find(
        (cat) => cat.name === categoryIdentifier
      );
      if (foundCategory) return categoryIdentifier;
    }

    // If it's an object, extract the name
    if (typeof categoryIdentifier === "object" && categoryIdentifier !== null) {
      return categoryIdentifier.name || "General";
    }

    // Fallback: try to find by id/_id
    const category = categories.find(
      (cat) =>
        cat.id === categoryIdentifier ||
        cat._id === categoryIdentifier ||
        cat.name === categoryIdentifier
    );

    return category ? category.name : "General";
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await getCategories();
        console.log("Categories response:", response);
        setCategories(response.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setEventsLoading(true);
        const response = await getAllEvents();
        console.log("Events response:", response);

        const eventsData =
          response.data?.events || response.events || response.data || [];

        const updatedEvents = Array.isArray(eventsData)
          ? eventsData.map((event) => {
              if (
                !event.status ||
                (event.status !== "cancelled" && event.status !== "postponed")
              ) {
                const autoStatus = determineEventStatus(event.date, event.time);
                return { ...event, status: autoStatus };
              }
              return event;
            })
          : [];

        setEvents(updatedEvents);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to fetch events");
        setEvents([]);
      } finally {
        setEventsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchPayments = async () => {
      if (!selectedEvent?.id) return;

      try {
        setLoading(true);
        const response = await getPaymentsByEvent(selectedEvent.id);
        console.log("Payments response:", response);

        let paymentsData = [];

        if (Array.isArray(response)) {
          paymentsData = response;
        } else if (Array.isArray(response.data)) {
          paymentsData = response.data;
        } else if (Array.isArray(response.payments)) {
          paymentsData = response.payments;
        } else if (response.data && Array.isArray(response.data.payments)) {
          paymentsData = response.data.payments;
        }

        console.log("Processed payments:", paymentsData);
        setPayments(paymentsData);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError("Failed to fetch payments");
        setPayments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [selectedEvent]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, categoryFilter]);

  const filteredEvents = Array.isArray(events)
    ? events.filter((event) => {
        if (!event) return false;

        const eventName = event.eventName;
        const eventStatus = event.status || "";
        const eventCategoryName = getCategoryName(event.category);

        const matchesSearch = eventName
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesStatus =
          statusFilter === "All Status" ||
          eventStatus.toLowerCase() === statusFilter.toLowerCase();
        const matchesCategory =
          categoryFilter === "All Category" ||
          eventCategoryName === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
      })
    : [];

  const totalEvents = filteredEvents.length;
  const totalPages = Math.ceil(totalEvents / itemsPerPage);
  const currentPageEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const eventPayments = selectedEvent
    ? Array.isArray(payments)
      ? payments
      : []
    : [];
  const totalPayments = eventPayments.length;
  const totalPaymentAmount = eventPayments.reduce(
    (sum, payment) => sum + (payment.amount || 0),
    0
  );
  const totalTickets = eventPayments.reduce(
    (sum, payment) => sum + (payment.numberOfTickets || payment.quantity || 0),
    0
  );

  const totalPaymentPages = Math.ceil(totalPayments / paymentsPerPage);
  const currentPayments = eventPayments.slice(
    (paymentPage - 1) * paymentsPerPage,
    paymentPage * paymentsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePaymentPageChange = (page) => {
    if (page >= 1 && page <= totalPaymentPages) {
      setPaymentPage(page);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "postponed":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status) => {
    return status
      ? status.charAt(0).toUpperCase() + status.slice(1)
      : "Unknown";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid Date";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const statusOptions = ["All Status", "Ongoing", "Upcoming", "Completed"];

  if (eventsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-slate-600">
            {eventsLoading ? "Loading events..." : "Loading categories..."}
          </p>
        </div>
      </div>
    );
  }

  if (selectedEvent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div>
            <button
              onClick={() => {
                setSelectedEvent(null);
                setPaymentPage(1);
                setPayments([]);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <ArrowLeft size={20} className="text-slate-700" />
              <span className="text-slate-700 font-medium">Back to Events</span>
            </button>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary/90 to-primary/70 bg-clip-text text-transparent mt-5">
                  Payment Details
                </h1>
                <p className="text-slate-600 mt-2 text-lg font-bold">
                  {selectedEvent.eventName || selectedEvent.name}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">
                      {formatCurrency(totalPaymentAmount)}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <DollarSign className="text-green-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">
                      Total Payments
                    </p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">
                      {totalPayments}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FileText className="text-blue-600" size={24} />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium">
                      Total Tickets
                    </p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">
                      {totalTickets}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Users className="text-purple-600" size={24} />
                  </div>
                </div>
              </div>
            </div>

            {loading && (
              <div className="flex items-center gap-2 text-slate-600 bg-white p-4 rounded-lg shadow">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                Loading payments...
              </div>
            )}
          </div>

          {/* Payment Details Table */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Participant Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Tickets Booked
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Payment Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                      Payment ID
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {currentPayments.length > 0 ? (
                    currentPayments.map((payment) => (
                      <tr
                        key={payment.id || payment._id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                          {payment.participant?.name ||
                            payment.fullName ||
                            payment.firstName ||
                            "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {payment.participant?.email || payment.email || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 text-center">
                          {payment.numberOfTickets ||
                            payment.quantity ||
                            payment.ticketsBooked ||
                            0}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                          {formatCurrency(payment.amount || 0)}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {formatDate(
                            payment.date ||
                              payment.createdAt ||
                              payment.paymentDate
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 font-mono">
                          {payment.id ||
                            payment._id ||
                            payment.paymentId ||
                            "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-4 text-center text-slate-600"
                      >
                        {loading
                          ? "Loading payments..."
                          : "No payments found for this event"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Pagination */}
          {eventPayments.length > paymentsPerPage && (
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => handlePaymentPageChange(paymentPage - 1)}
                disabled={paymentPage === 1}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-slate-600">
                Page {paymentPage} of {totalPaymentPages}
              </span>
              <button
                onClick={() => handlePaymentPageChange(paymentPage + 1)}
                disabled={paymentPage === totalPaymentPages}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary/90 to-primary/70 bg-clip-text text-transparent mb-2">
                Event Payments
              </h1>
              <p className="text-slate-600">
                Manage and view payment details for all events
              </p>
            </div>
          </div>
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
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
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
              <thead className="bg-primary/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Event
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Venue
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {currentPageEvents.length > 0 ? (
                  currentPageEvents.map((event) => (
                    <tr
                      key={event.id || event._id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/80 rounded-lg flex items-center justify-center">
                            <FileText size={20} className="text-white" />
                          </div>
                          <span className="text-sm font-medium text-slate-900">
                            {event.eventName || event.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDate(event.date)}
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
                        {event.venue}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setSelectedEvent(event);
                            console.log("Selected event ID:", event.id);
                            setPaymentPage(1);
                          }}
                          className="flex items-center gap-2 px-3 py-2 bg-primary/90 text-white rounded-lg hover:bg-primary/80 transition-colors"
                        >
                          <span className="text-xs font-medium">
                            View Payments
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-slate-600"
                    >
                      No events found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        {filteredEvents.length > itemsPerPage && (
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-slate-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
