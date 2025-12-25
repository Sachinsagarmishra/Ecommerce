import { getProductBySlug } from "@/services/products";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddToCart } from "./AddToCart";

export default async function ProductDetailsPage({ params }: { params: { slug: string } }) {
    const product = await getProductBySlug(params.slug);

    if (!product) {
        notFound();
    }

    const hasDiscount = product.discounted_price && product.discounted_price < product.price;

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-12">
                {/* Image Gallery */}
                <div className="flex flex-col">
                    <div className="relative aspect-square overflow-hidden rounded-3xl bg-gray-100 shadow-lg">
                        {product.image_url ? (
                            <Image
                                src={product.image_url}
                                alt={product.name}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-400">
                                No Image
                            </div>
                        )}
                    </div>
                </div>

                {/* Product Info */}
                <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">
                            {product.brand?.name || "Generic"}
                        </p>
                        <h1 className="text-4xl font-black italic tracking-tighter text-gray-900 uppercase">
                            {product.name}
                        </h1>
                    </div>

                    <div className="mt-4 flex items-center gap-4">
                        {hasDiscount ? (
                            <>
                                <span className="text-3xl font-black text-gray-900">
                                    ₹{product.discounted_price}
                                </span>
                                <span className="text-xl text-gray-400 line-through">
                                    ₹{product.price}
                                </span>
                                <Badge className="bg-red-500 text-white font-bold py-1 px-3">
                                    SAVE ₹{Math.floor(product.price - product.discounted_price!)}
                                </Badge>
                            </>
                        ) : (
                            <span className="text-3xl font-black text-gray-900">
                                ₹{product.price}
                            </span>
                        )}
                    </div>

                    <div className="mt-8">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Description</h3>
                        <div className="mt-4 prose prose-sm text-gray-600 font-medium leading-relaxed">
                            {product.description || "No description available for this product."}
                        </div>
                    </div>

                    <div className="mt-10 flex gap-4">
                        <AddToCart productId={product.id} />
                        <Button variant="outline" size="icon" className="h-16 w-16 rounded-2xl border-2 hover:bg-gray-50">
                            <Heart className="w-6 h-6 text-gray-400 hover:text-red-500 transition-colors" />
                        </Button>
                    </div>

                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-10">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <Truck className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-900">Free Delivery</p>
                                <p className="text-xs font-medium text-gray-500">Orders over ₹999</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <RotateCcw className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-900">Easy Returns</p>
                                <p className="text-xs font-medium text-gray-500">30-day window</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
