// Maps custom or compound color names to CSS background values for color swatches.
const COLOR_SWATCH_MAP: Record<string, string> = {
    "off-white": "#f8f7f4",
    sage: "#9caf88",
    mustard: "#d4a017",
    indigo: "#3f51b5",
    ivory: "#fffff0",
    teal: "#008080",
    black: "#18181b",
    rust: "#b7410e",
    sand: "#c2b280",
    charcoal: "#36454f",
    white: "#ffffff",
    olive: "#556b2f",
    "indigo/white": "linear-gradient(135deg, #3f51b5 50%, #ffffff 50%)",
    "maroon/cream": "linear-gradient(135deg, #800000 50%, #fffdd0 50%)",
    "olive/gold": "linear-gradient(135deg, #556b2f 50%, #d4af37 50%)",
};

export function getSwatchBackground(colorName: string): string {
    const key = colorName.trim().toLowerCase();

    if (COLOR_SWATCH_MAP[key]) {
        return COLOR_SWATCH_MAP[key];
    }

    if (key.includes("/")) {
        const [first, second] = key.split("/").map((part) => part.trim());
        const c1 = COLOR_SWATCH_MAP[first] || first;
        const c2 = COLOR_SWATCH_MAP[second] || second;
        return `linear-gradient(135deg, ${c1} 50%, ${c2} 50%)`;
    }

    return key;
}