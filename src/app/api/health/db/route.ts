import { NextResponse } from "next/server";

import { getSupabasePublicKey, getSupabaseUrl } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const url = getSupabaseUrl();
    const publicKey = getSupabasePublicKey();
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("health_check");

    if (!error) {
      return NextResponse.json({
        status: "ok",
        database: "reachable",
        mode: "rpc",
        result: data,
      });
    }

    // Keep the endpoint usable before the SQL function is created.
    if (isMissingHealthCheckFunction(error)) {
      const headers = new Headers({
        apikey: publicKey,
      });

      // Publishable keys are gateway keys, not JWTs, so don't send them as Bearer tokens.
      if (!publicKey.startsWith("sb_publishable_")) {
        headers.set("Authorization", `Bearer ${publicKey}`);
      }

      const response = await fetch(`${url}/rest/v1/`, {
        headers,
        cache: "no-store",
      });

      if (!response.ok) {
        return NextResponse.json(
          {
            status: "error",
            database: "unreachable",
            mode: "rest-probe",
            code: response.status,
          },
          { status: 503 },
        );
      }

      return NextResponse.json({
        status: "ok",
        database: "reachable",
        mode: "rest-probe",
        message:
          "Supabase is reachable. Create the public.health_check() SQL function to enable query-based verification.",
      });
    }

    return NextResponse.json(
      {
        status: "error",
        database: "unreachable",
        mode: "rpc",
        message: error.message,
      },
      { status: 503 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown Supabase error.";
    const isConfigError = message.toLowerCase().includes("missing supabase");

    return NextResponse.json(
      {
        status: "error",
        database: isConfigError ? "unconfigured" : "unreachable",
        message,
      },
      { status: isConfigError ? 503 : 500 },
    );
  }
}

function isMissingHealthCheckFunction(error: { code?: string; message: string }) {
  return (
    error.code === "PGRST202" ||
    error.message.toLowerCase().includes("health_check")
  );
}
