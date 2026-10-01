import type { Club } from "~/backend/models/ClubModel";

// MOCK DATA: swap each method body for Supabase queries when the clubs tables exist.
const clubs: Club[] = [
    {
        id: "c1",
        name: "Senayan Shuttle Club",
        area: "Senayan",
        schedule: "Every Tue & Thu · 19:00",
        imageUrl: "https://images.pexels.com/photos/32944292/pexels-photo-32944292.jpeg",
        imageAlt: "A group of men discussing strategy on an indoor badminton court.",
        memberCount: 342,
        memberIds: [],
    },
    {
        id: "c2",
        name: "Jaksel Badminton Crew",
        area: "Jakarta Selatan",
        schedule: "Saturday social · 08:00",
        imageUrl: "https://images.pexels.com/photos/8007494/pexels-photo-8007494.jpeg",
        imageAlt: "Two women holding racquets on an indoor badminton court.",
        memberCount: 218,
        memberIds: [],
    },
];

export const clubHandler = {
    async getAll(): Promise<Club[]> {
        return clubs;
    },

    async join(clubId: string, userId: string): Promise<Club> {
        const club = clubs.find((c) => c.id === clubId);
        if (!club) throw new Error("CLUB_NOT_FOUND");
        if (!club.memberIds.includes(userId)) {
            club.memberIds.push(userId);
            club.memberCount += 1;
        }
        return club;
    },
};
