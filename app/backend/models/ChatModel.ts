export type ChatRoom = {
    name: string;
    online: number;
};

export type ChatMessage = {
    id: string;
    room: string;
    author: string;
    text: string;
    sentAt: string; // ISO date-time
};
