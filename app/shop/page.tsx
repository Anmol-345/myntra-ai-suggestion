"use client";

import { Suspense, useState, useEffect } from "react";
import { getProducts, Product } from "@/lib/products";
import ProductCard from "@/components/ui/ProductCard";
import FilterPanel from "@/components/shop/FilterPanel";
import { Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductSkeleton } from "@/components/ui/Skeleton";
import { useSearchParams } from "next/navigation";

// Inner component — uses useSearchParams, must be inside <Suspense>
function ShopContent() {
  const searchParams = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    occasion: "",
    gender: searchParams.get("gender") || "",
    sort: "featured",
    search: "",
  });

  // Sync filters whenever the URL query params change (e.g. clicking nav links)
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      category: searchParams.get("category") || "",
      gender: searchParams.get("gender") || "",
    }));
  }, [searchParams]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const data = await getProducts();
      setAllProducts(data);
      setIsLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    let filtered = allProducts.filter((p) => {
      if (filters.category && !p.category.toLowerCase().includes(filters.category.toLowerCase())) return false;
      if (filters.gender && p.gender !== filters.gender) return false;
      if (filters.occasion && !p.occasions.includes(filters.occasion)) return false;
      if (filters.search && !p.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });

    if (filters.sort === "price-low") filtered.sort((a, b) => a.price - b.price);
    if (filters.sort === "price-high") filtered.sort((a, b) => b.price - a.price);
    if (filters.sort === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));

    setProducts(filtered);
  }, [filters, allProducts]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-10">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left Sidebar */}
        <aside className="hidden md:block w-64 shrink-0 border-r border-gray-100 pr-8">
          <div className="sticky top-24">
            <h2 className="text-base font-bold uppercase tracking-wider mb-6">Filters</h2>
            <FilterPanel filters={filters} setFilters={setFilters} isOpen={true} onClose={() => {}} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Stats Bar */}
          <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
            <h1 className="text-lg font-bold text-gray-800">
              {filters.gender || "All"} Clothing
              <span className="text-gray-400 font-normal ml-2">- {products.length} items</span>
            </h1>
            
            <button
              onClick={() => setIsFilterOpen(true)}
              className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-sm text-sm font-bold"
            >
              <Filter size={16} /> Filters
            </button>

            <select
              value={filters.sort}
              onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
              className="hidden md:block border border-gray-200 px-4 py-2 text-sm font-bold rounded-sm outline-hidden cursor-pointer"
            >
              <option value="featured">Sort by: Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <ProductSkeleton key={i} />)}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {products.length > 0 ? (
                <motion.div
                  layout
                  className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10"
                >
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center py-40 text-center">
                  <p className="text-xl font-bold text-gray-400">No matches found for your selection.</p>
                  <button
                    onClick={() => setFilters({ category: "", occasion: "", gender: "", sort: "featured", search: "" })}
                    className="mt-6 text-[#ff3f6c] font-bold hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </AnimatePresence>
          )}
        </main>
      </div>

      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/50 z-[60]"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="fixed inset-x-0 bottom-0 bg-white z-[70] p-6 rounded-t-3xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)} className="text-gray-400">✕</button>
              </div>
              <FilterPanel
                filters={filters}
                setFilters={setFilters}
                isOpen={true}
                onClose={() => setIsFilterOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Skeleton shown while ShopContent suspends during SSR
function ShopSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <ProductSkeleton key={i} />)}
      </div>
    </div>
  );
}

// Default export wraps in Suspense — required by Next.js App Router
export default function Shop() {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <ShopContent />
    </Suspense>
  );
}
