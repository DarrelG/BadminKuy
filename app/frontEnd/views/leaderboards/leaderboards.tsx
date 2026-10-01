import {
    Link, useLoaderData, type ClientLoaderFunctionArgs,
} from "react-router";
import { leaderboardsController } from "~/frontEnd/controllers/leaderboardsController";
import { LoadingState } from "~/frontEnd/components/LoadingState";

export async function clientLoader({ request }: ClientLoaderFunctionArgs) {
    return leaderboardsController.getLeaderboardsPage(new URL(request.url).searchParams.get("tab"));
}

export function HydrateFallback() {
    return <LoadingState />;
}

const AVATAR_TONES = ["bg-[#ffd85d]", "bg-[#d6ece0]", "bg-[#e7eef8]"];

export default function Leaderboards() {
    const page = useLoaderData<typeof clientLoader>();

    return (
        <section aria-labelledby="leaderboards-title">
            <p className="text-xs font-bold uppercase tracking-widest text-[#6b9424]">Local rankings</p>
            <h2 id="leaderboards-title" className="brand text-4xl">Climb the ladder.</h2>
            <div className="surface rounded-2xl p-5 mt-6">
                <div className="flex gap-5 border-b border-[#dbe8e1]">
                    {page.tabs.map((t) => (
                        <Link
                            key={t.key}
                            to={`?tab=${t.key}`}
                            className={`tab-btn${t.active ? " active" : ""}`}
                            aria-current={t.active ? "page" : undefined}
                        >
                            {t.label}
                        </Link>
                    ))}
                </div>
                <div className="divide-y divide-[#e9f0eb]">
                    {page.entries.map((e, i) => (
                        <div key={e.rank} className="flex items-center gap-4 py-4">
                            <b className="w-7 text-[#9b7808]">{e.rank}</b>
                            <span className={`w-10 h-10 rounded-full ${AVATAR_TONES[i % AVATAR_TONES.length]} grid place-items-center font-bold`}>
                                {e.initials}
                            </span>
                            <div className="flex-1">
                                <b>{e.name}</b>
                                <span className="block text-xs text-[#69808f]">{e.place}</span>
                            </div>
                            <b>{e.scoreLabel}</b>
                            <span className="text-sm text-[#4f7d22]">{e.deltaLabel}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
