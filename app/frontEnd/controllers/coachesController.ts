import { coachHandler } from "~/backend/handlers/coachHandler";
import { sessionController } from "~/frontEnd/controllers/sessionController";
import { formatPriceK } from "~/frontEnd/utils/format";
import type { CoachesPageModel } from "~/frontEnd/viewModels/coachesPageModel";

export const coachesController = {
    async getCoachesPage(): Promise<CoachesPageModel> {
        await sessionController.requireUser();
        const coaches = await coachHandler.getAll();

        return {
            coaches: coaches.map((c) => ({
                id: c.id,
                name: c.name,
                subtitle: `${c.area} · ${c.focus}`,
                priceLabel: `${formatPriceK(c.pricePerHour)}/hr`,
                ratingLabel: c.rating === null ? null : `★ ${c.rating}`,
                verified: c.verified,
                imageUrl: c.imageUrl,
                imageAlt: c.imageAlt ?? `${c.name}`,
            })),
        };
    },
};
