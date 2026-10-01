import type { Listing } from "~/backend/models/ListingModel";

// MOCK DATA: swap the method body for a Supabase query when the listings table exists.
const daysAgo = (days: number): string =>
    new Date(Date.now() - days * 86_400_000).toISOString();

const listings: Listing[] = [
    {
        id: "l1",
        title: "Yonex Astrox 88D",
        listingType: "item",
        condition: "Used · Excellent",
        location: "Jakarta Selatan",
        postedAt: daysAgo(0),
        priceIdr: 1450000,
        imageUrl: "https://images.pexels.com/photos/36576096/pexels-photo-36576096.jpeg",
        imageAlt: "Detailed view of a badminton racket lying on a wooden floor with focused strings.",
        sellerId: "seed-1",
    },
    {
        id: "l2",
        title: "Court shoes, size 42",
        listingType: "bundle",
        condition: "Lightly worn",
        location: "Blok M",
        postedAt: daysAgo(2),
        priceIdr: 420000,
        imageUrl: null,
        imageAlt: null,
        sellerId: "seed-2",
    },
];

export const marketplaceHandler = {
    async getAll(): Promise<Listing[]> {
        return listings;
    },
};
