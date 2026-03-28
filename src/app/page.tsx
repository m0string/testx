"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Star, ArrowRight } from "lucide-react";
import { Product, CartItem } from "@/types";
import { loadStripe } from "@stripe/stripe-js";

const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Truffle Risotto",
    description: "Creamy Arborio rice with black truffle shavings and aged parmesan.",
    price: 65,
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=800&auto=format&fit=crop",
    category: "risotto"
  },
  {
    id: "2",
    name: "A5 Wagyu Steak",
    description: "Perfectly seared Wagyu beef with a red wine reduction and gold leaf.",
    price: 150,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop",
    category: "steak"
  },
  {
    id: "3",
    name: "Beluga Caviar",
    description: "30g of the finest Beluga caviar served with traditional blinis.",
    price: 350,
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=800&auto=format&fit=crop",
    category: "caviar"
  },
  {
    id: "4",
    name: "Vintage Pinot Noir",
    description: "A rare 2012 vintage with complex notes of cherry and earth.",
    price: 120,
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop",
    category: "wine"
  }
];

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });

      const { id } = await response.json();
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

      if (stripe) {
        await stripe.redirectToCheckout({ sessionId: id });
      }
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Checkout failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen premium-gradient">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass px-8 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold gold-text">GOURMET EXPRESS</div>
        <div className="flex items-center gap-8">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 bg-[var(--surface)] px-4 py-2 rounded-full border border-[var(--border)] hover:border-[var(--accent)] transition-all"
          >
            <ShoppingCart size={20} />
            <span className="font-semibold">{cart.length}</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center px-8 sm:px-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2000&auto=format&fit=crop"
            alt="Hero Background"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl sm:text-8xl font-black mb-6 leading-tight"
          >
            Dining Elevated <br />
            <span className="gold-text">To Your Door</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 mb-8"
          >
            Experience the finest culinary creations from world-renowned chefs,
            delivered with precision through our premium Uber Direct partner.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4"
          >
            <button className="btn-primary" onClick={() => {
              const el = document.getElementById("menu");
              el?.scrollIntoView({ behavior: "smooth" });
            }}>
              Order Now <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Product Grid */}
      <section id="menu" className="px-8 sm:px-20 py-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold mb-2">Exquisite Selection</h2>
            <p className="text-gray-500">Hand-picked by our Master Chefs</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {MOCK_PRODUCTS.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -10 }}
              className="card glass flex flex-col"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[var(--accent)] border border-[var(--accent-muted)]">
                  PREMIUM
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{product.name}</h3>
                  <div className="flex items-center gap-1 text-[var(--accent)]">
                    <Star size={14} fill="currentColor" />
                    <span className="text-sm font-bold">4.9</span>
                  </div>
                </div>
                <p className="text-gray-400 text-sm mb-6 flex-1">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">${product.price}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="p-3 bg-[var(--surface)] rounded-xl border border-[var(--border)] hover:bg-[var(--accent)] hover:text-black transition-all group"
                  >
                    <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-[var(--background)] border-l border-[var(--border)] z-[101] p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Your Selection</h2>
                <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-white">Close</button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <ShoppingCart size={64} className="mb-4 opacity-10" />
                    <p>Your basket is empty of delights.</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
                      <div className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold">{item.name}</h4>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                          <span className="font-bold text-[var(--accent)]">${item.price * item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="mt-8 space-y-4">
                  <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
                    <div className="flex justify-between text-gray-400">
                      <span>Subtotal</span>
                      <span>${total}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Delivery (Uber Direct)</span>
                      <span>$15.99</span>
                    </div>
                    <div className="pt-2 mt-2 border-t border-gray-800 flex justify-between text-xl font-bold italic">
                      <span>Total</span>
                      <span className="gold-text">${total + 15.99}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="btn-primary w-full py-4 text-lg disabled:opacity-50"
                  >
                    {isLoading ? "Processing..." : "Confirm Order"}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <footer className="border-t border-[var(--border)] py-20 px-8 sm:px-20 text-center">
        <div className="gold-text text-3xl font-black mb-4">GOURMET EXPRESS</div>
        <p className="text-gray-500 mb-8">The standard in luxury dining logistics.</p>
      </footer>
    </main>
  );
}
