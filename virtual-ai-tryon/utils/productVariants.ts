import type { Product } from "@/types/product";

export interface ResolvedProductMedia {
    color: string;
    image: string;
    imagePublicId: string;
}

export function getActiveProductMedia(
    product: Pick<Product, "image" | "imagePublicId" | "colors" | "colorVariants">,
    selectedColor?: string
): ResolvedProductMedia {
    const variants = product.colorVariants ?? [];

    if (selectedColor) {
        const matchedVariant = variants.find(
            (v) => v.color.toLowerCase() === selectedColor.toLowerCase()
        );
        if (matchedVariant) {
            return {
                color: matchedVariant.color,
                image: matchedVariant.image,
                imagePublicId: matchedVariant.imagePublicId,
            };
        }
    }

    if (variants.length > 0) {
        return {
            color: variants[0].color,
            image: variants[0].image,
            imagePublicId: variants[0].imagePublicId,
        };
    }

    return {
        color: selectedColor || product.colors?.[0] || "Default",
        image: product.image,
        imagePublicId: product.imagePublicId,
    };
}