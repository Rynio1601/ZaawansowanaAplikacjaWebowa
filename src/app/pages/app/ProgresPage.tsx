import { useState } from 'react';
import { TrendingUp, TrendingDown, Scale, Activity, Plus, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const clients = [
  { id: 1, name: 'Anna Kowalska' },
  { id: 2, name: 'Marcin Nowak' },
  { id: 3, name: 'Katarzyna Wiśniewska' },
  { id: 4, name: 'Piotr Zając' },
];

const progressData: Record<number, { weight: number[]; chest: number[]; waist: number[]; hips: number[]; benchPress: number[]; squat: number[]; dates: string[] }> = {
  1: {
    dates: ['Paź', 'Lis', 'Gru', 'Sty', 'Lut', 'Mar'],
    weight: [74, 72.5, 71, 70, 69, 68],
    chest: [96, 95.5, 95, 94.5, 94, 93.5],
    waist: [78, 77, 76, 75.5, 75, 74],
    hips: [105, 104, 103.5, 103, 102, 101.5],
    benchPress: [40, 42.5, 42.5, 45, 45, 47.5],
    squat: [60, 62.5, 65, 65, 67.5, 70],
  },
  2: {
    dates: ['Lis', 'Gru', 'Sty', 'Lut', 'Mar'],
    weight: [83, 84, 84.5, 85, 85.5],
    chest: [105, 105.5, 106, 106, 106.5],
    waist: [86, 86, 85.5, 85, 85],
    hips: [102, 102, 102.5, 102, 102],
    benchPress: [80, 82.5, 85, 87.5, 90],
    squat: [100, 105, 107.5, 110, 112.5],
  },
  3: {
    dates: ['Mar'],
    weight: [72],
    chest: [97],
    waist: [80],
    hips: [108],
    benchPress: [25],
    squat: [40],
  },
  4: {
    dates: ['Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru', 'Sty', 'Lut', 'Mar'],
    weight: [76, 77, 78, 78.5, 79, 79.5, 79.5, 80, 80.5],
    chest: [108, 109, 110, 110.5, 111, 111, 111.5, 112, 112.5],
    waist: [84, 84, 83.5, 83.5, 83, 83, 82.5, 82, 82],
    hips: [103, 103, 103.5, 104, 104, 104, 104.5, 104.5, 105],
    benchPress: [80, 82.5, 85, 87.5, 90, 92.5, 95, 97.5, 100],
    squat: [100, 105, 110, 115, 117.5, 120, 122.5, 125, 130],
  },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3 py-2 rounded-lg text-xs" style={{ background: '#0D1525', border: '1px solid rgba(255,255,255,0.1)' }}>
        <p style={{ color: '#64748B', marginBottom: 4 }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} style={{ color: p.color }}>{p.name}: {p.value} {p.dataKey === 'weight' ? 'kg' : p.dataKey.includes('Press') || p.dataKey === 'squat' ? 'kg' : 'cm'}</p>
        ))}
      </div>
    );
  }
  return null;
};

