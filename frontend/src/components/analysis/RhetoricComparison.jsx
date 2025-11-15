export default function RhetoricComparison({ proTactics = [], conTactics = [], balance }) {
  const Column = ({ title, items }) => (
    <div className="space-y-3">
      <h4 className="text-primary font-semibold">{title}</h4>
      {items.map((tactic) => (
        <div key={tactic.name} className="border border-border rounded-xl p-3">
          <div className="flex items-center justify-between text-text-primary">
            <span>{tactic.name}</span>
            <span className="text-sm text-text-muted">{tactic.percentage}%</span>
          </div>
          <p className="text-text-secondary text-sm">“{tactic.example}”</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Column title="PRO Side Tactics" items={proTactics} />
      <Column title="CON Side Tactics" items={conTactics} />
      {balance && <p className="text-text-muted md:col-span-2">⚖️ Rhetorical Balance: {balance}</p>}
    </div>
  );
}
