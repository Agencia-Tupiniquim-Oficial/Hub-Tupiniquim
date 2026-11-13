export type MetricCardProps = {
  label: string;
  value: string;
  description: string;
};

export function MetricCard({ label, value, description }: MetricCardProps) {
  return (
    <article className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm">
      <h3 className="text-sm font-medium text-[var(--color-muted)]">{label}</h3>
      <p className="mt-4 text-3xl font-semibold text-[var(--color-brand-dark)]">{value}</p>
      <p className="mt-2 text-sm text-[var(--color-muted)]">{description}</p>
    </article>
  );
}
