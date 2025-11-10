"use client"

import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, FileText, Eye, ArrowLeft } from 'lucide-react';

export default function EventPaymentDashboard() {
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [categoryFilter, setCategoryFilter] = useState('All Category');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [paymentPage, setPaymentPage] = useState(1);
    const [paymentsPerPage] = useState(5);

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

    const [payments, setPayments] = useState([
        { id: 1, eventId: 1, firstName: 'John', lastName: 'Doe', phone: '55469852', ticketsBooked: 2, paymentMade: 400, paymentType: 'Card' },
        { id: 2, eventId: 1, firstName: 'Jane', lastName: 'Smith', phone: '55469852', ticketsBooked: 4, paymentMade: 800, paymentType: 'Bank' },
        { id: 3, eventId: 1, firstName: 'Robert', lastName: 'Johnson', phone: '55469852', ticketsBooked: 1, paymentMade: 200, paymentType: 'PayPal' },
        { id: 4, eventId: 1, firstName: 'Emily', lastName: 'Williams', phone: '55469852', ticketsBooked: 5, paymentMade: 1000, paymentType: 'Stripe' },
        { id: 5, eventId: 2, firstName: 'Michael', lastName: 'Brown', phone: '55469852', ticketsBooked: 1, paymentMade: 200, paymentType: 'PayPal' },
        { id: 6, eventId: 2, firstName: 'Sarah', lastName: 'Davis', phone: '55469852', ticketsBooked: 1, paymentMade: 200, paymentType: 'Bank' },
        { id: 7, eventId: 3, firstName: 'David', lastName: 'Miller', phone: '55469852', ticketsBooked: 6, paymentMade: 1200, paymentType: 'Card' },
        { id: 8, eventId: 3, firstName: 'Lisa', lastName: 'Wilson', phone: '55469852', ticketsBooked: 8, paymentMade: 1600, paymentType: 'PayPal' },
        { id: 9, eventId: 4, firstName: 'James', lastName: 'Moore', phone: '55469852', ticketsBooked: 8, paymentMade: 1600, paymentType: 'PayPal' },
        { id: 10, eventId: 4, firstName: 'Patricia', lastName: 'Taylor', phone: '55469852', ticketsBooked: 4, paymentMade: 800, paymentType: 'Stripe' },
    ]);

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

    const eventPayments = selectedEvent ? payments.filter(p => p.eventId === selectedEvent.id) : [];
    const totalPaymentPages = Math.ceil(eventPayments.length / paymentsPerPage);
    const currentPayments = eventPayments.slice((paymentPage - 1) * paymentsPerPage, paymentPage * paymentsPerPage);

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
        switch (status) {
            case 'Ongoing': return 'bg-green-100 text-green-800';
            case 'Upcoming': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

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
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        >
                            <ArrowLeft size={20} className="text-slate-700" />
                            <span className="text-slate-700 font-medium">Back to Payments</span>
                        </button>
                    </div>
                    <div className="mb-8 flex items-center gap-4">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary/90 to-primary/70 bg-clip-text text-transparent mt-5">
                                Payment Details
                            </h1>
                        </div>
                    </div>

                    {/* Payment Details Table */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <p className="text-slate-600 font-bold text-center text-2xl p-2 bg-primary/20">{selectedEvent.name}</p>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-primary/10">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">First Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Last Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Phone</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Tickets Booked</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Payment Made</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Payment Type</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200">
                                    {currentPayments.length > 0 ? (
                                        currentPayments.map((payment) => (
                                            <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-slate-900">{payment.firstName}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600">{payment.lastName}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600">{payment.phone}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600">{payment.ticketsBooked}</td>
                                                <td className="px-6 py-4 text-sm font-semibold text-slate-900">Rs.{payment.paymentMade}</td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary/90">
                                                        {payment.paymentType}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-center text-slate-600">
                                                No payments found for this event
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Payment Pagination */}
                    {eventPayments.length > 0 && (
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
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary/90 to-primary/70 bg-clip-text text-transparent mb-2">
                            Payment Details
                        </h1>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="flex gap-4 items-center">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search Payment..."
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
                                <option>Sports</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-2.5 text-slate-400 pointer-events-none" size={18} />
                        </div>
                    </div>
                </div>

                {/* Payment Table */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-primary/10">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Event</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Category</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Venue</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Action</th>
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
                                            <button
                                                onClick={() => {
                                                    setSelectedEvent(event);
                                                    setPaymentPage(1);
                                                }}
                                                className="flex items-center gap-2 px-3 py-1 bg-primary/90 text-white rounded-lg hover:bg-primary/80 transition-colors"
                                            >
                                                <Eye size={16} />
                                                <span className="text-xs font-medium">View</span>
                                            </button>
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
            </div>
        </div>
    );
}