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
import { signIn, verifyOtp } from "@/features/auth/actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const emailSchema = z.object({
    email: z.string().email("Invalid email address"),
});

const passwordSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const otpSchema = z.object({
    email: z.string().email(),
    otp: z.string().length(6, "OTP must be 6 digits"),
});

export function AuthForm() {
    const [step, setStep] = useState<"email" | "password" | "otp">("email");
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");

    const emailForm = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
        defaultValues: { email: "" },
    });

    const passwordForm = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { email: "", password: "" },
    });

    const otpForm = useForm<z.infer<typeof otpSchema>>({
        resolver: zodResolver(otpSchema),
        defaultValues: { email: "", otp: "" },
    });

    async function onEmailSubmit(values: z.infer<typeof emailSchema>) {
        setLoading(true);
        const formData = new FormData();
        formData.append("email", values.email);

        const result = await signIn(formData);
        setLoading(false);

        if (result?.error) {
            toast.error(result.error);
        } else if (result?.showPassword) {
            setEmail(values.email);
            setStep("password");
        } else if (result?.showOTP) {
            setEmail(values.email);
            setStep("otp");
            toast.success("OTP sent to your email!");
        }
    }

    async function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
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

    async function onOtpSubmit(values: z.infer<typeof otpSchema>) {
        setLoading(true);
        const result = await verifyOtp(values.email, values.otp);
        setLoading(false);

        if (result?.error) {
            toast.error(result.error);
        }
    }

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-black italic tracking-tighter mb-2">STØRE</h1>
                <p className="text-gray-500 font-medium whitespace-pre-line">
                    {step === "email" && "Enter your email to get started."}
                    {step === "password" && `Welcome back!\nEnter password for ${email}`}
                    {step === "otp" && `Verify your email\n6-digit code sent to ${email}`}
                </p>
            </div>

            {step === "email" && (
                <Form {...emailForm}>
                    <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                        <FormField
                            control={emailForm.control}
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
                        <Button type="submit" className="w-full h-12 rounded-xl bg-black font-bold text-lg" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : "CONTINUE"}
                        </Button>
                    </form>
                </Form>
            )}

            {step === "password" && (
                <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                        <input type="hidden" {...passwordForm.register("email")} value={email} />
                        <FormField
                            control={passwordForm.control}
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
                        <Button type="submit" className="w-full h-12 rounded-xl bg-black font-bold text-lg" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : "SIGN IN"}
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full"
                            onClick={() => setStep("email")}
                            disabled={loading}
                        >
                            Back
                        </Button>
                    </form>
                </Form>
            )}

            {step === "otp" && (
                <Form {...otpForm}>
                    <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
                        <input type="hidden" {...otpForm.register("email")} value={email} />
                        <FormField
                            control={otpForm.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="000000" {...field} disabled={loading} className="rounded-xl h-12 text-center text-2xl tracking-[1em]" maxLength={6} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full h-12 rounded-xl bg-black font-bold text-lg" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : "VERIFY"}
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full"
                            onClick={() => setStep("email")}
                            disabled={loading}
                        >
                            Back
                        </Button>
                    </form>
                </Form>
            )}
        </div>
    );
}
