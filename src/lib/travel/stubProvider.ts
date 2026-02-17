import type {
    TravelProvider,
    FlightSearchParams,
    HotelSearchParams,
    CarSearchParams,
    ProviderResult,
    FlightOption,
    HotelOption,
    CarOption,
  } from "./types";
  
  function money(amount: number, currency = "USD") {
    return { amount, currency };
  }
  
  export class StubProvider implements TravelProvider {
    name = "stub";
  
    async searchFlights(params: FlightSearchParams): Promise<ProviderResult<FlightOption>> {
      const adults = params.adults ?? 1;
      return {
        meta: { provider: this.name, warnings: ["Stub data (no live provider connected yet)."] },
        results: [
          {
            id: "stub-flight-1",
            price: money(249.99 * adults),
            stops: 0,
            durationMinutes: 320,
            validatingCarrier: "LH",
            segments: [
              {
                from: params.origin.toUpperCase(),
                to: params.destination.toUpperCase(),
                departAt: `${params.departDate}T08:15:00`,
                arriveAt: `${params.departDate}T13:35:00`,
                carrier: "LH",
                flightNumber: "123",
              },
            ],
          },
          {
            id: "stub-flight-2",
            price: money(199.5 * adults),
            stops: 1,
            durationMinutes: 410,
            validatingCarrier: "LH",
            segments: [
              {
                from: params.origin.toUpperCase(),
                to: "PHX",
                departAt: `${params.departDate}T09:10:00`,
                arriveAt: `${params.departDate}T10:35:00`,
                carrier: "LH",
                flightNumber: "456",
              },
              {
                from: "PHX",
                to: params.destination.toUpperCase(),
                departAt: `${params.departDate}T11:35:00`,
                arriveAt: `${params.departDate}T15:55:00`,
                carrier: "LH",
                flightNumber: "789",
              },
            ],
          },
        ].slice(0, params.maxResults ?? 20),
      };
    }
  
    async searchHotels(params: HotelSearchParams): Promise<ProviderResult<HotelOption>> {
      const adults = params.adults ?? 2;
      const rooms = params.rooms ?? 1;
  
      return {
        meta: { provider: this.name, warnings: ["Stub data (no live provider connected yet)."] },
        results: [
          {
            id: "stub-hotel-1",
            name: "Lanternlight Inn",
            starRating: 4,
            price: money(189.0 * rooms),
            locationText: params.city,
            amenities: ["Free Wi-Fi", "Pool", "Breakfast"],
          },
          {
            id: "stub-hotel-2",
            name: "Castleview Suites",
            starRating: 3,
            price: money(149.0 * rooms),
            locationText: params.city,
            amenities: ["Parking", "Family Rooms"],
          },
        ].slice(0, params.maxResults ?? 20),
      };
    }
  
    async searchCars(params: CarSearchParams): Promise<ProviderResult<CarOption>> {
      return {
        meta: { provider: this.name, warnings: ["Stub data (no live provider connected yet)."] },
        results: [
          {
            id: "stub-car-1",
            company: "Star Rentals",
            carClass: "Midsize SUV",
            price: money(59.99),
            seats: 5,
            bags: 3,
            transmission: "Automatic",
          },
          {
            id: "stub-car-2",
            company: "Sunset Cars",
            carClass: "Compact",
            price: money(39.99),
            seats: 4,
            bags: 2,
            transmission: "Automatic",
          },
        ].slice(0, params.maxResults ?? 20),
      };
    }
  }
  