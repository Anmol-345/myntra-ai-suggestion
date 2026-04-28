"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ShoppingBag, User, Heart, Search, Menu, X, Sparkles } from "lucide-react";
import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";

const categories = [
  { name: "Men", href: "/shop?gender=Men" },
  { name: "Women", href: "/shop?gender=Women" },
  { name: "Home & Living", href: "/shop" },
];

function NavbarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();

  // Helper to determine if a category is active
  const isActive = (href: string) => {
    if (href === "/shop") {
      return pathname === "/shop" && !searchParams?.get("gender") && !searchParams?.get("category");
    }
    const url = new URL(href, "http://localhost");
    const hrefGender = url.searchParams.get("gender");
    const hrefCategory = url.searchParams.get("category");
    
    return pathname === "/shop" && 
      (hrefGender ? searchParams?.get("gender") === hrefGender : true) &&
      (hrefCategory ? searchParams?.get("category") === hrefCategory : true);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-xs h-20">
      <div className="max-w-[1400px] mx-auto h-full px-4 md:px-10 flex items-center justify-between gap-4">

        {/* Left: Logo & Categories */}
        <div className="flex items-center gap-10">
          <Link href="/" className="shrink-0">
            <span className="text-2xl font-black tracking-tighter text-[#282c3f]">
              <span className="text-[#ff3f6c]">MYNTRA</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-6 h-20">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className={cn(
                  "h-full flex items-center px-2 text-sm font-bold uppercase tracking-wide border-b-4 border-transparent transition-all hover:border-[#ff3f6c]",
                  isActive(cat.href) ? "border-[#ff3f6c]" : ""
                )}
              >
                {cat.name}
              </Link>
            ))}

            {/* AI Stylist CTA in nav */}
            <Link
              href="/recommendations"
              className="h-full flex items-center px-2"
            >
              <span className={cn(
                "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border-2 transition-all",
                pathname === "/recommendations"
                  ? "bg-[#ff3f6c] border-[#ff3f6c] text-white"
                  : "border-[#ff3f6c] text-[#ff3f6c] hover:bg-[#ff3f6c] hover:text-white"
              )}>
                <Sparkles size={13} /> AI Stylist
              </span>
            </Link>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-xl hidden md:block relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search for products, brands and more"
            className="w-full bg-[#f5f5f6] border-none rounded-md pl-12 pr-4 py-2.5 text-sm focus:bg-white focus:ring-1 focus:ring-gray-200 transition-all outline-hidden"
          />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col items-center gap-0.5 cursor-pointer group">
            <User size={20} className="text-gray-700 group-hover:text-[#ff3f6c]" />
            <span className="text-[10px] font-bold text-gray-700 uppercase">Profile</span>
          </div>

          <div className="hidden sm:flex flex-col items-center gap-0.5 cursor-pointer group">
            <Heart size={20} className="text-gray-700 group-hover:text-[#ff3f6c]" />
            <span className="text-[10px] font-bold text-gray-700 uppercase">Wishlist</span>
          </div>

          <Link href="/cart" className="flex flex-col items-center gap-0.5 relative group">
            <ShoppingBag size={20} className="text-gray-700 group-hover:text-[#ff3f6c]" />
            <span className="text-[10px] font-bold text-gray-700 uppercase">Bag</span>
            {totalItems() > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff3f6c] text-white text-[9px] flex items-center justify-center rounded-full font-bold">
                {totalItems()}
              </span>
            )}
          </Link>

          <button
            className="lg:hidden p-2 text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            className="fixed inset-0 bg-white z-[60] p-6 lg:hidden"
          >
            <div className="flex justify-between items-center mb-10">
              <span className="text-xl font-black">AURA<span className="text-[#ff3f6c]">STYLE</span></span>
              <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
            </div>
            <div className="flex flex-col gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className={cn(
                    "text-lg font-bold uppercase tracking-wider border-b border-gray-100 pb-4",
                    isActive(cat.href) ? "text-[#ff3f6c]" : "text-[#282c3f]"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                href="/recommendations"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-lg font-bold uppercase tracking-wider text-[#ff3f6c] border-b border-gray-100 pb-4"
              >
                <Sparkles size={18} /> AI Stylist
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<div className="h-20 bg-white border-b border-gray-100" />}>
      <NavbarContent />
    </Suspense>
  );
}
