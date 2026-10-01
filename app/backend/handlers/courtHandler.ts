import type { BookingRequest, Court, CourtFilter } from "~/backend/models/CourtModel";

// MOCK DATA: this file is the only place to change when the courts tables exist.
// Keep the method signatures and swap each body for a Supabase query.
const courts: Court[] = [
    {
        id: "1",
        name: "GOR Senayan",
        address: "Jl. Pintu Satu Senayan, Gelora",
        district: "Jakarta Selatan",
        courtCount: 6,
        floor: "Wood",
        status: "open",
        pricePerHour: 65000,
        rating: 4.8,
        reviewCount: 126,
        verified: true,
        imageUrl: "https://images.pexels.com/photos/31790661/pexels-photo-31790661.jpeg",
        imageAlt: "Aerial shot of two badminton players on a blue court in Jakarta, Indonesia.",
        facilities: ["Parking", "Shower", "Equipment rental", "Café"],
        openingHours: "08–23",
        quality: { floor: 4.9, lighting: 4.7, cleanliness: 4.8 },
    },
    {
        id: "2",
        name: "Blok M Badminton",
        address: "Jl. Melawai Raya, Kebayoran Baru",
        district: "Jakarta Selatan",
        courtCount: 4,
        floor: "Vinyl",
        status: "busy",
        pricePerHour: 55000,
        rating: 4.6,
        reviewCount: 84,
        verified: true,
        imageUrl: "https://images.pexels.com/photos/8007075/pexels-photo-8007075.jpeg",
        imageAlt: "Focused badminton feather on red indoor court with active player in background.",
        facilities: ["Parking", "Equipment rental"],
        openingHours: "08–23",
        quality: { floor: 4.6, lighting: 4.5, cleanliness: 4.6 },
    },
    {
        id: "3",
        name: "Cilandak Sports Hall",
        address: "Jl. TB Simatupang, Cilandak",
        district: "Jakarta Selatan",
        courtCount: 3,
        floor: "Rubber",
        status: "open",
        pricePerHour: 50000,
        rating: 4.3,
        reviewCount: 21,
        verified: false,
        imageUrl: "https://images.pexels.com/photos/36815793/pexels-photo-36815793.jpeg",
        imageAlt: "A badminton racket resting on an indoor sports court floor near seated players.",
        facilities: ["Shower"],
        openingHours: "09–22",
        quality: { floor: 4.3, lighting: 4.2, cleanliness: 4.4 },
    },
];

const bookings: BookingRequest[] = [];
const reports: { courtId: string; userId: string }[] = [];

export const courtHandler = {
    async getAll(filter: Partial<CourtFilter> = {}): Promise<Court[]> {
        const query = (filter.query ?? "").toLowerCase();
        const facility = (filter.facility ?? "").toLowerCase();

        return courts.filter((c) => {
            const haystack = [c.name, c.address, c.district, c.floor, ...c.facilities]
                .join(" ")
                .toLowerCase();
            if (query && !haystack.includes(query)) return false;
            if (filter.floor && c.floor !== filter.floor) return false;
            if (filter.availability && c.status !== filter.availability) return false;
            if (filter.verifiedOnly && !c.verified) return false;
            if (filter.maxPrice != null && c.pricePerHour > filter.maxPrice) return false;
            if (facility && !c.facilities.some((f) => f.toLowerCase() === facility)) return false;
            return true;
        });
    },

    async getById(id: string): Promise<Court | null> {
        return courts.find((c) => c.id === id) ?? null;
    },

    async getFeatured(limit: number): Promise<Court[]> {
        return courts.slice(0, limit);
    },

    async createBooking(request: BookingRequest): Promise<void> {
        bookings.push(request);
    },

    async reportCourt(courtId: string, userId: string): Promise<void> {
        reports.push({ courtId, userId });
    },
};
