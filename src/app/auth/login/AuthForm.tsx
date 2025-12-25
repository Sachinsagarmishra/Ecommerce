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
import { signIn, signUp } from "@/features/auth/actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const authSchema = z.object({
    name: z.string().optional(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
}).superRefine((data, ctx) => {
    // We'll handle refined validation logic manually if needed, 
    // but for simplicity, we'll just check it in the component.
});

export function AuthForm() {
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof authSchema>>({
        resolver: zodResolver(authSchema),
        defaultValues: { name: "", email: "", password: "" },
    });

    async function onSubmit(values: z.infer<typeof authSchema>) {
        setLoading(true);
        const formData = new FormData();
        formData.append("email", values.email);
        formData.append("password", values.password);

        if (mode === "signup") {
            if (!values.name || values.name.length < 2) {
                toast.error("Please enter a valid name");
                setLoading(false);
                return;
            }
            formData.append("name", values.name);
            const result = await signUp(formData);
            setLoading(false);

            if (result?.error) {
                toast.error(result.error);
            } else {
                toast.success("Account created! You can now log in.");
                setMode("login");
            }
        } else {
            const result = await signIn(formData);
            setLoading(false);

            if (result?.error) {
                toast.error(result.error);
            }
        }
    }

    return (
        <div className="w-full max-w-md mx-auto p-8 bg-white rounded-3xl shadow-2xl border border-gray-100">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-black italic tracking-tighter mb-2">STØRE</h1>
                <p className="text-gray-500 font-medium">
                    {mode === "login" ? "Welcome back! Please login." : "Create your account."}
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {mode === "signup" && (
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="John Doe"
                                            {...field}
                                            disabled={loading}
                                            className="rounded-xl h-12"
                                            autoComplete="name"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="name@example.com"
                                        {...field}
                                        disabled={loading}
                                        className="rounded-xl h-12"
                                        autoComplete="email"
                                    />
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
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        {...field}
                                        disabled={loading}
                                        className="rounded-xl h-12"
                                        autoComplete={mode === "login" ? "current-password" : "new-password"}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full h-12 rounded-xl bg-black font-bold text-lg hover:bg-gray-800 transition-all"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
                    </Button>

                    <div className="text-center mt-6">
                        <button
                            type="button"
                            onClick={() => {
                                setMode(mode === "login" ? "signup" : "login");
                                form.reset();
                            }}
                            className="text-sm font-semibold text-gray-500 hover:text-black transition-colors"
                            disabled={loading}
                        >
                            {mode === "login" ? (
                                <>Don't have an account? <span className="text-black underline">Sign Up</span></>
                            ) : (
                                <>Already have an account? <span className="text-black underline">Sign In</span></>
                            )}
                        </button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
