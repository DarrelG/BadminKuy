import { marketplaceHandler } from "~/backend/handlers/marketplaceHandler";
import { sessionController } from "~/frontEnd/controllers/sessionController";
import { formatPosted, formatRupiah } from "~/frontEnd/utils/format";
import type { MarketplacePageModel } from "~/frontEnd/viewModels/marketplacePageModel";

export const marketplaceController = {
    async getMarketplacePage(): Promise<MarketplacePageModel> {
        await sessionController.requireUser();
        const listings = await marketplaceHandler.getAll();

        return {
            listings: listings.map((l) => ({
                id: l.id,
                title: l.title,
                badgeLabel: l.listingType === "bundle" ? "Bundle" : l.condition,
                badgeTone: l.listingType === "bundle" ? "blue" : "amber",
                details:
                    l.listingType === "bundle"
                        ? `${l.condition} · Pickup in ${l.location}`
                        : `${l.location} · ${formatPosted(l.postedAt)}`,
                priceLabel: formatRupiah(l.priceIdr),
                imageUrl: l.imageUrl,
                imageAlt: l.imageAlt ?? l.title,
            })),
        };
    },
};
