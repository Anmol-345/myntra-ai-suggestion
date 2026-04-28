"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCcw, Shirt, CheckCircle2, Loader2 } from "lucide-react";
import { getProducts, Product } from "@/lib/products";
import ProductCard from "@/components/ui/ProductCard";
import { cn } from "@/lib/utils";

export default function Recommendations() {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    occasion: "",
    gender: "",
    style: "",
  });

  const occasions = ["Wedding", "Party", "Casual Outing", "Gym", "Office", "Travel"];
  const styles = ["Minimal", "Trendy", "Sporty", "Traditional", "Elegant"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRecommendation(null);

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.error || !data.categories) {
        setRecommendation(null);
        console.error("Styling Error:", data.error || "Malformed response");
        alert(data.error || "AI Styling is temporarily unavailable.");
        setLoading(false);
        return;
      }

      setRecommendation(data);

      // Fetch all products to match
      const all = await getProducts();
      
      const filtered = all.filter((p) => {
        // Match category from AI with normalized API categories
        const matchesCategory = (data.categories || []).some((cat: string) => 
          p.category.toLowerCase().includes(cat.toLowerCase()) ||
          cat.toLowerCase().includes(p.category.toLowerCase())
        );
        const matchesGender = formData.gender ? p.gender === formData.gender : true;
        
        return matchesCategory && matchesGender;
      }).slice(0, 4);

      setSuggestedProducts(filtered);
    } catch (error) {
      console.error(error);
      alert("AI matching failed. Showing fallback styles.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-[#282c3f] uppercase tracking-tighter mb-4">
          Personal AI <span className="text-[#ff3f6c]">Stylist</span>
        </h1>
        <p className="text-lg text-[#7e818c] max-w-xl mx-auto font-medium">
          Answer 3 simple questions and let our AI curate your next favorite outfit from our premium collection.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Form */}
        <div className="lg:col-span-4 bg-white border border-gray-100 p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Occasion</label>
              <div className="grid grid-cols-2 gap-2">
                {occasions.map((occ) => (
                  <button
                    key={occ}
                    type="button"
                    onClick={() => setFormData({ ...formData, occasion: occ })}
                    className={cn(
                      "px-3 py-3 rounded-sm text-[10px] font-bold uppercase border transition-all",
                      formData.occasion === occ 
                        ? "bg-[#282c3f] border-[#282c3f] text-white" 
                        : "bg-white border-gray-200 text-gray-600 hover:border-[#ff3f6c]"
                    )}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Gender</label>
              <div className="flex gap-2">
                {["Men", "Women", ""].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: g })}
                    className={cn(
                      "flex-1 px-3 py-3 rounded-sm text-[10px] font-bold uppercase border transition-all",
                      formData.gender === g 
                        ? "bg-[#282c3f] border-[#282c3f] text-white" 
                        : "bg-white border-gray-200 text-gray-600 hover:border-[#ff3f6c]"
                    )}
                  >
                    {g || "Both"}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !formData.occasion}
              className="w-full h-12 bg-[#ff3f6c] text-white rounded-sm font-bold text-sm tracking-widest uppercase hover:bg-[#e63960] transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" /> : "Get Suggestions"}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 space-y-4"
              >
                <Loader2 className="w-10 h-10 text-[#ff3f6c] animate-spin" />
                <p className="font-bold text-gray-400 uppercase tracking-widest">Styling your look...</p>
              </motion.div>
            ) : recommendation ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
              >
                <div className="bg-[#282c3f] p-10 text-white rounded-none relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles size={20} className="text-[#ff3f6c]" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">AI Stylist Pick</span>
                    </div>
                    <h2 className="text-3xl font-black uppercase mb-4">{recommendation.title}</h2>
                    <p className="text-gray-400 mb-6 max-w-lg">{recommendation.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {(recommendation.categories || []).map((cat: string) => (
                        <span key={cat} className="px-3 py-1 bg-white/10 text-[10px] font-bold uppercase tracking-widest">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-black uppercase tracking-widest mb-6">Recommended for You</h3>
                  <div className="grid grid-cols-2 gap-6">
                    {suggestedProducts.map((p) => (
                      <ProductCard key={p.id} product={p as any} />
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full border-2 border-dashed border-gray-100 rounded-none flex flex-col items-center justify-center py-20">
                <Shirt size={48} className="text-gray-100 mb-4" />
                <p className="text-gray-400 font-bold uppercase text-xs">Fill the form to see AI magic</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
