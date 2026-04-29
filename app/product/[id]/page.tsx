"use client";

import { useParams } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { getProductById, getProducts, Product } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, Heart, Shield, RefreshCcw, Truck, Star, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import ProductImage from "@/components/ui/ProductImage";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const { addItem } = useCart();
  const { toggleItem, hasItem } = useWishlist();

  const handleAddToCart = () => {
    if (product?.sizes && product.sizes.length > 0 && !selectedSize) {
      alert("Please select a size first!");
      return;
    }
    addItem(product as any);
  };

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const p = await getProductById(id as string);
      setProduct(p || null);
      
      if (p) {
        const all = await getProducts();
        setRelatedProducts(all.filter(item => item.category === p.category && item.id !== p.id).slice(0, 4));
      }
      setIsLoading(false);
    }
    loadData();
  }, [id]);

  if (isLoading) return <div className="flex items-center justify-center py-40"><div className="w-10 h-10 border-4 border-gray-200 border-t-[#ff3f6c] rounded-full animate-spin" /></div>;

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <h2 className="text-3xl font-bold mb-4">Product not found</h2>
        <Link href="/shop" className="text-[#ff3f6c] font-bold underline">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
        
        {/* Left: Single Image */}
        <div className="lg:col-span-7 flex justify-center items-start">
          <div className="w-1/2 aspect-[3/4] overflow-hidden rounded-sm">
            <ProductImage 
              name={product.name} 
              category={product.category} 
              id={product.id} 
            />
          </div>
        </div>

        {/* Right: Info */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-[#282c3f] mb-1">{product.name}</h1>
            <p className="text-xl text-gray-400">{product.brand} | {product.category}</p>
          </div>

          <div className="flex items-center gap-2 border border-gray-100 px-3 py-1.5 w-fit rounded-sm cursor-pointer hover:border-gray-300">
            <span className="text-sm font-bold">4.2</span>
            <Star size={14} className="fill-green-600 text-green-600" />
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500 font-bold">12k Ratings</span>
          </div>

          <hr className="border-gray-100" />

          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-[#282c3f]">{formatPrice(product.price)}</span>
              {product.discountPrice && product.discountPrice > product.price && (
                <>
                  <span className="text-xl text-gray-400 line-through">{formatPrice(product.discountPrice)}</span>
                  <span className="text-xl font-bold text-[#ff905a]">({Math.round(((product.discountPrice - product.price) / product.discountPrice) * 100)}% OFF)</span>
                </>
              )}
            </div>
            <p className="text-green-600 text-sm font-bold italic">Inclusive of all taxes</p>
          </div>

          {/* Size Select */}
          <div className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-wider">Select Size</h3>
              <button className="text-[#ff3f6c] text-xs font-bold uppercase">Size Chart</button>
            </div>
            <div className="flex gap-4 flex-wrap">
              {product.sizes && product.sizes.length > 0 ? (
                product.sizes.map((size) => (
                  <button 
                    key={size} 
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[3rem] px-2 h-12 rounded-full border flex items-center justify-center text-sm font-bold transition-all ${
                      selectedSize === size 
                        ? "border-[#ff3f6c] text-[#ff3f6c] bg-[#ff3f6c]/5" 
                        : "border-gray-300 hover:border-[#ff3f6c] hover:text-[#ff3f6c]"
                    }`}
                  >
                    {size}
                  </button>
                ))
              ) : (
                <span className="text-gray-500 font-bold border border-gray-200 px-4 py-2 rounded-full">One Size</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-8">
            <button
              onClick={handleAddToCart}
              className="flex-1 h-14 bg-[#ff3f6c] text-white font-bold rounded-sm flex items-center justify-center gap-3 hover:bg-[#e63960] transition-all"
            >
              <ShoppingBag size={20} /> ADD TO BAG
            </button>
            <button 
              onClick={() => toggleItem(product!.id)}
              className={`flex-[0.6] h-14 border font-bold rounded-sm flex items-center justify-center gap-3 transition-all ${
                hasItem(product!.id) 
                  ? "border-[#ff3f6c] text-[#ff3f6c] bg-[#ff3f6c]/5" 
                  : "border-gray-300 hover:border-gray-800"
              }`}
            >
              <Heart size={20} className={hasItem(product!.id) ? "fill-[#ff3f6c]" : ""} /> 
              {hasItem(product!.id) ? "WISHLISTED" : "WISHLIST"}
            </button>
          </div>

          {/* Trust */}
          <div className="pt-8 space-y-4">
            <div className="flex items-center gap-4">
              <Truck size={24} className="text-gray-400" />
              <p className="text-sm text-gray-600">Get it by <span className="font-bold">Mon, Oct 23</span></p>
            </div>
            <div className="flex items-center gap-4">
              <RefreshCcw size={24} className="text-gray-400" />
              <p className="text-sm text-gray-600">Easy 30 days return & exchange</p>
            </div>
          </div>

          <hr className="border-gray-100" />

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Product Details</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">{product.description}</p>
            
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
              {product.color && product.color.length > 0 && (
                <div>
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-1">Colors</span>
                  <span className="text-[#282c3f]">{product.color.join(", ")}</span>
                </div>
              )}
              {product.fabric && (
                <div>
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-1">Fabric</span>
                  <span className="text-[#282c3f]">{product.fabric}</span>
                </div>
              )}
              {product.fit && (
                <div>
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-1">Fit</span>
                  <span className="text-[#282c3f]">{product.fit}</span>
                </div>
              )}
              {product.occasion && product.occasion.length > 0 && (
                <div>
                  <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block mb-1">Occasion</span>
                  <span className="text-[#282c3f] capitalize">{product.occasion.join(", ")}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      <section>
        <h2 className="text-xl font-black uppercase tracking-widest mb-10">Similar Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p as any} />
          ))}
        </div>
      </section>
    </div>
  );
}
