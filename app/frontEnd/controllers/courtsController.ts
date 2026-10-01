import { courtHandler } from "~/backend/handlers/CourtHandler";
import type { Court, CourtFilter, FloorType } from "~/backend/models/CourtModel";
import { sessionController } from "~/frontEnd/controllers/SessionController";
import { actionFail, actionOk, runAction } from "~/frontEnd/utils/actionResult";
import { formatPriceK } from "~/frontEnd/utils/format";
import type { ActionResult } from "~/frontEnd/viewModels/ActionResult";
import type {
    CourtCardModel,
    CourtDetailModel,
    CourtsPageModel,
} from "~/frontEnd/viewModels/CourtsPageModel";

const floors: FloorType[] = ["Wood", "Vinyl", "Rubber"];

const parseFilter = (params: URLSearchParams): CourtFilter => {
    const floor = params.get("floor") ?? "";
    const availability = params.get("availability") ?? "";
    const maxPrice = Number(params.get("maxPrice"));
    const verified = params.get("verified");

    return {
        query: (params.get("q") ?? "").trim(),
        floor: floors.find((f) => f === floor) ?? "",
        availability: availability === "open" || availability === "busy" ? availability : "",
        verifiedOnly: verified === "1" || verified === "on",
        maxPrice: params.get("maxPrice") && Number.isFinite(maxPrice) && maxPrice > 0 ? maxPrice : null,
        facility: (params.get("facility") ?? "").trim(),
    };
};

const joinList = (items: string[]): string => {
    const lower = items.map((i) => i.toLowerCase());
    if (lower.length === 0) return "basic facilities";
    if (lower.length === 1) return lower[0];
    return `${lower.slice(0, -1).join(", ")} and ${lower[lower.length - 1]}`;
};

const toCard = (c: Court): CourtCardModel => ({
    id: c.id,
    name: c.name,
    address: c.address,
    courtCountLabel: `${c.courtCount} courts`,
    floorLabel: `${c.floor} floor`,
    isOpen: c.status === "open",
    statusLabel: c.status === "open" ? "Open now" : "Busy now",
    verified: c.verified,
    verifiedLabel: c.verified ? "Verified" : "Pending review",
    priceLabel: formatPriceK(c.pricePerHour),
    ratingLabel: `★ ${c.rating} (${c.reviewCount})`,
    imageUrl: c.imageUrl,
    imageAlt: c.imageAlt,
    mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${c.name} ${c.address}`)}`,
});

const toDetail = (c: Court): CourtDetailModel => ({
    ...toCard(c),
    subtitle: `${c.address} · ${c.courtCount} indoor courts`,
    hoursLabel: c.openingHours,
    priceShort: formatPriceK(c.pricePerHour).replace("Rp ", ""),
    ratingShort: `${c.rating}★`,
    description: `${c.floor}-floor courts with ${joinList(c.facilities)}. Floor quality ${c.quality.floor} · Lighting ${c.quality.lighting} · Cleanliness ${c.quality.cleanliness}.`,
    approvalLabel: c.verified ? "Verified" : "Pending review",
});

export const courtsController = {
    async getCourtsPage(params: URLSearchParams): Promise<CourtsPageModel> {
        await sessionController.requireUser();

        const filter = parseFilter(params);
        const courts = await courtHandler.getAll(filter);

        const selectedId = params.get("court");
        const selected = selectedId ? await courtHandler.getById(selectedId) : null;

        return {
            filters: {
                query: filter.query,
                floor: filter.floor,
                availability: filter.availability,
                verifiedOnly: filter.verifiedOnly,
                maxPrice: filter.maxPrice ? String(filter.maxPrice) : "",
                facility: filter.facility,
            },
            countLabel: `Showing ${courts.length} local court${courts.length === 1 ? "" : "s"}`,
            courts: courts.map(toCard),
            selected: selected ? toDetail(selected) : null,
        };
    },

    requestBooking(input: { courtId: string; date: string; time: string }): Promise<ActionResult> {
        return runAction("booking", async () => {
            const user = await sessionController.requireUser();
            if (!input.courtId || !input.date || !input.time) {
                return actionFail("booking", "Choose a date and time.");
            }
            const when = new Date(`${input.date}T${input.time}`);
            if (Number.isNaN(when.getTime()) || when.getTime() < Date.now()) {
                return actionFail("booking", "Pick a date and time in the future.");
            }
            const court = await courtHandler.getById(input.courtId);
            if (!court) return actionFail("booking", "Court not found.");

            await courtHandler.createBooking({
                courtId: court.id,
                userId: user.id,
                date: input.date,
                time: input.time,
            });
            return actionOk("booking", "Booking request sent. The court will confirm availability by chat.");
        });
    },

    reportCourt(courtId: string): Promise<ActionResult> {
        return runAction("report", async () => {
            const user = await sessionController.requireUser();
            await courtHandler.reportCourt(courtId, user.id);
            return actionOk("report", "Thanks, this court detail has been flagged for review.");
        });
    },
};
