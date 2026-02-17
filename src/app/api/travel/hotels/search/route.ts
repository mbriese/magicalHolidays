import { NextResponse } from "next/server";
import { getTravelProvider } from "@/lib/travel/provider";
import type { HotelSearchParams } from "@/lib/travel/types";

export const dynamic = "force-dynamic";

function required(q: URLSearchParams, key: string) {
  const v = q.get(key);
  if (!v) throw new Error(`Missing required query param: ${key}`);
  return v;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const params: HotelSearchParams = {
      city: required(searchParams, "city"),
      checkIn: required(searchParams, "checkIn"),
      checkOut: required(searchParams, "checkOut"),
      adults: Number(searchParams.get("adults") ?? "2"),
      rooms: Number(searchParams.get("rooms") ?? "1"),
      maxResults: Number(searchParams.get("maxResults") ?? "20"),
    };

    const provider = getTravelProvider();
    const data = await provider.searchHotels(params);

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 400 }
    );
  }
}
