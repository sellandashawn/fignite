"use client";

import React, { useState, useEffect } from "react";
import {
  Upload,
  Calendar,
  MapPin,
  FileText,
  Tag,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  ChevronDown,
  Download,
  TrendingUp,
  Users,
  Ticket,
  CheckCircle,
  X,
  BarChart as BarChartIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getAllPayments, getPaymentsByEvent } from "../../api/payment";
import { getAllEvents, getEventById } from "../../api/event";
import { getEventParticipants } from "../../api/participant";
import { getCategories } from "../../api/category";
import { getAllSports } from "../../api/sports";

const attendeeEngagement = [
  { name: "Day 1", engagement: 100 },
  { name: "Day 16", engagement: 185 },
  { name: "Day 29", engagement: 250 },
  { name: "Day 30", engagement: 255 },
  { name: "Day 37", engagement: 290 },
  { name: "Day 40", engagement: 305 },
];

function getStatusClasses(status) {
  if (status === "active" || status === "Active")
    return "bg-green-200 text-green-800";
  if (status === "completed" || status === "Completed")
    return "bg-primary/20 text-primary/90";
  if (status === "pending" || status === "Pending")
    return "bg-gray-200 text-gray-700";
  if (status === "upcoming" || status === "Upcoming")
    return "bg-yellow-100 text-yellow-800";
  if (status === "ongoing" || status === "Ongoing")
    return "bg-blue-100 text-blue-800";
  return "bg-slate-200 text-slate-700";
}

// Helper function to get month name from date
const getMonthName = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("default", { month: "short" });
};

// Helper function to get category name from category object
const getCategoryName = (categoryIdentifier, categories = []) => {
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

// Helper function to group data by month
const groupByMonth = (data, dateKey) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const grouped = months.map((month) => ({
    name: month,
    registrations: 0,
    sales: 0,
  }));

  data.forEach((item) => {
    const date = new Date(item[dateKey]);
    const monthIndex = date.getMonth();
    const monthName = months[monthIndex];

    const monthData = grouped.find((m) => m.name === monthName);
    if (monthData) {
      monthData.registrations += 1;
      monthData.sales += item.numberOfTickets || 1; // Count tickets
    }
  });

  return grouped;
};

// Calculate participation rate
const calculateParticipationRate = (totalPlayers, maximumOccupancy) => {
  if (!maximumOccupancy || maximumOccupancy === 0) return 0;
  return Math.round((totalPlayers / maximumOccupancy) * 100);
};

// Filter events based on criteria
const filterEvents = (events, filters, categories = []) => {
  return events.filter((event) => {
    // Filter by search term
    if (
      filters.searchTerm &&
      !event.eventName?.toLowerCase().includes(filters.searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Filter by event category
    if (filters.category) {
      const eventCategoryName = getCategoryName(event.category, categories);
      if (eventCategoryName !== filters.category) {
        return false;
      }
    }

    // Filter by date range
    const eventDate = new Date(event.date);

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      if (eventDate < fromDate) return false;
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of the day
      if (eventDate > toDate) return false;
    }

    // Filter by month
    if (filters.month) {
      const filterDate = new Date(filters.month);
      const eventYear = eventDate.getFullYear();
      const eventMonth = eventDate.getMonth();
      const filterYear = filterDate.getFullYear();
      const filterMonth = filterDate.getMonth();

      if (eventYear !== filterYear || eventMonth !== filterMonth) {
        return false;
      }
    }

    // Filter by status
    if (filters.status) {
      const eventStatus = event.status?.toLowerCase();
      const filterStatus = filters.status.toLowerCase();
      if (eventStatus !== filterStatus) {
        return false;
      }
    }

    return true;
  });
};

// Filter sports based on criteria
const filterSports = (sports, filters, categories = []) => {
  return sports.filter((sport) => {
    // Filter by search term
    if (
      filters.searchTerm &&
      !sport.sportName
        ?.toLowerCase()
        .includes(filters.searchTerm.toLowerCase())
    ) {
      return false;
    }

    // Filter by sport category
    if (filters.category) {
      const sportCategoryName = getCategoryName(sport.category, categories);
      if (sportCategoryName !== filters.category) {
        return false;
      }
    }

    // Filter by date range
    const sportDate = new Date(sport.date);

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      if (sportDate < fromDate) return false;
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of the day
      if (sportDate > toDate) return false;
    }

    // Filter by month
    if (filters.month) {
      const filterDate = new Date(filters.month);
      const sportYear = sportDate.getFullYear();
      const sportMonth = sportDate.getMonth();
      const filterYear = filterDate.getFullYear();
      const filterMonth = filterDate.getMonth();

      if (sportYear !== filterYear || sportMonth !== filterMonth) {
        return false;
      }
    }

    // Filter by status
    if (filters.status) {
      const sportStatus = sport.status?.toLowerCase();
      const filterStatus = filters.status.toLowerCase();
      if (sportStatus !== filterStatus) {
        return false;
      }
    }

    return true;
  });
};

