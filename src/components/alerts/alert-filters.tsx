type AlertFiltersProps = {
  selectedStatus: string;
  selectedSeverity: string;
};

export function AlertFilters({
  selectedStatus,
  selectedSeverity,
}: AlertFiltersProps) {
  return (
    <form className="grid gap-4 rounded-[28px] border border-white/10 bg-white/[0.035] p-5 backdrop-blur lg:grid-cols-[1fr_1fr_auto]">
      <label className="flex flex-col gap-2 text-sm text-slate-300">
        <span className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
          Status
        </span>
        <select
          name="status"
          defaultValue={selectedStatus}
          className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
        >
          <option value="all">All statuses</option>
          <option value="open">Open</option>
          <option value="acknowledged">Acknowledged</option>
          <option value="resolved">Resolved</option>
        </select>
      </label>

      <label className="flex flex-col gap-2 text-sm text-slate-300">
        <span className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
          Severity
        </span>
        <select
          name="severity"
          defaultValue={selectedSeverity}
          className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
        >
          <option value="all">All severities</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </label>

      <div className="flex items-end">
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-sm font-medium text-cyan-50 transition hover:bg-cyan-300/18 lg:w-auto"
        >
          Apply Filters
        </button>
      </div>
    </form>
  );
}
