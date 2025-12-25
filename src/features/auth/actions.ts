"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function initAdmin(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const secretKey = formData.get("secretKey") as string;

    if (secretKey !== process.env.ADMIN_SETUP_KEY) {
        return { error: "Invalid setup secret key" };
    }

    const supabase = await createClient();
    const adminSupabase = await createAdminClient();

    // 1. Sign up the user
    const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
    });

    if (signUpError) {
        // If user already exists, we might just want to update their role
        if (signUpError.message.includes("User already registered")) {
            // Proceed to update role
        } else {
            return { error: signUpError.message };
        }
    }

    // 2. Force role to admin using service role client
    const { error: updateError } = await adminSupabase
        .from("profiles")
        .update({ role: "admin", has_password: true })
        .eq("email", email);

    if (updateError) {
        return { error: "Auth successful but failed to set admin role: " + updateError.message };
    }

    return { success: true };
}

export async function signIn(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("email", email)
        .single();

    if (profile?.role === 'admin') {
        redirect("/admin");
    }

    redirect("/dashboard");
}

export async function signUp(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name: name,
            }
        }
    });

    if (error) {
        return { error: error.message };
    }

    // Note: The handle_new_user trigger in Supabase will automatically 
    // create the profile entry. We just need to wait for confirmation if email confirmation is on.

    return { success: true };
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/auth/login");
}
