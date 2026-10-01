export type dashboardModel = {
    heroBadge: string;
    pulse: { label: string; value: string }[];
    featuredCourts: {
        id: string;
        name: string;
        address: string;
        priceLabel: string;
        statusLabel: string;
        isOpen: boolean;
        verified: boolean;
        verifiedLabel: string;
        imageUrl: string;
        imageAlt: string;
    }[];
    upcoming: {
        id: string;
        title: string;
        detail: string;
        dayLabel: string;
        isToday: boolean;
    }[];
};
