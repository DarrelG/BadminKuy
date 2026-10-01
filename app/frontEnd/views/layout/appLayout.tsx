import "../../styles/appShell.css";
import { useLayoutEffect, useRef, useState } from "react";
import { NavLink, Outlet, useLoaderData, useLocation, useNavigate } from "react-router";
import {
    Badge, Bell, ChevronDown, Feather, GraduationCap, House, LogOut, MapPin,
    Medal, MessagesSquare, ShoppingBag, Trophy, UsersRound, type LucideIcon,
} from "lucide-react";
import { authController } from "~/frontEnd/controllers/authController";
import { layoutController } from "~/frontEnd/controllers/layoutController";
import { LoadingState } from "~/frontEnd/components/LoadingState";

export async function clientLoader() {
    return layoutController.getLayoutPage();
}

export function HydrateFallback() {
    return <LoadingState />;
}

type NavItem = { to: string; label: string; Icon: LucideIcon };

const NAV_ITEMS: NavItem[] = [
    { to: "/", label: "Home", Icon: House },
    { to: "/courts", label: "Courts", Icon: MapPin },
    { to: "/mabar", label: "Mabar", Icon: UsersRound },
    { to: "/chat", label: "Chat", Icon: MessagesSquare },
    { to: "/clubs", label: "Clubs", Icon: Badge },
    { to: "/score", label: "Score Tracker", Icon: Trophy },
    { to: "/leaderboards", label: "Leaderboards", Icon: Medal },
    { to: "/coaches", label: "Coaches", Icon: GraduationCap },
    { to: "/marketplace", label: "Marketplace", Icon: ShoppingBag },
];

const MOBILE_NAV: NavItem[] = [
    { to: "/", label: "Home", Icon: House },
    { to: "/courts", label: "Courts", Icon: MapPin },
    { to: "/mabar", label: "Mabar", Icon: UsersRound },
    { to: "/chat", label: "Chat", Icon: MessagesSquare },
    { to: "/score", label: "Score", Icon: Trophy },
];

const navClass = ({ isActive }: { isActive: boolean }) => `nav-item${isActive ? " active" : ""}`;
const mobileClass = ({ isActive }: { isActive: boolean }) => (isActive ? "active" : "");

type Pill = { top: number; height: number; visible: boolean };

