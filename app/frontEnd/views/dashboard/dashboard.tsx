import { Link, useLoaderData } from "react-router";
import { Activity, BadgeCheck, CalendarDays } from "lucide-react";
import { dashboardController } from "~/frontEnd/controllers/dashboardController";
import { LoadingState } from "~/frontEnd/components/LoadingState";

export async function clientLoader() {
    return dashboardController.getDashboardPage();
}

export function HydrateFallback() {
    return <LoadingState />;
}

export default function Dashboard() {
    const page = useLoaderData<typeof clientLoader>();

    return (
        <>
            <section aria-labelledby="home-title">
                <div className="grid lg:grid-cols-[1.35fr_.65fr] gap-6">
                    <div className="court-lines rounded-[28px] p-7 md:p-10 relative overflow-hidden text-white bg-[#102a43]">
                        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full border-[24px] border-[#bcf24a]/20" />
                        <div className="relative max-w-xl">
                            <span className="badge bg-[#bcf24a] text-[#17324d]">{page.heroBadge}</span>
                            <h2 id="home-title" className="brand text-2xl font-extrabold leading-tight mt-5">
                                Find your next game.
                            </h2>
                            <p className="text-lg text-[#d9e9e2] mt-4">Courts, crews, and games near you.</p>
                            <div className="flex flex-wrap gap-3 mt-7">
                                <Link to="/courts" className="lime-btn px-5 py-3 text-base">Find a court</Link>
                                <Link
                                    to="/mabar"
                                    className="px-5 py-3 rounded-[13px] border border-[#a8c1b7] font-bold text-base hover:bg-white/10"
                                >
                                    Join a Mabar
                                </Link>
                            </div>
                        </div>
                    </div>

                    <aside className="surface rounded-[28px] p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-widest text-[#69808f]">
                                    Live local pulse
                                </p>
                                <h3 className="text-[19px] font-extrabold mt-1">Today in badminton</h3>
                            </div>
                            <span className="w-10 h-10 rounded-full bg-[#fff4c9] grid place-items-center">
                                <Activity className="w-5 h-5 text-[#a87b00]" />
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mt-6 text-center">
                            {page.pulse.map((p) => (
                                <div key={p.label} className="rounded-2xl bg-[#eff8f1] p-3">
                                    <b className="block text-lg">{p.value}</b>
                                    <span className="text-[10px] font-bold text-[#69808f]">{p.label}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-[#69808f] mt-5">
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
                            <Link to="/courts" className="text-sm font-bold text-[#527c20]">Explore all →</Link>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {page.featuredCourts.map((c) => (
                                <article key={c.id} className="surface court-card rounded-2xl overflow-hidden">
                                    <img className="w-full h-36 object-cover" loading="lazy" src={c.imageUrl} alt={c.imageAlt} />
                                    <div className="p-4">
                                        <div className="flex justify-between">
                                            <h4 className="font-extrabold text-base">{c.name}</h4>
                                            <span className={`badge ${c.verified ? "bg-[#e8f9d2] text-[#4c7416]" : "bg-[#fff4c9] text-[#946900]"}`}>
                                                {c.verified && <BadgeCheck className="w-3 h-3" />}
                                                {c.verifiedLabel}
                                            </span>
                                        </div>
                                        <p className="text-xs text-[#69808f] mt-1">{c.address}</p>
                                        <div className="flex justify-between mt-4 text-sm">
                                            <b>{c.priceLabel}</b>
                                            <span className={c.isOpen ? "text-[#4f7d22] font-bold" : "text-[#d35c3e] font-bold"}>
                                                ● {c.statusLabel}
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
                            {page.upcoming.map((s) => (
                                <div
                                    key={s.id}
                                    className={`p-3 rounded-xl ${s.isToday ? "bg-[#eff8f1]" : "border border-[#dbe8e1]"}`}
                                >
                                    <div className="flex justify-between">
                                        <b className="text-sm">{s.title}</b>
                                        <span className={`text-xs font-bold ${s.isToday ? "text-[#5b8522]" : "text-[#69808f]"}`}>
                                            {s.dayLabel}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[#69808f] mt-1">{s.detail}</p>
                                </div>
                            ))}
                        </div>
                        <Link to="/mabar" className="inline-block mt-4 text-sm font-bold text-[#527c20]">
                            See Mabar board →
                        </Link>
                    </section>
                </div>
            </section>
        </>
    );
}
