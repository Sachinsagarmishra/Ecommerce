"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signIn(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = await createClient();

    if (password) {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return { error: error.message };
        }

        return redirect("/dashboard");
    } else {
        // Check if user exists and has password
        const { data: profile } = await supabase
            .from("profiles")
            .select("has_password")
            .eq("email", email)
            .single();

        if (profile?.has_password) {
            return { showPassword: true };
        } else {
            // Send OTP
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    shouldCreateUser: true,
                },
            });

            if (error) return { error: error.message };
            return { showOTP: true };
        }
    }
}

export async function verifyOtp(email: string, token: string) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "magiclink",
    });

    if (error) return { error: error.message };

    // Check if password setup is needed
    const { data: profile } = await supabase
        .from("profiles")
        .select("has_password")
        .eq("email", email)
        .single();

    if (!profile?.has_password) {
        return redirect("/auth/setup-password");
    }

    return redirect("/dashboard");
}

export async function setupPassword(password: string) {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({
        password,
    });

    if (error) return { error: error.message };

    // Update profile
    await supabase
        .from("profiles")
        .update({ has_password: true })
        .eq("id", (await supabase.auth.getUser()).data.user?.id);

    return redirect("/dashboard");
}
