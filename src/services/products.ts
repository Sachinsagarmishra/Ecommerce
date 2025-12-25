import { createClient } from "@/lib/supabase/server";

export async function getProducts() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("products")
        .select(`
      *,
      brand:brands(name),
      category:categories(name)
    `)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
}

export async function getProductBySlug(slug: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("products")
        .select(`
      *,
      brand:brands(name),
      category:categories(name)
    `)
        .eq("slug", slug)
        .maybeSingle();

    if (error) throw error;
    return data;
}

export async function updateProduct(id: string, updates: any) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("products")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
}