// Filter payments based on criteria
const filterPayments = (payments, filters) => {
  return payments.filter((payment) => {
    const paymentDate = new Date(payment.createdAt || payment.date);

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      if (paymentDate < fromDate) return false;
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      if (paymentDate > toDate) return false;
    }

    if (filters.month) {
      const filterDate = new Date(filters.month);
      const paymentYear = paymentDate.getFullYear();
      const paymentMonth = paymentDate.getMonth();
      const filterYear = filterDate.getFullYear();
      const filterMonth = filterDate.getMonth();

      if (paymentYear !== filterYear || paymentMonth !== filterMonth) {
        return false;
      }
    }

    if (filters.status && payment.status !== filters.status.toLowerCase()) {
      return false;
    }

    return true;
  });
};

// Calculate aggregated stats from filtered events and sports
const calculateAggregatedStats = (
  filteredEvents,
  filteredPayments,
  filteredSports = []
) => {
  let totalMaximumOccupancy = 0;
  let totalPlayers = 0;
  let totalUnscannedTickets = 0;
  let totalSuccessfulPayments = 0;

  // Calculate from events
  filteredEvents.forEach((event) => {
    totalMaximumOccupancy += event.ticketStatus?.maximumOccupancy || 0;
    totalPlayers += event.ticketStatus?.totalNumberOfPlayers || 0;
    totalUnscannedTickets += event.ticketStatus?.unscannedTickets || 0;
    totalSuccessfulPayments += event.ticketStatus?.successfulPayment || 0;
  });

  // Calculate from sports (map participationStatus to event-style fields)
  filteredSports.forEach((sport) => {
    totalMaximumOccupancy +=
      sport.participationStatus?.maximumParticipants || 0;
    totalPlayers += sport.participationStatus?.confirmedParticipants || 0;
    // Sports currently don't track unscanned tickets or successful payment
  });

  // Also count from payments if available
  const successfulPaymentsFromPayments = filteredPayments.filter(
    (payment) => payment.status === "completed" || payment.status === "success"
  ).length;

  // Use the higher value between events and payments for successful payments
  totalSuccessfulPayments = Math.max(
    totalSuccessfulPayments,
    successfulPaymentsFromPayments
  );

  return {
    maximumOccupancy: totalMaximumOccupancy,
    totalPlayers: totalPlayers,
    unscannedTickets: totalUnscannedTickets,
    successfulPayments: totalSuccessfulPayments,
  };
};

// Generate aggregate chart data based on filtered events and sports
const generateAggregateChartData = (
  filteredEvents,
  allParticipants,
  filteredSports = []
) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Initialize chart data with all months
  const chartData = months.map((month) => ({
    name: month,
    registrations: 0,
    sales: 0,
    engagement: 0,
    revenue: 0,
  }));

  // Process all participants for aggregate data (events)
  allParticipants.forEach((participant) => {
    const date = new Date(participant.createdAt);
    const monthIndex = date.getMonth();
    const monthName = months[monthIndex];

    const monthData = chartData.find((m) => m.name === monthName);
    if (monthData) {
      monthData.registrations += 1;
      monthData.sales += participant.numberOfTickets || 1;
    }
  });

  // Calculate aggregate metrics from filtered events
  filteredEvents.forEach((event) => {
    const eventDate = new Date(event.date);
    const monthIndex = eventDate.getMonth();
    const monthName = months[monthIndex];

    const monthData = chartData.find((m) => m.name === monthName);
    if (monthData) {
      // Aggregate engagement calculation
      const occupancy = event.ticketStatus?.maximumOccupancy || 1;
      const players = event.ticketStatus?.totalNumberOfPlayers || 0;
      monthData.engagement += Math.round((players / occupancy) * 100);

      // Aggregate revenue (you might need to adjust this based on your payment data structure)
      monthData.revenue += event.ticketStatus?.successfulPayment || 0;
    }
  });

  // Add sports into chart data using their participationStatus and date
  filteredSports.forEach((sport) => {
    if (!sport.date) return;
    const date = new Date(sport.date);
    const monthIndex = date.getMonth();
    const monthName = months[monthIndex];

    const monthData = chartData.find((m) => m.name === monthName);
    if (monthData) {
      const confirmed =
        sport.participationStatus?.confirmedParticipants || 0;
      monthData.registrations += confirmed;
      monthData.sales += confirmed;
      // Engagement and revenue aren't currently tracked for sports
    }
  });

  return chartData;
};

// Generate aggregate participation rate (events + sports)
const generateAggregateParticipationRate = (
  filteredEvents,
  filteredSports = []
) => {
  let totalMaximumOccupancy = 0;
  let totalPlayers = 0;

  filteredEvents.forEach((event) => {
    totalMaximumOccupancy += event.ticketStatus?.maximumOccupancy || 0;
    totalPlayers += event.ticketStatus?.totalNumberOfPlayers || 0;
  });

  filteredSports.forEach((sport) => {
    totalMaximumOccupancy +=
      sport.participationStatus?.maximumParticipants || 0;
    totalPlayers += sport.participationStatus?.confirmedParticipants || 0;
  });

  const participationRate = calculateParticipationRate(
    totalPlayers,
    totalMaximumOccupancy
  );

  return [
    { name: "Participated", value: participationRate },
    { name: "Available", value: 100 - participationRate },
  ];
};

