import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { renderToBuffer } from "@react-pdf/renderer";
import { TripItineraryPDFServer } from "@/components/pdf/TripItineraryPDFServer";
import { prisma } from "@/lib/prisma";
import React from "react";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Email from address
const EMAIL_FROM = process.env.EMAIL_FROM || "Lamplight Holidays <onboarding@resend.dev>";

interface EmailRequest {
  tripId: string;
  recipients: string[]; // Array of email addresses
  message?: string; // Optional personal message
}

export async function POST(request: NextRequest) {
  try {
    const body: EmailRequest = await request.json();
    const { tripId, recipients, message } = body;

    // Validate input
    if (!tripId) {
      return NextResponse.json(
        { error: "Trip ID is required" },
        { status: 400 }
      );
    }

    if (!recipients || recipients.length === 0) {
      return NextResponse.json(
        { error: "At least one recipient email is required" },
        { status: 400 }
      );
    }

    // Validate email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = recipients.filter((email) => !emailRegex.test(email));
    if (invalidEmails.length > 0) {
      return NextResponse.json(
        { error: `Invalid email addresses: ${invalidEmails.join(", ")}` },
        { status: 400 }
      );
    }

    // Fetch trip with reservations
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        reservations: {
          orderBy: { startDateTime: "asc" },
        },
      },
    });

    if (!trip) {
      return NextResponse.json(
        { error: "Trip not found" },
        { status: 404 }
      );
    }

    // Convert dates to strings for the PDF component
    const tripData = {
      ...trip,
      startDate: trip.startDate.toISOString(),
      endDate: trip.endDate.toISOString(),
      reservations: trip.reservations.map((r) => ({
        ...r,
        startDateTime: r.startDateTime.toISOString(),
        endDateTime: r.endDateTime.toISOString(),
      })),
    };

    // Generate PDF buffer
    console.log("Generating PDF for trip:", trip.name);
    const pdfBuffer = await renderToBuffer(
      React.createElement(TripItineraryPDFServer, { trip: tripData })
    );
    console.log("PDF generated, size:", pdfBuffer.length, "bytes");

    // Create sanitized filename
    const sanitizedName = trip.name
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase();
    const filename = `${sanitizedName}_itinerary.pdf`;

    // Format trip dates for email
    const startDate = new Date(trip.startDate).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const endDate = new Date(trip.endDate).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    // Build email HTML
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #FAF4EF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #1F2A44 0%, #344262 100%); padding: 40px 30px; text-align: center;">
        <div style="font-size: 48px; margin-bottom: 10px;">✨</div>
        <h1 style="color: #FFB957; font-size: 28px; margin: 0 0 5px 0; font-weight: bold;">Magical Holidays</h1>
        <p style="color: #ffffff; font-size: 14px; margin: 0;">Your Trip Itinerary</p>
      </td>
    </tr>
    
    <!-- Trip Info -->
    <tr>
      <td style="padding: 30px;">
        <h2 style="color: #1F2A44; font-size: 24px; margin: 0 0 10px 0;">${trip.name}</h2>
        <p style="color: #666666; font-size: 16px; margin: 0 0 5px 0;">📍 ${trip.destination}</p>
        <p style="color: #666666; font-size: 14px; margin: 0;">📅 ${startDate} - ${endDate}</p>
        
        ${message ? `
        <div style="margin-top: 20px; padding: 15px; background-color: #FAF4EF; border-radius: 8px; border-left: 4px solid #FFB957;">
          <p style="color: #2B2B2B; font-size: 14px; margin: 0; font-style: italic;">"${message}"</p>
        </div>
        ` : ""}
      </td>
    </tr>
    
    <!-- Trip Summary -->
    <tr>
      <td style="padding: 0 30px 30px;">
        <div style="background-color: #FAF4EF; border-radius: 12px; padding: 20px;">
          <h3 style="color: #1F2A44; font-size: 16px; margin: 0 0 15px 0;">Trip Overview</h3>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 8px 0;">
                <span style="color: #F8AFA6; font-size: 20px;">🏨</span>
                <span style="color: #2B2B2B; font-size: 14px; margin-left: 8px;">${trip.reservations.filter((r) => r.type === "HOTEL").length} Hotel Reservation(s)</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <span style="color: #1F2A44; font-size: 20px;">🏰</span>
                <span style="color: #2B2B2B; font-size: 14px; margin-left: 8px;">${trip.reservations.filter((r) => r.type === "PARK").length} Park Day(s)</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <span style="color: #FFB957; font-size: 20px;">🎢</span>
                <span style="color: #2B2B2B; font-size: 14px; margin-left: 8px;">${trip.reservations.filter((r) => r.type === "RIDE").length} Ride Reservation(s)</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <span style="color: #677595; font-size: 20px;">✈️</span>
                <span style="color: #2B2B2B; font-size: 14px; margin-left: 8px;">${trip.reservations.filter((r) => r.type === "FLIGHT").length} Flight(s)</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <span style="color: #A7D2B7; font-size: 20px;">🚗</span>
                <span style="color: #2B2B2B; font-size: 14px; margin-left: 8px;">${trip.reservations.filter((r) => r.type === "CAR").length} Car Rental(s)</span>
              </td>
            </tr>
          </table>
        </div>
      </td>
    </tr>
    
    <!-- Attachment Notice -->
    <tr>
      <td style="padding: 0 30px 30px;">
        <div style="background-color: #1F2A44; border-radius: 8px; padding: 20px; text-align: center;">
          <p style="color: #FFB957; font-size: 14px; margin: 0 0 5px 0; font-weight: bold;">📎 PDF Itinerary Attached</p>
          <p style="color: #E5E5E5; font-size: 12px; margin: 0;">Your complete trip itinerary with all details is attached to this email.</p>
        </div>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="background-color: #FAF4EF; padding: 20px 30px; text-align: center;">
        <p style="color: #666666; font-size: 12px; margin: 0;">
          ✨ Sent with love from <strong style="color: #1F2A44;">Magical Holidays</strong> ✨
        </p>
        <p style="color: #999999; font-size: 11px; margin: 10px 0 0 0;">
          Plan your perfect trip at magicalholidays.com
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    // Send email via Resend
    console.log("Sending email to:", recipients.join(", "));
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: recipients,
      subject: `✨ Your Trip Itinerary: ${trip.name}`,
      html: emailHtml,
      attachments: [
        {
          filename,
          content: pdfBuffer,
        },
      ],
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: `Failed to send email: ${error.message}` },
        { status: 500 }
      );
    }

    console.log("Email sent successfully, ID:", data?.id);

    return NextResponse.json({
      success: true,
      message: `Itinerary sent to ${recipients.length} recipient(s)`,
      emailId: data?.id,
    });
  } catch (error) {
    console.error("Error sending itinerary email:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send email" },
      { status: 500 }
    );
  }
}
