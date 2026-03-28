import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Order, CartItem } from "@/types";

export const useOrders = () => {
    const [loading, setLoading] = useState(false);

    const createOrder = async (userId: string, items: CartItem[], total: number) => {
        setLoading(true);
        try {
            const docRef = await addDoc(collection(db, "orders"), {
                userId,
                items,
                total,
                status: "pending",
                createdAt: serverTimestamp(),
            });
            return docRef.id;
        } catch (err) {
            console.error("Error creating order:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { createOrder, loading };
};
