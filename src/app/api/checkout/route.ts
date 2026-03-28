import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { CartItem } from "@/types";

export async function POST(req: Request) {
    try {
        const { items } = await req.json();

        const line_items = items.map((item: CartItem) => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.name,
                    images: [item.image],
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));

        // Add Uber Direct delivery fee
        line_items.push({
            price_data: {
                currency: "usd",
                product_data: {
                    name: "Premium Uber Direct Delivery",
                },
                unit_amount: 1599, // $15.99
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url: `${req.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get("origin")}/`,
        });

        return NextResponse.json({ id: session.id });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