export function ProgresPage() {
  const [selectedClient, setSelectedClient] = useState(1);
  const [metric, setMetric] = useState<'weight' | 'measurements' | 'strength'>('weight');
  const [showAdd, setShowAdd] = useState(false);
  const [newEntry, setNewEntry] = useState({ weight: '', chest: '', waist: '', hips: '', bench: '', squat: '' });

  const data = progressData[selectedClient];
  const chartData = data.dates.map((date, i) => ({
    date,
    weight: data.weight[i],
    chest: data.chest[i],
    waist: data.waist[i],
    hips: data.hips[i],
    benchPress: data.benchPress[i],
    squat: data.squat[i],
  }));

  const lastWeight = data.weight[data.weight.length - 1];
  const firstWeight = data.weight[0];
  const weightChange = lastWeight - firstWeight;

  const lastBench = data.benchPress[data.benchPress.length - 1];
  const firstBench = data.benchPress[0];
  const benchChange = lastBench - firstBench;

  const lastSquat = data.squat[data.squat.length - 1];
  const firstSquat = data.squat[0];
  const squatChange = lastSquat - firstSquat;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white" style={{ fontSize: '1.4rem', fontWeight: 700 }}>Monitoring progresu</h1>
          <p className="text-sm mt-1" style={{ color: '#475569' }}>Śledź postępy klientów na przestrzeni czasu</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm"
          style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)', fontWeight: 600 }}>
          <Plus size={16} /> Dodaj pomiary
        </button>
      </div>

      {/* Client selector */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {clients.map(c => (
          <button key={c.id} onClick={() => setSelectedClient(c.id)}
            className="px-4 py-2 rounded-xl text-sm transition-all"
            style={{
              background: selectedClient === c.id ? 'rgba(37,99,235,0.15)' : '#0A0F1A',
              border: selectedClient === c.id ? '1px solid rgba(37,99,235,0.4)' : '1px solid rgba(255,255,255,0.06)',
              color: selectedClient === c.id ? '#60A5FA' : '#64748B',
              fontWeight: selectedClient === c.id ? 600 : 400,
            }}>
            {c.name}
          </button>
        ))}
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Aktualna waga', val: `${lastWeight} kg`, change: weightChange, unit: 'kg', icon: Scale, desc: 'vs start' },
          { label: 'Wyciskanie', val: `${lastBench} kg`, change: benchChange, unit: 'kg', icon: Activity, desc: 'wzrost siły' },
          { label: 'Przysiad', val: `${lastSquat} kg`, change: squatChange, unit: 'kg', icon: TrendingUp, desc: 'wzrost siły' },
          { label: 'Sesje', val: `${data.dates.length * 4}`, change: data.dates.length, unit: '', icon: Activity, desc: 'łącznie' },
        ].map(({ label, val, change, unit, icon: Icon, desc }) => {
          const isWeight = label === 'Aktualna waga';
          const isPositive = isWeight ? change < 0 : change > 0;
          return (
            <div key={label} className="p-4 rounded-2xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(37,99,235,0.1)' }}>
                  <Icon size={15} style={{ color: '#2563EB' }} />
                </div>
                <span className="text-xs flex items-center gap-0.5" style={{ color: isPositive ? '#34D399' : '#F87171' }}>
                  {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {change > 0 ? '+' : ''}{change.toFixed(1)}{unit}
                </span>
              </div>
              <p className="text-white" style={{ fontWeight: 800, fontSize: '1.2rem' }}>{val}</p>
              <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{label} <span style={{ color: '#334155' }}>· {desc}</span></p>
            </div>
          );
        })}
      </div>

      {/* Metric selector */}
      <div className="flex gap-2 mb-4">
        {[['weight', 'Waga'], ['measurements', 'Obwody'], ['strength', 'Siła']].map(([val, label]) => (
          <button key={val} onClick={() => setMetric(val as any)}
            className="px-4 py-2 rounded-xl text-sm transition-all"
            style={{
              background: metric === val ? 'rgba(37,99,235,0.15)' : '#0A0F1A',
              border: metric === val ? '1px solid rgba(37,99,235,0.4)' : '1px solid rgba(255,255,255,0.06)',
              color: metric === val ? '#60A5FA' : '#64748B',
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="p-5 rounded-2xl mb-6" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-white mb-4" style={{ fontWeight: 600 }}>
          {metric === 'weight' ? 'Waga (kg)' : metric === 'measurements' ? 'Obwody (cm)' : 'Siła (kg)'}
        </p>
        {data.dates.length < 2 ? (
          <div className="h-48 flex items-center justify-center">
            <p className="text-sm" style={{ color: '#475569' }}>Za mało danych do wyświetlenia wykresu. Dodaj więcej pomiarów.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              {metric === 'weight' && <Line type="monotone" dataKey="weight" stroke="#2563EB" strokeWidth={2.5} dot={{ fill: '#2563EB', r: 4 }} name="Waga" />}
              {metric === 'measurements' && <>
                <Line type="monotone" dataKey="chest" stroke="#06B6D4" strokeWidth={2} dot={{ fill: '#06B6D4', r: 3 }} name="Klatka" />
                <Line type="monotone" dataKey="waist" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 3 }} name="Talia" />
                <Line type="monotone" dataKey="hips" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: '#8B5CF6', r: 3 }} name="Biodra" />
              </>}
              {metric === 'strength' && <>
                <Line type="monotone" dataKey="benchPress" stroke="#2563EB" strokeWidth={2} dot={{ fill: '#2563EB', r: 3 }} name="Wyciskanie" />
                <Line type="monotone" dataKey="squat" stroke="#06B6D4" strokeWidth={2} dot={{ fill: '#06B6D4', r: 3 }} name="Przysiad" />
              </>}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* History table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-white" style={{ fontWeight: 600, fontSize: '0.95rem' }}>Historia pomiarów</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Data', 'Waga', 'Klatka', 'Talia', 'Biodra', 'Wyciskanie', 'Przysiad'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs" style={{ color: '#475569', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chartData.slice().reverse().map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="px-4 py-3 text-white">{row.date}</td>
                  <td className="px-4 py-3" style={{ color: '#94A3B8' }}>{row.weight} kg</td>
                  <td className="px-4 py-3" style={{ color: '#64748B' }}>{row.chest} cm</td>
                  <td className="px-4 py-3" style={{ color: '#64748B' }}>{row.waist} cm</td>
                  <td className="px-4 py-3" style={{ color: '#64748B' }}>{row.hips} cm</td>
                  <td className="px-4 py-3" style={{ color: '#60A5FA' }}>{row.benchPress} kg</td>
                  <td className="px-4 py-3" style={{ color: '#60A5FA' }}>{row.squat} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add measurements modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={() => setShowAdd(false)}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.08)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <p className="text-white" style={{ fontWeight: 700 }}>Nowe pomiary</p>
              <button onClick={() => setShowAdd(false)} style={{ color: '#475569' }}><X size={20} /></button>
            </div>
            <p className="text-xs mb-4" style={{ color: '#64748B' }}>Klient: <span style={{ color: '#94A3B8' }}>{clients.find(c => c.id === selectedClient)?.name}</span></p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'weight', label: 'Waga (kg)', placeholder: '70.0' },
                { key: 'chest', label: 'Klatka (cm)', placeholder: '95.0' },
                { key: 'waist', label: 'Talia (cm)', placeholder: '75.0' },
                { key: 'hips', label: 'Biodra (cm)', placeholder: '100.0' },
                { key: 'bench', label: 'Wyciskanie (kg)', placeholder: '50.0' },
                { key: 'squat', label: 'Przysiad (kg)', placeholder: '70.0' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs mb-1.5" style={{ color: '#64748B' }}>{label}</label>
                  <input type="number" step="0.1" value={newEntry[key as keyof typeof newEntry]} onChange={e => setNewEntry({ ...newEntry, [key]: e.target.value })}
                    placeholder={placeholder} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#0D1525', border: '1px solid rgba(255,255,255,0.06)', color: '#F1F5F9' }} />
                </div>
              ))}
            </div>
            <button onClick={() => setShowAdd(false)} className="w-full py-3 rounded-xl text-white text-sm mt-4"
              style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)', fontWeight: 600 }}>
              Zapisz pomiary
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
