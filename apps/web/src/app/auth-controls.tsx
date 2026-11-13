"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/shared/api/supabase/browser";

export function SignOutButton() {
  const [error, setError] = useState<string | null>(null);

  async function handleSignOut() {
    setError(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        setError("Não foi possível encerrar a sessão. Tente novamente.");
        return;
      }

      window.location.assign("/login");
    } catch {
      setError("Não foi possível encerrar a sessão. Verifique a conexão e tente novamente.");
    }
  }

  return (
    <>
      <button
        className="rounded-lg border border-[var(--color-border)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-brand-dark)] transition hover:opacity-80"
        onClick={handleSignOut}
        type="button"
      >
        Sair
      </button>
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </>
  );
}
