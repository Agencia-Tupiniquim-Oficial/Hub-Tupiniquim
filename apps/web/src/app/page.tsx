import { MetricCard } from "@tupiniquim/ui";
import { redirect } from "next/navigation";
import { SignOutButton } from "./auth-controls";
import { getCurrentAppUser } from "@/server/infrastructure/auth/current-user";

export const dynamic = "force-dynamic";

const metrics = [
  { label: "Clientes", value: "—", description: "A conectar" },
  { label: "Coletas recentes", value: "—", description: "Nenhuma fonte conectada" },
  { label: "Relatórios", value: "—", description: "Nenhum relatório gerado" },
];

type HomePageProps = {
  searchParams: Promise<{ signedIn?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const user = await getCurrentAppUser();
  if (!user) {
    const { signedIn } = await searchParams;
    redirect(signedIn === "1" ? "/login?error=profile" : "/login");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-12 md:px-10">
      <header className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--color-brand)]">
            Agência Tupiniquim
          </p>
          <SignOutButton />
        </div>
        <h1 className="text-4xl font-semibold tracking-tight text-[var(--color-brand-dark)]">
          Hub de campanhas
        </h1>
        <p className="max-w-2xl text-base leading-7 text-[var(--color-text)]">
          Acesso interno da agência para contas, resultados e relatórios dos clientes.
        </p>
        <p className="text-sm text-[var(--color-muted)]">Conectado como {user.email}</p>
      </header>

      <section aria-labelledby="overview-title" className="flex flex-col gap-5">
        <div>
          <h2 id="overview-title" className="text-xl font-semibold text-[var(--color-brand-dark)]">
            Visão geral
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Os dados aparecerão aqui após a configuração das integrações.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>
      </section>

      <section
        aria-label="Status do projeto"
        className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm"
      >
        <p className="font-medium text-[var(--color-brand-dark)]">Fundação em configuração</p>
        <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
          Ainda não há contas ou métricas conectadas. Nenhum dado de campanha está sendo
          apresentado como real.
        </p>
      </section>
    </main>
  );
}
