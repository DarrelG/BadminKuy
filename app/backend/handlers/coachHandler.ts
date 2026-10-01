import type { Coach } from "~/backend/models/CoachModel";

// MOCK DATA: swap the method body for a Supabase query when the coaches table exists.
const coaches: Coach[] = [
    {
        id: "co1",
        name: "Coach Bima",
        area: "Jakarta Selatan",
        focus: "Beginner to Advanced",
        pricePerHour: 180000,
        rating: 4.9,
        verified: false,
        imageUrl: "https://images.pexels.com/photos/35647222/pexels-photo-35647222.jpeg",
        imageAlt: "Teenage boy confidently holding a badminton racket on an indoor court.",
    },
    {
        id: "co2",
        name: "Coach Sinta",
        area: "Kemang",
        focus: "Doubles tactics & footwork",
        pricePerHour: 220000,
        rating: null,
        verified: true,
        imageUrl: null,
        imageAlt: null,
    },
];

export const coachHandler = {
    async getAll(): Promise<Coach[]> {
        return coaches;
    },
};
