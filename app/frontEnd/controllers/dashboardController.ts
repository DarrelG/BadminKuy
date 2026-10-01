import { courtHandler } from "~/backend/handlers/courtHandler";
import { mabarHandler } from "~/backend/handlers/mabarHandler";
import { statsHandler } from "~/backend/handlers/statsHandler";
import { sessionController } from "~/frontEnd/controllers/sessionController";
import { formatClock, formatDay, formatPriceK } from "~/frontEnd/utils/format";
import type { dashboardModel } from "~/frontEnd/viewModels/dashboardModel";

export const dashboardController = {
    async getDashboardPage(): Promise<dashboardModel> {
        const profile = await sessionController.requireProfile();

        const [pulse, courts, sessions] = await Promise.all([
            statsHandler.getPulse(),
            courtHandler.getFeatured(2),
            mabarHandler.getUpcoming(2),
        ]);

        return {
            heroBadge: `${(profile.city ?? "Your area").toUpperCase()} · TODAY`,
            pulse: [
                { label: "ONLINE", value: String(pulse.playersOnline) },
                { label: "SESSIONS", value: String(pulse.openSessions) },
                { label: "OPEN CTS", value: String(pulse.openCourts) },
            ],
            featuredCourts: courts.map((c) => ({
                id: c.id,
                name: c.name,
                address: c.address,
                priceLabel: `${formatPriceK(c.pricePerHour)}/hr`,
                statusLabel: c.status === "open" ? "Open now" : "Busy now",
                isOpen: c.status === "open",
                verified: c.verified,
                verifiedLabel: c.verified ? "Verified" : "Popular",
                imageUrl: c.imageUrl,
                imageAlt: c.imageAlt,
            })),
            upcoming: sessions.map((s) => ({
                id: s.id,
                title: s.title,
                detail: `${formatClock(s.startsAt)} · ${s.courtName} · ${s.format}`,
                dayLabel: formatDay(s.startsAt),
                isToday: formatDay(s.startsAt) === "TODAY",
            })),
        };
    },
};
