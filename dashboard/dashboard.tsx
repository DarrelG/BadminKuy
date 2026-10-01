import { useEffect, useMemo, useRef, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import {
    Feather, House, MapPin, UsersRound, MessagesSquare, Badge,
    Trophy, Medal, GraduationCap, ShoppingBag, Bell, ChevronDown,
    Activity, CalendarDays, BadgeCheck, Search, Map, X, MessageCircle,
    ShieldCheck, Flag, Send,
} from "lucide-react";
import { dashboardController } from "~/frontEnd/controllers/dashboardController";
import { authController } from "~/frontEnd/controllers/authController";

export async function clientLoader() {
    return dashboardController.getDashboardPage();
}

export function HydrateFallback() {
    return <p>Loading...</p>;
}

/* ---------------- data ---------------- */

type Court = {
    id: number;
    name: string;
    address: string;
    courts: number;
    floor: "Wood" | "Vinyl" | "Rubber";
    status: "Open now" | "Busy now";
    price: string;
    rating: number;
    reviews: number;
    verified: boolean;
    image: string;
    imageAlt: string;
    tags: string[];
};

const COURTS: Court[] = [
    {
        id: 1,
        name: "GOR Senayan",
        address: "Jl. Pintu Satu Senayan, Gelora",
        courts: 6,
        floor: "Wood",
        status: "Open now",
        price: "Rp 65k",
        rating: 4.8,
        reviews: 126,
        verified: true,
        image: "https://images.pexels.com/photos/31790661/pexels-photo-31790661.jpeg",
        imageAlt: "Aerial shot of two badminton players on a blue court in Jakarta, Indonesia.",
        tags: ["Jakarta Selatan", "Wood", "Open", "verified", "Parking", "Shower"],
    },
    {
        id: 2,
        name: "Blok M Badminton",
        address: "Jl. Melawai Raya, Kebayoran Baru",
        courts: 4,
        floor: "Vinyl",
        status: "Busy now",
        price: "Rp 55k",
        rating: 4.6,
        reviews: 84,
        verified: true,
        image: "https://images.pexels.com/photos/8007075/pexels-photo-8007075.jpeg",
        imageAlt: "Focused badminton feather on red indoor court with active player in background.",
        tags: ["Jakarta Selatan", "Vinyl", "Busy", "verified", "Parking"],
    },
    {
        id: 3,
        name: "Cilandak Sports Hall",
        address: "Jl. TB Simatupang, Cilandak",
        courts: 3,
        floor: "Rubber",
        status: "Open now",
        price: "Rp 50k",
        rating: 4.3,
        reviews: 21,
        verified: false,
        image: "https://images.pexels.com/photos/36815793/pexels-photo-36815793.jpeg",
        imageAlt: "A badminton racket resting on an indoor sports court floor near seated players.",
        tags: ["Jakarta Selatan", "Rubber", "Open", "Shower"],
    },
];

type Session = {
    id: number;
    skill: string;
    skillClass: string;
    when: string;
    title: string;
    meta: string;
    players: number;
    total: number;
    joined?: boolean;
};

const INITIAL_SESSIONS: Session[] = [
    { id: 1, skill: "Intermediate", skillClass: "bg-[#e8f9d2] text-[#4c7416]", when: "TODAY · 19:30", title: "Senayan after work", meta: "GOR Senayan · Doubles · Rp 45k/person", players: 3, total: 4 },
    { id: 2, skill: "Beginner friendly", skillClass: "bg-[#e7f0ff] text-[#345e98]", when: "FRI · 20:00", title: "Blok M doubles night", meta: "Blok M Badminton · Doubles · Rp 40k/person", players: 2, total: 4 },
    { id: 3, skill: "Advanced", skillClass: "bg-[#fff4c9] text-[#946900]", when: "SAT · 08:00", title: "Saturday smash ladder", meta: "Cilandak Sports Hall · Singles · Rp 55k/person", players: 4, total: 6 },
];

const ROOM_MESSAGES: Record<string, string[]> = {
    Global: [
        "Anyone looking for an intermediate doubles game in South Jakarta tonight?",
        "I just opened a session at GOR Senayan. Two spots left!",
    ],
    Jakarta: [
        "Welcome Jakarta players! Share court availability and rally plans.",
        "Blok M has a busy evening slot, book early.",
    ],
    Bandung: ["Bandung room checking in — Sunday social is open!"],
    Surabaya: ["Surabaya Mabar at Darmo has three open slots."],
};

const TOURNAMENT_PREVIEWS: Record<string, React.ReactNode> = {
    "Round-robin": (
        <>
        <b>Round 1</b>
        <p className="mt-2">Raka / Dimas vs Nadia / Sari</p>
        <p className="mt-1">Bimo / Arif vs Fina / Gita</p>
        </>
    ),
    Knockout: (
        <>
        <b>Quarter-finals</b>
        <p className="mt-2">Raka vs Nadia · Court 1</p>
        <p className="mt-1">Dimas vs Sari · Court 2</p>
        </>
    ),
    Americano: (
        <>
        <b>Round 1 · rotating pairs</b>
        <p className="mt-2">Raka + Sari vs Nadia + Dimas</p>
        <p className="mt-1">Play to 15 · switch partners next round</p>
        </>
    ),
};

/* ---------------- styles ---------------- */

const STYLES = `
:root { --navy:#102a43; --ink:#17324d; --lime:#bcf24a; --yellow:#ffd85d; --mint:#eff8f1; --line:#dbe8e1; --muted:#69808f; }
* { box-sizing:border-box; }
.app-shell { width:100%; min-height:100vh; background:radial-gradient(circle at 85% 0%,#e0f7bf 0,transparent 25%),#f4f8f5; font-family:"DM Sans",sans-serif; color:var(--ink); }
.side-nav { width:252px; background:var(--navy); color:#eaf4ef; position:fixed; inset:0 auto 0 0; z-index:30; padding:24px 16px; }
.main-area { margin-left:252px; min-height:100vh; }
.page { display:none; animation:rise .28s ease; }
.page.active { display:block; }
.nav-item { display:flex; align-items:center; gap:12px; width:100%; padding:11px 13px; border-radius:14px; color:#c8d8d3; font-weight:600; font-size:14px; text-align:left; transition:.2s; }
.nav-item:hover,.nav-item.active { background:rgba(188,242,74,.16); color:var(--lime); }
.nav-item.active { box-shadow:inset 3px 0 0 var(--lime); }
.brand { font-family:Fraunces,serif; letter-spacing:-.06em; }
.surface { background:#fff; border:1px solid var(--line); box-shadow:0 10px 25px rgba(32,63,55,.06); }
.court-card { transition:transform .2s,box-shadow .2s; }
.court-card:hover { transform:translateY(-3px); box-shadow:0 18px 34px rgba(32,63,55,.12); }
.badge { display:inline-flex; align-items:center; gap:5px; border-radius:999px; font-size:11px; font-weight:800; padding:5px 9px; }
.lime-btn { background:var(--lime); color:#16311d; font-weight:800; border-radius:13px; transition:.2s; }
.lime-btn:hover { background:#d1fa71; transform:translateY(-1px); }
.outline-btn { border:1px solid #c9dad1; color:var(--ink); background:#fff; border-radius:13px; font-weight:700; transition:.2s; }
.outline-btn:hover { border-color:#8dac9e; background:#f7faf7; }
.field { width:100%; border:1px solid #cfddd6; border-radius:12px; padding:11px 13px; outline:none; background:white; color:var(--ink); }
.field:focus { border-color:#7caf30; box-shadow:0 0 0 3px rgba(188,242,74,.3); }
.tab-btn { border-bottom:3px solid transparent; padding:10px 2px; font-size:13px; font-weight:800; color:#728792; background:transparent; }
.tab-btn.active { color:var(--ink); border-color:#8db82a; }
.mobile-nav { display:none; }
.toast { position:fixed; right:20px; bottom:22px; z-index:80; transform:translateY(120px); opacity:0; transition:.3s; }
.toast.show { transform:translateY(0); opacity:1; }
.modal-backdrop { display:none; position:fixed; inset:0; background:rgba(11,32,48,.52); z-index:60; padding:20px; align-items:center; justify-content:center; }
.modal-backdrop.open { display:flex; }
.court-lines { background-image:linear-gradient(90deg,transparent 0 48%,rgba(255,255,255,.24) 48% 49%,transparent 49%),linear-gradient(0deg,transparent 0 47%,rgba(255,255,255,.22) 47% 49%,transparent 49%); }
.notification-pop { display:none; position:absolute; right:0; top:56px; width:320px; z-index:50; }
.notification-pop.open { display:block; animation:rise .2s ease; }
@keyframes rise { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
@media(max-width:900px) {
    .side-nav { display:none; }
    .main-area { margin-left:0; padding-bottom:82px; }
    .mobile-nav { display:flex; position:fixed; z-index:40; bottom:0; inset-inline:0; height:72px; background:#102a43; justify-content:space-around; align-items:center; padding:6px 8px env(safe-area-inset-bottom); }
    .mobile-nav button { color:#b8cdc5; font-size:10px; font-weight:700; display:flex; flex-direction:column; align-items:center; gap:3px; background:transparent; }
    .mobile-nav button.active { color:var(--lime); }
    .desktop-only { display:none!important; }
    .notification-pop { right:-38px; width:min(320px,calc(100vw - 32px)); }
}
`;

/* ---------------- component ---------------- */

type View =
    | "home" | "courts" | "mabar" | "chat" | "clubs"
    | "score" | "leaderboards" | "coaches" | "marketplace";

const NAV_ITEMS: { view: View; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
    { view: "home", label: "Home", Icon: House },
    { view: "courts", label: "Courts", Icon: MapPin },
    { view: "mabar", label: "Mabar", Icon: UsersRound },
    { view: "chat", label: "Chat", Icon: MessagesSquare },
    { view: "clubs", label: "Clubs", Icon: Badge },
    { view: "score", label: "Score Tracker", Icon: Trophy },
    { view: "leaderboards", label: "Leaderboards", Icon: Medal },
    { view: "coaches", label: "Coaches", Icon: GraduationCap },
    { view: "marketplace", label: "Marketplace", Icon: ShoppingBag },
];

const MOBILE_NAV: { view: View; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
    { view: "home", label: "Home", Icon: House },
    { view: "courts", label: "Courts", Icon: MapPin },
    { view: "mabar", label: "Mabar", Icon: UsersRound },
    { view: "chat", label: "Chat", Icon: MessagesSquare },
    { view: "score", label: "Score", Icon: Trophy },
];

export default function Dashboard() {
    const page = useLoaderData<typeof clientLoader>();
    const navigate = useNavigate();

    /* view + ui state */
    const [view, setView] = useState<View>("home");
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifDot, setNotifDot] = useState(true);
    const [notifRead, setNotifRead] = useState(false);
    const [toast, setToast] = useState("");
    const toastTimer = useRef<number | null>(null);

    /* courts */
    const [courtSearch, setCourtSearch] = useState("");
    const [floor, setFloor] = useState("");
    const [availability, setAvailability] = useState("");
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [detailCourt, setDetailCourt] = useState<Court | null>(null);
    const [bookingSent, setBookingSent] = useState(false);

    /* mabar */
    const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
    const [sessionModalOpen, setSessionModalOpen] = useState(false);
    const [sessionForm, setSessionForm] = useState({
        name: "", court: "GOR Senayan", skill: "Intermediate",
        date: "", slots: 3,
    });

    /* chat */
    const [room, setRoom] = useState("Global");
    const [messages, setMessages] = useState<Record<string, string[]>>(ROOM_MESSAGES);
    const [chatInput, setChatInput] = useState("");

    /* clubs */
    const [joinedClubs, setJoinedClubs] = useState<Record<number, boolean>>({});

    /* score */
    const [scoreSaved, setScoreSaved] = useState(false);
    const [format, setFormat] = useState("Round-robin");

    const showToast = (msg: string) => {
        setToast(msg);
        if (toastTimer.current) window.clearTimeout(toastTimer.current);
        toastTimer.current = window.setTimeout(() => setToast(""), 2800);
    };

    const handleLogout = async () => {
        await authController.logout();
        navigate("/login");
    };

    const goTo = (v: View) => {
        setView(v);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    /* ---- courts filtering ---- */
    const filteredCourts = useMemo(() => {
        const q = courtSearch.toLowerCase();
        return COURTS.filter((c) => {
        const hay = [c.name, c.address, ...c.tags].join(" ").toLowerCase();
        if (q && !hay.includes(q)) return false;
        if (floor && c.floor.toLowerCase() !== floor.toLowerCase()) return false;
        if (availability === "open" && c.status !== "Open now") return false;
        if (availability === "busy" && c.status !== "Busy now") return false;
        if (verifiedOnly && !c.verified) return false;
        return true;
        });
    }, [courtSearch, floor, availability, verifiedOnly]);

    const courtCountLabel = `Showing ${filteredCourts.length} local court${filteredCourts.length === 1 ? "" : "s"}`;

    /* ---- mabar ---- */
    const joinSession = (id: number) => {
        setSessions((prev) =>
        prev.map((s) =>
            s.id === id && !s.joined
            ? { ...s, joined: true, players: Math.min(s.players + 1, s.total) }
            : s
        )
        );
        showToast("You're in! See you on court.");
    };

    const publishSession = (e: React.FormEvent) => {
        e.preventDefault();
        const { name, court, skill, slots } = sessionForm;
        if (!name.trim()) return;
        setSessions((prev) => [
        {
            id: Date.now(),
            skill,
            skillClass: "bg-[#e8f9d2] text-[#4c7416]",
            when: "NEW SESSION",
            title: name,
            meta: `${court} · Casual play · Rp 45k/person`,
            players: 1,
            total: Number(slots) + 1,
        },
        ...prev,
        ]);
        setSessionForm({ name: "", court: "GOR Senayan", skill: "Intermediate", date: "", slots: 3 });
        setSessionModalOpen(false);
        showToast("Your Mabar session is live.");
    };

    /* ---- chat ---- */
    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        const text = chatInput.trim();
        if (!text) return;
        setMessages((prev) => ({ ...prev, [room]: [...prev[room], text] }));
        setChatInput("");
        showToast("Message sent. Please keep messages friendly.");
    };

    /* ---- notifications ---- */
    const markAllRead = () => {
        setNotifRead(true);
        setNotifDot(false);
        showToast("Notifications marked as read");
    };

    return (
        <div className="app-shell">
        <style>{STYLES}</style>

        {/* ---------------- SIDEBAR ---------------- */}
        <aside className="side-nav" aria-label="Primary navigation">
            <div className="px-3 mb-8">
            <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-[#bcf24a] text-[#102a43] grid place-items-center">
                <Feather className="w-5 h-5" />
                </div>
                <h1 className="brand text-3xl text-white font-extrabold" style={{ fontSize: 32 }}>
                BadminKuy
                </h1>
            </div>
            <p className="text-xs mt-2 text-[#a9c4b9]" style={{ fontSize: 12 }}>
                Your local badminton circle
            </p>
            </div>
            <nav className="space-y-1">
            {NAV_ITEMS.map(({ view: v, label, Icon }) => (
                <button
                key={v}
                className={`nav-item${view === v ? " active" : ""}`}
                onClick={() => goTo(v)}
                >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
                </button>
            ))}
            </nav>
            <div className="absolute bottom-6 left-4 right-4 rounded-2xl bg-[#193952] p-4">
            <p className="text-xs font-bold text-[#bcf24a]" style={{ fontSize: 11 }}>
                PLAY FAIR. PLAY MORE.
            </p>
            <p className="text-xs leading-5 mt-1 text-[#c8d8d3]" style={{ fontSize: 12 }}>
                Good rallies start with a friendly invite.
            </p>
            </div>
        </aside>

        {/* ---------------- MAIN ---------------- */}
        <main className="main-area">
            <header className="sticky top-0 z-20 bg-[#f4f8f5]/90 backdrop-blur border-b border-[#dbe8e1] px-5 md:px-8 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                <div className="md:hidden w-9 h-9 rounded-full bg-[#102a43] text-[#bcf24a] grid place-items-center">
                    <Feather className="w-5 h-5" />
                </div>
                <button className="flex items-center gap-2 outline-btn px-3 py-2 text-sm" type="button">
                    <MapPin className="w-4 h-4 text-[#6b9424]" />
                    <span>Jakarta Selatan</span>
                    <ChevronDown className="w-4 h-4" />
                </button>
                </div>
                <div className="flex items-center gap-3 relative">
                <button
                    className="relative w-10 h-10 rounded-full bg-white border border-[#dbe8e1] grid place-items-center"
                    aria-label="Open notifications"
                    onClick={() => setNotifOpen((o) => !o)}
                >
                    <Bell className="w-4 h-4" />
                    {notifDot && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-[#e96a47] rounded-full" />
                    )}
                </button>
                <div className={`notification-pop surface rounded-2xl overflow-hidden${notifOpen ? " open" : ""}`}>
                    <div className="p-4 flex justify-between items-center border-b border-[#e4eee8]">
                    <strong>Notifications</strong>
                    <button className="text-xs font-bold text-[#548020]" onClick={markAllRead}>
                        Mark all read
                    </button>
                    </div>
                    <div>
                    <button
                        className={`w-full text-left p-4 border-b border-[#eef4ef] hover:bg-[#f6faf6]${notifRead ? " opacity-50" : ""}`}
                    >
                        <strong className="block text-sm">Mabar match found</strong>
                        <span className="text-xs text-[#69808f]">
                        Doubles at GOR Senayan starts in 2 hours.
                        </span>
                    </button>
                    <button className={`w-full text-left p-4 hover:bg-[#f6faf6]${notifRead ? " opacity-50" : ""}`}>
                        <strong className="block text-sm">Court update</strong>
                        <span className="text-xs text-[#69808f]">
                        GOR Blok M has reported 2 courts open.
                        </span>
                    </button>
                    </div>
                </div>
                <button className="flex items-center gap-2" type="button" aria-label="Open player profile" onClick={handleLogout}>
                    <span className="w-10 h-10 rounded-full bg-[#ffd85d] grid place-items-center font-extrabold text-[#102a43]">
                    RA
                    </span>
                    <span className="desktop-only text-left">
                    <b className="block text-sm">Raka Aditya</b>
                    <small className="text-[#69808f]">Intermediate</small>
                    </span>
                </button>
                </div>
            </div>
            </header>

            <div className="max-w-7xl mx-auto px-5 md:px-8 py-7">
            {/* ---------- HOME ---------- */}
            <section className={`page${view === "home" ? " active" : ""}`} aria-labelledby="home-title">
                <div className="grid lg:grid-cols-[1.35fr_.65fr] gap-6">
                <div className="court-lines rounded-[28px] p-7 md:p-10 relative overflow-hidden text-white" style={{ background: "#102a43" }}>
                    <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full border-[24px] border-[#bcf24a]/20" />
                    <div className="relative max-w-xl">
                    <span className="badge" style={{ background: "#bcf24a", color: "#17324d", fontWeight: 800, fontSize: 11 }}>
                        JAKARTA SELATAN · TODAY
                    </span>
                    <h2 id="home-title" className="brand text-5xl md:text-6xl leading-[.95] mt-5" style={{ fontWeight: 800, fontSize: 24 }}>
                        Find your next game.
                    </h2>
                    <p className="text-lg text-[#d9e9e2] mt-4" style={{ fontSize: 18 }}>
                        Courts, crews, and games near you.
                    </p>
                    <div className="flex flex-wrap gap-3 mt-7">
                        <button className="lime-btn px-5 py-3" style={{ fontSize: 16 }} onClick={() => goTo("courts")}>
                        Find a court
                        </button>
                        <button
                        className="px-5 py-3 rounded-[13px] border border-[#a8c1b7] font-bold hover:bg-white/10"
                        style={{ fontWeight: 700, fontSize: 16 }}
                        onClick={() => goTo("mabar")}
                        >
                        Join a Mabar
                        </button>
                    </div>
                    </div>
                </div>

                <aside className="surface rounded-[28px] p-6">
                    <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-[#69808f]" style={{ fontSize: 11 }}>
                        Live local pulse
                        </p>
                        <h3 className="text-xl font-extrabold mt-1" style={{ fontWeight: 800, fontSize: 19 }}>
                        Today in badminton
                        </h3>
                    </div>
                    <span className="w-10 h-10 rounded-full bg-[#fff4c9] grid place-items-center">
                        <Activity className="w-5 h-5 text-[#a87b00]" />
                    </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-6 text-center">
                    {[
                        { n: "428", l: "ONLINE" },
                        { n: "18", l: "SESSIONS" },
                        { n: "24", l: "OPEN CTS" },
                    ].map(({ n, l }) => (
                        <div key={l} className="rounded-2xl bg-[#eff8f1] p-3">
                        <b className="block text-lg">{n}</b>
                        <span className="text-[10px] font-bold text-[#69808f]">{l}</span>
                        </div>
                    ))}
                    </div>
                    <p className="text-xs text-[#69808f] mt-5" style={{ fontSize: 12 }}>
                    Availability is refreshed by players and approved court admins.
                    </p>
                </aside>
                </div>

                <div className="grid lg:grid-cols-[1.25fr_.75fr] gap-6 mt-7">
                <section aria-labelledby="nearby-title">
                    <div className="flex justify-between items-center mb-4">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-[#6b9424]">Play nearby</p>
                        <h3 id="nearby-title" className="font-extrabold text-2xl">Courts ready for you</h3>
                    </div>
                    <button className="text-sm font-bold text-[#527c20]" onClick={() => goTo("courts")}>
                        Explore all →
                    </button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                    {COURTS.slice(0, 2).map((c) => (
                        <article key={c.id} className="surface court-card rounded-2xl overflow-hidden">
                        <img className="w-full h-36 object-cover" loading="lazy" src={c.image} alt={c.imageAlt} />
                        <div className="p-4">
                            <div className="flex justify-between">
                            <h4 className="font-extrabold" style={{ fontSize: 16 }}>{c.name}</h4>
                            <span className={`badge ${c.verified ? "bg-[#e8f9d2] text-[#4c7416]" : "bg-[#fff4c9] text-[#946900]"}`}>
                                {c.verified && <BadgeCheck className="w-3 h-3" />}
                                {c.verified ? "Verified" : "Popular"}
                            </span>
                            </div>
                            <p className="text-xs text-[#69808f] mt-1" style={{ fontSize: 12 }}>{c.address}</p>
                            <div className="flex justify-between mt-4 text-sm">
                            <b>{c.price}/hr</b>
                            <span className={c.status === "Open now" ? "text-[#4f7d22] font-bold" : "text-[#d35c3e] font-bold"}>
                                ● {c.status}
                            </span>
                            </div>
                        </div>
                        </article>
                    ))}
                    </div>
                </section>

                <section className="surface rounded-[24px] p-5" aria-labelledby="upcoming-title">
                    <div className="flex justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-[#6b9424]">Your next rally</p>
                        <h3 id="upcoming-title" className="font-extrabold text-xl">Upcoming sessions</h3>
                    </div>
                    <CalendarDays className="text-[#6b9424]" />
                    </div>
                    <div className="mt-4 space-y-3">
                    <div className="p-3 rounded-xl bg-[#eff8f1]">
                        <div className="flex justify-between">
                        <b className="text-sm">Senayan after work</b>
                        <span className="text-xs font-bold text-[#5b8522]">TODAY</span>
                        </div>
                        <p className="text-xs text-[#69808f] mt-1">19:30 · GOR Senayan · Doubles</p>
                    </div>
                    <div className="p-3 rounded-xl border border-[#dbe8e1]">
                        <div className="flex justify-between">
                        <b className="text-sm">Saturday Smash</b>
                        <span className="text-xs font-bold text-[#69808f]">SAT</span>
                        </div>
                        <p className="text-xs text-[#69808f] mt-1">08:00 · Cilandak · Intermediate</p>
                    </div>
                    </div>
                    <button className="mt-4 text-sm font-bold text-[#527c20]" onClick={() => goTo("mabar")}>
                    See Mabar board →
                    </button>
                </section>
                </div>
            </section>

            {/* ---------- COURTS ---------- */}
            <section className={`page${view === "courts" ? " active" : ""}`} aria-labelledby="courts-title">
                <div className="flex flex-wrap justify-between gap-4 items-end">
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#6b9424]">Court directory</p>
                    <h2 id="courts-title" className="brand text-4xl">Choose your court.</h2>
                    <p className="text-[#69808f] mt-1">Verified details from local players and court admins.</p>
                </div>
                <button className="outline-btn px-4 py-3 text-sm">
                    <Map className="inline w-4 h-4 mr-1" /> Map view
                </button>
                </div>

                <div className="surface rounded-2xl p-4 mt-6">
                <div className="grid md:grid-cols-[2fr_1fr_1fr_auto] gap-3">
                    <label className="relative">
                    <span className="sr-only">Search courts</span>
                    <Search className="absolute left-3 top-3 w-5 h-5 text-[#69808f]" />
                    <input
                        className="field pl-10"
                        placeholder="Search court or district"
                        value={courtSearch}
                        onChange={(e) => setCourtSearch(e.target.value)}
                    />
                    </label>
                    <label>
                    <span className="sr-only">Floor type</span>
                    <select className="field" value={floor} onChange={(e) => setFloor(e.target.value)}>
                        <option value="">Any floor</option>
                        <option value="Wood">Wood</option>
                        <option value="Vinyl">Vinyl</option>
                        <option value="Rubber">Rubber</option>
                    </select>
                    </label>
                    <label>
                    <span className="sr-only">Availability</span>
                    <select className="field" value={availability} onChange={(e) => setAvailability(e.target.value)}>
                        <option value="">Any availability</option>
                        <option value="open">Open now</option>
                        <option value="busy">Busy now</option>
                    </select>
                    </label>
                    <label className="flex items-center gap-2 px-3 text-sm font-bold">
                    <input
                        type="checkbox"
                        className="accent-[#6b9424] w-4 h-4"
                        checked={verifiedOnly}
                        onChange={(e) => setVerifiedOnly(e.target.checked)}
                    />
                    Verified only
                    </label>
                </div>
                <div className="flex flex-wrap gap-2 mt-3 text-xs">
                    <span className="font-bold text-[#69808f] py-2">Quick filters:</span>
                    {["Jakarta Selatan", "Under 70k", "Parking", "Shower"].map((f) => (
                    <button
                        key={f}
                        className="badge bg-[#eff8f1] text-[#40651a]"
                        onClick={() => setCourtSearch(f)}
                    >
                        {f}
                    </button>
                    ))}
                </div>
                </div>

                <p className="text-sm text-[#69808f] mt-5">{courtCountLabel}</p>
                <div className="grid lg:grid-cols-3 gap-5 mt-3">
                {filteredCourts.map((c) => (
                    <article key={c.id} className="surface court-card rounded-2xl overflow-hidden">
                    <img className="w-full h-44 object-cover" loading="lazy" src={c.image} alt={c.imageAlt} />
                    <div className="p-5">
                        <div className="flex justify-between gap-2">
                        <h3 className="font-extrabold text-lg" style={{ fontSize: 19 }}>{c.name}</h3>
                        <span className={`badge whitespace-nowrap ${c.verified ? "bg-[#e8f9d2] text-[#4c7416]" : "bg-[#fff4c9] text-[#946900]"}`}>
                            {c.verified && <BadgeCheck className="w-3 h-3" />}
                            {c.verified ? "Verified" : "Pending review"}
                        </span>
                        </div>
                        <p className="text-xs text-[#69808f] mt-1" style={{ fontSize: 12 }}>{c.address}</p>
                        <div className="flex gap-2 flex-wrap mt-3">
                        <span className="badge bg-[#f1f5f3] text-[#48606a]">{c.courts} courts</span>
                        <span className="badge bg-[#f1f5f3] text-[#48606a]">{c.floor} floor</span>
                        <span className={`badge ${c.status === "Open now" ? "bg-[#e8f9d2] text-[#4c7416]" : "bg-[#fff0e9] text-[#c54f31]"}`}>
                            {c.status}
                        </span>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                        <div>
                            <b>{c.price}</b>
                            <span className="text-xs text-[#69808f]"> / hour</span>
                            <p className="text-xs text-[#a97900] font-bold">★ {c.rating} ({c.reviews})</p>
                        </div>
                        <button className="lime-btn px-3 py-2 text-sm" onClick={() => setDetailCourt(c)}>
                            View
                        </button>
                        </div>
                        <div className="flex justify-between mt-4 pt-3 border-t border-[#edf2ef] text-xs">
                        <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="font-bold text-[#527c20]">
                            Open map ↗
                        </a>
                        <button
                            className="text-[#69808f]"
                            onClick={() => showToast("Thanks — this court detail has been flagged for review.")}
                        >
                            Report wrong info
                        </button>
                        </div>
                    </div>
                    </article>
                ))}
                </div>

                {detailCourt && (
                <section className="mt-7 surface rounded-[24px] overflow-hidden" aria-live="polite">
                    <div className="grid lg:grid-cols-[1.1fr_.9fr]">
                    <img className="w-full h-full min-h-[320px] object-cover" loading="lazy" src={detailCourt.image} alt={detailCourt.imageAlt} />
                    <div className="p-6">
                        <div className="flex justify-between gap-4">
                        <div>
                            <span className="badge bg-[#e8f9d2] text-[#4c7416]">
                            <BadgeCheck className="w-3 h-3" /> Verified court
                            </span>
                            <h3 className="brand text-3xl mt-3">{detailCourt.name}</h3>
                            <p className="text-sm text-[#69808f] mt-1">
                            {detailCourt.address} · {detailCourt.courts} indoor courts
                            </p>
                        </div>
                        <button
                            className="w-9 h-9 rounded-full bg-[#eff8f1]"
                            aria-label="Close court detail"
                            onClick={() => { setDetailCourt(null); setBookingSent(false); }}
                        >
                            <X className="w-4 h-4 mx-auto" />
                        </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center mt-5">
                        {[
                            { v: "08–23", l: "HOURS" },
                            { v: detailCourt.price.replace("Rp ", ""), l: "PER HOUR" },
                            { v: `${detailCourt.rating}★`, l: "RATING" },
                        ].map(({ v, l }) => (
                            <div key={l} className="bg-[#eff8f1] p-3 rounded-xl">
                            <b>{v}</b>
                            <span className="block text-[10px] text-[#69808f]">{l}</span>
                            </div>
                        ))}
                        </div>
                        <p className="text-sm mt-5 leading-6">
                        {detailCourt.floor}-floor courts with parking, shower rooms, equipment rental, and a small café.
                        Floor quality 4.9 · Lighting 4.7 · Cleanliness 4.8.
                        </p>
                        <div className="mt-5 p-3 rounded-xl border border-[#f0d37c] bg-[#fffaf0]">
                        <b className="text-sm">Admin approval: Verified</b>
                        <p className="text-xs text-[#7d6a30] mt-1">
                            In production, court admin access is enforced by Supabase row-level security — never by hidden buttons alone.
                        </p>
                        </div>
                        <form
                        className="mt-5 grid sm:grid-cols-2 gap-3"
                        onSubmit={(e) => {
                            e.preventDefault();
                            setBookingSent(true);
                            showToast("Booking request sent");
                        }}
                        >
                        <label className="text-xs font-bold">
                            Preferred date
                            <input required type="date" className="field mt-1" />
                        </label>
                        <label className="text-xs font-bold">
                            Preferred time
                            <select className="field mt-1">
                            <option>19:00</option>
                            <option>20:00</option>
                            <option>21:00</option>
                            </select>
                        </label>
                        <button className="lime-btn py-3 text-sm" type="submit">Send booking request</button>
                        <a
                            href="https://wa.me/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="outline-btn py-3 text-sm text-center"
                        >
                            <MessageCircle className="inline w-4 h-4" /> Book via WhatsApp
                        </a>
                        </form>
                        {bookingSent && (
                        <p className="text-xs font-bold text-[#4f7d22] mt-3">
                            Request prepared. The court will confirm availability by chat.
                        </p>
                        )}
                    </div>
                    </div>
                </section>
                )}
            </section>

            {/* ---------- MABAR ---------- */}
            <section className={`page${view === "mabar" ? " active" : ""}`} aria-labelledby="mabar-title">
                <div className="flex flex-wrap justify-between gap-4 items-end">
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#6b9424]">Play together</p>
                    <h2 id="mabar-title" className="brand text-4xl">The Mabar board.</h2>
                    <p className="text-[#69808f] mt-1">Find your crew, split the court, play more.</p>
                </div>
                <button
                    className="lime-btn px-5 py-3"
                    style={{ fontSize: 16 }}
                    onClick={() => setSessionModalOpen(true)}
                >
                    Create session
                </button>
                </div>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
                {sessions.map((s) => (
                    <article key={s.id} className="surface rounded-2xl p-5">
                    <div className="flex justify-between">
                        <span className={`badge ${s.skillClass}`}>{s.skill}</span>
                        <span className="text-xs font-bold text-[#69808f]">{s.when}</span>
                    </div>
                    <h3 className="font-extrabold text-lg mt-4">{s.title}</h3>
                    <p className="text-sm text-[#69808f] mt-1">{s.meta}</p>
                    <div className="flex items-center justify-between mt-5">
                        <span className="text-sm font-bold">{s.players} / {s.total} players</span>
                        <button
                        className={s.joined ? "outline-btn px-4 py-2 text-sm" : "lime-btn px-4 py-2 text-sm"}
                        onClick={() => joinSession(s.id)}
                        disabled={s.joined}
                        >
                        {s.joined ? "Joined ✓" : "Join session"}
                        </button>
                    </div>
                    </article>
                ))}
                </div>
            </section>

            {/* ---------- CHAT ---------- */}
            <section className={`page${view === "chat" ? " active" : ""}`} aria-labelledby="chat-title">
                <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#6b9424]">Community rooms</p>
                <h2 id="chat-title" className="brand text-4xl">Say hi. Set up a game.</h2>
                </div>
                <div className="surface rounded-[24px] mt-6 overflow-hidden grid lg:grid-cols-[220px_1fr] min-h-[500px]">
                <aside className="bg-[#f7faf7] p-4 border-r border-[#dbe8e1]">
                    <p className="text-xs font-bold uppercase text-[#69808f] mb-3">Rooms</p>
                    <div className="space-y-1">
                    {Object.keys(messages).map((r) => (
                        <button
                        key={r}
                        className={`w-full text-left p-3 rounded-xl font-bold text-sm ${room === r ? "bg-[#e5f6c5]" : ""}`}
                        onClick={() => setRoom(r)}
                        >
                        # {r}
                        </button>
                    ))}
                    </div>
                    <div className="mt-8 text-xs text-[#69808f] leading-5">
                    <ShieldCheck className="inline w-4 h-4 text-[#648d26]" /> Basic rate limiting and community
                    moderation protect these rooms.
                    </div>
                </aside>
                <div className="flex flex-col min-w-0">
                    <div className="p-5 border-b border-[#dbe8e1] flex justify-between">
                    <div>
                        <h3 className="font-extrabold"># {room}</h3>
                        <p className="text-xs text-[#69808f]">
                        {room === "Global" ? "428" : room === "Jakarta" ? "186" : "64"} players online
                        </p>
                    </div>
                    <button
                        className="text-xs font-bold text-[#69808f]"
                        onClick={() => showToast("Message report opened for moderator review.")}
                    >
                        <Flag className="inline w-4 h-4" /> Report
                    </button>
                    </div>
                    <div className="p-5 space-y-5 flex-1 overflow-auto max-h-[350px]">
                    {messages[room].map((m, i) => (
                        <div key={i}>
                        <b className="text-sm">
                            {i % 2 ? "Dimas" : "Nadia"}{" "}
                            <span className="text-xs font-normal text-[#69808f]">today</span>
                        </b>
                        <p className="text-sm mt-1">{m}</p>
                        </div>
                    ))}
                    </div>
                    <form className="p-4 border-t border-[#dbe8e1] flex gap-2" onSubmit={sendMessage}>
                    <label className="sr-only" htmlFor="chat-input">Message</label>
                    <input
                        id="chat-input"
                        className="field"
                        placeholder="Write a friendly message…"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                    />
                    <button className="lime-btn px-4" type="submit" aria-label="Send message">
                        <Send className="w-4 h-4" />
                    </button>
                    </form>
                </div>
                </div>
            </section>

            {/* ---------- CLUBS ---------- */}
            <section className={`page${view === "clubs" ? " active" : ""}`} aria-labelledby="clubs-title">
                <p className="text-xs font-bold uppercase tracking-widest text-[#6b9424]">Communities</p>
                <h2 id="clubs-title" className="brand text-4xl">Your badminton people.</h2>
                <div className="grid md:grid-cols-3 gap-5 mt-6">
                {[
                    { id: 1, name: "Senayan Shuttle Club", meta: "342 members · Senayan", sched: "Every Tue & Thu · 19:00", img: "https://images.pexels.com/photos/32944292/pexels-photo-32944292.jpeg", alt: "A group of men discussing strategy on an indoor badminton court." },
                    { id: 2, name: "Jaksel Badminton Crew", meta: "218 members · Jakarta Selatan", sched: "Saturday social · 08:00", img: "https://images.pexels.com/photos/8007494/pexels-photo-8007494.jpeg", alt: "Two women holding racquets on an indoor badminton court." },
                ].map((c) => (
                    <article key={c.id} className="surface rounded-2xl overflow-hidden">
                    <img className="w-full h-36 object-cover" loading="lazy" src={c.img} alt={c.alt} />
                    <div className="p-5">
                        <h3 className="font-extrabold">{c.name}</h3>
                        <p className="text-sm text-[#69808f] mt-1">{c.meta}</p>
                        <p className="text-sm mt-3">{c.sched}</p>
                        <button
                        className={joinedClubs[c.id] ? "outline-btn px-4 py-2 text-sm mt-4" : "lime-btn px-4 py-2 text-sm mt-4"}
                        onClick={() => {
                            setJoinedClubs((p) => ({ ...p, [c.id]: true }));
                            showToast("Welcome to the club!");
                        }}
                        >
                        {joinedClubs[c.id] ? "Joined ✓" : "Join club"}
                        </button>
                    </div>
                    </article>
                ))}
                <article className="surface rounded-2xl p-5 border-dashed">
                    <span className="badge bg-[#fff4c9] text-[#946900]">Pending approval</span>
                    <h3 className="font-extrabold mt-4">Create a local club</h3>
                    <p className="text-sm leading-6 text-[#69808f] mt-2">
                    Club ownership and moderation must be verified before publishing.
                    </p>
                    <p className="text-xs text-[#7d6a30] mt-4">Production permission: Supabase RLS-enforced.</p>
                </article>
                </div>
            </section>

            {/* ---------- SCORE ---------- */}
            <section className={`page${view === "score" ? " active" : ""}`} aria-labelledby="score-title">
                <p className="text-xs font-bold uppercase tracking-widest text-[#6b9424]">Match tools</p>
                <h2 id="score-title" className="brand text-4xl">Make every game count.</h2>
                <div className="grid lg:grid-cols-[.9fr_1.1fr] gap-6 mt-6">
                <form
                    className="surface rounded-2xl p-6"
                    onSubmit={(e) => { e.preventDefault(); setScoreSaved(true); showToast("Match recorded and rating updated."); }}
                >
                    <h3 className="font-extrabold text-xl">Log a match</h3>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                    <label className="text-xs font-bold">Player A<input required className="field mt-1" defaultValue="Raka Aditya" /></label>
                    <label className="text-xs font-bold">Player B<input required className="field mt-1" placeholder="Opponent name" /></label>
                    <label className="text-xs font-bold">Your score<input required type="number" min={0} className="field mt-1" defaultValue={21} /></label>
                    <label className="text-xs font-bold">Opponent score<input required type="number" min={0} className="field mt-1" defaultValue={17} /></label>
                    </div>
                    <button className="lime-btn py-3 px-5 mt-5 text-sm" type="submit">Save match</button>
                    {scoreSaved && (
                    <p className="text-sm font-bold text-[#4f7d22] mt-3">Match saved locally. Rating updated +12.</p>
                    )}
                </form>
                <div className="space-y-6">
                    <section className="surface rounded-2xl p-6">
                    <div className="flex justify-between">
                        <div>
                        <p className="text-xs font-bold uppercase text-[#69808f]">Your rating</p>
                        <h3 className="text-4xl font-extrabold">1,284 <span className="text-sm text-[#5d8b25]">+12</span></h3>
                        </div>
                        <span className="badge bg-[#e8f9d2] text-[#4c7416]">Intermediate</span>
                    </div>
                    <p className="text-sm text-[#69808f] mt-3">
                        Simple Elo-style summary based on recorded match results.
                    </p>
                    </section>
                    <section className="surface rounded-2xl p-6">
                    <div className="flex flex-wrap justify-between gap-3">
                        <div>
                        <h3 className="font-extrabold text-xl">Mini tournament</h3>
                        <p className="text-sm text-[#69808f]">Generate a quick social format.</p>
                        </div>
                        <div className="flex gap-2">
                        {["Round-robin", "Knockout", "Americano"].map((f) => (
                            <button
                            key={f}
                            type="button"
                            className={`badge ${format === f ? "bg-[#e5f6c5] text-[#40651a]" : "bg-[#f1f5f3] text-[#48606a]"}`}
                            onClick={() => setFormat(f)}
                            >
                            {f}
                            </button>
                        ))}
                        </div>
                    </div>
                    <div className="mt-4 p-4 rounded-xl bg-[#eff8f1] text-sm">{TOURNAMENT_PREVIEWS[format]}</div>
                    </section>
                </div>
                </div>
            </section>

            {/* ---------- LEADERBOARDS ---------- */}
            <section className={`page${view === "leaderboards" ? " active" : ""}`} aria-labelledby="leaderboards-title">
                <p className="text-xs font-bold uppercase tracking-widest text-[#6b9424]">Local rankings</p>
                <h2 id="leaderboards-title" className="brand text-4xl">Climb the ladder.</h2>
                <div className="surface rounded-2xl p-5 mt-6">
                <div className="flex gap-5 border-b border-[#dbe8e1]">
                    <button className="tab-btn active">Jakarta</button>
                    <button className="tab-btn">Club</button>
                    <button className="tab-btn">September</button>
                </div>
                <div className="divide-y divide-[#e9f0eb]">
                    {[
                    { rank: "01", initials: "NA", bg: "bg-[#ffd85d]", name: "Nadia Putri", place: "Jakarta Selatan", score: "1,542", delta: "+28" },
                    { rank: "02", initials: "DI", bg: "bg-[#d6ece0]", name: "Dimas H.", place: "Kemang Smash", score: "1,489", delta: "+14" },
                    { rank: "03", initials: "RA", bg: "bg-[#e7eef8]", name: "Raka Aditya", place: "Senayan Shuttle Club", score: "1,284", delta: "+12" },
                    ].map((r) => (
                    <div key={r.rank} className="flex items-center gap-4 py-4">
                        <b className="w-7 text-[#9b7808]">{r.rank}</b>
                        <span className={`w-10 h-10 rounded-full ${r.bg} grid place-items-center font-bold`}>{r.initials}</span>
                        <div className="flex-1">
                        <b>{r.name}</b>
                        <span className="block text-xs text-[#69808f]">{r.place}</span>
                        </div>
                        <b>{r.score}</b>
                        <span className="text-sm text-[#4f7d22]">{r.delta}</span>
                    </div>
                    ))}
                </div>
                </div>
            </section>

            {/* ---------- COACHES ---------- */}
            <section className={`page${view === "coaches" ? " active" : ""}`} aria-labelledby="coaches-title">
                <p className="text-xs font-bold uppercase tracking-widest text-[#6b9424]">Level up</p>
                <h2 id="coaches-title" className="brand text-4xl">Coaches nearby.</h2>
                <div className="grid md:grid-cols-3 gap-5 mt-6">
                <article className="surface rounded-2xl overflow-hidden">
                    <img
                    className="w-full h-40 object-cover"
                    loading="lazy"
                    src="https://images.pexels.com/photos/35647222/pexels-photo-35647222.jpeg"
                    alt="Teenage boy confidently holding a badminton racket on an indoor court."
                    />
                    <div className="p-5">
                    <h3 className="font-extrabold">Coach Bima</h3>
                    <p className="text-sm text-[#69808f]">Jakarta Selatan · Beginner to Advanced</p>
                    <div className="flex justify-between mt-4">
                        <b>Rp 180k/hr</b>
                        <span className="text-[#a97900] text-sm font-bold">★ 4.9</span>
                    </div>
                    <button className="outline-btn px-3 py-2 text-sm mt-4">View profile</button>
                    </div>
                </article>
                <article className="surface rounded-2xl p-5">
                    <span className="badge bg-[#e8f9d2] text-[#4c7416]">Verified coach</span>
                    <h3 className="font-extrabold mt-4">Coach Sinta</h3>
                    <p className="text-sm text-[#69808f] mt-1">Kemang · Doubles tactics &amp; footwork</p>
                    <b className="block mt-4">Rp 220k/hr</b>
                    <button className="outline-btn px-3 py-2 text-sm mt-4">View profile</button>
                </article>
                </div>
            </section>

            {/* ---------- MARKETPLACE ---------- */}
            <section className={`page${view === "marketplace" ? " active" : ""}`} aria-labelledby="market-title">
                <p className="text-xs font-bold uppercase tracking-widest text-[#6b9424]">Second-hand gear</p>
                <h2 id="market-title" className="brand text-4xl">Give good gear another game.</h2>
                <div className="grid md:grid-cols-3 gap-5 mt-6">
                <article className="surface rounded-2xl overflow-hidden">
                    <img
                    className="w-full h-40 object-cover"
                    loading="lazy"
                    src="https://images.pexels.com/photos/36576096/pexels-photo-36576096.jpeg"
                    alt="Detailed view of a badminton racket lying on a wooden floor with focused strings."
                    />
                    <div className="p-5">
                    <span className="badge bg-[#fff4c9] text-[#946900]">Used · Excellent</span>
                    <h3 className="font-extrabold mt-3">Yonex Astrox 88D</h3>
                    <p className="text-sm text-[#69808f] mt-1">Jakarta Selatan · Posted today</p>
                    <div className="flex justify-between items-center mt-4">
                        <b>Rp 1.450.000</b>
                        <button className="lime-btn px-3 py-2 text-sm">Message seller</button>
                    </div>
                    </div>
                </article>
                <article className="surface rounded-2xl p-5">
                    <span className="badge bg-[#e7f0ff] text-[#345e98]">Bundle</span>
                    <h3 className="font-extrabold mt-3">Court shoes, size 42</h3>
                    <p className="text-sm text-[#69808f] mt-1">Lightly worn · Pickup in Blok M</p>
                    <div className="flex justify-between items-center mt-5">
                    <b>Rp 420.000</b>
                    <button className="lime-btn px-3 py-2 text-sm">Message seller</button>
                    </div>
                </article>
                </div>
                <section className="surface rounded-2xl p-6 mt-6">
                <h3 className="font-extrabold">Notifications that help, not distract</h3>
                <label className="flex justify-between items-center mt-4 text-sm font-bold">
                    Nearby Mabar matching my skill level
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#6b9424]" />
                </label>
                <label className="flex justify-between items-center mt-4 text-sm font-bold">
                    Court availability changes
                    <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#6b9424]" />
                </label>
                </section>
            </section>
            </div>
        </main>

        {/* ---------------- MOBILE NAV ---------------- */}
        <nav className="mobile-nav" aria-label="Mobile navigation">
            {MOBILE_NAV.map(({ view: v, label, Icon }) => (
            <button key={v} className={view === v ? "active" : ""} onClick={() => goTo(v)}>
                <Icon className="w-5 h-5" />
                {label}
            </button>
            ))}
        </nav>

        {/* ---------------- SESSION MODAL ---------------- */}
        <div
            className={`modal-backdrop${sessionModalOpen ? " open" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="session-modal-title"
            onClick={(e) => { if (e.target === e.currentTarget) setSessionModalOpen(false); }}
        >
            <form className="surface rounded-[24px] w-full max-w-lg p-6" onSubmit={publishSession}>
            <div className="flex justify-between items-center">
                <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#6b9424]">Host a game</p>
                <h2 id="session-modal-title" className="brand text-3xl">Create Mabar session</h2>
                </div>
                <button
                type="button"
                className="w-9 h-9 rounded-full bg-[#eff8f1]"
                aria-label="Close modal"
                onClick={() => setSessionModalOpen(false)}
                >
                <X className="w-4 h-4 mx-auto" />
                </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mt-5">
                <label className="text-xs font-bold sm:col-span-2">
                Session name
                <input
                    required
                    className="field mt-1"
                    placeholder="Friday doubles rally"
                    value={sessionForm.name}
                    onChange={(e) => setSessionForm((f) => ({ ...f, name: e.target.value }))}
                />
                </label>
                <label className="text-xs font-bold">
                Court
                <select
                    className="field mt-1"
                    value={sessionForm.court}
                    onChange={(e) => setSessionForm((f) => ({ ...f, court: e.target.value }))}
                >
                    <option>GOR Senayan</option>
                    <option>Blok M Badminton</option>
                    <option>Cilandak Sports Hall</option>
                </select>
                </label>
                <label className="text-xs font-bold">
                Skill
                <select
                    className="field mt-1"
                    value={sessionForm.skill}
                    onChange={(e) => setSessionForm((f) => ({ ...f, skill: e.target.value }))}
                >
                    <option>Intermediate</option>
                    <option>Beginner friendly</option>
                    <option>Advanced</option>
                </select>
                </label>
                <label className="text-xs font-bold">
                Date
                <input
                    required
                    type="date"
                    className="field mt-1"
                    value={sessionForm.date}
                    onChange={(e) => setSessionForm((f) => ({ ...f, date: e.target.value }))}
                />
                </label>
                <label className="text-xs font-bold">
                Slots needed
                <input
                    required
                    type="number"
                    min={1}
                    max={10}
                    className="field mt-1"
                    value={sessionForm.slots}
                    onChange={(e) => setSessionForm((f) => ({ ...f, slots: Number(e.target.value) }))}
                />
                </label>
            </div>
            <button className="lime-btn w-full py-3 mt-5" type="submit" style={{ fontSize: 16 }}>
                Publish session
            </button>
            </form>
        </div>

        {/* ---------------- TOAST ---------------- */}
        <div
            className={`toast rounded-xl bg-[#102a43] text-white px-4 py-3 shadow-xl text-sm font-bold${toast ? " show" : ""}`}
            role="status"
            aria-live="polite"
        >
            {toast}
        </div>
        </div>
    );
}