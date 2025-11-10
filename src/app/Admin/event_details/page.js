"use client";
import React, { useState, useEffect } from 'react';
import { Upload, Calendar, MapPin, FileText, Tag, Eye, Edit, Trash2, Plus, Search, ChevronDown } from 'lucide-react';

export default function EventDetails() {
  const [showForm, setShowForm] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [categoryFilter, setCategoryFilter] = useState('All Category');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [events, setEvents] = useState([
    { id: 1, name: 'Silver State Table Tennis Open Championship', date: '8/11/2025', category: 'Table Tennis', status: 'Ongoing', venue: 'IUKM Sultan Azizan Shah' },
    { id: 2, name: 'Fun Run Larian Perpaduan Malaysia Madani', date: '8/11/2025', category: 'Road Race', status: 'Upcoming', venue: 'Sunway Ipoh, Malaysia' },
    { id: 3, name: 'Rakan Muda Kolokium Pemerkasaan Sukan', date: '8/11/2025', category: 'Symposium', status: 'Upcoming', venue: 'M Roof Hotel' },
    { id: 4, name: 'Table Tennis State Championship', date: '10/11/2025', category: 'Table Tennis', status: 'Upcoming', venue: 'IUKM Sultan Azizan Shah' },
    { id: 5, name: 'Charity Marathon', date: '11/11/2025', category: 'Road Race', status: 'Ongoing', venue: 'Kuala Lumpur, Malaysia' },
    { id: 6, name: 'International Symposium on AI', date: '12/11/2025', category: 'Symposium', status: 'Upcoming', venue: 'M Roof Hotel' },
    { id: 7, name: 'National Basketball Championship', date: '13/11/2025', category: 'Sports', status: 'Ongoing', venue: 'Stadium A' },
    { id: 8, name: 'Global Tech Conference', date: '14/11/2025', category: 'Symposium', status: 'Upcoming', venue: 'Tech Hall B' },
  ]);

  const [formData, setFormData] = useState({
    eventName: '',
    venue: '',
    date: '',
    category: '',
    description: '',
  });

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      id: events.length + 1,
      name: formData.eventName,
      date: formData.date,
      category: formData.category,
      status: 'Upcoming',
      venue: formData.venue,
    };
    setEvents([...events, newEvent]);
    setFormData({ eventName: '', venue: '', date: '', category: '', description: '' });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ongoing': return 'bg-green-100 text-green-800';
      case 'Upcoming': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, categoryFilter]);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || event.status === statusFilter;
    const matchesCategory = categoryFilter === 'All Category' || event.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const currentPageEvents = filteredEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                  Event Details
                </h1>
              </div>
              <button
                onClick={() => setShowForm(true)}
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
                  <Search className="absolute left-3 top-3 text-slate-400" size={20} />
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
                    <option>Ongoing</option>
                    <option>Upcoming</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-2.5 text-slate-400 pointer-events-none" size={18} />
                </div>
                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="text-black appearance-none px-4 py-2 pr-8 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 cursor-pointer"
                  >
                    <option>All Category</option>
                    <option>Table Tennis</option>
                    <option>Road Race</option>
                    <option>Symposium</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-2.5 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>
            </div>

            {/* Events Table */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Event</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Venue</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {currentPageEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/80 rounded-lg flex items-center justify-center">
                              <FileText size={20} className="text-white" />
                            </div>
                            <span className="text-sm font-medium text-slate-900">{event.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{event.date}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{event.category}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)}`}>
                            {event.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{event.venue}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button className="p-2 text-slate-400 hover:text-primary/90 hover:bg-primary/10 rounded-lg transition-colors">
                              <Eye size={18} />
                            </button>
                            <button className="p-2 text-slate-400 hover:text-primary/90 hover:bg-primary/10 rounded-lg transition-colors">
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(event.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
          </>
        ) : (
          <>
            {/* Create Event Form */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary/90 to-primary/70 bg-clip-text text-transparent mb-2">
                Create Event
              </h1>
              <p className="text-slate-600">Fill in the details to create a new event</p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
              {/* Event Name */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-3">Event Name</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3.5 text-slate-400" size={20} />
                  <input
                    type="text"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleChange}
                    placeholder="Enter event name"
                    className="text-black w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Venue */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-3">Venue</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 text-slate-400" size={20} />
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    placeholder="Enter venue"
                    className="text-black w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Date & Category Row */}
              <div className="grid grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3.5 text-slate-400" size={20} />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="text-black w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-slate-700 mb-3">Category</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-3.5 text-slate-400" size={20} />
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="text-black w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select a Category</option>
                      <option value="Table Tennis">Table Tennis</option>
                      <option value="Road Race">Road Race</option>
                      <option value="Symposium">Symposium</option>
                      <option value="Sports">Sports</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-3">Event Image</label>
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  className={`relative p-8 border-2 border-dashed rounded-xl transition-all ${dragActive
                    ? 'border-primary/80 bg-primary/10'
                    : 'border-slate-300 bg-slate-50 hover:border-slate-400'
                    }`}
                >
                  <div className="text-center">
                    <Upload className={`mx-auto mb-3 ${dragActive ? 'text-primary/80' : 'text-slate-400'}`} size={32} />
                    <p className="text-sm font-medium text-slate-700">Drag and drop your image here</p>
                    <p className="text-xs text-slate-500 mt-1">or click to browse</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-3">Description</label>
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
                  className="flex-1 py-3 bg-primary/90 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95 hover:bg-primary/80"
                >
                  Create Event
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ eventName: '', venue: '', date: '', category: '', description: '' });
                  }}
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