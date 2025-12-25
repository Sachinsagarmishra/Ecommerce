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

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
    name: z.string().min(2, "Name is too short"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export function AuthForm() {
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [loading, setLoading] = useState(false);

    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const signupForm = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: { name: "", email: "", password: "" },
    });

    async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
        setLoading(true);
        const formData = new FormData();
        formData.append("email", values.email);
        formData.append("password", values.password);

        const result = await signIn(formData);
        setLoading(false);

        if (result?.error) {
            toast.error(result.error);
        }
    }

    async function onSignupSubmit(values: z.infer<typeof signupSchema>) {
        setLoading(true);
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("password", values.password);

        const result = await signUp(formData);
        setLoading(false);

        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success("Account created! You can now log in.");
            setMode("login");
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

            {mode === "login" ? (
                <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                        <FormField
                            control={loginForm.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="name@example.com" {...field} disabled={loading} className="rounded-xl h-12" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={loginForm.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} disabled={loading} className="rounded-xl h-12" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full h-12 rounded-xl bg-black font-bold text-lg hover:bg-gray-800 transition-all" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : "SIGN IN"}
                        </Button>
                        <div className="text-center mt-6">
                            <button
                                type="button"
                                onClick={() => setMode("signup")}
                                className="text-sm font-semibold text-gray-500 hover:text-black transition-colors"
                                disabled={loading}
                            >
                                Don't have an account? <span className="text-black underline">Sign Up</span>
                            </button>
                        </div>
                    </form>
                </Form>
            ) : (
                <Form {...signupForm}>
                    <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                        <FormField
                            control={signupForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} disabled={loading} className="rounded-xl h-12" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={signupForm.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="name@example.com" {...field} disabled={loading} className="rounded-xl h-12" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={signupForm.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} disabled={loading} className="rounded-xl h-12" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full h-12 rounded-xl bg-black font-bold text-lg hover:bg-gray-800 transition-all" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : "CREATE ACCOUNT"}
                        </Button>
                        <div className="text-center mt-6">
                            <button
                                type="button"
                                onClick={() => setMode("login")}
                                className="text-sm font-semibold text-gray-500 hover:text-black transition-colors"
                                disabled={loading}
                            >
                                Already have an account? <span className="text-black underline">Sign In</span>
                            </button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
}
