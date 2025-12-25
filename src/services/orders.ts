import { createClient } from "@/lib/supabase/server";

export async function getMyOrders() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from("orders")
        .select(`
      *,
      order_items (
        *,
        product:products(name, slug)
      )
    `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
}

export async function getAllOrders() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("orders")
        .select(`
      *,
      profiles(name, email)
    `)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
}
