export type ModelGender = "male" | "female";

export interface VirtualModel {
    id: string;
    image: string;
}

export const VIRTUAL_MODELS: Record<ModelGender, VirtualModel[]> = {
    male: [
        {
            id: "Male-1",
            image:
                "https://res.cloudinary.com/dtgxlzlmw/image/upload/v1795285938/Male-1.png",
        },
        {
            id: "Male-2",
            image:
                "https://res.cloudinary.com/dtgxlzlmw/image/upload/v1795285939/Male-2.png",
        },
        {
            id: "Male-3",
            image:
                "https://res.cloudinary.com/dtgxlzlmw/image/upload/v1795285940/Male-3.png",
        },
    ],
    female: [
        {
            id: "Female-1",
            image:
                "https://res.cloudinary.com/dtgxlzlmw/image/upload/v1795285856/Female-1.png",
        },
        {
            id: "Female-2",
            image:
                "https://res.cloudinary.com/dtgxlzlmw/image/upload/v1795285856/Female-2.png",
        },
        {
            id: "Female-3",
            image:
                "https://res.cloudinary.com/dtgxlzlmw/image/upload/v1795285857/Female-3.png",
        },
    ],
};

export const ALL_VIRTUAL_MODELS = Object.values(VIRTUAL_MODELS).flat();