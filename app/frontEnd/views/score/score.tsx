import { useEffect, useRef, useState } from "react";
import { useFetcher, useLoaderData, type ClientActionFunctionArgs } from "react-router";
import { scoreController } from "~/frontEnd/controllers/ScoreController";
import { LoadingState } from "~/frontEnd/components/LoadingState";
import { Toast } from "~/frontEnd/components/Toast";
import { actionFail } from "~/frontEnd/utils/actionResult";
import { formText } from "~/frontEnd/utils/form";
import type { ActionResult } from "~/frontEnd/viewModels/ActionResult";

export async function clientLoader() {
    return scoreController.getScorePage();
}

export async function clientAction({ request }: ClientActionFunctionArgs): Promise<ActionResult> {
    const form = await request.formData();
    const intent = formText(form, "intent");

    if (intent === "match") {
        return scoreController.saveMatch({
            playerA: formText(form, "playerA"),
            playerB: formText(form, "playerB"),
            scoreA: Number(formText(form, "scoreA")),
            scoreB: Number(formText(form, "scoreB")),
        });
    }
    return actionFail(intent, "Unknown action.");
}

export function HydrateFallback() {
    return <LoadingState />;
}

export default function Score() {
    const page = useLoaderData<typeof clientLoader>();
    const fetcher = useFetcher<typeof clientAction>();
    const formRef = useRef<HTMLFormElement>(null);
    const [format, setFormat] = useState(page.tournamentFormats[0]?.name ?? "");
    const preview = page.tournamentFormats.find((f) => f.name === format);

    useEffect(() => {
        if (fetcher.state === "idle" && fetcher.data?.ok) {
            formRef.current?.reset();
        }
    }, [fetcher.state, fetcher.data]);

    const result = fetcher.data?.intent === "match" ? fetcher.data : null;
    const saving = fetcher.state !== "idle";

    return (
        <section aria-labelledby="score-title">
            <p className="text-xs font-bold uppercase tracking-widest text-[#6b9424]">Match tools</p>
            <h2 id="score-title" className="brand text-4xl">Make every game count.</h2>
            <div className="grid lg:grid-cols-[.9fr_1.1fr] gap-6 mt-6">
                <fetcher.Form ref={formRef} method="post" className="surface rounded-2xl p-6">
                    <input type="hidden" name="intent" value="match" />
                    <h3 className="font-extrabold text-xl">Log a match</h3>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        <label className="text-xs font-bold">
                            Player A
                            <input required name="playerA" className="field mt-1" defaultValue={page.defaultPlayerA} />
                        </label>
                        <label className="text-xs font-bold">
                            Player B
                            <input required name="playerB" className="field mt-1" placeholder="Opponent name" maxLength={40} />
                        </label>
                        <label className="text-xs font-bold">
                            Your score
                            <input required name="scoreA" type="number" min={0} max={99} className="field mt-1" defaultValue={21} />
                        </label>
                        <label className="text-xs font-bold">
                            Opponent score
                            <input required name="scoreB" type="number" min={0} max={99} className="field mt-1" defaultValue={17} />
                        </label>
                    </div>
                    <button className="lime-btn py-3 px-5 mt-5 text-sm" type="submit" disabled={saving}>
                        {saving ? "Saving..." : "Save match"}
                    </button>
                    {result && (
                        <p className={`text-sm font-bold mt-3 ${result.ok ? "text-[#4f7d22]" : "text-[#c54f31]"}`}>
                            {result.message}
                        </p>
                    )}
                </fetcher.Form>

                <div className="space-y-6">
                    <section className="surface rounded-2xl p-6">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase text-[#69808f]">Your rating</p>
                                <h3 className="text-4xl font-extrabold">
                                    {page.ratingLabel} <span className="text-sm text-[#5d8b25]">{page.deltaLabel}</span>
                                </h3>
                            </div>
                            <span className="badge bg-[#e8f9d2] text-[#4c7416] self-start">{page.levelLabel}</span>
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
                                {page.tournamentFormats.map((f) => (
                                    <button
                                        key={f.name}
                                        type="button"
                                        className={`badge ${format === f.name ? "bg-[#e5f6c5] text-[#40651a]" : "bg-[#f1f5f3] text-[#48606a]"}`}
                                        aria-pressed={format === f.name}
                                        onClick={() => setFormat(f.name)}
                                    >
                                        {f.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {preview && (
                            <div className="mt-4 p-4 rounded-xl bg-[#eff8f1] text-sm">
                                <b>{preview.title}</b>
                                {preview.lines.map((line, i) => (
                                    <p key={line} className={i === 0 ? "mt-2" : "mt-1"}>{line}</p>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>

            <Toast result={fetcher.data} />
        </section>
    );
}
