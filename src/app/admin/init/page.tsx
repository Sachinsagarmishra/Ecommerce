"use client";

import { useState } from "react";
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
import { initAdmin } from "@/features/auth/actions";
import { toast } from "sonner";
import { Loader2, AlertTriangle } from "lucide-react";

const schema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    secretKey: z.string().min(1, "Secret key is required"),
});

export default function AdminInitPage() {
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: { email: "", password: "", secretKey: "" },
    });

    async function onSubmit(values: z.infer<typeof schema>) {
        setLoading(true);
        const formData = new FormData();
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("secretKey", values.secretKey);

        const result = await initAdmin(formData);
        setLoading(false);

        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success("Admin initialized successfully! You can now login.");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl border border-gray-100">
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-red-50 rounded-full">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                </div>

                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-black mb-2">ADMIN INITIALIZATION</h1>
                    <p className="text-gray-500 font-medium">Create your master admin account.</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Admin Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="admin@example.com" {...field} disabled={loading} className="rounded-xl h-12" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Set Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} disabled={loading} className="rounded-xl h-12" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="secretKey"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Admin Setup Secret Key</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter the secret key from your team" {...field} disabled={loading} className="rounded-xl h-12 border-orange-200 focus:border-orange-500" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full h-12 rounded-xl bg-red-600 hover:bg-red-700 font-bold text-lg transition-all" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : "INITIALIZE MASTER ADMIN"}
                        </Button>
                        <p className="text-[10px] text-center text-gray-400 mt-4 px-4">
                            CAUTION: This page uses the Service Role key to override standard database permissions. Delete this page from your codebase after use.
                        </p>
                    </form>
                </Form>
            </div>
        </div>
    );
}
