import { ApplicationHandler } from "./ApplicationHandler";
import { CoachModel } from "~/backend/models/CoachModel";
import { CoachViewModel } from "~/frontEnd/viewModels/CoachViewModel";

class CoachHandler extends ApplicationHandler {
    async CoachHandler(): Promise<CoachViewModel[]> {
        try {
            const data: CoachModel[] = await CoachModel.Run();

            const result: CoachViewModel[] = data.map((m) => {
                const vm = new CoachViewModel();
                vm.name = m.name;
                vm.description = m.description;
                vm.pricePerHour = m.pricePerHour;
                vm.rating = m.rating;
                vm.isVerified = m.isVerified;
                vm.imageUrl = m.imageUrl;
                return vm;
            });

            return result;
        } catch (error) {
            console.error("[coachHandler.getAll]", error);
            return [];
        }
    }
}

export const coachHandler = new CoachHandler();