import { useEffect, useRef } from "react";
import {
    Link, useFetcher, useLoaderData, type ClientActionFunctionArgs, type ClientLoaderFunctionArgs,
} from "react-router";
import { Flag, Send, ShieldCheck } from "lucide-react";
import { chatController } from "~/frontEnd/controllers/ChatController";
import { LoadingState } from "~/frontEnd/components/LoadingState";
import { Toast } from "~/frontEnd/components/Toast";
import { actionFail } from "~/frontEnd/utils/actionResult";
import { formText } from "~/frontEnd/utils/form";
import type { ActionResult } from "~/frontEnd/viewModels/ActionResult";

export async function clientLoader({ request }: ClientLoaderFunctionArgs) {
    return chatController.getChatPage(new URL(request.url).searchParams.get("room"));
}

export async function clientAction({ request }: ClientActionFunctionArgs): Promise<ActionResult> {
    const form = await request.formData();
    const intent = formText(form, "intent");
    const room = formText(form, "room");

    if (intent === "send") return chatController.sendMessage(room, formText(form, "text"));
    if (intent === "report") return chatController.reportRoom(room);
    return actionFail(intent, "Unknown action.");
}

export function HydrateFallback() {
    return <LoadingState />;
}

export default function Chat() {
    const page = useLoaderData<typeof clientLoader>();
    const fetcher = useFetcher<typeof clientAction>();
    const formRef = useRef<HTMLFormElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Clear the input after a message was sent
    useEffect(() => {
        if (fetcher.state === "idle" && fetcher.data?.ok && fetcher.data.intent === "send") {
            formRef.current?.reset();
        }
    }, [fetcher.state, fetcher.data]);

    // Keep the newest message in view
    useEffect(() => {
        const list = listRef.current;
        if (list) list.scrollTop = list.scrollHeight;
    }, [page.messages.length, page.activeRoom]);

    const sending = fetcher.formData?.get("intent") === "send";

    return (
        <section aria-labelledby="chat-title">
            <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#6b9424]">Community rooms</p>
                <h2 id="chat-title" className="brand text-4xl">Say hi. Set up a game.</h2>
            </div>
            <div className="surface rounded-[24px] mt-6 overflow-hidden grid lg:grid-cols-[220px_1fr] min-h-[500px]">
                <aside className="bg-[#f7faf7] p-4 border-r border-[#dbe8e1]">
                    <p className="text-xs font-bold uppercase text-[#69808f] mb-3">Rooms</p>
                    <div className="space-y-1">
                        {page.rooms.map((name) => (
                            <Link
                                key={name}
                                to={`?room=${encodeURIComponent(name)}`}
                                className={`block w-full text-left p-3 rounded-xl font-bold text-sm ${page.activeRoom === name ? "bg-[#e5f6c5]" : ""}`}
                                aria-current={page.activeRoom === name ? "page" : undefined}
                            >
                                # {name}
                            </Link>
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
                            <h3 className="font-extrabold"># {page.activeRoom}</h3>
                            <p className="text-xs text-[#69808f]">{page.onlineLabel}</p>
                        </div>
                        <fetcher.Form method="post">
                            <input type="hidden" name="intent" value="report" />
                            <input type="hidden" name="room" value={page.activeRoom} />
                            <button type="submit" className="text-xs font-bold text-[#69808f]">
                                <Flag className="inline w-4 h-4" /> Report
                            </button>
                        </fetcher.Form>
                    </div>

                    <div ref={listRef} className="p-5 space-y-5 flex-1 overflow-auto max-h-[350px]">
                        {page.messages.length === 0 && (
                            <p className="text-sm text-[#69808f]">No messages yet. Say hi to start the room.</p>
                        )}
                        {page.messages.map((m) => (
                            <div key={m.id}>
                                <b className="text-sm">
                                    {m.author} <span className="text-xs font-normal text-[#69808f]">{m.timeLabel}</span>
                                </b>
                                <p className="text-sm mt-1">{m.text}</p>
                            </div>
                        ))}
                    </div>

                    <fetcher.Form ref={formRef} method="post" className="p-4 border-t border-[#dbe8e1] flex gap-2">
                        <input type="hidden" name="intent" value="send" />
                        <input type="hidden" name="room" value={page.activeRoom} />
                        <label className="sr-only" htmlFor="chat-input">Message</label>
                        <input
                            id="chat-input"
                            name="text"
                            className="field"
                            placeholder="Write a friendly message…"
                            maxLength={500}
                            autoComplete="off"
                        />
                        <button className="lime-btn px-4" type="submit" aria-label="Send message" disabled={sending}>
                            <Send className="w-4 h-4" />
                        </button>
                    </fetcher.Form>
                </div>
            </div>

            <Toast result={fetcher.data} />
        </section>
    );
}
