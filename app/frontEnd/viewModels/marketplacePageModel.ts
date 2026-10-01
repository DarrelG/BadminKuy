export type MarketplacePageModel = {
    listings: {
        id: string;
        title: string;
        badgeLabel: string;
        badgeTone: "amber" | "blue";
        details: string;
        priceLabel: string;
        imageUrl: string | null;
        imageAlt: string;
    }[];
};
