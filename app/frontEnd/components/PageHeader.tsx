import type { ReactNode } from "react";

type PageHeaderProps = {
    eyebrow: string;
    title: string;
    titleId: string;
    subtitle?: string;
    children?: ReactNode;
};

export function PageHeader({ eyebrow, title, titleId, subtitle, children }: PageHeaderProps) {
    return (
        <div className="flex flex-wrap justify-between gap-4 items-end">
            <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#6b9424]">{eyebrow}</p>
                <h2 id={titleId} className="brand text-4xl">{title}</h2>
                {subtitle && <p className="text-[#69808f] mt-1">{subtitle}</p>}
            </div>
            {children}
        </div>
    );
}
