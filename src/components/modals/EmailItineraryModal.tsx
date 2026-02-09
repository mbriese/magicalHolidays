"use client";

import { useState, useEffect } from "react";
import type { TripApiResponse, ReservationApiResponse } from "@/types";

interface EmailItineraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: TripApiResponse & { reservations: ReservationApiResponse[] };
}

export default function EmailItineraryModal({
  isOpen,
  onClose,
  trip,
}: EmailItineraryModalProps) {
  const [recipients, setRecipients] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setRecipients([]);
      setNewEmail("");
      setMessage("");
      setError("");
      setSuccess(false);
    }
  }, [isOpen]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleAddEmail = () => {
    const trimmedEmail = newEmail.trim().toLowerCase();
    
    if (!trimmedEmail) return;
    
    if (!validateEmail(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }
    
    if (recipients.includes(trimmedEmail)) {
      setError("This email is already added");
      return;
    }
    
    setRecipients([...recipients, trimmedEmail]);
    setNewEmail("");
    setError("");
  };

  const handleRemoveEmail = (email: string) => {
    setRecipients(recipients.filter((r) => r !== email));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleSend = async () => {
    if (recipients.length === 0) {
      setError("Please add at least one recipient");
      return;
    }

    setIsSending(true);
    setError("");

    try {
      const response = await fetch("/api/email/itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tripId: trip.id,
          recipients,
          message: message.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send email");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send email");
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg transform rounded-2xl bg-white dark:bg-midnight-800 shadow-xl transition-all">
          {/* Header */}
          <div className="bg-linear-to-r from-midnight-700 to-midnight-600 rounded-t-2xl px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✉️</span>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Email Itinerary
                  </h2>
                  <p className="text-sm text-ember-300">{trip.name}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            {success ? (
              // Success State
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-xl font-semibold text-midnight-700 dark:text-white mb-2">
                  Itinerary Sent!
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Your trip itinerary has been sent to {recipients.length}{" "}
                  recipient{recipients.length > 1 ? "s" : ""}.
                </p>
                <button onClick={onClose} className="btn-magical">
                  Done
                </button>
              </div>
            ) : (
              // Form State
              <>
                {/* Recipients Section */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-midnight-700 dark:text-slate-300 mb-2">
                    Recipients
                  </label>
                  
                  {/* Added Recipients */}
                  {recipients.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {recipients.map((email) => (
                        <span
                          key={email}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-ember-100 dark:bg-ember-900/30 text-ember-700 dark:text-ember-300 rounded-full text-sm"
                        >
                          {email}
                          <button
                            onClick={() => handleRemoveEmail(email)}
                            className="hover:text-ember-900 dark:hover:text-ember-100"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Email Input */}
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => {
                        setNewEmail(e.target.value);
                        setError("");
                      }}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter email address"
                      className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-midnight-500 bg-white dark:bg-midnight-700 text-midnight-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-ember-400"
                    />
                    <button
                      onClick={handleAddEmail}
                      className="px-4 py-2 bg-ember-400 hover:bg-ember-500 text-midnight-700 font-medium rounded-lg transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Personal Message */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-midnight-700 dark:text-slate-300 mb-2">
                    Personal Message (optional)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add a personal note to include in the email..."
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-midnight-500 bg-white dark:bg-midnight-700 text-midnight-700 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-ember-400 resize-none"
                  />
                </div>

                {/* Preview Info */}
                <div className="bg-slate-50 dark:bg-midnight-700 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-medium text-midnight-700 dark:text-slate-300 mb-2">
                    Email will include:
                  </h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <li>✨ Trip overview and dates</li>
                    <li>📎 PDF itinerary attachment with all reservations</li>
                    <li>🏨 Hotel, park, flight, and car rental details</li>
                    <li>👥 Travel party information</li>
                  </ul>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={isSending || recipients.length === 0}
                    className={`btn-magical inline-flex items-center gap-2 ${
                      isSending || recipients.length === 0
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {isSending ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        Send Itinerary
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
