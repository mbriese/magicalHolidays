"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { TripItineraryPDF } from "./TripItineraryPDF";
import type { TripApiResponse, ReservationApiResponse } from "@/types";

interface DownloadItineraryButtonProps {
  trip: TripApiResponse & { reservations: ReservationApiResponse[] };
  includeParticipantPages?: boolean;
  className?: string;
}

export const DownloadItineraryButton = ({
  trip,
  includeParticipantPages = false,
  className = "",
}: DownloadItineraryButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    
    try {
      console.log("Starting PDF generation for trip:", trip.name);
      console.log("Trip data:", JSON.stringify(trip, null, 2));
      
      // Generate the PDF blob
      const pdfDoc = pdf(
        <TripItineraryPDF
          trip={trip}
          includeParticipantPages={includeParticipantPages}
        />
      );
      
      console.log("PDF document created, generating blob...");
      const blob = await pdfDoc.toBlob();
      console.log("Blob generated, size:", blob.size);

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      // Create filename from trip name
      const sanitizedName = trip.name
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase();
      link.download = `${sanitizedName}_itinerary.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      URL.revokeObjectURL(url);
      console.log("PDF download triggered successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      console.error("Error details:", error instanceof Error ? error.message : String(error));
      alert(`There was an error generating the PDF: ${error instanceof Error ? error.message : "Unknown error"}. Check the browser console for details.`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className={`btn-magical inline-flex items-center gap-2 ${className} ${
        isGenerating ? "opacity-70 cursor-wait" : ""
      }`}
    >
      {isGenerating ? (
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
          Generating PDF...
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
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Download Itinerary PDF
        </>
      )}
    </button>
  );
};

export default DownloadItineraryButton;
