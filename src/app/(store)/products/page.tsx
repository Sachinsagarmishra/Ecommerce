import { getProducts } from "@/services/products";
import { ProductCard } from "@/components/ProductCard";

export default async function ProductsPage() {
    const products = await getProducts();

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tighter mb-2 uppercase">SHOP ALL</h1>
                    <p className="text-gray-500 font-medium">Explore our premium collection of streetwear and essentials.</p>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                        <p className="text-xl font-bold text-gray-400">No products found.</p>
                        <p className="text-gray-400">Stay tuned for our latest arrivals!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
