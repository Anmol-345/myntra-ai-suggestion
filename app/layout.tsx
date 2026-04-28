import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata = {
  title: "Myntra | AI-Powered Fashion E-commerce",
  description: "Discover your perfect style with our AI-powered clothing recommendations and curated fashion catalog.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} scroll-smooth`}>
      <body className="font-sans bg-gray-50/50" suppressHydrationWarning>
        <Navbar />
        <main className="min-h-screen pt-20">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-100 py-12 mt-20">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-gray-500 text-sm">
              &copy; 2026 Myntra. Powered by Gemini AI.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
