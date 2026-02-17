export type Money = {
    amount: number; // e.g. 199.99
    currency: string; // e.g. "USD"
  };
  
  export type TravelMeta = {
    provider: string;
    requestId?: string;
    warnings?: string[];
    raw?: unknown; // optional: keep for debugging v1.0
  };
  
  export type FlightSearchParams = {
    origin: string;        // SNA
    destination: string;   // MCO
    departDate: string;    // YYYY-MM-DD
    returnDate?: string;   // YYYY-MM-DD
    adults?: number;       // default 1
    cabin?: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
    maxResults?: number;   // default 20
  };
  
  export type FlightOption = {
    id: string;
    price: Money;
    stops: number;
    durationMinutes: number;
    validatingCarrier?: string;
    segments: Array<{
      from: string;
      to: string;
      departAt: string; // ISO
      arriveAt: string; // ISO
      carrier?: string;
      flightNumber?: string;
    }>;
  };
  
  export type HotelSearchParams = {
    city: string;          // "Anaheim, CA" or provider-specific later
    checkIn: string;       // YYYY-MM-DD
    checkOut: string;      // YYYY-MM-DD
    adults?: number;       // default 2
    rooms?: number;        // default 1
    maxResults?: number;   // default 20
  };
  
  export type HotelOption = {
    id: string;
    name: string;
    starRating?: number;
    price: Money;
    locationText?: string;
    imageUrl?: string;
    amenities?: string[];
  };
  
  export type CarSearchParams = {
    pickupLocation: string; // "SNA" or "Anaheim, CA"
    pickupDateTime: string; // ISO
    dropoffDateTime: string;// ISO
    driverAge?: number;     // default 30
    maxResults?: number;    // default 20
  };
  
  export type CarOption = {
    id: string;
    company?: string;
    carClass?: string; // "Midsize SUV"
    price: Money;
    seats?: number;
    bags?: number;
    transmission?: "Automatic" | "Manual";
  };
  
  export type ProviderResult<T> = {
    meta: TravelMeta;
    results: T[];
  };
  
  export interface TravelProvider {
    name: string;
  
    searchFlights(params: FlightSearchParams): Promise<ProviderResult<FlightOption>>;
    searchHotels(params: HotelSearchParams): Promise<ProviderResult<HotelOption>>;
    searchCars(params: CarSearchParams): Promise<ProviderResult<CarOption>>;
  }
  