import type { ActionResult } from "~/frontEnd/viewModels/actionResult";

export const actionOk = (intent: string, message: string): ActionResult => ({
    intent,
    ok: true,
    message,
});

export const actionFail = (intent: string, message: string): ActionResult => ({
    intent,
    ok: false,
    message,
});

// Wraps a controller action: redirects pass through, unexpected errors become a friendly message
export const runAction = async (
    intent: string,
    fn: () => Promise<ActionResult>,
): Promise<ActionResult> => {
    try {
        return await fn();
    } catch (error) {
        if (error instanceof Response) throw error;
        return actionFail(intent, "Something went wrong. Please try again.");
    }
};
