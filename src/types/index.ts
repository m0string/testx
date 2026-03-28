export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: "steak" | "risotto" | "caviar" | "wine";
}

export interface CartItem extends Product {
    quantity: number;
}

export interface Order {
    id: string;
    userId: string;
    items: CartItem[];
    total: number;
    status: "pending" | "paid" | "preparing" | "delivered";
    paymentIntentId?: string;
    deliveryQuote?: any;
    createdAt: number;
}
