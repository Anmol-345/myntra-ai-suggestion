"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft, CheckCircle2, Truck, CreditCard, MapPin, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ProductImage from "@/components/ui/ProductImage";

// ─── Checkout Steps ─────────────────────────────────────────────────────────
type Step = "cart" | "address" | "payment" | "processing" | "success";

const STEPS: { key: Step; label: string; icon: any }[] = [
  { key: "address",  label: "Address",  icon: MapPin },
  { key: "payment",  label: "Payment",  icon: CreditCard },
  { key: "success",  label: "Confirmed", icon: CheckCircle2 },
];

// ─── Empty Bag ───────────────────────────────────────────────────────────────
function EmptyBag() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-32 flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300 mb-8">
        <ShoppingBag size={48} />
      </div>
      <h1 className="text-4xl font-black text-[#282c3f] uppercase mb-4">Your bag is empty</h1>
      <p className="text-gray-400 max-w-md mb-10">
        Looks like you haven't added anything yet. Start exploring!
      </p>
      <Link
        href="/shop"
        className="px-8 py-4 bg-[#ff3f6c] text-white font-bold text-sm uppercase tracking-widest hover:bg-[#e63960] transition-all flex items-center gap-2"
      >
        Explore Shop <ArrowRight size={18} />
      </Link>
    </div>
  );
}

