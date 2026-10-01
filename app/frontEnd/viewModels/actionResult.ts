// What every form action returns to its page (used for toasts and inline messages)
export type ActionResult = {
    intent: string;
    ok: boolean;
    message: string;
};
