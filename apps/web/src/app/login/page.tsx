import { redirect } from "next/navigation";
import { LoginForm } from "@/features/auth/ui/login-form";
import { getCurrentAppUser } from "@/server/infrastructure/auth/current-user";

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getCurrentAppUser();
  if (user) {
    redirect("/");
  }

  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <section className="w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
          Agência Tupiniquim
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--color-brand-dark)]">
          Acesso ao Hub
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
          Entre com uma conta criada pela administração. O cadastro público está desativado.
        </p>
        {error === "profile" ? (
          <p
            className="mt-6 rounded-lg border border-[var(--color-border)] p-4 text-sm leading-6 text-[var(--color-text)]"
            role="alert"
          >
            Sua conta ainda não tem um perfil de acesso configurado. Peça ao administrador para
            habilitá-la.
          </p>
        ) : null}
        <LoginForm />
      </section>
    </main>
  );
}