export default function AppLayout() {
    const page = useLoaderData<typeof clientLoader>();
    const navigate = useNavigate();
    const location = useLocation();
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifRead, setNotifRead] = useState(false);

    const navRef = useRef<HTMLElement | null>(null);
    const [pill, setPill] = useState<Pill>({ top: 0, height: 0, visible: false });

    useLayoutEffect(() => {
        const nav = navRef.current;
        if (!nav) return;

        const measure = () => {
            const active = nav.querySelector<HTMLElement>(".nav-item.active");
            if (!active) {
                setPill((p) => ({ ...p, visible: false }));
                return;
            }
            setPill({
                top: active.offsetTop,
                height: active.offsetHeight,
                visible: true,
            });
        };

        measure();

        const ro = new ResizeObserver(measure);
        ro.observe(nav);
        window.addEventListener("resize", measure);
        if (document.fonts?.ready) document.fonts.ready.then(measure);

        return () => {
            ro.disconnect();
            window.removeEventListener("resize", measure);
        };
    }, [location.pathname]);

    const handleLogout = async () => {
        await authController.logout();
        navigate("/login");
    };

    return (
        <div className="bk-shell">
            <aside className="side-nav" aria-label="Primary navigation">
                <div className="px-3 mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-[#bcf24a] text-[#102a43] grid place-items-center">
                            <Feather className="w-5 h-5" />
                        </div>
                        <h1 className="brand text-[32px] text-white font-extrabold">BadminKuy</h1>
                    </div>
                    <p className="text-xs mt-2 text-[#a9c4b9]">Your local badminton circle</p>
                </div>

                <nav ref={navRef} className="nav-list space-y-1">
                    <span
                        className={`nav-pill${pill.visible ? " is-visible" : ""}`}
                        style={{
                            transform: `translateY(${pill.top}px)`,
                            height: pill.height,
                        }}
                        aria-hidden="true"
                    />
                    {NAV_ITEMS.map(({ to, label, Icon }) => (
                        <NavLink key={to} to={to} end={to === "/"} className={navClass}>
                            <Icon className="w-4 h-4" />
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="absolute bottom-6 left-4 right-4 rounded-2xl bg-[#193952] p-4">
                    <p className="text-[11px] font-bold text-[#bcf24a]">PLAY FAIR. PLAY MORE.</p>
                    <p className="text-xs leading-5 mt-1 text-[#c8d8d3]">
                        Good rallies start with a friendly invite.
                    </p>
                </div>
            </aside>

            <main className="main-area">
                <header className="sticky top-0 z-20 bg-[#f4f8f5]/90 backdrop-blur border-b border-[#dbe8e1] px-5 md:px-8 py-3">
                    <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="md:hidden w-9 h-9 rounded-full bg-[#102a43] text-[#bcf24a] grid place-items-center">
                                <Feather className="w-5 h-5" />
                            </div>
                            <button className="flex items-center gap-2 outline-btn px-3 py-2 text-sm" type="button">
                                <MapPin className="w-4 h-4 text-[#6b9424]" />
                                <span>{page.city}</span>
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex items-center gap-3 relative">
                            <button
                                type="button"
                                className="relative w-10 h-10 rounded-full bg-white border border-[#dbe8e1] grid place-items-center"
                                aria-label="Open notifications"
                                aria-expanded={notifOpen}
                                onClick={() => setNotifOpen((open) => !open)}
                            >
                                <Bell className="w-4 h-4" />
                                {page.hasUnread && !notifRead && (
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-[#e96a47] rounded-full" />
                                )}
                            </button>

                            <div className={`notification-pop surface rounded-2xl overflow-hidden${notifOpen ? " open" : ""}`}>
                                <div className="p-4 flex justify-between items-center border-b border-[#e4eee8]">
                                    <strong>Notifications</strong>
                                    <button
                                        type="button"
                                        className="text-xs font-bold text-[#548020]"
                                        onClick={() => setNotifRead(true)}
                                    >
                                        Mark all read
                                    </button>
                                </div>
                                {page.notifications.length === 0 ? (
                                    <p className="p-4 text-sm text-[#69808f]">You're all caught up.</p>
                                ) : (
                                    page.notifications.map((n) => (
                                        <div
                                            key={n.id}
                                            className={`p-4 border-b border-[#eef4ef] last:border-b-0${notifRead ? " opacity-50" : ""}`}
                                        >
                                            <strong className="block text-sm">{n.title}</strong>
                                            <span className="text-xs text-[#69808f]">{n.body}</span>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="w-10 h-10 rounded-full bg-[#ffd85d] grid place-items-center font-extrabold text-[#102a43]">
                                    {page.initials}
                                </span>
                                <span className="desktop-only text-left">
                                    <b className="block text-sm">{page.username}</b>
                                    <small className="text-[#69808f]">{page.skillLabel}</small>
                                </span>
                            </div>
                            <button
                                type="button"
                                className="w-10 h-10 rounded-full bg-white border border-[#dbe8e1] grid place-items-center"
                                aria-label="Log out"
                                title="Log out"
                                onClick={handleLogout}
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-5 md:px-8 py-7">
                    <Outlet />
                </div>
            </main>

            <nav className="mobile-nav" aria-label="Mobile navigation">
                {MOBILE_NAV.map(({ to, label, Icon }) => (
                    <NavLink key={to} to={to} end={to === "/"} className={mobileClass}>
                        <Icon className="w-5 h-5" />
                        {label}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
}