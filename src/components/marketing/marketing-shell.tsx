import type { ReactNode } from "react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

type MarketingShellProps = {
  children: ReactNode;
};

export function MarketingShell({ children }: MarketingShellProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#183149_0%,#09121a_36%,#05080b_100%)] text-slate-100">
      <div className="absolute inset-x-0 top-0 -z-0 h-[34rem] bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.12),transparent_35%),radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_40%),radial-gradient(circle_at_top_right,rgba(249,115,22,0.16),transparent_34%)]" />
      <MarketingHeader />
      <div className="relative z-10">{children}</div>
      <MarketingFooter />
    </div>
  );
}
