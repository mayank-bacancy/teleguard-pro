type CaseBadgeProps = {
  value: string;
  kind: "status" | "priority";
};

export function CaseBadge({ value, kind }: CaseBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.2em] ${getTone(
        value,
        kind,
      )}`}
    >
      {value}
    </span>
  );
}

function getTone(value: string, kind: CaseBadgeProps["kind"]) {
  if (kind === "status") {
    switch (value) {
      case "resolved":
        return "bg-emerald-400/14 text-emerald-200";
      case "in_review":
        return "bg-amber-400/14 text-amber-200";
      default:
        return "bg-cyan-400/14 text-cyan-200";
    }
  }

  switch (value) {
    case "critical":
      return "bg-rose-400/14 text-rose-200";
    case "high":
      return "bg-amber-400/14 text-amber-200";
    case "medium":
      return "bg-cyan-400/14 text-cyan-200";
    default:
      return "bg-slate-400/14 text-slate-200";
  }
}
