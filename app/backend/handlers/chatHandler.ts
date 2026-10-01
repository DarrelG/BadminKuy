import type { ChatMessage, ChatRoom } from "~/backend/models/ChatModel";

// MOCK DATA: swap each method body for Supabase queries/realtime when the messages table exists.
const minutesAgo = (minutes: number): string =>
    new Date(Date.now() - minutes * 60_000).toISOString();

const rooms: ChatRoom[] = [
    { name: "Global", online: 428 },
    { name: "Jakarta", online: 186 },
    { name: "Bandung", online: 64 },
    { name: "Surabaya", online: 41 },
];

const messages: ChatMessage[] = [
    { id: "m1", room: "Global", author: "Nadia", text: "Anyone looking for an intermediate doubles game in South Jakarta tonight?", sentAt: minutesAgo(18) },
    { id: "m2", room: "Global", author: "Dimas", text: "I just opened a session at GOR Senayan. Two spots left!", sentAt: minutesAgo(11) },
    { id: "m3", room: "Jakarta", author: "Nadia", text: "Welcome Jakarta players! Share court availability and rally plans.", sentAt: minutesAgo(40) },
    { id: "m4", room: "Jakarta", author: "Dimas", text: "Blok M has a busy evening slot, book early.", sentAt: minutesAgo(25) },
    { id: "m5", room: "Bandung", author: "Nadia", text: "Bandung room checking in, Sunday social is open!", sentAt: minutesAgo(90) },
    { id: "m6", room: "Surabaya", author: "Dimas", text: "Surabaya Mabar at Darmo has three open slots.", sentAt: minutesAgo(60) },
];

export const chatHandler = {
    async getRooms(): Promise<ChatRoom[]> {
        return rooms;
    },

    async getMessages(room: string): Promise<ChatMessage[]> {
        return messages.filter((m) => m.room === room);
    },

    async send(room: string, author: string, text: string): Promise<ChatMessage> {
        const message: ChatMessage = {
            id: crypto.randomUUID(),
            room,
            author,
            text,
            sentAt: new Date().toISOString(),
        };
        messages.push(message);
        return message;
    },

    async report(room: string, userId: string): Promise<void> {
        void room;
        void userId;
    },
};
