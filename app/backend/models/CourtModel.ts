export type FloorType = "Wood" | "Vinyl" | "Rubber";
export type CourtStatus = "open" | "busy";

export type Court = {
    id: string;
    name: string;
    address: string;
    district: string;
    courtCount: number;
    floor: FloorType;
    status: CourtStatus;
    pricePerHour: number;
    rating: number;
    reviewCount: number;
    verified: boolean;
    imageUrl: string;
    imageAlt: string;
    facilities: string[];
    openingHours: string;
    quality: { floor: number; lighting: number; cleanliness: number };
};

export type CourtFilter = {
    query: string;
    floor: FloorType | "";
    availability: CourtStatus | "";
    verifiedOnly: boolean;
    maxPrice: number | null;
    facility: string;
};

export type BookingRequest = {
    courtId: string;
    userId: string;
    date: string;
    time: string;
};
