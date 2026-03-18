"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Camera,
  Info,
  CheckCircle2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { BrowserQRCodeReader } from "@zxing/browser";
import { scanTicketByQR, getEntityParticipants } from "../../api/participant";
import { getAllEvents } from "../../api/event";
import { getAllSports } from "../../api/sports";
import { EntityStatsCard } from "../../../components/EntityStatsCard";

export default function QrScannerPage() {
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState(null);
  const [lastScannedAt, setLastScannedAt] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendResult, setBackendResult] = useState(null);
  const [backendError, setBackendError] = useState(null);
  const [entityStats, setEntityStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [sports, setSports] = useState([]);
  const [selectedEntityId, setSelectedEntityId] = useState("");
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const streamRef = useRef(null);
  const lastSentRawRef = useRef("");
  const isProcessingRef = useRef(false);
  const selectedEntityIdRef = useRef(selectedEntityId);
  selectedEntityIdRef.current = selectedEntityId;

  useEffect(() => {
    getAllEvents()
      .then((resp) => {
        const all = Array.isArray(resp) ? resp : resp?.events || [];
        setEvents(filterToday(all));
      })
      .catch(() => setEvents([]));
    getAllSports()
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.sports || [];
        setSports(filterToday(list));
      })
      .catch(() => setSports([]));
  }, []);

  useEffect(() => {
    if (!isScanning) return;

    const setupScanner = async () => {
      try {
        setScanError(null);

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setScanError(
            "Camera API is not supported in this browser. Please use a modern browser like Chrome or Edge.",
          );
          return;
        }

        const constraints = {
          video: {
            facingMode: "environment",
          },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          try {
            await videoRef.current.play();
          } catch (err) {
            if (err && err.name !== "AbortError") {
              console.error("Video play error:", err);
            }
          }
        }

        const codeReader = new BrowserQRCodeReader();
        codeReaderRef.current = codeReader;

        const videoInputDevices =
          await BrowserQRCodeReader.listVideoInputDevices();
        const deviceId = videoInputDevices[0]?.deviceId;

        await codeReader.decodeFromVideoDevice(
          deviceId || undefined,
          videoRef.current,
          (result, err) => {
            if (result) {
              if (isProcessingRef.current) {
                return;
              }
              isProcessingRef.current = true;

              setIsScanning(false);

              const raw = result.getText();
              setScanError(null);
              const parsed = parseScanPayload(raw);
              setScanResult(parsed);
              setLastScannedAt(new Date());

              if (raw !== lastSentRawRef.current) {
                lastSentRawRef.current = raw;
                submitScan(raw, parsed);
              }
            } else if (err && !(err.name === "NotFoundException")) {
              console.error("QR scan error:", err);
            }
          },
        );
      } catch (error) {
        console.error("QR setup error:", error);
        setScanError(
          "We couldn't access your camera. Please ensure camera permissions are allowed and a camera is connected.",
        );
      }
    };

    setupScanner();

    return () => {
      if (
        codeReaderRef.current &&
        typeof codeReaderRef.current.reset === "function"
      ) {
        codeReaderRef.current.reset();
        codeReaderRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [isScanning]);

  const loadStats = useCallback(async () => {
    if (!selectedEntityId) return;

    const isSport = sports.some((sp) => (sp.id || sp._id) === selectedEntityId);
    const nameSource = isSport
      ? sports.find((sp) => (sp.id || sp._id) === selectedEntityId)
      : events.find((ev) => (ev.id || ev._id) === selectedEntityId);

    try {
      const res = await getEntityParticipants(selectedEntityId, isSport);
      const participants =
        res.data?.participants || res.data?.data?.participants || [];
      const totals = aggregateStats(participants, isSport);
      setEntityStats({
        ...totals,
        isSport,
        name:
          nameSource?.sportName ||
          nameSource?.eventName ||
          nameSource?.name ||
          selectedEntityId,
      });
    } catch (err) {
      console.error("Failed to load entity stats", err);
      setEntityStats(null);
    }
  }, [selectedEntityId, events, sports]);

  async function submitScan(rawQrData, parsed) {
    setBackendError(null);
    setBackendResult(null);
    setIsSubmitting(true);
    try {
      const entityId = selectedEntityIdRef.current;
      if (!entityId) {
        setBackendError({
          message: "Please select an event or sport before scanning.",
        });
        return;
      }
      const res = await scanTicketByQR(rawQrData, entityId);
      setBackendResult(res.data?.data ?? res.data);
      setBackendError(null);
      loadStats();
    } catch (err) {
      const msg =
        err.response?.data?.message ?? err.message ?? "Scan request failed";
      setBackendError({ message: msg });
      setBackendResult(null);
    } finally {
      setIsSubmitting(false);
      lastSentRawRef.current = "";
    }
  }

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const clearResult = () => {
    setScanResult(null);
    setScanError(null);
    setLastScannedAt(null);
    setBackendResult(null);
    setBackendError(null);
    lastSentRawRef.current = "";
    isProcessingRef.current = false;
    setIsScanning(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary/90 to-primary/70 bg-clip-text text-transparent">
              QR Scanner
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Scan QR codes for event tickets and sport registrations to
              validate and record entry.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
          {/* Scanner panel */}
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Live camera scanner
            </h2>

            <div className="relative overflow-hidden rounded-2xl bg-slate-900/95 p-4">
              <div className="absolute inset-4 rounded-2xl border-2 border-primary/80 pointer-events-none" />

              <div className="aspect-square w-full max-w-md mx-auto rounded-xl overflow-hidden bg-black/80 flex items-center justify-center">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-200/80">
                <Camera size={16} className="text-primary/80" />
                <span>
                  Position the QR code inside the frame. The scan will happen
                  automatically once the code is in focus.
                </span>
              </div>
            </div>

            <EntityStatsCard stats={entityStats} />
          </div>

          {/* Result / details panel */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-5">
                <label
                  htmlFor="entity-filter"
                  className="text-sm font-medium text-slate-700 whitespace-nowrap"
                >
                  Event/Sport filter:
                </label>
                <select
                  id="entity-filter"
                  value={selectedEntityId}
                  onChange={(e) => setSelectedEntityId(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary min-w-[220px]"
                >
                  <option value="" disabled>
                    Select event or sport
                  </option>
                  {events.length > 0 && (
                    <optgroup label="Events">
                      {events.map((ev) => (
                        <option
                          key={`ev-${ev.id || ev._id}`}
                          value={ev.id || ev._id}
                        >
                          {ev.eventName || ev.id || ev._id}
                        </option>
                      ))}
                    </optgroup>
                  )}
                  {sports.length > 0 && (
                    <optgroup label="Sports">
                      {sports.map((sp) => {
                        const id = sp.id || sp._id;
                        return (
                          <option key={`sp-${id}`} value={id}>
                            {sp.sportName || id}
                          </option>
                        );
                      })}
                    </optgroup>
                  )}
                </select>
              </div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  Scan details
                </h2>
                {(scanResult || backendResult || backendError) && (
                  <button
                    type="button"
                    onClick={clearResult}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                  >
                    Scan another
                  </button>
                )}
              </div>

              {scanError && (
                <div className="mb-3 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  <AlertTriangle size={16} className="mt-0.5" />
                  <p>{scanError}</p>
                </div>
              )}

              {isSubmitting && (
                <div className="mb-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  <Loader2 size={18} className="animate-spin" />
                  <span>Validating ticket…</span>
                </div>
              )}

              {backendError && (
                <div className="mb-3 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                  <AlertTriangle size={18} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">{backendError.message}</p>
                  </div>
                </div>
              )}

              {backendResult && (
                <div className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-900">
                  <div className="flex items-center gap-2 font-semibold text-emerald-800">
                    <CheckCircle2 size={20} />
                    {backendResult.isSport
                      ? "Sport registration"
                      : "Ticket"}{" "}
                    scanned successfully
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-emerald-700/80">Attendee</p>
                      <p className="font-medium text-emerald-900">
                        {backendResult.attendeeName}
                      </p>
                    </div>
                    <div>
                      <p className="text-emerald-700/80">Ticket #</p>
                      <p className="font-mono text-emerald-900">
                        {backendResult.ticketNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-emerald-700/80">
                        {backendResult.isSport ? "Sport" : "Event"}
                      </p>
                      <p className="font-medium text-emerald-900">
                        {backendResult.eventName}
                      </p>
                    </div>
                    <div>
                      <p className="text-emerald-700/80">Scanned at</p>
                      <p className="text-emerald-900">
                        {backendResult.scannedAt
                          ? new Date(backendResult.scannedAt).toLocaleString()
                          : "—"}
                      </p>
                    </div>
                    {backendResult.allTicketsScanned != null && (
                      <div className="col-span-2">
                        <p className="text-emerald-700/80">Party</p>
                        <p className="text-emerald-900">
                          {backendResult.allTicketsScanned
                            ? "All tickets in this order are scanned."
                            : `${backendResult.remainingTickets} ticket(s) remaining in this order.`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {scanResult ? (
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2">
                    <CheckCircle2 size={16} />
                    <div>
                      <p className="font-semibold">QR code detected</p>
                      {lastScannedAt && (
                        <p className="text-[11px] text-slate-600">
                          Last scanned at {lastScannedAt.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    The QR code has been read and sent to the server for
                    validation. Use the message above to see whether the ticket
                    was accepted or rejected.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                  <p className="font-medium text-slate-700">
                    No QR code scanned yet
                  </p>
                  <p className="mt-1 text-xs">
                    Hold a valid ticket or registration QR code in front of the
                    camera to see details here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function parseScanPayload(value) {
  let parsed = { raw: value };

  try {
    const asJson = JSON.parse(value);
    parsed.raw = JSON.stringify(asJson, null, 2);

    if (typeof asJson === "object" && asJson !== null) {
      if (asJson.type) {
        parsed.type = String(asJson.type).toLowerCase();
      }
      if (asJson.ticketNumber) {
        parsed.ticketNumber = asJson.ticketNumber;
        parsed.type = parsed.type || "event";
      }
      if (asJson.eventId) parsed.eventId = asJson.eventId;
      if (asJson.eventName) parsed.eventName = asJson.eventName;
      if (asJson.eventDate) parsed.eventDate = asJson.eventDate;
      if (asJson.ticketId || asJson.id || asJson._id) {
        parsed.id = asJson.ticketId || asJson.id || asJson._id;
      }
    }
  } catch {
    if (/sport/i.test(value)) {
      parsed.type = "sport";
    } else if (/event/i.test(value)) {
      parsed.type = "event";
    }
  }

  return parsed;
}

function filterToday(list) {
  if (!Array.isArray(list)) return [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return list.filter((item) => {
    if (!item?.date) return false;
    const d = new Date(item.date);
    if (isNaN(d.getTime())) return false;
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });
}

function aggregateStats(participants, isSport) {
  if (!Array.isArray(participants)) {
    return {
      soldTickets: 0,
      scannedTickets: 0,
      remainingTickets: 0,
      orders: 0,
      successfulOrders: 0,
      attendees: 0,
    };
  }

  let sold = 0;
  let scanned = 0;
  let orders = participants.length;
  let successfulOrders = 0;
  let attendees = 0;

  participants.forEach((p) => {
    const tickets = Number(p.numberOfTickets || 0);
    const scannedTickets = Number(p.scannedTickets || 0);
    if (p.paymentStatus === "successful") {
      successfulOrders += 1;
      sold += tickets;
    }
    scanned += scannedTickets;
    attendees += Array.isArray(p.attendeeInfo) ? p.attendeeInfo.length : 0;
  });

  const remaining = Math.max(0, sold - scanned);

  return {
    soldTickets: sold,
    scannedTickets: scanned,
    remainingTickets: remaining,
    orders,
    successfulOrders,
    attendees,
  };
}
