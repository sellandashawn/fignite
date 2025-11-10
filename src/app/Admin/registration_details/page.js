'use client';

import React, { useState } from 'react';
import { Search, Eye, Download } from 'lucide-react';

const registrations = [
    { name: 'John6', age: 26, phone: '55469852', gender: 'Male', ticketsBooked: 2, paymentStatus: 'Paid' },
    { name: 'Dee', age: 26, phone: '55469852', gender: 'Male', ticketsBooked: 4, paymentStatus: 'Paid' },
    { name: 'Jony', age: 26, phone: '55469852', gender: 'Female', ticketsBooked: 1, paymentStatus: 'Paid' },
    { name: 'John6', age: 26, phone: '55469852', gender: 'Male', ticketsBooked: 5, paymentStatus: 'Pending' },
    { name: 'John6', age: 26, phone: '55469852', gender: 'Male', ticketsBooked: 1, paymentStatus: 'Paid' },
    { name: 'John6', age: 26, phone: '55469852', gender: 'Male', ticketsBooked: 1, paymentStatus: 'Paid' },
    { name: 'John6', age: 26, phone: '55469852', gender: 'Male', ticketsBooked: 6, paymentStatus: 'Paid' },
    { name: 'John6', age: 26, phone: '55469852', gender: 'Male', ticketsBooked: 8, paymentStatus: 'Pending' },
    { name: 'John6', age: 26, phone: '55469852', gender: 'Male', ticketsBooked: 8, paymentStatus: 'Paid' },
    { name: 'John6', age: 26, phone: '55469852', gender: 'Male', ticketsBooked: 4, paymentStatus: 'Pending' },
];

export default function RegistrationsDetails() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const filteredRegistrations = registrations.filter((registration) => {
        const matchesSearch = registration.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All Status' || registration.paymentStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
    const currentPageRegistrations = filteredRegistrations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage); // Slice data for current page

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
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
                    <div className="flex gap-4 items-center mb-6">
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

                        <div className="flex gap-4">
                            <button
                                className="flex items-center gap-2 px-6 py-3 bg-primary/90 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all hover:bg-primary/80"
                            >
                                <Eye size={20} />
                                Preview
                            </button>
                            <button
                                className="flex items-center gap-2 px-6 py-3 bg-primary/90 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all hover:bg-primary/80"
                            >
                                <Download size={20} />
                                Download
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Age</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Phone no</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Gender</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Tickets Booked</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Payment Status</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {currentPageRegistrations.map((registration, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4  text-slate-700">{registration.name}</td>
                                    <td className="px-6 py-4 text-slate-700">{registration.age}</td>
                                    <td className="px-6 py-4 text-slate-700">{registration.phone}</td>
                                    <td className="px-6 py-4 text-slate-700">{registration.gender}</td>
                                    <td className="px-6 py-4 text-slate-700">{registration.ticketsBooked}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(registration.paymentStatus)}`}>
                                            {registration.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button className="p-2 text-slate-400 hover:text-primary/90 hover:bg-primary/10 rounded-lg transition-colors">
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
        </div>
    );
}