"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { TripApiResponse, ReservationApiResponse } from "@/types";

// Using built-in Helvetica font family for reliability
// Available: Courier, Helvetica, Times-Roman (and their Bold/Oblique variants)

// Lamplight Holidays color palette
const colors = {
  midnight: "#1F2A44",
  midnightLight: "#344262",
  ember: "#FFB957",
  emberLight: "#FFE4B8",
  rose: "#F8AFA6",
  sage: "#A7D2B7",
  background: "#FAF4EF",
  text: "#2B2B2B",
  textLight: "#666666",
  white: "#FFFFFF",
  border: "#E5E5E5",
};

// Reservation type styling
const reservationStyles = {
  HOTEL: { color: colors.rose, icon: "🏨", label: "Hotel" },
  PARK: { color: colors.midnight, icon: "🏰", label: "Park Day" },
  RIDE: { color: colors.ember, icon: "🎢", label: "Ride / Attraction" },
  FLIGHT: { color: "#677595", icon: "✈️", label: "Flight" },
  CAR: { color: colors.sage, icon: "🚗", label: "Car Rental" },
};

// PDF Styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.background,
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: colors.text,
  },
  // Cover Page
  coverPage: {
    backgroundColor: colors.midnight,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  coverLogo: {
    fontSize: 48,
    marginBottom: 20,
  },
  coverTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 36,
    fontWeight: 700,
    color: colors.ember,
    textAlign: "center",
    marginBottom: 10,
  },
  coverSubtitle: {
    fontSize: 18,
    color: colors.white,
    textAlign: "center",
    marginBottom: 30,
  },
  coverDestination: {
    fontFamily: "Helvetica-Bold",
    fontSize: 24,
    color: colors.white,
    textAlign: "center",
    marginBottom: 8,
  },
  coverDates: {
    fontSize: 14,
    color: colors.emberLight,
    textAlign: "center",
    marginBottom: 40,
  },
  coverFooter: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    textAlign: "center",
  },
  coverBrand: {
    fontFamily: "Helvetica-Bold",
    fontSize: 16,
    color: colors.ember,
  },
  // Section Headers
  sectionHeader: {
    backgroundColor: colors.midnight,
    padding: 12,
    marginBottom: 16,
    borderRadius: 4,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 18,
    fontWeight: 700,
    color: colors.ember,
  },
  sectionIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  // Page Header
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: colors.ember,
  },
  pageHeaderTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
    fontWeight: 700,
    color: colors.midnight,
  },
  pageHeaderSubtitle: {
    fontSize: 10,
    color: colors.textLight,
  },
  // Travel Party
  travelPartyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  participantCard: {
    width: "48%",
    backgroundColor: colors.white,
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  participantName: {
    fontSize: 12,
    fontWeight: 700,
    color: colors.midnight,
    marginBottom: 4,
  },
  participantIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  // Reservation Cards
  reservationCard: {
    backgroundColor: colors.white,
    borderRadius: 6,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  reservationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  reservationTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: colors.midnight,
    flex: 1,
  },
  reservationType: {
    fontSize: 9,
    color: colors.textLight,
    backgroundColor: colors.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  reservationDetails: {
    marginTop: 6,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 9,
    color: colors.textLight,
    width: 80,
  },
  detailValue: {
    fontSize: 10,
    color: colors.text,
    flex: 1,
  },
  confirmationNumber: {
    fontSize: 10,
    fontWeight: 700,
    color: colors.midnight,
    backgroundColor: colors.emberLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  guestList: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  guestLabel: {
    fontSize: 9,
    color: colors.textLight,
    marginBottom: 4,
  },
  guestNames: {
    fontSize: 10,
    color: colors.text,
  },
  // Notes section
  notesSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  notesLabel: {
    fontSize: 9,
    color: colors.textLight,
    marginBottom: 2,
  },
  notesText: {
    fontSize: 10,
    color: colors.text,
    fontStyle: "italic",
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 25,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  footerBrand: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: colors.midnight,
  },
  footerPage: {
    fontSize: 9,
    color: colors.textLight,
  },
  // Empty state
  emptyState: {
    padding: 20,
    textAlign: "center",
    color: colors.textLight,
    fontStyle: "italic",
  },
  // Per-participant page
  participantPageHeader: {
    backgroundColor: colors.midnight,
    padding: 16,
    marginBottom: 20,
    borderRadius: 6,
    alignItems: "center",
  },
  participantPageTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 20,
    fontWeight: 700,
    color: colors.ember,
    marginTop: 8,
  },
  participantPageIcon: {
    fontSize: 32,
  },
});

// Helper functions
const formatDate = (dateStr: string, includeTime = false) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  if (includeTime) {
    options.hour = "numeric";
    options.minute = "2-digit";
  }
  return date.toLocaleDateString("en-US", options);
};

const formatDateRange = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const startFormatted = startDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const endFormatted = endDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `${startFormatted} - ${endFormatted}`;
};

// Props interface
interface TripItineraryPDFProps {
  trip: TripApiResponse & { reservations: ReservationApiResponse[] };
  includeParticipantPages?: boolean;
}

