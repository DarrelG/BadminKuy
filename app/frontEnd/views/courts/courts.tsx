import { useEffect } from "react";
import {
    Form, Link, useFetcher, useLoaderData, useSearchParams, useSubmit,
    type ClientActionFunctionArgs, type ClientLoaderFunctionArgs,
} from "react-router";
import { BadgeCheck, Map, MessageCircle, Search, X } from "lucide-react";
import { courtsController } from "~/frontEnd/controllers/courtsController";
import { LoadingState } from "~/frontEnd/components/LoadingState";
import { PageHeader } from "~/frontEnd/components/PageHeader";
import { Toast } from "~/frontEnd/components/Toast";
import { actionFail } from "~/frontEnd/utils/actionResult";
import { formText } from "~/frontEnd/utils/form";
import { todayInputValue } from "~/frontEnd/utils/format";
import type { ActionResult } from "~/frontEnd/viewModels/actionResult";

export async function clientLoader({ request }: ClientLoaderFunctionArgs) {
    return courtsController.getCourtsPage(new URL(request.url).searchParams);
}

export async function clientAction({ request }: ClientActionFunctionArgs): Promise<ActionResult> {
    const form = await request.formData();
    const intent = formText(form, "intent");

    if (intent === "booking") {
        return courtsController.requestBooking({
            courtId: formText(form, "courtId"),
            date: formText(form, "date"),
            time: formText(form, "time"),
        });
    }
    if (intent === "report") {
        return courtsController.reportCourt(formText(form, "courtId"));
    }
    return actionFail(intent, "Unknown action.");
}

export function HydrateFallback() {
    return <LoadingState />;
}

const QUICK_FILTERS = [
    { label: "Jakarta Selatan", key: "q", value: "Jakarta Selatan" },
    { label: "Under 70k", key: "maxPrice", value: "70000" },
    { label: "Parking", key: "facility", value: "Parking" },
    { label: "Shower", key: "facility", value: "Shower" },
];

