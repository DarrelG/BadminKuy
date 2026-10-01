import { useFetcher, useLoaderData, type ClientActionFunctionArgs } from "react-router";
import { clubsController } from "~/frontEnd/controllers/clubsController";
import { LoadingState } from "~/frontEnd/components/LoadingState";
import { Toast } from "~/frontEnd/components/Toast";
import { actionFail } from "~/frontEnd/utils/actionResult";
import { formText } from "~/frontEnd/utils/form";
import type { ActionResult } from "~/frontEnd/viewModels/actionResult";

export async function clientLoader() {
    return clubsController.getClubsPage();
}

export async function clientAction({ request }: ClientActionFunctionArgs): Promise<ActionResult> {
    const form = await request.formData();
    const intent = formText(form, "intent");

    if (intent === "join") return clubsController.joinClub(formText(form, "clubId"));
    return actionFail(intent, "Unknown action.");
}

export function HydrateFallback() {
    return <LoadingState />;
}

export default function Clubs() {
    const page = useLoaderData<typeof clientLoader>();
    const fetcher = useFetcher<typeof clientAction>();
    const joiningId = fetcher.formData ? String(fetcher.formData.get("clubId")) : null;

    return (
        <section aria-labelledby="clubs-title">
            <p className="text-xs font-bold uppercase tracking-widest text-[#6b9424]">Communities</p>
            <h2 id="clubs-title" className="brand text-4xl">Your badminton people.</h2>
            <div className="grid md:grid-cols-3 gap-5 mt-6">
                {page.clubs.map((c) => (
                    <article key={c.id} className="surface rounded-2xl overflow-hidden">
                        <img className="w-full h-36 object-cover" loading="lazy" src={c.imageUrl} alt={c.imageAlt} />
                        <div className="p-5">
                            <h3 className="font-extrabold">{c.name}</h3>
                            <p className="text-sm text-[#69808f] mt-1">{c.meta}</p>
                            <p className="text-sm mt-3">{c.schedule}</p>
                            <fetcher.Form method="post">
                                <input type="hidden" name="intent" value="join" />
                                <input type="hidden" name="clubId" value={c.id} />
                                <button
                                    type="submit"
                                    className={c.joined ? "outline-btn px-4 py-2 text-sm mt-4" : "lime-btn px-4 py-2 text-sm mt-4"}
                                    disabled={c.joined || joiningId === c.id}
                                >
                                    {c.joined ? "Joined ✓" : joiningId === c.id ? "Joining..." : "Join club"}
                                </button>
                            </fetcher.Form>
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

            <Toast result={fetcher.data} />
        </section>
    );
}
