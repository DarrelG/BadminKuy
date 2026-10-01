import { useLoaderData } from "react-router";
import { coachesController } from "~/frontEnd/controllers/CoachesController";
import { LoadingState } from "~/frontEnd/components/LoadingState";

export async function clientLoader() {
    return coachesController.getCoachesPage();
}

export function HydrateFallback() {
    return <LoadingState />;
}

export default function Coaches() {
    const page = useLoaderData<typeof clientLoader>();

    return (
        <section aria-labelledby="coaches-title">
            <p className="text-xs font-bold uppercase tracking-widest text-[#6b9424]">Level up</p>
            <h2 id="coaches-title" className="brand text-4xl">Coaches nearby.</h2>
            <div className="grid md:grid-cols-3 gap-5 mt-6">
                {page.datas.map((c) => (
                    <article key={c.id} className="surface rounded-2xl overflow-hidden">
                        {c.imageUrl && (
                            <img className="w-full h-40 object-cover" loading="lazy" src={c.imageUrl} alt={c.imageUrl} />
                        )}
                        <div className="p-5">
                            {c.isVerified && <span className="badge bg-[#e8f9d2] text-[#4c7416]">Verified coach</span>}
                            <h3 className={`font-extrabold${c.isVerified ? " mt-4" : ""}`}>{c.name}</h3>
                            <p className="text-sm text-[#69808f] mt-1">{c.description}</p>
                            <div className="flex justify-between mt-4">
                                <b>{c.pricePerHour}</b>
                                {c.rating && <span className="text-[#a97900] text-sm font-bold">{c.rating}</span>}
                            </div>
                            <button type="button" className="outline-btn px-3 py-2 text-sm mt-4">View profile</button>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
