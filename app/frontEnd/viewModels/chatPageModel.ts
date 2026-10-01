export type ChatPageModel = {
    rooms: string[];
    activeRoom: string;
    onlineLabel: string;
    messages: { id: string; author: string; text: string; timeLabel: string }[];
};
