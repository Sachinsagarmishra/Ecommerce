import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        slug: string;
        price: number;
        discounted_price?: number | null;
        image_url?: string;
        brand?: { name: string };
    };
}

export function ProductCard({ product }: ProductCardProps) {
    const hasDiscount = product.discounted_price && product.discounted_price < product.price;

    return (
        <Card className="group overflow-hidden rounded-xl border-none shadow-sm transition-all hover:shadow-md bg-white">
            <Link href={`/products/${product.slug}`}>
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {product.image_url ? (
                        <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                            No Image
                        </div>
                    )}
                    {hasDiscount && (
                        <Badge className="absolute left-2 top-2 bg-red-500 font-bold">
                            SALE
                        </Badge>
                    )}
                </div>
            </Link>
            <CardContent className="p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    {product.brand?.name || "Generic"}
                </p>
                <Link href={`/products/${product.slug}`}>
                    <h3 className="mt-1 font-medium text-gray-900 group-hover:text-blue-600 truncate">
                        {product.name}
                    </h3>
                </Link>
                <div className="mt-2 flex items-center gap-2">
                    {hasDiscount ? (
                        <>
                            <span className="text-lg font-bold text-gray-900">
                                ₹{product.discounted_price}
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                                ₹{product.price}
                            </span>
                        </>
                    ) : (
                        <span className="text-lg font-bold text-gray-900">
                            ₹{product.price}
                        </span>
                    )}
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button className="w-full gap-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-all">
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                </Button>
            </CardFooter>
        </Card>
    );
}
