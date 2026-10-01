import { chatHandler } from "~/backend/handlers/chatHandler";
import { sessionController } from "~/frontEnd/controllers/sessionController";
import { actionFail, actionOk, runAction } from "~/frontEnd/utils/actionResult";
import { formatClock } from "~/frontEnd/utils/format";
import type { ActionResult } from "~/frontEnd/viewModels/actionResult";
import type { ChatPageModel } from "~/frontEnd/viewModels/chatPageModel";

export const chatController = {
    async getChatPage(roomParam: string | null): Promise<ChatPageModel> {
        await sessionController.requireUser();

        const rooms = await chatHandler.getRooms();
        const active = rooms.find((r) => r.name === roomParam) ?? rooms[0];
        const messages = await chatHandler.getMessages(active.name);

        return {
            rooms: rooms.map((r) => r.name),
            activeRoom: active.name,
            onlineLabel: `${active.online} players online`,
            messages: messages.map((m) => ({
                id: m.id,
                author: m.author,
                text: m.text,
                timeLabel: formatClock(m.sentAt),
            })),
        };
    },

    sendMessage(room: string, text: string): Promise<ActionResult> {
        return runAction("send", async () => {
            const profile = await sessionController.requireProfile();
            const rooms = await chatHandler.getRooms();
            if (!rooms.some((r) => r.name === room)) return actionFail("send", "Room not found.");
            if (text.length === 0) return actionFail("send", "Write a message first.");
            if (text.length > 500) return actionFail("send", "Messages can be up to 500 characters.");

            await chatHandler.send(room, profile.displayName, text);
            return actionOk("send", "Message sent. Please keep messages friendly.");
        });
    },

    reportRoom(room: string): Promise<ActionResult> {
        return runAction("report", async () => {
            const user = await sessionController.requireUser();
            await chatHandler.report(room, user.id);
            return actionOk("report", "Message report opened for moderator review.");
        });
    },
};
