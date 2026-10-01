export type CourtCardModel = {
    id: string;
    name: string;
    address: string;
    courtCountLabel: string;
    floorLabel: string;
    isOpen: boolean;
    statusLabel: string;
    verified: boolean;
    verifiedLabel: string;
    priceLabel: string;
    ratingLabel: string;
    imageUrl: string;
    imageAlt: string;
    mapUrl: string;
};

export type CourtDetailModel = CourtCardModel & {
    subtitle: string;
    hoursLabel: string;
    priceShort: string;
    ratingShort: string;
    description: string;
    approvalLabel: string;
};

export type CourtsPageModel = {
    filters: {
        query: string;
        floor: string;
        availability: string;
        verifiedOnly: boolean;
        maxPrice: string;
        facility: string;
    };
    countLabel: string;
    courts: CourtCardModel[];
    selected: CourtDetailModel | null;
};
