/**
 * Uber Direct Service Mockup
 * In a real application, this would use the Uber Direct API via fetch/axios.
 */

export interface DeliveryQuote {
    id: string;
    quote_id: string;
    expires_at: number;
    fee: number;
    currency: string;
    estimated_pickup_time: number;
    estimated_delivery_time: number;
}

export const getUberDeliveryQuote = async (pickup_address: string, dropoff_address: string): Promise<DeliveryQuote> => {
    // Mock API call to Uber Direct
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: `quote_${Math.random().toString(36).substr(2, 9)}`,
                quote_id: `uber_quote_${Date.now()}`,
                expires_at: Date.now() + 600000,
                fee: 15.99,
                currency: "USD",
                estimated_pickup_time: Date.now() + 900000,
                estimated_delivery_time: Date.now() + 2700000,
            });
        }, 800);
    });
};

export const createUberDelivery = async (quote_id: string, order_id: string) => {
    // Mock API call to create a delivery
    console.log(`Creating Uber Direct delivery for quote ${quote_id} and order ${order_id}`);
    return {
        delivery_id: `del_${Math.random().toString(36).substr(2, 9)}`,
        status: "pending",
    };
};
