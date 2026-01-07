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
  Trophy,
  X,
} from "lucide-react";
import {
  createSport,
  getAllSports,
  deleteSport,
  updateSport,
  getSportById,
  getSportsByCategory,
} from "../../api/sports";
import { getCategoriesByType } from "../../api/category";

export default function SportsDetails() {
  const [showForm, setShowForm] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [categoryFilter, setCategoryFilter] = useState("All Category");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sports, setSports] = useState([]);
  const [error, setError] = useState("");
  const [sportToEdit, setSportToEdit] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const initialFormData = {
    sportName: "",
    venue: "",
    date: "",
    time: "",
    category: "",
    description: "",
    registrationFee: "",
    maximumParticipants: "",
    teamSize: "1",
    schedule: [{ time: "", activity: "" }],
    status: "upcoming",
  };

  const [formData, setFormData] = useState(initialFormData);

  const statusOptions = [
    { value: "upcoming", label: "Upcoming" },
    { value: "ongoing", label: "Ongoing" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "postponed", label: "Postponed" },
  ];

  const determineSportStatus = (sportDate, sportTime) => {
    if (!sportDate) return "upcoming";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sportDateTime = new Date(sportDate);

    if (sportTime) {
      const [hours, minutes] = sportTime.split(":");
      sportDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(23, 59, 59, 999);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    if (sportDateTime < yesterday) {
      return "completed";
    } else if (
      sportDateTime.getDate() === today.getDate() &&
      sportDateTime.getMonth() === today.getMonth() &&
      sportDateTime.getFullYear() === today.getFullYear()
    ) {
      return "ongoing";
    } else if (sportDateTime >= tomorrow) {
      return "upcoming";
    } else {
      return "completed";
    }
  };

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

  const fetchSportById = async (sportId) => {
    try {
      const response = await getSportById(sportId);

      if (response.sport) {
        const sport = response.sport;
        const formattedDate = sport.date
          ? new Date(sport.date).toISOString().split("T")[0]
          : "";

        const updatedFormData = {
          sportName: sport.sportName || "",
          venue: sport.venue || "",
          date: formattedDate,
          time: sport.time || "",
          category: sport.category || "",
          description: sport.description || "",
          registrationFee: sport.registrationFee || "",
          maximumParticipants:
            sport.participationStatus?.maximumParticipants || "",
          teamSize: sport.teamSize?.toString() || "1",
          schedule:
            sport.schedule && sport.schedule.length > 0
              ? sport.schedule
              : [{ time: "", activity: "" }],
          status: sport.status || "upcoming",
        };

        if (sport.image) {
          setImagePreview(sport.image);
        }
        setSelectedImage(null);

        setFormData(updatedFormData);

        setShowForm(true);
        setSportToEdit(sportId);
        setError("");
      }
    } catch (err) {
      console.error("Error fetching sport:", err);
      setError("Failed to fetch sport details");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategoriesByType("sports");
      console.log("Fetched sports categories:", response);

      let categoriesArray = [];

      if (
        response &&
        response.categories &&
        Array.isArray(response.categories)
      ) {
        categoriesArray = response.categories;
      } else if (response && Array.isArray(response.categories)) {
        categoriesArray = response.categories;
      } else if (response && Array.isArray(response.data)) {
        categoriesArray = response.data;
      } else if (Array.isArray(response)) {
        categoriesArray = response;
      } else {
        console.error("Unexpected response format:", response);
        categoriesArray = [];
      }

      console.log("Categories array:", categoriesArray);
      setCategories(categoriesArray);
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

  const handleScheduleChange = (index, field, value) => {
    const newSchedule = [...formData.schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setFormData((prev) => ({ ...prev, schedule: newSchedule }));
  };

  const addScheduleItem = () => {
    setFormData((prev) => ({
      ...prev,
      schedule: [...prev.schedule, { time: "", activity: "" }],
    }));
  };

  const removeScheduleItem = (index) => {
    const newSchedule = formData.schedule.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, schedule: newSchedule }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.sportName ||
      !formData.venue ||
      !formData.date ||
      !formData.time ||
      !formData.category ||
      !formData.registrationFee ||
      !formData.maximumParticipants
    ) {
      setError("Please fill in all required fields");
      return;
    }

    const invalidScheduleItems = formData.schedule.some(
      (item) => !item.time || !item.activity
    );
    if (invalidScheduleItems) {
      setError(
        "Please fill out both time and activity for all schedule items or remove empty ones."
      );
      return;
    }

    setIsLoading(true);

    try {
      const submitData = new FormData();

      submitData.append("sportName", formData.sportName);
      submitData.append("venue", formData.venue);
      submitData.append("date", formData.date);
      submitData.append("time", formData.time);
      submitData.append("category", formData.category);
      submitData.append("description", formData.description);
      submitData.append("registrationFee", formData.registrationFee);
      submitData.append("maximumParticipants", formData.maximumParticipants);
      submitData.append("teamSize", formData.teamSize);

      const autoStatus = determineSportStatus(formData.date, formData.time);
      submitData.append("status", autoStatus);

      submitData.append("schedule", JSON.stringify(formData.schedule));

      if (selectedImage) {
        submitData.append("image", selectedImage);
      }

      let response;
      if (sportToEdit) {
        response = await updateSport(sportToEdit, submitData);
        console.log("Sport updated:", response);
      } else {
        response = await createSport(submitData);
        console.log("Sport created:", response);
      }

      await fetchSports();
      resetForm();
    } catch (err) {
      console.error("Error creating/updating sport:", err);
      setError("Failed to create/update sport. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSports = async () => {
    try {
      const response = await getAllSports();
      const updatedSports = (response.sports || []).map((sport) => {
        if (
          !sport.status ||
          (sport.status !== "cancelled" && sport.status !== "postponed")
        ) {
          const autoStatus = determineSportStatus(sport.date, sport.time);
          return { ...sport, status: autoStatus };
        }
        return sport;
      });

      setSports(updatedSports);
    } catch (err) {
      console.error("Error fetching sports:", err);
      setError("Failed to fetch sports");
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([fetchSports(), fetchCategories()]);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchAllData();
  }, []);

  const resetForm = () => {
    setFormData(initialFormData);
    setShowForm(false);
    setSportToEdit(null);
    setSelectedImage(null);
    setImagePreview("");
    setError("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sport?")) {
      return;
    }
    try {
      await deleteSport(id);
      console.log(`Sport with ID ${id} deleted successfully.`);
      await fetchSports();
    } catch (err) {
      console.error("Error deleting sport:", err);
      setError("Failed to delete sport. Please try again.");
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, categoryFilter]);

  const filteredSports = sports.filter((sport) => {
    if (!sport) return false;

    const sportName = sport.sportName || "";
    const sportStatus = sport.status || "";
    const sportCategoryName = getCategoryName(sport.category || "");
    const matchesSearch = sportName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" || sportStatus === statusFilter;
    const matchesCategory =
      categoryFilter === "All Category" || sportCategoryName === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalPages = Math.ceil(filteredSports.length / itemsPerPage);
  const currentPageSports = filteredSports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {!showForm ? (
          <>
            {/* Header */}
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary/90 to-primary/70 bg-clip-text text-transparent mb-2">
                  Sports Details
                </h1>
                <p className="text-slate-600">
                  Manage and track all your sports events
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
                Create Sport
              </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="col-span-1 relative">
                  <Search
                    className="absolute left-3 top-3 text-slate-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search sports..."
                    className="text-black w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="text-black appearance-none w-full px-4 py-2 pr-8 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 cursor-pointer"
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
                    className="text-black appearance-none w-full px-4 py-2 pr-8 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 cursor-pointer"
                  >
                    <option>All Category</option>
                    {categories &&
                      categories.map((category) => (
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

            {/* Sports Table */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        Sport
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        Date & Time
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        Category
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        Team Size
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                        Registration Fee
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
                    {currentPageSports.length > 0 ? (
                      currentPageSports.map((sport) => (
                        <tr
                          key={sport.id}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary/80 rounded-lg flex items-center justify-center">
                                <Trophy size={20} className="text-white" />
                              </div>
                              <div>
                                <span className="text-sm font-medium text-slate-900 block">
                                  {sport.sportName}
                                </span>
                                <div className="flex items-center gap-2 mt-1">
                                  <Users size={14} className="text-slate-400" />
                                  <span className="text-xs text-slate-500">
                                    {sport.participationStatus
                                      ?.confirmedParticipants || 0}
                                    /
                                    {sport.participationStatus
                                      ?.maximumParticipants || 0}{" "}
                                    participants
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-slate-600">
                              <div>
                                {sport.date
                                  ? new Date(sport.date).toLocaleDateString()
                                  : "N/A"}
                              </div>
                              <div className="text-slate-500">
                                {sport.time || "N/A"}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {getCategoryName(sport.category)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              <Users size={14} className="text-slate-400" />
                              <span className="text-sm text-slate-600">
                                {sport.teamSize || 1}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                sport.status
                              )}`}
                            >
                              {formatStatus(sport.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            <div className="flex items-center gap-1">
                              $ {sport.registrationFee || "0.00"}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {sport.venue || "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                className="p-2 text-slate-400 hover:text-primary/90 hover:bg-primary/10 rounded-lg transition-colors"
                                onClick={() => fetchSportById(sport.id)}
                                title="Edit Sport"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(sport.id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Sport"
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
                          colSpan="8"
                          className="px-6 py-8 text-center text-slate-500"
                        >
                          No sports found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            {filteredSports.length > 0 && (
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
            {/* Create or Update Sport Form */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary/90 to-primary/70 bg-clip-text text-transparent mb-2">
                {sportToEdit ? "Update Sport" : "Create Sport"}
              </h1>
              <p className="text-slate-600">
                Fill in the details to {sportToEdit ? "update" : "create"} the
                sport
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

              {/* Sport Name */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Sport Name *
                </label>
                <div className="relative">
                  <Trophy
                    className="absolute left-3 top-3.5 text-slate-400"
                    size={20}
                  />
                  <input
                    type="text"
                    name="sportName"
                    value={formData.sportName}
                    onChange={handleChange}
                    placeholder="Enter sport name"
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

              {/* Category & Team Size Row */}
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

                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Team Size *
                  </label>
                  <div className="relative">
                    <Users
                      className="absolute left-3 top-3.5 text-slate-400"
                      size={20}
                    />
                    <input
                      type="number"
                      name="teamSize"
                      value={formData.teamSize}
                      onChange={handleChange}
                      min="1"
                      className="text-black w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Registration Fee & Maximum Participants Row */}
              <div className="grid grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Registration Fee ($) *
                  </label>
                  <div className="relative">
                    <FileText
                      className="absolute left-3 top-3.5 text-slate-400"
                      size={20}
                    />
                    <input
                      type="number"
                      name="registrationFee"
                      value={formData.registrationFee}
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
                    Maximum Participants *
                  </label>
                  <div className="relative">
                    <Users
                      className="absolute left-3 top-3.5 text-slate-400"
                      size={20}
                    />
                    <input
                      type="number"
                      name="maximumParticipants"
                      value={formData.maximumParticipants}
                      onChange={handleChange}
                      placeholder="Enter maximum number of participants"
                      min="1"
                      className="text-black w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Sport Schedule
                </label>
                {formData.schedule.map((item, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                    <input
                      type="time"
                      value={item.time}
                      onChange={(e) =>
                        handleScheduleChange(index, "time", e.target.value)
                      }
                      className="text-black px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 focus:bg-white transition-all"
                    />
                    <input
                      type="text"
                      value={item.activity}
                      onChange={(e) =>
                        handleScheduleChange(index, "activity", e.target.value)
                      }
                      placeholder="Activity description"
                      className="text-black col-span-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 focus:bg-white transition-all"
                    />
                    {formData.schedule.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeScheduleItem(index)}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addScheduleItem}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all"
                >
                  <Plus size={16} />
                  Add Schedule Item
                </button>
              </div>

              {/* Image Upload */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Sport Image
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
                      {!selectedImage && sportToEdit && (
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
                      {sportToEdit && (
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
                  About The Sport
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter sport description"
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
                    : sportToEdit
                    ? "Update Sport"
                    : "Create Sport"}
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
