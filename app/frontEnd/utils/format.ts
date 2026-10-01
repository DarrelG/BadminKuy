export const formatClock = (iso: string): string =>
    new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });

export const formatDay = (iso: string): string => {
    const date = new Date(iso);
    const isToday = date.toDateString() === new Date().toDateString();
    return isToday
        ? "TODAY"
        : date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
};

export const formatWhen = (iso: string): string => `${formatDay(iso)} · ${formatClock(iso)}`;

export const formatPriceK = (idr: number): string => `Rp ${Math.round(idr / 1000)}k`;

export const formatRupiah = (idr: number): string => `Rp ${idr.toLocaleString("id-ID")}`;

export const formatPosted = (iso: string): string => {
    const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
    if (days <= 0) return "Posted today";
    if (days === 1) return "Posted yesterday";
    return `Posted ${days} days ago`;
};

export const initialsOf = (name: string): string => {
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return "?";
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
};

// Value for <input type="date" min=...> in the user's local time zone
export const todayInputValue = (): string => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 10);
};
