"use server";

import { redirect } from "next/navigation";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function sanitizeNextPath(nextPath: string | null) {
  if (!nextPath || !nextPath.startsWith("/")) {
    return "/dashboard";
  }

  if (nextPath.startsWith("//") || nextPath.startsWith("/login") || nextPath.startsWith("/signup")) {
    return "/dashboard";
  }

  return nextPath;
}

function getField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function loginAction(formData: FormData) {
  const email = getField(formData, "email");
  const password = getField(formData, "password");
  const nextPath = sanitizeNextPath(getField(formData, "next") || null);

  if (!email || !password) {
    redirect("/login?error=Email%20and%20password%20are%20required");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect(nextPath);
}

export async function signupAction(formData: FormData) {
  const firstName = getField(formData, "first_name");
  const lastName = getField(formData, "last_name");
  const company = getField(formData, "company");
  const email = getField(formData, "email");
  const password = getField(formData, "password");

  if (!firstName || !lastName || !company || !email || !password) {
    redirect("/signup?error=All%20fields%20are%20required");
  }

  const supabase = await createClient();
  const serviceRoleConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (serviceRoleConfigured) {
    const admin = createAdminClient();
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        company,
      },
    });

    if (error || !data.user) {
      redirect(`/signup?error=${encodeURIComponent(error?.message ?? "Unable to create user")}`);
    }

    const { error: profileError } = await admin.from("user_profiles").insert({
      id: data.user.id,
      email,
      first_name: firstName,
      last_name: lastName,
      company,
    });

    if (profileError) {
      await admin.auth.admin.deleteUser(data.user.id);
      redirect(`/signup?error=${encodeURIComponent(profileError.message)}`);
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      redirect(`/login?message=Account%20created.%20Please%20sign%20in&error=${encodeURIComponent(signInError.message)}`);
    }

    redirect("/dashboard");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        company,
      },
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  if (data.user && data.session) {
    const { error: profileError } = await supabase.from("user_profiles").upsert({
      id: data.user.id,
      email,
      first_name: firstName,
      last_name: lastName,
      company,
    });

    if (profileError) {
      redirect(`/signup?error=${encodeURIComponent(profileError.message)}`);
    }

    redirect("/dashboard");
  }

  redirect("/login?message=Account%20created.%20Confirm%20your%20email%20before%20logging%20in");
}
