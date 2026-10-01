import { coachHandler } from "~/backend/handlers/CoachHandler";

export const coachesController = {
    async getCoachesPage() {
        return {
            datas: await coachHandler.CoachHandler(),
        };
    },
};
