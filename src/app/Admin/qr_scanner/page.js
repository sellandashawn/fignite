"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera, RefreshCw, Info, CheckCircle2, AlertTriangle } from "lucide-react";
import { BrowserQRCodeReader } from "@zxing/browser";

const SAMPLE_RESULT = {
  type: "event",
  id: "TCK-2025-000123",
  raw: JSON.stringify(
    {
      type: "event",
      ticketId: "TCK-2025-000123",
      holderName: "Saman De sliva",
      eventName: "Opening Ceremony",
      date: "2026-03-1T17:30:00Z",
      gate: "Main Entrance A",
      status: "Scanned",
    },
    null,
    2
  ),
};

export default function QrScannerPage() {
  const [scanResult, setScanResult] = useState(SAMPLE_RESULT);
  const [scanError, setScanError] = useState(null);
  const [lastScannedAt, setLastScannedAt] = useState(new Date());
  const [isScanning, setIsScanning] = useState(true);
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (!isScanning) return;

    const setupScanner = async () => {
      try {
        setScanError(null);

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setScanError(
            "Camera API is not supported in this browser. Please use a modern browser like Chrome or Edge."
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
          await videoRef.current.play();
        }

        const codeReader = new BrowserQRCodeReader();
        codeReaderRef.current = codeReader;

        const videoInputDevices = await BrowserQRCodeReader.listVideoInputDevices();
        const deviceId = videoInputDevices[0]?.deviceId;

        await codeReader.decodeFromVideoDevice(
          deviceId || undefined,
          videoRef.current,
          (result, err) => {
            if (result) {
              setScanError(null);
              setScanResult(parseScanPayload(result.getText()));
              setLastScannedAt(new Date());
            } else if (err && !(err.name === "NotFoundException")) {
              console.error("QR scan error:", err);
            }
          }
        );
      } catch (error) {
        console.error("QR setup error:", error);
        setScanError(
          "We couldn't access your camera. Please ensure camera permissions are allowed and a camera is connected."
        );
      }
    };

    setupScanner();

    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
        codeReaderRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [isScanning]);

  const clearResult = () => {
    setScanResult(null);
    setScanError(null);
    setLastScannedAt(null);
    setIsScanning(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary/90 to-primary/70 bg-clip-text text-transparent">
              QR Scanner
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Scan QR codes for event tickets and sport registrations to validate entries.
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

            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-xs text-slate-600 flex gap-3">
              <Info size={16} className="mt-0.5 text-primary/80" />
              <ul className="space-y-1">
                <li>Ensure your browser has permission to access the camera.</li>
                <li>
                  For best results, use a device with a rear camera and scan in a
                  well‑lit environment.
                </li>
                <li>
                  QR codes are expected to contain ticket or registration details for
                  events and sports (for example, a ticket ID).
                </li>
              </ul>
            </div>
          </div>

          {/* Result / details panel */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                Scan details
              </h2>

              {scanError && (
                <div className="mb-3 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  <AlertTriangle size={16} className="mt-0.5" />
                  <p>{scanError}</p>
                </div>
              )}

              {scanResult ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-emerald-800 text-xs">
                    <CheckCircle2 size={16} />
                    <div>
                      <p className="font-semibold">QR code scanned</p>
                      {lastScannedAt && (
                        <p className="text-[11px] text-emerald-900/70">
                          {lastScannedAt.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {scanResult.type && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg bg-slate-50 px-3 py-2">
                        <p className="text-[11px] uppercase tracking-wide text-slate-400">
                          Type
                        </p>
                        <p className="mt-0.5 font-semibold text-slate-800">
                          {scanResult.type === "event"
                            ? "Event Ticket"
                            : scanResult.type === "sport"
                            ? "Sport Registration"
                            : scanResult.type}
                        </p>
                      </div>
                      {scanResult.id && (
                        <div className="rounded-lg bg-slate-50 px-3 py-2">
                          <p className="text-[11px] uppercase tracking-wide text-slate-400">
                            Reference ID
                          </p>
                          <p className="mt-0.5 font-mono text-xs text-slate-800 break-all">
                            {scanResult.id}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Sample ticket details (static for now) */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs">
                    <p className="mb-2 text-[11px] uppercase tracking-wide text-slate-400">
                      Sample ticket details
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[11px] text-slate-500">Ticket ID</p>
                        <p className="font-mono text-xs text-slate-900">
                          {scanResult.id || "TCK-2025-000123"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-500">Holder name</p>
                        <p className="text-xs font-semibold text-slate-900">
                          Saman De Silva
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-500">
                          {scanResult.type === "sport" ? "Sport" : "Event"}
                        </p>
                        <p className="text-xs font-semibold text-slate-900">
                          {scanResult.type === "sport"
                            ? "Inter University Football Finals"
                            : "Opening Ceremony"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-500">Date &amp; time</p>
                        <p className="text-xs text-slate-900">
                          01 Jan 2026, 5.30 PM
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-500">Status</p>
                        <p className="text-xs font-semibold text-emerald-700">
                          Scanned
                        </p>
                      </div>
                    </div>
                  </div>

                  
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

