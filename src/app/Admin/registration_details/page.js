"use client";

import React, { useState, useEffect } from "react";
import { Search, Eye, X } from "lucide-react";
import { getEventParticipants } from "../../api/participant";

export default function RegistrationsDetails() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [typeFilter, setTypeFilter] = useState("All"); // All | Event | Sport
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [userdata, setUserData] = useState([]);
  const [selectedRegistration, setSelectedRegistration] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getEventParticipants();
      if (response && response.data) {
        setUserData(response.data.participants || []);
      }
    };

    fetchUsers();
  }, []);

  const filteredRegistrations = userdata.filter((registration) => {
    const firstAttendee = Array.isArray(registration.attendeeInfo)
      ? registration.attendeeInfo[0]
      : registration.attendeeInfo;
    const name = firstAttendee?.name || "";
    const eventName = registration.event?.name || "";
    const sportName = registration.sport?.name || "";
    const paymentStatus = registration.paymentStatus || "";

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      name.toLowerCase().includes(query) ||
      eventName.toLowerCase().includes(query) ||
      sportName.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "All Status" || paymentStatus === statusFilter;

    const matchesType =
      typeFilter === "All" ||
      (typeFilter === "Event" && !registration.isSport) ||
      (typeFilter === "Sport" && registration.isSport);

    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const currentPageRegistrations = filteredRegistrations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "successful":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary/90 to-primary/70 bg-clip-text text-transparent mb-2">
              Registrations Details
            </h1>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex gap-4 items-end mb-6">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-3 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by attendee, event or sport..."
                className="text-black w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-start">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="text-black w-40 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60"
              >
                <option value="All">All Types</option>
                <option value="Event">Event</option>
                <option value="Sport">Sport</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Event / Sport
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Phone no
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Tickets Booked
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Payment Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentPageRegistrations.map((registration, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4  text-slate-700">
                    {Array.isArray(registration.attendeeInfo)
                      ? registration.attendeeInfo[0]?.name || "N/A"
                      : registration.attendeeInfo?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {registration.isSport ? "Sport" : "Event"}
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {registration.isSport
                      ? registration.sport?.name || "N/A"
                      : registration.event?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {registration.billingInfo?.phone || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {registration.numberOfTickets || 0}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(registration.paymentStatus)}`}
                    >
                      {registration.paymentStatus || "Unknown"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      className="p-2 text-slate-400 hover:text-primary/90 hover:bg-primary/10 rounded-lg transition-colors"
                      onClick={() => setSelectedRegistration(registration)}
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all"
          >
            Previous
          </button>
          <span className="text-slate-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all"
          >
            Next
          </button>
        </div>
      </div>

      {selectedRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-1">
                  Attendees
                </h2>
                <p className="text-sm text-slate-600">
                  {selectedRegistration.isSport ? "Sport" : "Event"}:{" "}
                  {selectedRegistration.isSport
                    ? selectedRegistration.sport?.name || "N/A"
                    : selectedRegistration.event?.name || "N/A"}
                </p>
                <p className="text-xs text-slate-500">
                  Order ID: {selectedRegistration.orderId}
                </p>
              </div>
              <button
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                onClick={() => setSelectedRegistration(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              {(Array.isArray(selectedRegistration.attendeeInfo)
                ? selectedRegistration.attendeeInfo
                : selectedRegistration.attendeeInfo
                  ? [selectedRegistration.attendeeInfo]
                  : []
              ).map((attendee, index) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-xl px-4 py-3 bg-slate-50"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-slate-500">
                      Attendee {index + 1}
                    </span>
                    {attendee.teamName && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary/90">
                        {attendee.teamName}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-slate-700">
                    <div>
                      <span className="font-semibold">Name: </span>
                      <span>{attendee.name || "N/A"}</span>
                    </div>
                    <div>
                      <span className="font-semibold">ID: </span>
                      <span>{attendee.identificationNumber || "N/A"}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Age: </span>
                      <span>{attendee.age ?? "N/A"}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Gender: </span>
                      <span>
                        {attendee.gender
                          ? attendee.gender.charAt(0).toUpperCase() +
                            attendee.gender.slice(1)
                          : "N/A"}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold">Email: </span>
                      <span>{attendee.emailAddress || "N/A"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
