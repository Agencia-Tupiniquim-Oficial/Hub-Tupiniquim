"use client";

import { useState, type FormEvent } from "react";
import { signInWithPassword } from "../model/sign-in";
import { createSupabaseBrowserClient } from "@/shared/api/supabase/browser";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    if (typeof email !== "string" || typeof password !== "string") {
      setError("Informe seu e-mail e sua senha.");
      return;
    }

    try {
      const supabase = createSupabaseBrowserClient();
      const result = await signInWithPassword(
        {
          signInWithPassword: (credentials) =>
            supabase.auth.signInWithPassword(credentials),
        },
        email,
        password,
      );

      if (!result.authenticated) {
        setError("E-mail ou senha inválidos.");
        return;
      }

      window.location.assign("/?signedIn=1");
    } catch {
      setError("Não foi possível entrar. Verifique a conexão e tente novamente.");
    }
  }

  return (
    <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
      <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-brand-dark)]">
        E-mail
        <input
          autoComplete="username"
          className="rounded-lg border border-[var(--color-border)] px-3 py-2"
          name="email"
          required
          type="email"
        />
      </label>
      <label className="flex flex-col gap-2 text-sm font-medium text-[var(--color-brand-dark)]">
        Senha
        <input
          autoComplete="current-password"
          className="rounded-lg border border-[var(--color-border)] px-3 py-2"
          name="password"
          required
          type="password"
        />
      </label>
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <button
        className="rounded-lg bg-[var(--color-brand)] px-5 py-3 font-semibold text-white transition hover:opacity-90"
        type="submit"
      >
        Entrar
      </button>
    </form>
  );
}
