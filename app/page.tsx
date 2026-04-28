import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, ShoppingBag, ShieldCheck, Zap } from "lucide-react";
import { getFeaturedProducts } from "@/lib/products";
import ProductCard from "@/components/ui/ProductCard";

export default async function Home() {
  const featuredProducts = await getFeaturedProducts(8);

  return (
    <div className="flex flex-col gap-10 pb-20">
      {/* Hero Section */}
      <section className="relative aspect-[21/9] md:aspect-[21/7] w-full overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2000"
          alt="Fashion Hero"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/60 to-transparent flex items-center">
          <div className="max-w-7xl mx-auto px-6 md:px-10 w-full text-white space-y-6">
            <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter leading-tight">
              FLAT 50% OFF<br />
              <span className="text-[#ff3f6c]">SUMMER SALE</span>
            </h1>
            <p className="text-lg md:text-xl font-medium max-w-lg">
              Explore the season's most loved styles at incredible prices.
            </p>
            <div className="flex gap-4 pt-4">
              <Link
                href="/shop"
                className="px-8 py-3 bg-[#ff3f6c] text-white font-bold rounded-sm hover:bg-[#e63960] transition-all"
              >
                SHOP MEN
              </Link>
              <Link
                href="/shop"
                className="px-8 py-3 bg-white text-black font-bold rounded-sm hover:bg-gray-100 transition-all"
              >
                SHOP WOMEN
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-[1400px] mx-auto px-4 md:px-10 w-full">
        <h2 className="text-2xl font-black tracking-widest text-[#282c3f] uppercase mb-10 text-center md:text-left">
          Featured Collection
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-gray-50 py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-[#ff3f6c]">
              <ShoppingBag size={24} />
            </div>
            <h3 className="text-lg font-bold">100% Authentic</h3>
            <p className="text-sm text-gray-500">Products sourced directly from brands.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-[#ff3f6c]">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-lg font-bold">Secure Payments</h3>
            <p className="text-sm text-gray-500">Your transactions are safe with us.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-[#ff3f6c]">
              <Zap size={24} />
            </div>
            <h3 className="text-lg font-bold">Fast Delivery</h3>
            <p className="text-sm text-gray-500">Free shipping on orders above ₹999.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
