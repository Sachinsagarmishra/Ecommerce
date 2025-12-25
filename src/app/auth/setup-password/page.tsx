"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { setupPassword } from "@/features/auth/actions";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const schema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export default function SetupPasswordPage() {
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: { password: "", confirmPassword: "" },
    });

    async function onSubmit(values: z.infer<typeof schema>) {
        setLoading(true);
        const result = await setupPassword(values.password);
        setLoading(false);

        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success("Password set successfully!");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
                <h1 className="text-2xl font-black mb-2 text-center">SECURE YOUR ACCOUNT</h1>
                <p className="text-gray-500 mb-8 text-center font-medium">Please set a password for future logins.</p>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} disabled={loading} className="rounded-xl h-12" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} disabled={loading} className="rounded-xl h-12" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full h-12 rounded-xl bg-black font-bold text-lg" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : "COMPLETE SETUP"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
