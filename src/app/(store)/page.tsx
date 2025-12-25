import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/services/products";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Zap, ShieldCheck, Truck } from "lucide-react";

export default async function HomePage() {
  const products = await getProducts();
  const featuredProducts = products.filter(p => p.is_featured).slice(0, 4);

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-black text-white px-4">
        <div className="absolute inset-0 z-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center" />
        <div className="relative z-10 text-center space-y-6 max-w-3xl">
          <Badge className="bg-white/10 text-white backdrop-blur-md border-white/20 px-4 py-1 text-sm">
            NEW COLLECTION 2024
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
            ELEVATE YOUR <br /> EVERYDAY STYLE.
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-medium">
            Discover a curated collection of premium products designed for the modern lifestyle.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/shop">
              <Button size="lg" className="bg-white text-black hover:bg-gray-200 rounded-full px-8 text-lg font-bold">
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto w-full px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Zap, title: "Fast Delivery", desc: "Get your orders in 2-3 days" },
          { icon: ShieldCheck, title: "Secure Payment", desc: "100% secure checkout with Razorpay" },
          { icon: Truck, title: "Free Shipping", desc: "On all orders above ₹999" },
        ].map((feat, i) => (
          <div key={i} className="flex items-start gap-4 p-6 rounded-2xl bg-gray-50 border transition-all hover:shadow-sm">
            <div className="p-3 bg-black rounded-xl">
              <feat.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{feat.title}</h3>
              <p className="text-gray-500 text-sm mt-1">{feat.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto w-full px-4 space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight">FEATURED PRODUCTS</h2>
            <p className="text-gray-500 mt-2 font-medium">Handpicked favorites for you</p>
          </div>
          <Link href="/shop" className="text-sm font-bold flex items-center gap-1 hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            // Placeholder/Empty state
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square rounded-xl" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

// Re-import Badge and Skeleton for the hero/placeholders
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
