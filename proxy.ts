import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = new Set([
  "/",
  "/login",
  "/signup",
  "/solutions",
  "/services",
  "/about-us",
  "/contact-us",
  "/privacy-policy",
  "/terms-of-service",
  "/api/health",
  "/api/health/db",
]);

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/alerts",
  "/blocked-numbers",
  "/rules",
  "/analytics",
  "/cases",
  "/network-security",
  "/ingestion",
  "/revenue-assurance",
  "/signaling-security",
  "/reports",
  "/logout",
];

function isProtectedPath(pathname: string) {
  if (
    PROTECTED_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    )
  ) {
    return true;
  }

  if (pathname.startsWith("/api/")) {
    return !PUBLIC_PATHS.has(pathname);
  }

  return false;
}

function copyCookies(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie);
  });
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const requiresAuth = isProtectedPath(pathname);

  if (user && isAuthPage) {
    const redirectResponse = NextResponse.redirect(
      new URL("/dashboard", request.url),
    );
    copyCookies(response, redirectResponse);
    return redirectResponse;
  }

  if (!user && requiresAuth) {
    if (pathname.startsWith("/api/")) {
      const apiResponse = NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
      copyCookies(response, apiResponse);
      return apiResponse;
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);

    const redirectResponse = NextResponse.redirect(loginUrl);
    copyCookies(response, redirectResponse);
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
