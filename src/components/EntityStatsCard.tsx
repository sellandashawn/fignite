import React from "react";

type EntityStats = {
  isSport: boolean;
  name: string;
  soldTickets: number;
  scannedTickets: number;
  remainingTickets: number;
  orders: number;
  successfulOrders: number;
  attendees: number;
};

type Props = {
  stats: EntityStats | null;
};

export function EntityStatsCard({ stats }: Props) {
  if (!stats) return null;

  return (
    <div className="my-3 rounded-xl border border-sky-200 bg-sky-50 px-3 py-3 text-xs text-sky-900">
      <p className="mb-1 font-semibold text-sky-800">
        {stats.isSport ? "Sport" : "Event"} overview ({stats.name})
      </p>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <p className="text-sky-700/80">Tickets sold</p>
          <p className="font-mono text-sky-900">{stats.soldTickets}</p>
        </div>
        <div>
          <p className="text-sky-700/80">Tickets scanned</p>
          <p className="font-mono text-sky-900">{stats.scannedTickets}</p>
        </div>
        <div>
          <p className="text-sky-700/80">Remaining</p>
          <p className="font-mono text-sky-900">{stats.remainingTickets}</p>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2">
        <div>
          <p className="text-sky-700/80">Orders</p>
          <p className="font-mono text-sky-900">{stats.orders}</p>
        </div>
        <div>
          <p className="text-sky-700/80">Attendees</p>
          <p className="font-mono text-sky-900">{stats.attendees}</p>
        </div>
        <div>
          <p className="text-sky-700/80">Successful payments</p>
          <p className="font-mono text-sky-900">{stats.successfulOrders}</p>
        </div>
      </div>
    </div>
  );
}

