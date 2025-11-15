export default function MetaSection({ title, description, children }) {
  return (
    <section className="bg-bg-secondary border border-border rounded-2xl p-6 space-y-3">
      <div>
        <h3 className="text-text-primary text-lg font-semibold">{title}</h3>
        {description && <p className="text-text-secondary text-sm">{description}</p>}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
