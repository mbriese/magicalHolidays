import type { TravelProvider } from "./types";
import { StubProvider } from "./stubProvider";

export function getTravelProvider(): TravelProvider {
  const provider = process.env.TRAVEL_PROVIDER?.toLowerCase() ?? "stub";

  switch (provider) {
    case "stub":
      return new StubProvider();
    // case "flightslogic":
    //   return new FlightsLogicProvider();
    default:
      return new StubProvider();
  }
}
