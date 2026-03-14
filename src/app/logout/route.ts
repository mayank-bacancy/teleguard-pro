import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const url = new URL("/login?message=You%20have%20been%20signed%20out", request.url);
  return NextResponse.redirect(url);
}
