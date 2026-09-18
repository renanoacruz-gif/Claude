export default function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-14 text-center">
      <p className="text-base font-medium text-slate-800">{title}</p>
      <p className="max-w-sm text-sm text-slate-500">{description}</p>
      {actionHref && actionLabel && (
        <a href={actionHref} className="btn btn-primary mt-2">
          {actionLabel}
        </a>
      )}
    </div>
  );
}
