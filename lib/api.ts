export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  occasions: string[];
  gender: string;
}

const OCCASIONS = ["casual", "party", "formal", "gym", "office", "travel", "wedding"];

// Seeded randomness so images are stable across renders
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const res = await fetch('https://fakestoreapi.com/products', {
      cache: 'force-cache', // Works in both Server and Client components
    });

    if (!res.ok) throw new Error(`FakeStoreAPI returned ${res.status}`);

    const data: any[] = await res.json();

    // Only include clothing & jewelery — filter out electronics
    const clothingItems = data.filter((item: any) =>
      item.category === "men's clothing" ||
      item.category === "women's clothing" ||
      item.category === "jewelery"
    );

    return clothingItems.map((item: any, idx: number) => {
      // Normalize gender
      let gender = "Unisex";
      if (item.category === "men's clothing") gender = "Men";
      if (item.category === "women's clothing") gender = "Women";

      // Use seeded (stable) randomness so occasions don't change on every render
      const seed1 = item.id * 7;
      const seed2 = item.id * 13;
      const occasionIdx1 = Math.floor(seededRandom(seed1) * OCCASIONS.length);
      const occasionIdx2 = Math.floor(seededRandom(seed2) * OCCASIONS.length);
      const occasions = seededRandom(item.id * 3) > 0.5
        ? [...new Set([OCCASIONS[occasionIdx1], OCCASIONS[occasionIdx2]])]
        : [OCCASIONS[occasionIdx1]];

      return {
        id: item.id.toString(),
        name: item.title,
        price: Math.round(item.price * 80), // Convert USD → approx INR
        category: item.category.replace("'s clothing", "").trim(),
        image: item.image,                  // Unique image per product from FakeStoreAPI
        description: item.description,
        occasions,
        gender,
      };
    });
  } catch (error) {
    console.error("Failed to fetch products from FakeStoreAPI:", error);
    return [];
  }
}

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
      cache: 'force-cache',
    });
    if (!res.ok) return null;
    const item = await res.json();

    let gender = "Unisex";
    if (item.category === "men's clothing") gender = "Men";
    if (item.category === "women's clothing") gender = "Women";

    return {
      id: item.id.toString(),
      name: item.title,
      price: Math.round(item.price * 80),
      category: item.category.replace("'s clothing", "").trim(),
      image: item.image,
      description: item.description,
      occasions: ["casual", "party"],
      gender,
    };
  } catch {
    return null;
  }
}
