"use client";

import { useProfile } from "@/hooks/useProfile";
import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Save, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const { profile, updateProfile } = useProfile();
  
  // Local state for the form so we can edit before saving
  const [formData, setFormData] = useState(profile);
  const [isSaved, setIsSaved] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Hydration fix
  useEffect(() => {
    setFormData(profile);
    setIsMounted(true);
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsSaved(true);
    
    // Hide the success message after 3 seconds
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  if (!isMounted) return null;

  return (
    <div className="max-w-[1000px] mx-auto px-4 md:px-10 py-10 min-h-[70vh]">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#282c3f] uppercase tracking-wider">
          Profile Details
        </h1>
        <p className="text-gray-500 mt-2">Manage your personal information and delivery address.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Left Sidebar (Static navigation) */}
        <div className="md:col-span-3 space-y-2">
          <div className="bg-[#f5f5f6] p-4 rounded-sm border-l-4 border-[#ff3f6c] font-bold text-[#282c3f]">
            Overview
          </div>
          <div className="p-4 rounded-sm text-gray-500 hover:bg-gray-50 cursor-not-allowed">
            Orders
          </div>
          <div className="p-4 rounded-sm text-gray-500 hover:bg-gray-50 cursor-not-allowed">
            Coupons
          </div>
          <div className="p-4 rounded-sm text-gray-500 hover:bg-gray-50 cursor-not-allowed">
            Saved Cards
          </div>
        </div>

        {/* Right Form Content */}
        <div className="md:col-span-9 bg-white border border-gray-100 shadow-sm rounded-sm p-6 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-sm pl-10 pr-4 py-3 text-sm focus:border-[#ff3f6c] focus:ring-1 focus:ring-[#ff3f6c] outline-hidden transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-sm pl-10 pr-4 py-3 text-sm focus:border-[#ff3f6c] focus:ring-1 focus:ring-[#ff3f6c] outline-hidden transition-all"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mobile Number</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-sm pl-10 pr-4 py-3 text-sm focus:border-[#ff3f6c] focus:ring-1 focus:ring-[#ff3f6c] outline-hidden transition-all"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Delivery Address</label>
                <div className="relative">
                  <div className="absolute left-3 top-4 text-gray-400">
                    <MapPin size={18} />
                  </div>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full border border-gray-200 rounded-sm pl-10 pr-4 py-3 text-sm focus:border-[#ff3f6c] focus:ring-1 focus:ring-[#ff3f6c] outline-hidden transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
              <AnimatePresence>
                {isSaved ? (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-green-600 font-bold text-sm"
                  >
                    <CheckCircle2 size={18} />
                    Profile Updated Successfully
                  </motion.div>
                ) : (
                  <div /> 
                )}
              </AnimatePresence>

              <button
                type="submit"
                className="bg-[#ff3f6c] text-white px-8 py-3 rounded-sm font-bold flex items-center gap-2 hover:bg-[#e63960] transition-colors"
              >
                <Save size={18} />
                SAVE DETAILS
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