// Cover Page Component
const CoverPage = ({ trip }: { trip: TripItineraryPDFProps["trip"] }) => (
  <Page size="LETTER" style={styles.coverPage}>
    <Text style={styles.coverLogo}>✨</Text>
    <Text style={styles.coverTitle}>{trip.name}</Text>
    <Text style={styles.coverSubtitle}>Trip Itinerary</Text>
    <Text style={styles.coverDestination}>📍 {trip.destination}</Text>
    <Text style={styles.coverDates}>
      {formatDateRange(trip.startDate, trip.endDate)}
    </Text>
    <View style={styles.coverFooter}>
      <Text style={styles.coverBrand}>✨ Magical Holidays ✨</Text>
    </View>
  </Page>
);

// Page Header Component
const PageHeader = ({ trip }: { trip: TripItineraryPDFProps["trip"] }) => (
  <View style={styles.pageHeader}>
    <View>
      <Text style={styles.pageHeaderTitle}>{trip.name}</Text>
      <Text style={styles.pageHeaderSubtitle}>{trip.destination}</Text>
    </View>
    <Text style={styles.pageHeaderSubtitle}>
      {formatDateRange(trip.startDate, trip.endDate)}
    </Text>
  </View>
);

// Page Footer Component
const PageFooter = ({ pageNumber }: { pageNumber: number }) => (
  <View style={styles.footer} fixed>
    <Text style={styles.footerBrand}>✨ Magical Holidays</Text>
    <Text style={styles.footerPage}>Page {pageNumber}</Text>
  </View>
);

// Reservation Card Component
const ReservationCard = ({ reservation }: { reservation: ReservationApiResponse }) => {
  const typeStyle = reservationStyles[reservation.type];
  
  return (
    <View style={[styles.reservationCard, { borderLeftColor: typeStyle.color }]}>
      <View style={styles.reservationHeader}>
        <Text style={styles.reservationTitle}>
          {typeStyle.icon} {reservation.title}
        </Text>
        <Text style={styles.reservationType}>{typeStyle.label}</Text>
      </View>
      
      <View style={styles.reservationDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date/Time:</Text>
          <Text style={styles.detailValue}>
            {formatDate(reservation.startDateTime, true)}
          </Text>
        </View>
        
        {reservation.endDateTime !== reservation.startDateTime && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>End:</Text>
            <Text style={styles.detailValue}>
              {formatDate(reservation.endDateTime, true)}
            </Text>
          </View>
        )}
        
        {reservation.location && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location:</Text>
            <Text style={styles.detailValue}>{reservation.location}</Text>
          </View>
        )}
      </View>
      
      {reservation.confirmationNumber && (
        <Text style={styles.confirmationNumber}>
          Confirmation: {reservation.confirmationNumber}
        </Text>
      )}
      
      {reservation.guests && reservation.guests.length > 0 && (
        <View style={styles.guestList}>
          <Text style={styles.guestLabel}>Participants:</Text>
          <Text style={styles.guestNames}>{reservation.guests.join(", ")}</Text>
        </View>
      )}
      
      {reservation.notes && (
        <View style={styles.notesSection}>
          <Text style={styles.notesLabel}>Notes:</Text>
          <Text style={styles.notesText}>{reservation.notes}</Text>
        </View>
      )}
    </View>
  );
};

// Travel Party Page Component
const TravelPartyPage = ({ trip }: { trip: TripItineraryPDFProps["trip"] }) => {
  const allGuests = new Set<string>();
  
  // Collect guests from trip level
  trip.guests?.forEach((g) => allGuests.add(g));
  
  // Collect guests from all reservations
  trip.reservations?.forEach((r) => {
    r.guests?.forEach((g) => allGuests.add(g));
  });
  
  const guestList = Array.from(allGuests);
  
  return (
    <Page size="LETTER" style={styles.page}>
      <PageHeader trip={trip} />
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>👨‍👩‍👧‍👦 Travel Party</Text>
      </View>
      
      {guestList.length > 0 ? (
        <View style={styles.travelPartyGrid}>
          {guestList.map((guest, index) => (
            <View key={index} style={styles.participantCard}>
              <Text style={styles.participantIcon}>
                {index % 4 === 0 ? "👤" : index % 4 === 1 ? "👩" : index % 4 === 2 ? "👨" : "🧒"}
              </Text>
              <Text style={styles.participantName}>{guest}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.emptyState}>No participants added yet</Text>
      )}
      
      <PageFooter pageNumber={2} />
    </Page>
  );
};

// Accommodations Page Component
const AccommodationsPage = ({ trip }: { trip: TripItineraryPDFProps["trip"] }) => {
  const hotels = trip.reservations?.filter((r) => r.type === "HOTEL") || [];
  
  return (
    <Page size="LETTER" style={styles.page}>
      <PageHeader trip={trip} />
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🏨 Accommodations</Text>
      </View>
      
      {hotels.length > 0 ? (
        hotels.map((hotel) => (
          <ReservationCard key={hotel.id} reservation={hotel} />
        ))
      ) : (
        <Text style={styles.emptyState}>No hotel reservations</Text>
      )}
      
      <PageFooter pageNumber={3} />
    </Page>
  );
};

// Transportation Page Component
const TransportationPage = ({ trip }: { trip: TripItineraryPDFProps["trip"] }) => {
  const flights = trip.reservations?.filter((r) => r.type === "FLIGHT") || [];
  const cars = trip.reservations?.filter((r) => r.type === "CAR") || [];
  
  return (
    <Page size="LETTER" style={styles.page}>
      <PageHeader trip={trip} />
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🚀 Transportation</Text>
      </View>
      
      {flights.length > 0 && (
        <>
          <Text style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, color: colors.midnight }}>
            ✈️ Flights
          </Text>
          {flights.map((flight) => (
            <ReservationCard key={flight.id} reservation={flight} />
          ))}
        </>
      )}
      
      {cars.length > 0 && (
        <>
          <Text style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, marginTop: 12, color: colors.midnight }}>
            🚗 Car Rentals
          </Text>
          {cars.map((car) => (
            <ReservationCard key={car.id} reservation={car} />
          ))}
        </>
      )}
      
      {flights.length === 0 && cars.length === 0 && (
        <Text style={styles.emptyState}>No transportation reservations</Text>
      )}
      
      <PageFooter pageNumber={4} />
    </Page>
  );
};

