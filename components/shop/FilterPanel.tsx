"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";

// Static filter options — no API import needed
const CATEGORIES = ["men", "women", "jewelery"];
const OCCASIONS  = ["casual", "party", "formal", "gym", "office", "travel", "wedding"];
const GENDERS    = ["Men", "Women", "Unisex"];

interface FilterPanelProps {
  filters: {
    category: string;
    occasion: string;
    gender: string;
    sort: string;
    search?: string;
  };
  setFilters: (updater: (prev: any) => any) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterPanel({ filters, setFilters, isOpen, onClose }: FilterPanelProps) {
  const updateFilter = (key: string, value: string) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  const ACTIVE  = "bg-[#282c3f] border-[#282c3f] text-white";
  const PASSIVE = "bg-white border-gray-200 text-gray-600 hover:border-[#ff3f6c]";
  const BTN     = "px-3 py-2 text-xs font-bold uppercase border transition-all";

  return (
    <div className="space-y-8">

      {/* Category */}
      <section>
        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Category</h3>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => updateFilter("category", "")} className={cn(BTN, filters.category === "" ? ACTIVE : PASSIVE)}>
            All
          </button>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => updateFilter("category", cat)} className={cn(BTN, filters.category === cat ? ACTIVE : PASSIVE)}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {/* Gender */}
      <section>
        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Gender</h3>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => updateFilter("gender", "")} className={cn(BTN, filters.gender === "" ? ACTIVE : PASSIVE)}>
            All
          </button>
          {GENDERS.map(g => (
            <button key={g} onClick={() => updateFilter("gender", g)} className={cn(BTN, filters.gender === g ? ACTIVE : PASSIVE)}>
              {g}
            </button>
          ))}
        </div>
      </section>

      {/* Occasion */}
      <section>
        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Occasion</h3>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => updateFilter("occasion", "")} className={cn(BTN, filters.occasion === "" ? ACTIVE : PASSIVE)}>
            Any
          </button>
          {OCCASIONS.map(occ => (
            <button key={occ} onClick={() => updateFilter("occasion", occ)} className={cn(BTN, filters.occasion === occ ? ACTIVE : PASSIVE)}>
              {occ.charAt(0).toUpperCase() + occ.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {/* Sort */}
      <section>
        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Sort By</h3>
        <select
          value={filters.sort}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="w-full border border-gray-200 px-3 py-2 text-xs font-bold uppercase outline-hidden focus:border-[#ff3f6c] cursor-pointer"
        >
          <option value="featured">Recommended</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name">Name A–Z</option>
        </select>
      </section>

    </div>
  );
}
