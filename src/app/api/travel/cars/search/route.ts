import { NextResponse } from "next/server";
import { getTravelProvider } from "@/lib/travel/provider";
import type { CarSearchParams } from "@/lib/travel/types";

export const dynamic = "force-dynamic";

function required(q: URLSearchParams, key: string) {
  const v = q.get(key);
  if (!v) throw new Error(`Missing required query param: ${key}`);
  return v;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const params: CarSearchParams = {
      pickupLocation: required(searchParams, "pickupLocation"),
      pickupDateTime: required(searchParams, "pickupDateTime"),
      dropoffDateTime: required(searchParams, "dropoffDateTime"),
      driverAge: Number(searchParams.get("driverAge") ?? "30"),
      maxResults: Number(searchParams.get("maxResults") ?? "20"),
    };

    const provider = getTravelProvider();
    const data = await provider.searchCars(params);

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 400 }
    );
  }
}
