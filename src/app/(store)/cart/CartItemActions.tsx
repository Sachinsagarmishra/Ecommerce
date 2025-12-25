"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { updateQuantity, removeFromCart } from "@/features/cart/actions";
import { toast } from "sonner";

interface CartItemActionsProps {
    itemId: string;
    quantity: number;
}

export function CartItemActions({ itemId, quantity }: CartItemActionsProps) {
    const [isPending, startTransition] = useTransition();

    async function handleUpdate(newQuantity: number) {
        startTransition(async () => {
            const result = await updateQuantity(itemId, newQuantity);
            if (result?.error) toast.error(result.error);
        });
    }

    async function handleRemove() {
        startTransition(async () => {
            const result = await removeFromCart(itemId);
            if (result?.error) toast.error(result.error);
            else toast.success("Item removed from bag");
        });
    }

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center border-2 rounded-xl px-2 py-1 bg-white">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-gray-50"
                    onClick={() => handleUpdate(quantity - 1)}
                    disabled={isPending}
                >
                    <Minus className="w-4 h-4" />
                </Button>
                <span className="w-10 text-center font-bold">
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : quantity}
                </span>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-gray-50"
                    onClick={() => handleUpdate(quantity + 1)}
                    disabled={isPending}
                >
                    <Plus className="w-4 h-4" />
                </Button>
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-red-500"
                onClick={handleRemove}
                disabled={isPending}
            >
                <Trash2 className="w-5 h-5" />
            </Button>
        </div>
    );
}
