export type ListingType = "item" | "bundle";

export type Listing = {
    id: string;
    title: string;
    listingType: ListingType;
    condition: string;
    location: string;
    postedAt: string; // ISO date-time
    priceIdr: number;
    imageUrl: string | null;
    imageAlt: string | null;
    sellerId: string;
};
