import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function TimelineChart({ data = [] }) {
  if (!data.length) return <p className="text-text-muted">Timeline data unavailable.</p>;

  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00FF41" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#00FF41" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="range" stroke="#808080" tick={{ fill: '#808080' }} />
          <YAxis stroke="#808080" tick={{ fill: '#808080' }} domain={[0, 100]} />
          <Tooltip
            contentStyle={{ background: '#0A0A0A', border: '1px solid #2D2D2D', color: '#FFFFFF' }}
            formatter={(value) => [`${value}% positive`, 'Sentiment']}
          />
          <Area type="monotone" dataKey="positivePercent" stroke="#00FF41" fillOpacity={1} fill="url(#colorPositive)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
