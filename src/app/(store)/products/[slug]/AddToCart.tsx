"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";
import { addToCart } from "@/features/cart/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AddToCartProps {
    productId: string;
}

export function AddToCart({ productId }: AddToCartProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleAdd() {
        setLoading(true);
        const result = await addToCart(productId);
        setLoading(false);

        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success("Added to cart!");
            router.push("/cart");
        }
    }

    return (
        <Button
            onClick={handleAdd}
            className="flex-1 h-16 rounded-2xl bg-black text-white font-black text-lg hover:bg-gray-800 transition-all gap-3"
            disabled={loading}
        >
            {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
                <ShoppingCart className="w-6 h-6" />
            )}
            ADD TO CART
        </Button>
    );
}
