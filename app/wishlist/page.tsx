"use client";

import { useWishlist } from "@/hooks/useWishlist";
import { getProducts, Product } from "@/lib/products";
import ProductCard from "@/components/ui/ProductCard";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WishlistPage() {
  const { items } = useWishlist();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // We need to wait for client hydration before rendering to avoid mismatch, 
  // and we need to fetch the actual product data for the IDs in the wishlist.
  useEffect(() => {
    async function fetchWishlistData() {
      setIsLoading(true);
      const allProducts = await getProducts();
      // Filter the products that are in the user's wishlist
      const filtered = allProducts.filter(p => items.includes(p.id));
      setWishlistProducts(filtered);
      setIsLoading(false);
    }
    fetchWishlistData();
  }, [items]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-10 min-h-[60vh]">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#282c3f] uppercase tracking-wider">
          My Wishlist <span className="font-normal text-gray-400 text-lg ml-2">{items.length} items</span>
        </h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-[#ff3f6c] rounded-full animate-spin" />
        </div>
      ) : wishlistProducts.length > 0 ? (
        <AnimatePresence mode="popLayout">
          <motion.div layout className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-sm">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xs mb-6 text-gray-300">
            <Heart size={40} />
          </div>
          <h2 className="text-xl font-bold text-[#282c3f] mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8 max-w-sm">
            Save items that you like in your wishlist. Review them anytime and easily move them to the bag.
          </p>
          <Link 
            href="/shop" 
            className="px-8 py-3 bg-white border border-[#ff3f6c] text-[#ff3f6c] font-bold rounded-sm hover:bg-[#ff3f6c] hover:text-white transition-colors"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      )}
    </div>
  );
}
