import { Metadata } from "next";

export function constructMetadata({
    title = "STØRE - Premium eCommerce",
    description = "Shop the latest products with ease.",
    image = "/og-image.png",
    noIndex = false,
}: {
    title?: string;
    description?: string;
    image?: string;
    noIndex?: boolean;
} = {}): Metadata {
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [{ url: image }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [image],
            creator: "@yourhandle",
        },
        icons: {
            icon: "/favicon.ico",
        },
        metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
        ...(noIndex && {
            robots: {
                index: false,
                follow: false,
            },
        }),
    };
}

export function productSchema(product: any) {
    return {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": [product.image_url],
        "description": product.description,
        "sku": product.id,
        "brand": {
            "@type": "Brand",
            "name": product.brand?.name || "Generic"
        },
        "offers": {
            "@type": "Offer",
            "url": `${process.env.NEXT_PUBLIC_APP_URL}/product/${product.slug}`,
            "priceCurrency": "INR",
            "price": product.discounted_price || product.price,
            "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        }
    };
}
