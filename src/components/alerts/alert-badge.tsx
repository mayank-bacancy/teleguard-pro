type AlertBadgeProps = {
  value: string;
  kind: "severity" | "status" | "block";
};

export function AlertBadge({ value, kind }: AlertBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.2em] ${getTone(value, kind)}`}
    >
      {value}
    </span>
  );
}

function getTone(value: string, kind: AlertBadgeProps["kind"]) {
  if (kind === "block") {
    return value === "blocked"
      ? "bg-rose-400/14 text-rose-200"
      : "bg-emerald-400/14 text-emerald-200";
  }

  if (kind === "status") {
    switch (value) {
      case "resolved":
        return "bg-emerald-400/14 text-emerald-200";
      case "acknowledged":
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
    default:
      return "bg-cyan-400/14 text-cyan-200";
  }
}
