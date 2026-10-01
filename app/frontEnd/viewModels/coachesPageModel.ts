export type CoachesPageModel = {
    coaches: {
        id: string;
        name: string;
        subtitle: string;
        priceLabel: string;
        ratingLabel: string | null;
        verified: boolean;
        imageUrl: string | null;
        imageAlt: string;
    }[];
};
