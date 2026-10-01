import { useLoaderData } from "react-router";
import { marketplaceController } from "~/frontEnd/controllers/marketplaceController";
import { LoadingState } from "~/frontEnd/components/LoadingState";

export async function clientLoader() {
    return marketplaceController.getMarketplacePage();
}

export function HydrateFallback() {
    return <LoadingState />;
}

const BADGE_TONE = {
    amber: "bg-[#fff4c9] text-[#946900]",
    blue: "bg-[#e7f0ff] text-[#345e98]",
};

export default function Marketplace() {
    const page = useLoaderData<typeof clientLoader>();

    return (
        <section aria-labelledby="market-title">
            <p className="text-xs font-bold uppercase tracking-widest text-[#6b9424]">Second-hand gear</p>
            <h2 id="market-title" className="brand text-4xl">Give good gear another game.</h2>
            <div className="grid md:grid-cols-3 gap-5 mt-6">
                {page.listings.map((l) => (
                    <article key={l.id} className="surface rounded-2xl overflow-hidden">
                        {l.imageUrl && (
                            <img className="w-full h-40 object-cover" loading="lazy" src={l.imageUrl} alt={l.imageAlt} />
                        )}
                        <div className="p-5">
                            <span className={`badge ${BADGE_TONE[l.badgeTone]}`}>{l.badgeLabel}</span>
                            <h3 className="font-extrabold mt-3">{l.title}</h3>
                            <p className="text-sm text-[#69808f] mt-1">{l.details}</p>
                            <div className="flex justify-between items-center mt-4">
                                <b>{l.priceLabel}</b>
                                <button type="button" className="lime-btn px-3 py-2 text-sm">Message seller</button>
                            </div>
                        </div>
                    </article>
                ))}
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
    );
}
