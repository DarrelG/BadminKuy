export type ClubsPageModel = {
    clubs: {
        id: string;
        name: string;
        meta: string;
        schedule: string;
        imageUrl: string;
        imageAlt: string;
        joined: boolean;
    }[];
};
