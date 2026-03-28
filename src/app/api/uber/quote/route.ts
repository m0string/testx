import { NextResponse } from "next/server";
import { getUberDeliveryQuote } from "@/services/uber";

export async function POST(req: Request) {
    try {
        const { pickup_address, dropoff_address } = await req.json();
        const quote = await getUberDeliveryQuote(pickup_address, dropoff_address);
        return NextResponse.json(quote);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