// ─── Step Indicator ──────────────────────────────────────────────────────────
function StepBar({ current }: { current: Step }) {
  const activeIdx = STEPS.findIndex(s => s.key === current);
  return (
    <div className="flex items-center justify-center gap-0 mb-12">
      {STEPS.map((step, i) => {
        const done = i < activeIdx;
        const active = i === activeIdx;
        const Icon = step.icon;
        return (
          <div key={step.key} className="flex items-center">
            <div className={`flex flex-col items-center gap-1`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                ${done   ? "bg-[#ff3f6c] border-[#ff3f6c] text-white" : ""}
                ${active ? "bg-white border-[#ff3f6c] text-[#ff3f6c]" : ""}
                ${!done && !active ? "bg-white border-gray-200 text-gray-300" : ""}
              `}>
                <Icon size={18} />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider
                ${active || done ? "text-[#282c3f]" : "text-gray-300"}
              `}>{step.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-20 h-0.5 mb-5 mx-2 transition-all ${done ? "bg-[#ff3f6c]" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Address Form ────────────────────────────────────────────────────────────
function AddressForm({ onNext }: { onNext: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} className="max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-black uppercase text-[#282c3f] mb-8">Delivery Address</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">First Name</label>
          <input defaultValue="Rohan" className="w-full border border-gray-200 px-4 py-3 text-sm outline-hidden focus:border-[#ff3f6c]" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Last Name</label>
          <input defaultValue="Sharma" className="w-full border border-gray-200 px-4 py-3 text-sm outline-hidden focus:border-[#ff3f6c]" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Address Line</label>
          <input defaultValue="42, MG Road, Koramangala" className="w-full border border-gray-200 px-4 py-3 text-sm outline-hidden focus:border-[#ff3f6c]" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">City</label>
          <input defaultValue="Bengaluru" className="w-full border border-gray-200 px-4 py-3 text-sm outline-hidden focus:border-[#ff3f6c]" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">PIN Code</label>
          <input defaultValue="560034" className="w-full border border-gray-200 px-4 py-3 text-sm outline-hidden focus:border-[#ff3f6c]" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Phone</label>
          <input defaultValue="+91 98765 43210" className="w-full border border-gray-200 px-4 py-3 text-sm outline-hidden focus:border-[#ff3f6c]" />
        </div>
      </div>
      <button
        onClick={onNext}
        className="w-full h-14 bg-[#ff3f6c] text-white font-bold text-sm uppercase tracking-widest hover:bg-[#e63960] transition-all flex items-center justify-center gap-3 mt-8"
      >
        Continue to Payment <ArrowRight size={18} />
      </button>
    </motion.div>
  );
}

// ─── Payment Form ────────────────────────────────────────────────────────────
function PaymentForm({ total, onNext }: { total: number; onNext: () => void }) {
  const [method, setMethod] = useState<"card" | "upi" | "cod">("card");
  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} className="max-w-xl mx-auto">
      <h2 className="text-2xl font-black uppercase text-[#282c3f] mb-8">Payment</h2>

      {/* Method Selector */}
      <div className="flex gap-3 mb-8">
        {(["card", "upi", "cod"] as const).map(m => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            className={`flex-1 py-3 text-xs font-bold uppercase border transition-all
              ${method === m ? "bg-[#282c3f] border-[#282c3f] text-white" : "bg-white border-gray-200 text-gray-500 hover:border-gray-400"}`}
          >
            {m === "card" ? "Credit / Debit" : m === "upi" ? "UPI" : "Cash on Delivery"}
          </button>
        ))}
      </div>

      {method === "card" && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Card Number</label>
            <input defaultValue="4242 4242 4242 4242" className="w-full border border-gray-200 px-4 py-3 text-sm font-mono outline-hidden focus:border-[#ff3f6c]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Expiry</label>
              <input defaultValue="12 / 27" className="w-full border border-gray-200 px-4 py-3 text-sm font-mono outline-hidden focus:border-[#ff3f6c]" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">CVV</label>
              <input defaultValue="•••" className="w-full border border-gray-200 px-4 py-3 text-sm font-mono outline-hidden focus:border-[#ff3f6c]" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Name on Card</label>
            <input defaultValue="Rohan Sharma" className="w-full border border-gray-200 px-4 py-3 text-sm outline-hidden focus:border-[#ff3f6c]" />
          </div>
        </div>
      )}
      {method === "upi" && (
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">UPI ID</label>
          <input defaultValue="rohan@upi" className="w-full border border-gray-200 px-4 py-3 text-sm outline-hidden focus:border-[#ff3f6c]" />
        </div>
      )}
      {method === "cod" && (
        <div className="p-6 bg-orange-50 border border-orange-100 text-sm text-orange-800 font-medium">
          ₹{total.toLocaleString()} will be collected at the time of delivery.
        </div>
      )}

      <button
        onClick={onNext}
        className="w-full h-14 bg-[#ff3f6c] text-white font-bold text-sm uppercase tracking-widest hover:bg-[#e63960] transition-all flex items-center justify-center gap-3 mt-8"
      >
        Pay {formatPrice(total)} <ArrowRight size={18} />
      </button>
    </motion.div>
  );
}

// ─── Processing Screen ───────────────────────────────────────────────────────
function Processing() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 gap-8">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-gray-100 rounded-full" />
        <div className="absolute inset-0 border-4 border-t-[#ff3f6c] rounded-full animate-spin" />
      </div>
      <div className="text-center">
        <p className="text-xl font-black uppercase text-[#282c3f] mb-2">Processing Payment</p>
        <p className="text-gray-400 text-sm">Please wait, do not close this page...</p>
      </div>
    </motion.div>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────
function Success({ items, total }: { items: any[]; total: number }) {
  const orderId = `AS${Date.now().toString().slice(-8)}`;
  const delivery = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center py-10">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8"
      >
        <CheckCircle2 size={40} className="text-white" />
      </motion.div>

      <h2 className="text-3xl font-black uppercase text-[#282c3f] mb-2">Order Confirmed!</h2>
      <p className="text-gray-400 mb-8">
        Your order <span className="font-bold text-[#282c3f]">#{orderId}</span> has been placed successfully.
      </p>

      {/* Delivery Card */}
      <div className="bg-[#282c3f] text-white p-6 mb-8 text-left">
        <div className="flex items-center gap-3 mb-4">
          <Truck size={20} className="text-[#ff3f6c]" />
          <span className="text-xs font-bold uppercase tracking-widest">Estimated Delivery</span>
        </div>
        <p className="text-xl font-black">{delivery}</p>
        <p className="text-gray-400 text-sm mt-1">42, MG Road, Koramangala, Bengaluru - 560034</p>
      </div>

      {/* Items mini list */}
      <div className="text-left border border-gray-100 mb-8">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-50 last:border-0">
            <div className="w-14 h-14 overflow-hidden shrink-0">
              <ProductImage name={item.name} category={item.category} id={item.id} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#282c3f] truncate">{item.name}</p>
              <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</p>
          </div>
        ))}
        <div className="flex justify-between items-center p-4 bg-gray-50">
          <span className="text-sm font-bold uppercase tracking-widest">Total Paid</span>
          <span className="text-lg font-black text-[#ff3f6c]">{formatPrice(total)}</span>
        </div>
      </div>

      <Link
        href="/shop"
        className="inline-flex items-center gap-2 px-8 py-4 bg-[#ff3f6c] text-white font-bold text-sm uppercase tracking-widest hover:bg-[#e63960] transition-all"
      >
        Continue Shopping <ArrowRight size={18} />
      </Link>
    </motion.div>
  );
}

