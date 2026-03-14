import Link from "next/link";

type ControlShellNavProps = {
  current:
    | "dashboard"
    | "alerts"
    | "blocked-numbers"
    | "rules"
    | "analytics"
    | "cases"
    | "network-security"
    | "ingestion"
    | "revenue-assurance"
    | "signaling-security";
};

const items = [
  { key: "dashboard", href: "/", label: "Dashboard" },
  { key: "alerts", href: "/alerts", label: "Alerts" },
  { key: "blocked-numbers", href: "/blocked-numbers", label: "Blocked Numbers" },
  { key: "rules", href: "/rules", label: "Rules" },
  { key: "analytics", href: "/analytics", label: "Analytics" },
  { key: "cases", href: "/cases", label: "Cases" },
  { key: "network-security", href: "/network-security", label: "Network Security" },
  { key: "ingestion", href: "/ingestion", label: "Ingestion" },
  { key: "revenue-assurance", href: "/revenue-assurance", label: "Revenue Assurance" },
  { key: "signaling-security", href: "/signaling-security", label: "Signaling Security" },
] as const;

export function ControlShellNav({ current }: ControlShellNavProps) {
  return (
    <nav className="flex flex-wrap gap-3">
      {items.map((item) => {
        const active = item.key === current;

        return (
          <Link
            key={item.key}
            href={item.href}
            className={`inline-flex rounded-full border px-4 py-2 text-sm transition ${
              active
                ? "border-cyan-300/30 bg-cyan-300/12 text-cyan-100"
                : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
