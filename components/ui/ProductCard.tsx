"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Heart, Star } from "lucide-react";
import { Product } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import ProductImage from "@/components/ui/ProductImage";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <motion.div
      layout
      className="group bg-white flex flex-col relative"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden transition-transform duration-500 group-hover:scale-105">
        <ProductImage name={product.name} category={product.category} id={product.id} />
        
        {/* Wishlist Button */}
        <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-[#ff3f6c] shadow-sm transition-colors opacity-0 group-hover:opacity-100">
          <Heart size={18} />
        </button>

        {/* Quick View Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform bg-white/90 backdrop-blur-sm border-t border-gray-100 flex gap-2">
          <button 
            onClick={() => addItem(product as any)}
            className="flex-1 h-10 bg-[#ff3f6c] text-white text-xs font-bold rounded-sm flex items-center justify-center gap-2 hover:bg-[#e63960]"
          >
            <ShoppingBag size={14} /> ADD TO BAG
          </button>
        </div>

        {/* Rating Tag */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1 px-1.5 py-0.5 bg-white/90 backdrop-blur-sm rounded-sm shadow-xs">
          <span className="text-[10px] font-bold text-gray-700">4.2</span>
          <Star size={10} className="fill-green-600 text-green-600" />
          <span className="text-[10px] text-gray-400 border-l border-gray-200 pl-1">120</span>
        </div>
      </div>

      {/* Content */}
      <Link href={`/product/${product.id}`} className="p-3">
        <h3 className="font-bold text-sm text-[#282c3f] truncate mb-0.5">
          {product.name}
        </h3>
        <p className="text-xs text-[#7e818c] truncate mb-2">
          {product.description}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#282c3f]">
            {formatPrice(product.price)}
          </span>
          <span className="text-[10px] text-gray-400 line-through">
            {formatPrice(product.price * 1.5)}
          </span>
          <span className="text-[10px] font-bold text-[#ff905a]">
            (50% OFF)
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
