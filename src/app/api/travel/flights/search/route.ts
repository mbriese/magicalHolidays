import { NextResponse } from "next/server";
import { getTravelProvider } from "@/lib/travel/provider";
import type { FlightSearchParams } from "@/lib/travel/types";

export const dynamic = "force-dynamic";

function required(q: URLSearchParams, key: string) {
  const v = q.get(key);
  if (!v) throw new Error(`Missing required query param: ${key}`);
  return v;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const params: FlightSearchParams = {
      origin: required(searchParams, "origin"),
      destination: required(searchParams, "destination"),
      departDate: required(searchParams, "departDate"),
      returnDate: searchParams.get("returnDate") ?? undefined,
      adults: Number(searchParams.get("adults") ?? "1"),
      cabin: (searchParams.get("cabin") as any) ?? "ECONOMY",
      maxResults: Number(searchParams.get("maxResults") ?? "20"),
    };

    const provider = getTravelProvider();
    const data = await provider.searchFlights(params);

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 400 }
    );
  }
}