export default function DashBoard() {
  const [payments, setPayments] = useState([]);
  const [events, setEvents] = useState([]);
  const [sports, setSports] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filteredSports, setFilteredSports] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [eventid, setEventId] = useState("");
  const [eventdata, setEventData] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSport, setSelectedSport] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userdata, setUserData] = useState([]);
  const [allParticipants, setAllParticipants] = useState([]);
  const [registrationData, setRegistrationData] = useState([]);
  const [ticketsales, setTicketSales] = useState([]);
  const [participationRate, setParticipationRate] = useState([]);
  const [eventPerformance, setEventPerformance] = useState([]);
  const [aggregatedStats, setAggregatedStats] = useState(null);
  const [dynamicChartData, setDynamicChartData] = useState([]);
  const [showAggregateView, setShowAggregateView] = useState(true);
  const [listFilter, setListFilter] = useState("all"); // all | events | sports

  // Filter states
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    month: "",
    category: "",
    status: "",
  });

  useEffect(() => {
    const fetchCategoriesData = async () => {
      try {
        const response = await getCategories();
        console.log("Fetched categories:", response.categories);
        setCategories(response.categories || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategoriesData();
  }, []);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await getAllSports();
        setSports(response.sports || []);
      } catch (err) {
        console.error("Error fetching sports:", err);
      }
    };

    fetchSports();
  }, []);

  // Default stats when no event is selected
  const defaultStats = [
    { label: "Maximum Occupancy", value: "-", Icon: BarChartIcon },
    { label: "Total number of players", value: "-", Icon: Users },
    { label: "Unscanned tickets", value: "-", Icon: Ticket },
    { label: "Successful Payment", value: "-", Icon: CheckCircle },
  ];

  // Get dynamic stats based on selected event or filtered events
  const getEventStats = (event, userData = [], aggregatedData = null) => {
    // If we have aggregated data from filters, use that
    if (aggregatedData) {
      return [
        {
          label: "Maximum Occupancy",
          value: aggregatedData.maximumOccupancy,
          Icon: BarChartIcon,
        },
        {
          label: "Total number of players",
          value: aggregatedData.totalPlayers,
          Icon: Users,
        },
        {
          label: "Unscanned tickets",
          value: aggregatedData.unscannedTickets,
          Icon: Ticket,
        },
        {
          label: "Successful Payment",
          value: aggregatedData.successfulPayments,
          Icon: CheckCircle,
        },
      ];
    }

    // If a specific event is selected
    if (event && event.ticketStatus) {
      // Count successful payments from user data
      const successfulPaymentsCount = userData.length;

      return [
        {
          label: "Maximum Occupancy",
          value: event.ticketStatus.maximumOccupancy || 0,
          Icon: BarChartIcon,
        },
        {
          label: "Total number of players",
          value: event.ticketStatus.totalNumberOfPlayers || 0,
          Icon: Users,
        },
        {
          label: "Unscanned tickets",
          value: event.ticketStatus.unscannedTickets || 0,
          Icon: Ticket,
        },
        {
          label: "Successful Payment",
          value:
            successfulPaymentsCount > 0
              ? successfulPaymentsCount
              : event.ticketStatus.successfulPayment || 0,
          Icon: CheckCircle,
        },
      ];
    }

    // Default stats
    return defaultStats;
  };

  const [stats, setStats] = useState(defaultStats);

  useEffect(() => {
    const filtered = filterEvents(
      events,
      { ...filters, searchTerm },
      categories
    );
    setFilteredEvents(filtered);
  }, [events, filters, searchTerm, categories]);

  useEffect(() => {
    const filtered = filterSports(
      sports,
      { ...filters, searchTerm },
      categories
    );
    setFilteredSports(filtered);
  }, [sports, filters, searchTerm, categories]);

  useEffect(() => {
    const filtered = filterPayments(payments, filters);
    setFilteredPayments(filtered);
  }, [payments, filters]);

  // Calculate aggregated stats when filtered events or payments change
  useEffect(() => {
    if (filteredEvents.length > 0 || filteredSports.length > 0) {
      const aggregated = calculateAggregatedStats(
        filteredEvents,
        filteredPayments,
        filteredSports
      );
      setAggregatedStats(aggregated);

      // Update stats with aggregated data
      const newStats = getEventStats(null, [], aggregated);
      setStats(newStats);
    } else {
      setAggregatedStats(null);
      // Reset to default stats when no events match filters
      setStats(defaultStats);
    }
  }, [filteredEvents, filteredSports, filteredPayments]);

  // Fetch all participants for aggregate data
  useEffect(() => {
    const fetchAllParticipants = async () => {
      try {
        // Fetch participants for all events
        const allParticipantsData = [];
        for (const event of events) {
          try {
            const response = await getEventParticipants(event.id);
            if (response && response.data && response.data.participants) {
              allParticipantsData.push(...response.data.participants);
            }
          } catch (error) {
            console.error(
              `Error fetching participants for event ${event.id}:`,
              error
            );
          }
        }
        setAllParticipants(allParticipantsData);
      } catch (error) {
        console.error("Error fetching all participants:", error);
      }
    };

    if (events.length > 0) {
      fetchAllParticipants();
    }
  }, [events]);

  useEffect(() => {
    if (
      showAggregateView &&
      (filteredEvents.length > 0 || filteredSports.length > 0)
    ) {
      // Show aggregate data for all filtered events and sports
      const aggregateChartData = generateAggregateChartData(
        filteredEvents,
        allParticipants,
        filteredSports
      );
      setDynamicChartData(aggregateChartData);

      const aggregateParticipationRate =
        generateAggregateParticipationRate(filteredEvents, filteredSports);
      setParticipationRate(aggregateParticipationRate);
    } else if (selectedEvent && userdata.length > 0) {
      const registrationByMonth = groupByMonth(userdata, "createdAt");

      // Create chart data for this specific event
      const eventChartData = [
        { name: "Jan", registrations: 0, sales: 0, engagement: 0, revenue: 0 },
        { name: "Feb", registrations: 0, sales: 0, engagement: 0, revenue: 0 },
        { name: "Mar", registrations: 0, sales: 0, engagement: 0, revenue: 0 },
        { name: "Apr", registrations: 0, sales: 0, engagement: 0, revenue: 0 },
        { name: "May", registrations: 0, sales: 0, engagement: 0, revenue: 0 },
        { name: "Jun", registrations: 0, sales: 0, engagement: 0, revenue: 0 },
        { name: "Jul", registrations: 0, sales: 0, engagement: 0, revenue: 0 },
        { name: "Aug", registrations: 0, sales: 0, engagement: 0, revenue: 0 },
        { name: "Sep", registrations: 0, sales: 0, engagement: 0, revenue: 0 },
        { name: "Oct", registrations: 0, sales: 0, engagement: 0, revenue: 0 },
        { name: "Nov", registrations: 0, sales: 0, engagement: 0, revenue: 0 },
        { name: "Dec", registrations: 0, sales: 0, engagement: 0, revenue: 0 },
      ];

      // Populate with actual data for this event
      registrationByMonth.forEach((monthData) => {
        const monthIndex = eventChartData.findIndex(
          (m) => m.name === monthData.name
        );
        if (monthIndex !== -1) {
          eventChartData[monthIndex].registrations = monthData.registrations;
          eventChartData[monthIndex].sales = monthData.sales;

          // Calculate engagement for this event
          const maxOccupancy =
            selectedEvent.ticketStatus?.maximumOccupancy || 1;
          const totalPlayers =
            selectedEvent.ticketStatus?.totalNumberOfPlayers || 0;
          eventChartData[monthIndex].engagement = Math.round(
            (totalPlayers / maxOccupancy) * 100
          );

          // Calculate revenue (sum of payments for this event)
          const eventMonth = new Date(selectedEvent.date).getMonth();
          const monthName = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ][eventMonth];
          if (monthData.name === monthName) {
            // Find payments for this event
            const eventPayments = payments.filter((payment) => {
              if (payment.event) {
                return (
                  payment.event.id === selectedEvent.id ||
                  payment.event._id === selectedEvent.id ||
                  payment.eventId === selectedEvent.id
                );
              }
              return false;
            });

            const totalRevenue = eventPayments.reduce(
              (sum, payment) => sum + (payment.amount || 0),
              0
            );
            eventChartData[monthIndex].revenue = totalRevenue;
          }
        }
      });

      setDynamicChartData(eventChartData);

      // Calculate participation rate for this specific event
      const maxOccupancy = selectedEvent.ticketStatus?.maximumOccupancy || 0;
      const totalPlayers =
        selectedEvent.ticketStatus?.totalNumberOfPlayers || 0;
      const rate = calculateParticipationRate(totalPlayers, maxOccupancy);
      setParticipationRate([
        { name: "Participated", value: rate },
        { name: "Available", value: 100 - rate },
      ]);
    } else if (selectedSport) {
      // Build simple per-sport chart using its date and participationStatus
      const sportChartData = [
        { name: "Jan", registrations: 0, sales: 0, engagement: 0, revenue: 0 },
        { name: "Feb", registrations: 0, sales: 0, engagement: 0, revenue: 0 },
        { name: "Mar", registrations: 0, sales: 0, engagement: 0, revenue: 0 },
        { name: "Apr", registrations: 0, sales: 0, engagement: 0, revenue: 0 },
        { name: "May", registrations: 0, sales: 0, engagement: 0, revenue: 0 },
        { name: "Jun", registrations: 0, sales: 0, engagement: 0, revenue: 0 },
        { name: "Jul", registrations: 0, sales: 0, engagement: 0, revenue: 0 },
        { name: "Aug", registrations: 0, sales: 0, engagement: 0, revenue: 0 },
        { name: "Sep", registrations: 0, sales: 0, engagement: 0, revenue: 0 },
        { name: "Oct", registrations: 0, sales: 0, engagement: 0, revenue: 0 },
        { name: "Nov", registrations: 0, sales: 0, engagement: 0, revenue: 0 },
        { name: "Dec", registrations: 0, sales: 0, engagement: 0, revenue: 0 },
      ];

      if (selectedSport.date) {
        const eventMonth = new Date(selectedSport.date).getMonth();
        const monthName = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ][eventMonth];

        const idx = sportChartData.findIndex((m) => m.name === monthName);
        if (idx !== -1) {
          const confirmed =
            selectedSport.participationStatus?.confirmedParticipants || 0;
          const maxParticipants =
            selectedSport.participationStatus?.maximumParticipants || 0;

          sportChartData[idx].registrations = confirmed;
          sportChartData[idx].sales = confirmed;
          sportChartData[idx].engagement = calculateParticipationRate(
            confirmed,
            maxParticipants
          );
        }
      }

      setDynamicChartData(sportChartData);

      const maxParticipants =
        selectedSport.participationStatus?.maximumParticipants || 0;
      const confirmed =
        selectedSport.participationStatus?.confirmedParticipants || 0;
      const rate = calculateParticipationRate(confirmed, maxParticipants);
      setParticipationRate([
        { name: "Participated", value: rate },
        { name: "Available", value: 100 - rate },
      ]);
    } else {
      setDynamicChartData([]);
      setParticipationRate([]);
    }
  }, [
    showAggregateView,
    filteredEvents,
    filteredSports,
    selectedEvent,
    selectedSport,
    userdata,
    allParticipants,
    payments,
  ]);

  useEffect(() => {
    const fetchEventPerformance = async () => {
      try {
        // Get all events
        const eventsResponse = await getAllEvents();
        const allEvents = eventsResponse.events || [];

        // Build event performance data
        const performanceData = await Promise.all(
          allEvents.map(async (event) => {
            // Get payments for this specific event using getPaymentsByEvent
            const paymentsResponse = await getPaymentsByEvent(event.id);
            const eventPayments = paymentsResponse.data?.payments || [];

            // Get total players from ticketStatus
            const ticketsSold = event.ticketStatus?.totalNumberOfPlayers || 0;

            // Sum all payments for this event
            const totalAmount = eventPayments.reduce((sum, payment) => {
              return sum + (payment.amount || 0);
            }, 0);

            return {
              event: event.eventName,
              ticketSold: ticketsSold,
              amount: `$${totalAmount.toLocaleString()}`,
              status:
                event.status?.charAt(0).toUpperCase() + event.status?.slice(1),
              eventId: event.id,
              totalAmount: totalAmount,
            };
          })
        );

        setEventPerformance(performanceData);
        console.log("Event Performance Data:", performanceData);
      } catch (error) {
        console.error("Error fetching event performance:", error);
      }
    };

    fetchEventPerformance();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!selectedEvent?.id) return;

      try {
        const response = await getEventParticipants(selectedEvent.id);
        console.log("patienid", selectedEvent.id);
        if (response && response.data) {
          const participants = response.data.participants || [];
          setUserData(participants);

          // Update stats with user data count
          const eventStats = getEventStats(selectedEvent, participants);
          setStats(eventStats);
        }
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };

    fetchUsers();
  }, [selectedEvent]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await getAllPayments();
        setPayments(response.data.payments || []);
        console.log("as", response.data.payments);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayments();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getAllEvents();
        setEvents(response.events || []);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, []);

  const handleRowClick = (item) => {
    setShowAggregateView(false);
    setAggregatedStats(null);
    setUserData([]);

    if (item.type === "event") {
      const event = item.original;
      setSelectedEvent(event);
      setSelectedSport(null);
      setEventId(event.id);
      console.log("Selected event:", event);
    } else if (item.type === "sport") {
      const sport = item.original;
      setSelectedEvent(null);
      setSelectedSport(sport);

      // Map sport participationStatus to ticket-style stats for cards
      const fakeEventForStats = {
        ticketStatus: {
          maximumOccupancy:
            sport.participationStatus?.maximumParticipants || 0,
          totalNumberOfPlayers:
            sport.participationStatus?.confirmedParticipants || 0,
          unscannedTickets:
            sport.participationStatus?.pendingRegistrations || 0,
          successfulPayment:
            sport.participationStatus?.confirmedParticipants || 0,
        },
      };

      const sportStats = getEventStats(fakeEventForStats, []);
      setStats(sportStats);

      console.log("Selected sport:", sport);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const clearSelectedItem = () => {
    setSelectedEvent(null);
    setSelectedSport(null);
    setUserData([]);
    setStats(defaultStats);
    setShowAggregateView(true);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev };

      // If month is selected, reset dateFrom and dateTo
      if (filterName === "month" && value) {
        newFilters.dateFrom = "";
        newFilters.dateTo = "";
      }
      // If dateFrom or dateTo is selected, reset month
      else if (
        (filterName === "dateFrom" || filterName === "dateTo") &&
        value
      ) {
        newFilters.month = "";
      }

      newFilters[filterName] = value;
      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      month: "",
      category: "",
      status: "",
    });
    setSearchTerm("");
  };

  const toggleAggregateView = () => {
    const newShowAggregateView = !showAggregateView;
    setShowAggregateView(newShowAggregateView);

    if (!newShowAggregateView) {
      setSelectedEvent(null);
      setSelectedSport(null);
      setStats(defaultStats);
    } else {
      setSelectedEvent(null);
      setSelectedSport(null);

      if (filteredEvents.length > 0 && aggregatedStats) {
        const newStats = getEventStats(null, [], aggregatedStats);
        setStats(newStats);
      } else {
        setStats(defaultStats);
      }
    }
  };

  const paymentReports = [
    { date: "25/11/2025", amount: "$10,000", status: "Completed" },
    { date: "25/10/2025", amount: "$8,000", status: "Pending" },
    { date: "25/01/2026", amount: "$5,000", status: "Completed" },
  ];

  // Default empty data for charts when no event is selected
  const defaultChartData = [
    { name: "Jan", registrations: 0, sales: 0 },
    { name: "Feb", registrations: 0, sales: 0 },
    { name: "Mar", registrations: 0, sales: 0 },
    { name: "Apr", registrations: 0, sales: 0 },
    { name: "May", registrations: 0, sales: 0 },
    { name: "Jun", registrations: 0, sales: 0 },
    { name: "Jul", registrations: 0, sales: 0 },
    { name: "Aug", registrations: 0, sales: 0 },
    { name: "Sep", registrations: 0, sales: 0 },
    { name: "Oct", registrations: 0, sales: 0 },
    { name: "Nov", registrations: 0, sales: 0 },
    { name: "Dec", registrations: 0, sales: 0 },
  ];

  // Default participation rate when no event is selected
  const defaultParticipationRate = [
    { name: "Participated", value: 0 },
    { name: "Available", value: 100 },
  ];

  // Combined list of events and sports for unified table
  const combinedList = [
    ...(listFilter === "all" || listFilter === "events"
      ? filteredEvents.map((event) => ({
          id: event.id || event._id,
          type: "event",
          name: event.eventName,
          date: event.date,
          category: event.category,
          status: event.status,
          original: event,
        }))
      : []),
    ...(listFilter === "all" || listFilter === "sports"
      ? filteredSports.map((sport) => ({
          id: sport.id || sport._id,
          type: "sport",
          name: sport.sportName,
          date: sport.date,
          category: sport.category,
          status: sport.status,
          original: sport,
        }))
      : []),
  ].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Determine which chart data to use
  const chartDataToUse =
    dynamicChartData.length > 0 ? dynamicChartData : defaultChartData;
  const participationRateToUse =
    participationRate.length > 0 ? participationRate : defaultParticipationRate;

  // Status options for filter dropdown
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "upcoming", label: "Upcoming" },
    { value: "ongoing", label: "Ongoing" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary/90 to-primary/70 bg-clip-text text-transparent mb-2">
Dashboard
                </h1>
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex gap-4 items-center mb-6">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-3 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="text-black w-full pl-10 pr-10 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 focus:bg-white/50 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* <div className="flex gap-4">
              {filteredEvents.length > 0 && (
                <button
                  onClick={toggleAggregateView}
                  className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg transition-all ${
                    showAggregateView
                      ? "bg-primary/90 text-white hover:shadow-lg hover:shadow-primary/30 hover:bg-primary/80"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <BarChartIcon size={16} />
                  {showAggregateView
                    ? "View Specific Events"
                    : "View Overall View"}
                </button>
              )}
              <button className="flex items-center gap-2 px-6 py-3 bg-primary/90 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all hover:bg-primary/80">
                <Eye size={20} />
                Preview
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-primary/90 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all hover:bg-primary/80">
                <Download size={20} />
                Download
              </button>
            </div> */}
          </div>

          <div className="flex gap-4">
            {/* Date From */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Date From
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-3.5 text-slate-400"
                  size={20}
                />
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) =>
                    handleFilterChange("dateFrom", e.target.value)
                  }
                  className="text-black w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 focus:bg-white/50 transition-all"
                />
              </div>
            </div>

            {/* Date To */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Date To
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-3.5 text-slate-400"
                  size={20}
                />
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                  className="text-black w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 focus:bg-white/50 transition-all"
                />
              </div>
            </div>

            {/* Month */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Month
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-3.5 text-slate-400"
                  size={20}
                />
                <input
                  type="month"
                  value={filters.month}
                  onChange={(e) => handleFilterChange("month", e.target.value)}
                  className="text-black w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 focus:bg-white/50 transition-all"
                />
              </div>
            </div>

            {/* Event Category */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Event Category
              </label>
              <div className="relative">
                <Tag
                  className="absolute left-3 top-3.5 text-slate-400"
                  size={20}
                />
                <select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="text-black w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 focus:bg-white/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="">All Categories</option>
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

            {/* Status Filter */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Status
              </label>
              <div className="relative">
                <Tag
                  className="absolute left-3 top-3.5 text-slate-400"
                  size={20}
                />
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="text-black w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 focus:bg-white/50 transition-all appearance-none cursor-pointer"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex-1 flex items-end">
              <div className="w-full flex justify-center">
                <button
                  onClick={clearFilters}
                  disabled={
                    !filters.dateFrom &&
                    !filters.dateTo &&
                    !filters.month &&
                    !filters.category &&
                    !filters.status &&
                    !searchTerm
                  }
                  className={`flex items-center gap-2 px-4 py-3 text-sm border rounded-lg transition-all ${
                    filters.dateFrom ||
                    filters.dateTo ||
                    filters.month ||
                    filters.category ||
                    filters.status ||
                    searchTerm
                      ? "text-slate-600 hover:text-slate-800 border-slate-300 hover:bg-slate-50 cursor-pointer"
                      : "text-slate-400 border-slate-200 cursor-not-allowed"
                  }`}
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Events & Sports List Section */}
          <div className="pt-5">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-black font-bold text-2xl">
                Events &amp; Sports List
                {(filters.dateFrom ||
                  filters.dateTo ||
                  filters.month ||
                  filters.category ||
                  filters.status ||
                  searchTerm) && (
                  <span className="text-sm font-normal text-slate-600 ml-2">
                    ({combinedList.length} items found)
                  </span>
                )}
              </h1>
              <div className="flex items-center gap-3">
                <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
                  <button
                    type="button"
                    onClick={() => setListFilter("all")}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                      listFilter === "all"
                        ? "bg-primary/90 text-white shadow-sm"
                        : "text-slate-600 hover:bg-white"
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setListFilter("events")}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                      listFilter === "events"
                        ? "bg-primary/90 text-white shadow-sm"
                        : "text-slate-600 hover:bg-white"
                    }`}
                  >
                    Events
                  </button>
                  <button
                    type="button"
                    onClick={() => setListFilter("sports")}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                      listFilter === "sports"
                        ? "bg-primary/90 text-white shadow-sm"
                        : "text-slate-600 hover:bg-white"
                    }`}
                  >
                    Sports
                  </button>
                </div>
                {filteredEvents.length > 0 && (
                  <button
                    onClick={toggleAggregateView}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                      showAggregateView
                        ? "bg-primary/90 text-white hover:shadow-lg hover:shadow-primary/30 hover:bg-primary/80"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    <BarChartIcon size={14} />
                    {showAggregateView
                      ? listFilter === "sports"
                        ? "View Sports"
                        : listFilter === "events"
                        ? "View Events"
                        : "View All"
                      : "View Overall"}
                  </button>
                )}
              </div>
            </div>
            <div className="rounded-2xl border border-primary/20 overflow-hidden bg-slate-50">
              <div className="max-h-80 overflow-y-auto">
                <table className="w-full text-left text-sm text-slate-800">
                  <thead className="bg-red-100 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {combinedList.length > 0 ? (
                      combinedList.map((item, idx) => {
                        const isEvent = item.type === "event";
                        const isSport = item.type === "sport";
                        const isSelected = isEvent
                          ? selectedEvent?.id === item.id
                          : isSport
                          ? selectedSport?.id === item.id ||
                            selectedSport?._id === item.id
                          : false;

                        return (
                        <tr
                          key={item.id || idx}
                          className={`border-t border-primary/10 transition-all hover:bg-primary/5 hover:shadow-md ${
                            isSelected
                              ? "bg-primary/20 ring-2 ring-primary/30 border-l-4 border-l-primary shadow-lg"
                              : "bg-white"
                          } ${
                            showAggregateView ? "opacity-50" : ""
                          } cursor-pointer`}
                          onClick={
                            !showAggregateView
                              ? () => handleRowClick(item)
                              : undefined
                          }
                        >
                          <td className="px-6 py-4 font-medium">
                            {isSelected && (
                              <span className="inline-block w-2 h-2 bg-primary rounded-full mr-2"></span>
                            )}
                            {item.name}
                            {isEvent && isSelected && (
                              <span className="ml-2 text-xs text-primary font-semibold">
                                SELECTED
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 capitalize">
                            {item.type}
                          </td>
                          <td className="px-6 py-4">
                            {new Date(item.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            {getCategoryName(item.category, categories)}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-4 py-1 rounded-full text-xs font-semibold ${getStatusClasses(
                                item.status
                              )}`}
                            >
                              {item.status?.charAt(0).toUpperCase() +
                                item.status?.slice(1)}
                            </span>
                          </td>
                        </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-8 text-center text-slate-500"
                        >
                          No events or sports found matching your filters
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Ticket Status Section */}
          <div className="pt-5">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-black font-bold text-2xl">
                Ticket Status
                {selectedEvent ? (
                  <span className="text-lg font-normal text-slate-600 ml-2">
                    - {selectedEvent.eventName}
                  </span>
                ) : selectedSport ? (
                  <span className="text-lg font-normal text-slate-600 ml-2">
                    - {selectedSport.sportName}
                  </span>
                ) : showAggregateView &&
                  (filteredEvents.length > 0 || filteredSports.length > 0) ? (
                  <span className="text-lg font-normal text-slate-600 ml-2">
                    - Aggregate of {filteredEvents.length} events and{" "}
                    {filteredSports.length} sports
                  </span>
                ) : null}
              </h1>
              {(selectedEvent || selectedSport) && (
                <button
                  onClick={clearSelectedItem}
                  className="text-sm text-slate-500 hover:text-slate-700 underline"
                >
                  Show All
                </button>
              )}
            </div>
            <div className="grid grid-cols-4 gap-6 mt-8">
              {stats.map((stat, idx) => {
                const Icon = stat.Icon;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl shadow-lg p-2 hover:shadow-xl transition-shadow flex flex-col items-center justify-center"
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                      <Icon size={24} className="text-primary/90" />
                    </div>
                    <p className="text-slate-600 text-sm font-medium mb-2 text-center">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-slate-900 text-center">
                      {stat.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Registrations Bar Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Registrations
                {selectedEvent ? (
                  <span className="text-sm font-normal text-slate-600 ml-2">
                    - {selectedEvent.eventName}
                  </span>
                ) : selectedSport ? (
                  <span className="text-sm font-normal text-slate-600 ml-2">
                    - {selectedSport.sportName}
                  </span>
                ) : showAggregateView &&
                  (filteredEvents.length > 0 || filteredSports.length > 0) ? (
                  <span className="text-sm font-normal text-slate-600 ml-2">
                    - Aggregate of {filteredEvents.length} events and{" "}
                    {filteredSports.length} sports
                  </span>
                ) : null}
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartDataToUse}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="registrations"
                    fill="var(--primary)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Participation Pie Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Participation Rate
                {selectedEvent ? (
                  <span className="text-sm font-normal text-slate-600 ml-2">
                    - {selectedEvent.eventName}
                  </span>
                ) : selectedSport ? (
                  <span className="text-sm font-normal text-slate-600 ml-2">
                    - {selectedSport.sportName}
                  </span>
                ) : showAggregateView &&
                  (filteredEvents.length > 0 || filteredSports.length > 0) ? (
                  <span className="text-sm font-normal text-slate-600 ml-2">
                    - Aggregate of {filteredEvents.length} events and{" "}
                    {filteredSports.length} sports
                  </span>
                ) : null}
              </h3>
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={participationRateToUse}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {participationRateToUse.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            index === 0 ? "var(--primary)" : "rgb(229 231 235)"
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                {selectedEvent && (
                  <div className="mt-2 text-center text-sm text-slate-600">
                    <p>
                      Maximum Occupancy:{" "}
                      {selectedEvent.ticketStatus?.maximumOccupancy || 0}
                    </p>
                    <p>
                      Total Players:{" "}
                      {selectedEvent.ticketStatus?.totalNumberOfPlayers || 0}
                    </p>
                    <p className="font-semibold">
                      Participation Rate:{" "}
                      {participationRateToUse[0]?.value || 0}%
                    </p>
                  </div>
                )}
                {selectedSport && (
                  <div className="mt-2 text-center text-sm text-slate-600">
                    <p>
                      Maximum Participants:{" "}
                      {selectedSport.participationStatus?.maximumParticipants ||
                        0}
                    </p>
                    <p>
                      Confirmed Participants:{" "}
                      {selectedSport.participationStatus
                        ?.confirmedParticipants || 0}
                    </p>
                    <p className="font-semibold">
                      Participation Rate:{" "}
                      {participationRateToUse[0]?.value || 0}%
                    </p>
                  </div>
                )}
                {showAggregateView &&
                  (filteredEvents.length > 0 || filteredSports.length > 0) && (
                  <div className="mt-2 text-center text-sm text-slate-600">
                    <p>
                      Total Maximum Occupancy:{" "}
                      {aggregatedStats?.maximumOccupancy || 0}
                    </p>
                    <p>
                      Total Players (Events &amp; Sports):{" "}
                      {aggregatedStats?.totalPlayers || 0}
                    </p>
                    <p className="font-semibold">
                      Aggregate Participation Rate:{" "}
                      {participationRateToUse[0]?.value || 0}%
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Ticket Sales Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Ticket Sales
                {selectedEvent ? (
                  <span className="text-sm font-normal text-slate-600 ml-2">
                    - {selectedEvent.eventName}
                  </span>
                ) : showAggregateView &&
                  (filteredEvents.length > 0 || filteredSports.length > 0) ? (
                  <span className="text-sm font-normal text-slate-600 ml-2">
                    - Aggregate of {filteredEvents.length} events and{" "}
                    {filteredSports.length} sports
                  </span>
                ) : null}
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartDataToUse}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="sales"
                    fill="var(--primary)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Attendee Engagement */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Attendee Engagement
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={attendeeEngagement}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="engagement"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    dot={{ fill: "var(--primary)", r: 4 }}
                    activeDot={{ r: 6, fill: "var(--primary)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
}
