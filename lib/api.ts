import productsData from "../data/products.json";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  gender: string;
  price: number;
  discountPrice: number;
  color: string[];
  fabric: string | null;
  fit: string | null;
  occasion: string[];
  sizes: string[];
  imageUrl: string;
  description: string;
}

export async function fetchProducts(): Promise<Product[]> {
  return productsData as Product[];
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const products = productsData as Product[];
  return products.find(p => p.id === id) || null;
}
