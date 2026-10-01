import { useEffect, useState } from "react";
import type { ActionResult } from "~/frontEnd/viewModels/ActionResult";

// Shows the message of the latest action result for a moment, then hides it
export function Toast({ result }: { result?: ActionResult | null }) {
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!result?.message) return;
        setMessage(result.message);
        const timer = window.setTimeout(() => setMessage(""), 2800);
        return () => window.clearTimeout(timer);
    }, [result]);

    return (
        <div
            className={`toast rounded-xl bg-[#102a43] text-white px-4 py-3 shadow-xl text-sm font-bold${message ? " show" : ""}`}
            role="status"
            aria-live="polite"
        >
            {message}
        </div>
    );
}