// ─── Main Cart Page ───────────────────────────────────────────────────────────
export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const [step, setStep] = useState<Step>("cart");

  const subtotal = totalPrice();
  const gst      = subtotal * 0.12;
  const total    = subtotal + gst;

  if (items.length === 0 && step === "cart") return <EmptyBag />;

  // ─── Checkout success clears cart
  function handlePayNow() {
    setStep("processing");
    setTimeout(() => {
      setStep("success");
      clearCart();
    }, 2500);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      {/* ─── Cart View ─── */}
      {step === "cart" && (
        <>
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-3xl font-black uppercase text-[#282c3f]">
              My Bag <span className="text-gray-300 font-normal">({totalItems()} items)</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Items */}
            <div className="lg:col-span-8 space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex gap-4 p-4 bg-white border border-gray-100 hover:border-gray-200 transition-all"
                  >
                    {/* SVG image thumbnail */}
                    <div className="w-28 h-36 shrink-0 overflow-hidden">
                      <ProductImage name={item.name} category={item.category} id={item.id} />
                    </div>

                    <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="font-bold text-sm text-[#282c3f] leading-snug line-clamp-2">{item.name}</h3>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 text-gray-300 hover:text-[#ff3f6c] transition-colors shrink-0"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{item.category}</p>
                        <p className="text-base font-black text-[#282c3f] mt-2">{formatPrice(item.price)}</p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 border border-gray-200">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-[#7e818c]">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <Link href="/shop" className="inline-flex items-center gap-2 text-[#ff3f6c] font-bold text-sm hover:underline py-4">
                <ArrowLeft size={16} /> Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white border border-gray-100 p-6 sticky top-24">
                <h2 className="text-base font-black uppercase tracking-widest mb-6">Price Details</h2>

                <div className="space-y-3 text-sm border-b border-gray-100 pb-6 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Price ({totalItems()} items)</span>
                    <span className="font-bold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Discount</span>
                    <span className="font-bold text-green-600">- {formatPrice(subtotal * 0.5)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Delivery Charges</span>
                    <span className="font-bold text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">GST (12%)</span>
                    <span className="font-bold">{formatPrice(gst)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="font-black uppercase tracking-wider">Total Amount</span>
                  <span className="text-xl font-black text-[#282c3f]">{formatPrice(total)}</span>
                </div>

                <p className="text-xs text-green-600 font-bold mb-6">
                  You will save {formatPrice(subtotal * 0.5)} on this order 🎉
                </p>

                <button
                  onClick={() => setStep("address")}
                  className="w-full h-12 bg-[#ff3f6c] text-white font-bold text-sm uppercase tracking-widest hover:bg-[#e63960] transition-all flex items-center justify-center gap-3"
                >
                  Place Order <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ─── Checkout Flow ─── */}
      {step !== "cart" && (
        <div>
          {(step === "address" || step === "payment") && <StepBar current={step} />}

          <AnimatePresence mode="wait">
            {step === "address"    && <AddressForm key="address" onNext={() => setStep("payment")} />}
            {step === "payment"    && <PaymentForm key="payment" total={total} onNext={handlePayNow} />}
            {step === "processing" && <Processing key="processing" />}
            {step === "success"    && <Success key="success" items={items.length > 0 ? items : []} total={total} />}
          </AnimatePresence>

          {step === "address" && (
            <button
              onClick={() => setStep("cart")}
              className="mt-6 mx-auto flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700"
            >
              <ArrowLeft size={14} /> Back to Bag
            </button>
          )}
        </div>
      )}
    </div>
  );
}
