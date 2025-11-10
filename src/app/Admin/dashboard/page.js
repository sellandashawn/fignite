"use client";

import React from "react";
import { Upload, Calendar, MapPin, FileText, Tag, Eye, Edit, Trash2, Plus, Search, ChevronDown, Download, TrendingUp, Users, BarChart3, Ticket, CheckCircle } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const stats = [
    { label: 'Maximum Occupancy', value: 19, Icon: BarChart3 },
    { label: 'Total number of players', value: 2, Icon: Users },
    { label: 'Unscanned tickets', value: '0', Icon: Ticket },
    { label: 'Successful Payment', value: '18', Icon: CheckCircle },
];

const registrationData = [
    { name: 'Aug', registrations: 120 },
    { name: 'Sep', registrations: 90 },
    { name: 'Oct', registrations: 200 },
    { name: 'Nov', registrations: 150 },
    { name: 'Dec', registrations: 250 },
];

const ticketPerformance = [
    { name: 'Sold', value: 420 },
    { name: 'Available', value: 180 },
];
const COLORS = ['var(--primary)', 'rgb(229 231 235)'];

const ticketsales = [
    { name: 'Week 1', sales: 1000 },
    { name: 'Week 2', sales: 500 },
    { name: 'Week 3', sales: 750 },
    { name: 'Week 4', sales: 278 },
    { name: 'Week 5', sales: 1890 },
    { name: 'Week 6', sales: 2390 },
];
const attendeeEngagement = [
    { name: 'Day 1', engagement: 100 },
    { name: 'Day 16', engagement: 185 },
    { name: 'Day 29', engagement: 250 },
    { name: 'Day 30', engagement: 255 },
    { name: 'Day 37', engagement: 290 },
    { name: 'Day 40', engagement: 305 }
];

const eventPerformance = [
    { event: "Fun Run 2025", ticketSold: 500, amount: "Rs.15,000", status: "Active" },
    { event: "Fun Run 2025", ticketSold: 300, amount: "Rs.10,000", status: "Completed" },
    { event: "Fun Run 2025", ticketSold: 200, amount: "Rs.5,000", status: "Upcoming" },
];

const paymentReports = [
    { date: "25/11/2025", amount: "Rs.10,000", status: "Completed" },
    { date: "25/10/2025", amount: "Rs.8,000", status: "Pending" },
    { date: "25/01/2026", amount: "Rs.5,000", status: "Completed" },
];

function getStatusClasses(status) {
    if (status === "Active") return "bg-green-200 text-green-800";
    if (status === "Completed") return "bg-primary/20 text-primary/90";
    if (status === "Pending") return "bg-gray-200 text-gray-700";
    if (status === "Upcoming") return "bg-yellow-100 text-yellow-800";
    return "bg-slate-200 text-slate-700";
}

export default function DashBoard() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="flex gap-4 items-center mb-6">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search events..."
                                className="text-black w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 focus:bg-white/50 transition-all"
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

                    <div className="flex gap-4 ">
                        {/* Date From */}
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-slate-700 mb-3">Date From</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3.5 text-slate-400" size={20} />
                                <input
                                    type="date"
                                    name="dateFrom"
                                    className="text-black w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 focus:bg-white/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Date To */}
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-slate-700 mb-3">Date To</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3.5 text-slate-400" size={20} />
                                <input
                                    type="date"
                                    name="dateTo"
                                    className="text-black w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 focus:bg-white/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Month */}
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-slate-700 mb-3">Month</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3.5 text-slate-400" size={20} />
                                <input
                                    type="month"
                                    name="month"
                                    className="text-black w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 focus:bg-white/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Event Category */}
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-slate-700 mb-3">Event</label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-3.5 text-slate-400" size={20} />
                                <select
                                    name="category"
                                    className="text-black w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/60 focus:bg-white/50 transition-all appearance-none cursor-pointer"
                                >
                                    <option value="">All</option>
                                    <option value="Table Tennis">Table Tennis</option>
                                    <option value="Road Race">Road Race</option>
                                    <option value="Symposium">Symposium</option>
                                    <option value="Sports">Sports</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="pt-5 ">
                        <h1 className="text-black font-bold text-2xl">Ticket Status</h1>
                        <div className="grid grid-cols-4 gap-6 mt-8">
                            {stats.map((stat, idx) => {
                                const Icon = stat.Icon;
                                return (
                                    <div key={idx} className="bg-white rounded-2xl shadow-lg p-2 hover:shadow-xl transition-shadow flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                                            <Icon size={24} className="text-primary/90" />
                                        </div>
                                        <p className="text-slate-600 text-sm font-medium mb-2 text-center">{stat.label}</p>
                                        <p className="text-3xl font-bold text-slate-900 text-center">{stat.value}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        {/* Registrations Bar Chart */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Registrations</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={registrationData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="registrations" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Participation Pie Chart */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Participation Rate</h3>
                            <div className="flex justify-center">
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={ticketPerformance}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            dataKey="value"
                                        >
                                            {ticketPerformance.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-6 mb-8">
                            {/* Revenue Line Chart */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4">Ticket Sales</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={ticketsales}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="sales" fill="var(--primary)" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 mb-8">
                            {/*  Attendee Engagement */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-slate-900 mb-4"> Attendee Engagement</h3>
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

                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 space-y-8">
                    {/* Event Performance */}
                    <div>
                        <h2 className="text-slate-900 font-semibold mb-3">Event Performance</h2>
                        <div className="rounded-2xl border border-primary/20 overflow-hidden bg-slate-50">
                            <table className="w-full text-left text-sm text-slate-800">
                                <thead className="bg-primary/10">
                                    <tr>
                                        <th className="px-6 py-4">Event</th>
                                        <th className="px-6 py-4">Ticket Sold</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {eventPerformance.map((row, idx) => (
                                        <tr key={idx} className="border-t border-primary/10 bg-white">
                                            <td className="px-6 py-4">{row.event}</td>
                                            <td className="px-6 py-4">{row.ticketSold}</td>
                                            <td className="px-6 py-4">{row.amount}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-4 py-1 rounded-full text-xs font-semibold ${getStatusClasses(row.status)}`}>
                                                    {row.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Payment Reports */}
                    <div>
                        <h2 className="text-slate-900 font-semibold mb-3">Payment Reports</h2>
                        <div className="rounded-2xl border border-primary/20 overflow-hidden bg-slate-50">
                            <table className="w-full text-left text-sm text-slate-800">
                                <thead className="bg-primary/10">
                                    <tr>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paymentReports.map((row, idx) => (
                                        <tr key={idx} className="border-t border-primary/10 bg-white">
                                            <td className="px-6 py-4">{row.date}</td>
                                            <td className="px-6 py-4">{row.amount}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-4 py-1 rounded-full text-xs font-semibold ${getStatusClasses(row.status)}`}>
                                                    {row.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}