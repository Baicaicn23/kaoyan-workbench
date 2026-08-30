export function PageHeader({
  title,
  code,
  description,
}: {
  title: string;
  code?: string;
  description?: string;
}) {
  return (
    <div className="mb-8">
      {code && (
        <p className="mb-1.5 text-[0.6875rem] font-medium uppercase tracking-widest text-muted-foreground/70">
          {code}
        </p>
      )}
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {description && (
        <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