export default function Courts() {
    const page = useLoaderData<typeof clientLoader>();
    const [params] = useSearchParams();
    const submit = useSubmit();
    const fetcher = useFetcher<typeof clientAction>();
    const selected = page.selected;

    // Quick filters toggle one URL parameter and close any open court detail
    const filterLink = (key: string, value: string) => {
        const next = new URLSearchParams(params);
        next.delete("court");
        if (next.get(key) === value) next.delete(key);
        else next.set(key, value);
        return `?${next.toString()}`;
    };

    const courtLink = (id: string | null) => {
        const next = new URLSearchParams(params);
        if (id) next.set("court", id);
        else next.delete("court");
        return `?${next.toString()}`;
    };

    useEffect(() => {
        if (selected) {
            document.getElementById("court-detail")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [selected?.id]);

    const booking = fetcher.data?.intent === "booking" ? fetcher.data : null;

    return (
        <section aria-labelledby="courts-title">
            <PageHeader
                eyebrow="Court directory"
                title="Choose your court."
                titleId="courts-title"
                subtitle="Verified details from local players and court admins."
            >
                <button type="button" className="outline-btn px-4 py-3 text-sm">
                    <Map className="inline w-4 h-4 mr-1" /> Map view
                </button>
            </PageHeader>

            <div className="surface rounded-2xl p-4 mt-6">
                <Form
                    method="get"
                    replace
                    onChange={(event) => {
                        const fieldName = (event.target as HTMLElement).getAttribute("name");
                        // Text search submits on Enter; the other fields submit as soon as they change
                        if (fieldName !== "q") submit(event.currentTarget, { replace: true });
                    }}
                >
                    <div className="grid md:grid-cols-[2fr_1fr_1fr_auto] gap-3">
                        <label className="relative">
                            <span className="sr-only">Search courts</span>
                            <Search className="absolute left-3 top-3 w-5 h-5 text-[#69808f]" />
                            <input
                                key={page.filters.query}
                                name="q"
                                className="field pl-10"
                                placeholder="Search court or district"
                                defaultValue={page.filters.query}
                            />
                        </label>
                        <label>
                            <span className="sr-only">Floor type</span>
                            <select name="floor" className="field" defaultValue={page.filters.floor}>
                                <option value="">Any floor</option>
                                <option value="Wood">Wood</option>
                                <option value="Vinyl">Vinyl</option>
                                <option value="Rubber">Rubber</option>
                            </select>
                        </label>
                        <label>
                            <span className="sr-only">Availability</span>
                            <select name="availability" className="field" defaultValue={page.filters.availability}>
                                <option value="">Any availability</option>
                                <option value="open">Open now</option>
                                <option value="busy">Busy now</option>
                            </select>
                        </label>
                        <label className="flex items-center gap-2 px-3 text-sm font-bold">
                            <input
                                name="verified"
                                value="1"
                                type="checkbox"
                                className="accent-[#6b9424] w-4 h-4"
                                defaultChecked={page.filters.verifiedOnly}
                            />
                            Verified only
                        </label>
                    </div>
                    <input type="hidden" name="maxPrice" value={page.filters.maxPrice} />
                    <input type="hidden" name="facility" value={page.filters.facility} />
                </Form>

                <div className="flex flex-wrap gap-2 mt-3 text-xs">
                    <span className="font-bold text-[#69808f] py-2">Quick filters:</span>
                    {QUICK_FILTERS.map((f) => {
                        const active = params.get(f.key) === f.value;
                        return (
                            <Link
                                key={f.label}
                                to={filterLink(f.key, f.value)}
                                preventScrollReset
                                className={`badge ${active ? "bg-[#e5f6c5] text-[#40651a]" : "bg-[#eff8f1] text-[#40651a]"}`}
                                aria-pressed={active}
                            >
                                {f.label}
                            </Link>
                        );
                    })}
                </div>
            </div>

            <p className="text-sm text-[#69808f] mt-5">{page.countLabel}</p>
            {page.courts.length === 0 && (
                <p className="surface rounded-2xl p-6 mt-3 text-sm text-[#69808f]">
                    No courts match these filters. Clear a filter to see more.
                </p>
            )}
            <div className="grid lg:grid-cols-3 gap-5 mt-3">
                {page.courts.map((c) => (
                    <article key={c.id} className="surface court-card rounded-2xl overflow-hidden">
                        <img className="w-full h-44 object-cover" loading="lazy" src={c.imageUrl} alt={c.imageAlt} />
                        <div className="p-5">
                            <div className="flex justify-between gap-2">
                                <h3 className="font-extrabold text-[19px]">{c.name}</h3>
                                <span className={`badge whitespace-nowrap ${c.verified ? "bg-[#e8f9d2] text-[#4c7416]" : "bg-[#fff4c9] text-[#946900]"}`}>
                                    {c.verified && <BadgeCheck className="w-3 h-3" />}
                                    {c.verifiedLabel}
                                </span>
                            </div>
                            <p className="text-xs text-[#69808f] mt-1">{c.address}</p>
                            <div className="flex gap-2 flex-wrap mt-3">
                                <span className="badge bg-[#f1f5f3] text-[#48606a]">{c.courtCountLabel}</span>
                                <span className="badge bg-[#f1f5f3] text-[#48606a]">{c.floorLabel}</span>
                                <span className={`badge ${c.isOpen ? "bg-[#e8f9d2] text-[#4c7416]" : "bg-[#fff0e9] text-[#c54f31]"}`}>
                                    {c.statusLabel}
                                </span>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <div>
                                    <b>{c.priceLabel}</b>
                                    <span className="text-xs text-[#69808f]"> / hour</span>
                                    <p className="text-xs text-[#a97900] font-bold">{c.ratingLabel}</p>
                                </div>
                                <Link to={courtLink(c.id)} preventScrollReset className="lime-btn px-3 py-2 text-sm">
                                    View
                                </Link>
                            </div>
                            <div className="flex justify-between mt-4 pt-3 border-t border-[#edf2ef] text-xs">
                                <a href={c.mapUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-[#527c20]">
                                    Open map ↗
                                </a>
                                <fetcher.Form method="post">
                                    <input type="hidden" name="intent" value="report" />
                                    <input type="hidden" name="courtId" value={c.id} />
                                    <button type="submit" className="text-[#69808f]">Report wrong info</button>
                                </fetcher.Form>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {selected && (
                <section id="court-detail" className="mt-7 surface rounded-[24px] overflow-hidden" aria-live="polite">
                    <div className="grid lg:grid-cols-[1.1fr_.9fr]">
                        <img className="w-full h-full min-h-[320px] object-cover" loading="lazy" src={selected.imageUrl} alt={selected.imageAlt} />
                        <div className="p-6">
                            <div className="flex justify-between gap-4">
                                <div>
                                    <span className={`badge ${selected.verified ? "bg-[#e8f9d2] text-[#4c7416]" : "bg-[#fff4c9] text-[#946900]"}`}>
                                        {selected.verified && <BadgeCheck className="w-3 h-3" />}
                                        {selected.verified ? "Verified court" : "Pending review"}
                                    </span>
                                    <h3 className="brand text-3xl mt-3">{selected.name}</h3>
                                    <p className="text-sm text-[#69808f] mt-1">{selected.subtitle}</p>
                                </div>
                                <Link
                                    to={courtLink(null)}
                                    preventScrollReset
                                    className="w-9 h-9 rounded-full bg-[#eff8f1] grid place-items-center shrink-0"
                                    aria-label="Close court detail"
                                >
                                    <X className="w-4 h-4" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-center mt-5">
                                {[
                                    { v: selected.hoursLabel, l: "HOURS" },
                                    { v: selected.priceShort, l: "PER HOUR" },
                                    { v: selected.ratingShort, l: "RATING" },
                                ].map(({ v, l }) => (
                                    <div key={l} className="bg-[#eff8f1] p-3 rounded-xl">
                                        <b>{v}</b>
                                        <span className="block text-[10px] text-[#69808f]">{l}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm mt-5 leading-6">{selected.description}</p>
                            <div className="mt-5 p-3 rounded-xl border border-[#f0d37c] bg-[#fffaf0]">
                                <b className="text-sm">Admin approval: {selected.approvalLabel}</b>
                                <p className="text-xs text-[#7d6a30] mt-1">
                                    Court admin access is enforced by Supabase row-level security, never by hidden buttons alone.
                                </p>
                            </div>
                            <fetcher.Form method="post" className="mt-5 grid sm:grid-cols-2 gap-3">
                                <input type="hidden" name="intent" value="booking" />
                                <input type="hidden" name="courtId" value={selected.id} />
                                <label className="text-xs font-bold">
                                    Preferred date
                                    <input required name="date" type="date" min={todayInputValue()} className="field mt-1" />
                                </label>
                                <label className="text-xs font-bold">
                                    Preferred time
                                    <select name="time" className="field mt-1" defaultValue="19:00">
                                        <option>19:00</option>
                                        <option>20:00</option>
                                        <option>21:00</option>
                                    </select>
                                </label>
                                <button className="lime-btn py-3 text-sm" type="submit" disabled={fetcher.state !== "idle"}>
                                    {fetcher.state !== "idle" ? "Sending..." : "Send booking request"}
                                </button>
                                <a
                                    href="https://wa.me/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="outline-btn py-3 text-sm text-center"
                                >
                                    <MessageCircle className="inline w-4 h-4" /> Book via WhatsApp
                                </a>
                            </fetcher.Form>
                            {booking && (
                                <p className={`text-xs font-bold mt-3 ${booking.ok ? "text-[#4f7d22]" : "text-[#c54f31]"}`}>
                                    {booking.message}
                                </p>
                            )}
                        </div>
                    </div>
                </section>
            )}

            <Toast result={fetcher.data} />
        </section>
    );
}