// Park Days Page Component
const ParkDaysPage = ({ trip }: { trip: TripItineraryPDFProps["trip"] }) => {
  const parks = trip.reservations?.filter((r) => r.type === "PARK") || [];
  const rides = trip.reservations?.filter((r) => r.type === "RIDE") || [];
  
  // Sort by date
  const sortedParks = [...parks].sort(
    (a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
  );
  const sortedRides = [...rides].sort(
    (a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
  );
  
  return (
    <Page size="LETTER" style={styles.page}>
      <PageHeader trip={trip} />
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🏰 Park Days & Attractions</Text>
      </View>
      
      {sortedParks.length > 0 && (
        <>
          <Text style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, color: colors.midnight }}>
            🏰 Park Reservations
          </Text>
          {sortedParks.map((park) => (
            <ReservationCard key={park.id} reservation={park} />
          ))}
        </>
      )}
      
      {sortedRides.length > 0 && (
        <>
          <Text style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, marginTop: 12, color: colors.midnight }}>
            🎢 Rides & Attractions
          </Text>
          {sortedRides.map((ride) => (
            <ReservationCard key={ride.id} reservation={ride} />
          ))}
        </>
      )}
      
      {sortedParks.length === 0 && sortedRides.length === 0 && (
        <Text style={styles.emptyState}>No park reservations</Text>
      )}
      
      <PageFooter pageNumber={5} />
    </Page>
  );
};

// Per-Participant Page Component
const ParticipantPage = ({
  guest,
  trip,
  pageNumber,
}: {
  guest: string;
  trip: TripItineraryPDFProps["trip"];
  pageNumber: number;
}) => {
  // Filter reservations that include this guest
  const guestReservations = trip.reservations?.filter(
    (r) => r.guests?.includes(guest)
  ) || [];
  
  // Sort by date
  const sortedReservations = [...guestReservations].sort(
    (a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
  );
  
  return (
    <Page size="LETTER" style={styles.page}>
      <View style={styles.participantPageHeader}>
        <Text style={styles.participantPageIcon}>👤</Text>
        <Text style={styles.participantPageTitle}>{guest}</Text>
      </View>
      
      <PageHeader trip={trip} />
      
      {sortedReservations.length > 0 ? (
        sortedReservations.map((reservation) => (
          <ReservationCard key={reservation.id} reservation={reservation} />
        ))
      ) : (
        <Text style={styles.emptyState}>
          No specific reservations for {guest}
        </Text>
      )}
      
      <PageFooter pageNumber={pageNumber} />
    </Page>
  );
};

// Main PDF Document Component
export const TripItineraryPDF = ({
  trip,
  includeParticipantPages = false,
}: TripItineraryPDFProps) => {
  // Collect all unique guests
  const allGuests = new Set<string>();
  trip.guests?.forEach((g) => allGuests.add(g));
  trip.reservations?.forEach((r) => {
    r.guests?.forEach((g) => allGuests.add(g));
  });
  const guestList = Array.from(allGuests);
  
  return (
    <Document
      title={`${trip.name} - Trip Itinerary`}
      author="Magical Holidays"
      subject={`Itinerary for ${trip.destination}`}
    >
      <CoverPage trip={trip} />
      <TravelPartyPage trip={trip} />
      <AccommodationsPage trip={trip} />
      <TransportationPage trip={trip} />
      <ParkDaysPage trip={trip} />
      
      {includeParticipantPages &&
        guestList.map((guest, index) => (
          <ParticipantPage
            key={guest}
            guest={guest}
            trip={trip}
            pageNumber={6 + index}
          />
        ))}
    </Document>
  );
};

export default TripItineraryPDF;
