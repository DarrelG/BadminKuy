import { useEffect, useRef, useState } from "react";
import { useFetcher, useLoaderData, type ClientActionFunctionArgs } from "react-router";
import { X } from "lucide-react";
import { mabarController } from "~/frontEnd/controllers/mabarController";
import { LoadingState } from "~/frontEnd/components/LoadingState";
import { PageHeader } from "~/frontEnd/components/PageHeader";
import { Toast } from "~/frontEnd/components/Toast";
import { actionFail } from "~/frontEnd/utils/actionResult";
import { formText } from "~/frontEnd/utils/form";
import { todayInputValue } from "~/frontEnd/utils/format";
import type { SkillLevel } from "~/backend/models/UserModel";
import type { ActionResult } from "~/frontEnd/viewModels/actionResult";

export async function clientLoader() {
    return mabarController.getMabarPage();
}

export async function clientAction({ request }: ClientActionFunctionArgs): Promise<ActionResult> {
    const form = await request.formData();
    const intent = formText(form, "intent");

    if (intent === "join") {
        return mabarController.joinSession(formText(form, "sessionId"));
    }
    if (intent === "create") {
        return mabarController.createSession({
            title: formText(form, "title"),
            courtName: formText(form, "courtName"),
            skill: formText(form, "skill"),
            date: formText(form, "date"),
            time: formText(form, "time"),
            slots: Number(formText(form, "slots")),
            price: Number(formText(form, "price")),
        });
    }
    return actionFail(intent, "Unknown action.");
}

export function HydrateFallback() {
    return <LoadingState />;
}

const SKILL_TONE: Record<SkillLevel, string> = {
    beginner: "bg-[#e7f0ff] text-[#345e98]",
    intermediate: "bg-[#e8f9d2] text-[#4c7416]",
    advanced: "bg-[#fff4c9] text-[#946900]",
};

export default function Mabar() {
    const page = useLoaderData<typeof clientLoader>();
    const fetcher = useFetcher<typeof clientAction>();
    const [modalOpen, setModalOpen] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    // Close the modal and clear the form once a session was created
    useEffect(() => {
        if (fetcher.state === "idle" && fetcher.data?.ok && fetcher.data.intent === "create") {
            setModalOpen(false);
            formRef.current?.reset();
        }
    }, [fetcher.state, fetcher.data]);

    const joiningId = fetcher.formData?.get("intent") === "join" ? String(fetcher.formData.get("sessionId")) : null;
    const createError = fetcher.data?.intent === "create" && !fetcher.data.ok ? fetcher.data.message : null;
    const creating = fetcher.formData?.get("intent") === "create";

    return (
        <section aria-labelledby="mabar-title">
            <PageHeader
                eyebrow="Play together"
                title="The Mabar board."
                titleId="mabar-title"
                subtitle="Find your crew, split the court, play more."
            >
                <button type="button" className="lime-btn px-5 py-3 text-base" onClick={() => setModalOpen(true)}>
                    Create session
                </button>
            </PageHeader>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
                {page.sessions.map((s) => (
                    <article key={s.id} className="surface rounded-2xl p-5">
                        <div className="flex justify-between">
                            <span className={`badge ${SKILL_TONE[s.skill]}`}>{s.skillLabel}</span>
                            <span className="text-xs font-bold text-[#69808f]">{s.whenLabel}</span>
                        </div>
                        <h3 className="font-extrabold text-lg mt-4">{s.title}</h3>
                        <p className="text-sm text-[#69808f] mt-1">{s.meta}</p>
                        <div className="flex items-center justify-between mt-5">
                            <span className="text-sm font-bold">{s.playersLabel}</span>
                            <fetcher.Form method="post">
                                <input type="hidden" name="intent" value="join" />
                                <input type="hidden" name="sessionId" value={s.id} />
                                <button
                                    type="submit"
                                    className={s.joined ? "outline-btn px-4 py-2 text-sm" : "lime-btn px-4 py-2 text-sm"}
                                    disabled={s.joined || s.full || joiningId === s.id}
                                >
                                    {s.joined ? "Joined ✓" : s.full ? "Full" : joiningId === s.id ? "Joining..." : "Join session"}
                                </button>
                            </fetcher.Form>
                        </div>
                    </article>
                ))}
            </div>

            <div
                className={`modal-backdrop${modalOpen ? " open" : ""}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="session-modal-title"
                onClick={(event) => {
                    if (event.target === event.currentTarget) setModalOpen(false);
                }}
            >
                <fetcher.Form ref={formRef} method="post" className="surface rounded-[24px] w-full max-w-lg p-6 max-h-full overflow-auto">
                    <input type="hidden" name="intent" value="create" />
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-[#6b9424]">Host a game</p>
                            <h2 id="session-modal-title" className="brand text-3xl">Create Mabar session</h2>
                        </div>
                        <button
                            type="button"
                            className="w-9 h-9 rounded-full bg-[#eff8f1] grid place-items-center"
                            aria-label="Close modal"
                            onClick={() => setModalOpen(false)}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3 mt-5">
                        <label className="text-xs font-bold sm:col-span-2">
                            Session name
                            <input required name="title" minLength={3} maxLength={60} className="field mt-1" placeholder="Friday doubles rally" />
                        </label>
                        <label className="text-xs font-bold">
                            Court
                            <select name="courtName" className="field mt-1">
                                {page.courtOptions.map((name) => (
                                    <option key={name}>{name}</option>
                                ))}
                            </select>
                        </label>
                        <label className="text-xs font-bold">
                            Skill
                            <select name="skill" className="field mt-1" defaultValue="intermediate">
                                {page.skillOptions.map((o) => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </label>
                        <label className="text-xs font-bold">
                            Date
                            <input required name="date" type="date" min={todayInputValue()} className="field mt-1" />
                        </label>
                        <label className="text-xs font-bold">
                            Time
                            <input required name="time" type="time" defaultValue="19:00" className="field mt-1" />
                        </label>
                        <label className="text-xs font-bold">
                            Slots needed
                            <input required name="slots" type="number" min={1} max={10} defaultValue={3} className="field mt-1" />
                        </label>
                        <label className="text-xs font-bold">
                            Price per person (Rp)
                            <input required name="price" type="number" min={0} step={1000} defaultValue={45000} className="field mt-1" />
                        </label>
                    </div>
                    {createError && <p className="text-xs font-bold text-[#c54f31] mt-3">{createError}</p>}
                    <button className="lime-btn w-full py-3 mt-5 text-base" type="submit" disabled={creating}>
                        {creating ? "Publishing..." : "Publish session"}
                    </button>
                </fetcher.Form>
            </div>

            <Toast result={fetcher.data} />
        </section>
    );
}
