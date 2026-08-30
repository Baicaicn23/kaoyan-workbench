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
    <div className="mb-6">
      <div className="flex items-center gap-3">
        {code && <span className="ak-label">{code}</span>}
        <h1 className="ak-title text-3xl text-foreground">{title}</h1>
      </div>
      {description && (
        <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
      )}
      <div className="ak-stripe mt-4 h-1 w-full opacity-70" />
    </div>
  );
}
