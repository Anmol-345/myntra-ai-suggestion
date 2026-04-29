import { fetchProducts } from "./api";

export type { Product } from "./api";

export async function getProducts() {
  return await fetchProducts();
}

export async function getProductById(id: string) {
  const products = await fetchProducts();
  return products.find((p) => p.id === id);
}

export async function getFeaturedProducts(count = 8) {
  const products = await fetchProducts();
  return products.slice(0, count);
}

export async function getCategories() {
  const products = await fetchProducts();
  return Array.from(new Set(products.map((p) => p.category)));
}

export async function getOccasions() {
  const products = await fetchProducts();
  return Array.from(new Set(products.flatMap((p) => p.occasion || [])));
}

export async function getGenders() {
  const products = await fetchProducts();
  return Array.from(new Set(products.map((p) => p.gender)));
}
