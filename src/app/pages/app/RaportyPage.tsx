import { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Download, TrendingUp, Users, CreditCard, Percent, Calendar, Filter } from 'lucide-react';
import ExportButton from '../../components/ExportButton';
import { exportToPDF, exportToExcel } from '../../../utils/exportUtils';

const mrrData = [
  { month: 'Wrz', mrr: 7200, new: 1200, churn: 300 },
  { month: 'Paź', mrr: 8200, new: 1400, churn: 400 },
  { month: 'Lis', mrr: 9400, new: 1800, churn: 600 },
  { month: 'Gru', mrr: 8800, new: 1000, churn: 1600 },
  { month: 'Sty', mrr: 10200, new: 2000, churn: 600 },
  { month: 'Lut', mrr: 11400, new: 1800, churn: 600 },
  { month: 'Mar', mrr: 12840, new: 2000, churn: 560 },
];

const clientRetentionData = [
  { month: 'Paź', active: 22, churned: 2 },
  { month: 'Lis', active: 25, churned: 1 },
  { month: 'Gru', active: 24, churned: 2 },
  { month: 'Sty', active: 27, churned: 1 },
  { month: 'Lut', active: 30, churned: 1 },
  { month: 'Mar', active: 32, churned: 1 },
];

const planDistribution = [
  { name: 'Redukcja', value: 12, color: '#EF4444' },
  { name: 'Siła', value: 8, color: '#2563EB' },
  { name: 'Masa', value: 7, color: '#06B6D4' },
  { name: 'Wytrzymałość', value: 3, color: '#10B981' },
  { name: 'Rehabilitacja', value: 2, color: '#F59E0B' },
];

const sessionsPerWeek = [
  { week: 'Tydz 1', sessions: 24, completed: 22, cancelled: 2 },
  { week: 'Tydz 2', sessions: 26, completed: 24, cancelled: 2 },
  { week: 'Tydz 3', sessions: 28, completed: 26, cancelled: 2 },
  { week: 'Tydz 4', sessions: 25, completed: 23, cancelled: 2 },
];

const clientSatisfaction = [
  { month: 'Paź', score: 4.2 },
  { month: 'Lis', score: 4.4 },
  { month: 'Gru', score: 4.3 },
  { month: 'Sty', score: 4.5 },
  { month: 'Lut', score: 4.6 },
  { month: 'Mar', score: 4.7 },
];

const kpis = [
  { label: 'MRR', value: '12 840 zł', change: '+18%', up: true, icon: CreditCard, color: '#10B981', desc: 'vs poprzedni miesiąc' },
  { label: 'Aktywni klienci', value: '32', change: '+4', up: true, icon: Users, color: '#2563EB', desc: 'ten miesiąc' },
  { label: 'Retencja', value: '94%', change: '-1%', up: false, icon: Percent, color: '#F59E0B', desc: 'miesięczna' },
  { label: 'ARPU', value: '401 zł', change: '+9 zł', up: true, icon: TrendingUp, color: '#8B5CF6', desc: 'średni przychód/klient' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="px-3 py-2 rounded-lg text-xs" style={{ background: '#0D1525', border: '1px solid rgba(255,255,255,0.1)' }}>
        <p style={{ color: '#64748B', marginBottom: 4 }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: {typeof p.value === 'number' && p.value > 1000 ? `${p.value.toLocaleString()} zł` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function RaportyPage() {
  const [timeRange, setTimeRange] = useState<'7days' | '30days' | '3months' | '6months'>('6months');
  const [showFilters, setShowFilters] = useState(false);

  const handleExportPDF = () => {
    const allData = [
      ...kpis.map(k => ({ type: 'KPI', name: k.label, value: k.value, change: k.change })),
      ...mrrData.map(m => ({ type: 'MRR', month: m.month, mrr: m.mrr, new: m.new, churn: m.churn })),
    ];

    exportToPDF({
      filename: `raport_biznesowy_${new Date().toISOString().split('T')[0]}`,
      title: 'Raport Biznesowy - TrainerPro',
      columns: [
        { header: 'Typ', key: 'type', width: 30 },
        { header: 'Nazwa', key: 'name', width: 60 },
        { header: 'Wartość', key: 'value', width: 40 },
        { header: 'Zmiana', key: 'change', width: 30 },
      ],
      data: allData,
      orientation: 'landscape',
    });
  };

  const handleExportExcel = () => {
    exportToExcel({
      filename: `raport_biznesowy_${new Date().toISOString().split('T')[0]}`,
      columns: [
        { header: 'Typ', key: 'type' },
        { header: 'Nazwa', key: 'name' },
        { header: 'Wartość', key: 'value' },
        { header: 'Zmiana', key: 'change' },
      ],
      data: [
        ...kpis.map(k => ({ type: 'KPI', name: k.label, value: k.value, change: k.change })),
        ...mrrData.map(m => ({ type: 'MRR', name: m.month, value: `${m.mrr} zł`, change: `+${m.new - m.churn}` })),
      ],
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white" style={{ fontSize: '1.4rem', fontWeight: 700 }}>Raporty biznesowe</h1>
          <p className="text-sm mt-1" style={{ color: '#475569' }}>Analityka i KPI Twojego biznesu trenerskiego</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all"
            style={{
              background: showFilters ? 'rgba(37,99,235,0.15)' : '#0A0F1A',
              border: showFilters ? '1px solid rgba(37,99,235,0.4)' : '1px solid rgba(255,255,255,0.06)',
              color: showFilters ? '#60A5FA' : '#94A3B8',
            }}
          >
            <Filter size={16} />
            Filtry
          </button>
          <ExportButton
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
          />
        </div>
      </div>

      {showFilters && (
        <div className="p-4 rounded-xl mb-5" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
          <label className="block text-xs mb-2" style={{ color: '#64748B' }}>Zakres czasowy:</label>
          <div className="flex gap-2">
            {[
              ['7days', 'Ostatnie 7 dni'],
              ['30days', 'Ostatnie 30 dni'],
              ['3months', 'Ostatnie 3 miesiące'],
              ['6months', 'Ostatnie 6 miesięcy'],
            ].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setTimeRange(val as any)}
                className="px-3 py-1.5 rounded-lg text-xs transition-all"
                style={{
                  background: timeRange === val ? 'rgba(37,99,235,0.15)' : '#0D1525',
                  border: timeRange === val ? '1px solid rgba(37,99,235,0.4)' : '1px solid rgba(255,255,255,0.06)',
                  color: timeRange === val ? '#60A5FA' : '#475569',
                  fontWeight: timeRange === val ? 600 : 400,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map(({ label, value, change, up, icon: Icon, color, desc }) => (
          <div key={label} className="p-4 rounded-2xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                <Icon size={16} style={{ color }} />
              </div>
              <span className="text-xs" style={{ color: up ? '#34D399' : '#F87171' }}>{change}</span>
            </div>
            <p className="text-white" style={{ fontWeight: 800, fontSize: '1.3rem' }}>{value}</p>
            <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{label} <span style={{ color: '#334155' }}>· {desc}</span></p>
          </div>
        ))}
      </div>

      {/* MRR Chart */}
      <div className="p-5 rounded-2xl mb-6" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white" style={{ fontWeight: 600 }}>Przychody – MRR</p>
            <p className="text-xs mt-0.5" style={{ color: '#475569' }}>Ostatnie 7 miesięcy · Nowi klienci vs Churn</p>
          </div>
          <div className="flex items-center gap-4 text-xs" style={{ color: '#475569' }}>
            <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded inline-block" style={{ background: '#2563EB' }} /> MRR</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded inline-block" style={{ background: '#10B981' }} /> Nowi</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-1 rounded inline-block" style={{ background: '#EF4444' }} /> Churn</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={mrrData}>
            <defs>
              <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="mrr" name="MRR" stroke="#2563EB" fill="url(#mrrGrad)" strokeWidth={2.5} dot={false} />
            <Area type="monotone" dataKey="new" name="Nowi" stroke="#10B981" fill="none" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
            <Area type="monotone" dataKey="churn" name="Churn" stroke="#EF4444" fill="none" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Retention */}
        <div className="p-5 rounded-2xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-white mb-1" style={{ fontWeight: 600 }}>Klienci – Aktywni vs Churn</p>
          <p className="text-xs mb-4" style={{ color: '#475569' }}>Ostatnie 6 miesięcy</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={clientRetentionData}>
              <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="active" name="Aktywni" fill="#2563EB" radius={[4, 4, 0, 0]} />
              <Bar dataKey="churned" name="Odeszli" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Plan distribution */}
        <div className="p-5 rounded-2xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-white mb-1" style={{ fontWeight: 600 }}>Rozkład celów klientów</p>
          <p className="text-xs mb-4" style={{ color: '#475569' }}>Obecni klienci według celu treningowego</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie data={planDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" strokeWidth={0}>
                  {planDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2.5">
              {planDistribution.map(({ name, value, color }) => (
                <div key={name} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                    <span className="text-sm" style={{ color: '#94A3B8' }}>{name}</span>
                  </div>
                  <span className="text-sm" style={{ color: '#64748B' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Sessions per week */}
        <div className="p-5 rounded-2xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-white mb-1" style={{ fontWeight: 600 }}>Sesje treningowe – Ostatni miesiąc</p>
          <p className="text-xs mb-4" style={{ color: '#475569' }}>Zaplanowane vs Zrealizowane</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={sessionsPerWeek}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="week" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="completed" name="Zrealizowane" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cancelled" name="Anulowane" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Client satisfaction */}
        <div className="p-5 rounded-2xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-white mb-1" style={{ fontWeight: 600 }}>Satysfakcja klientów</p>
          <p className="text-xs mb-4" style={{ color: '#475569' }}>Średnia ocena (skala 1-5)</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={clientSatisfaction}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 5]} tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="score" name="Ocena" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: '#8B5CF6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 rounded-xl" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
            <p className="text-sm" style={{ color: '#A78BFA' }}>
              Średnia ocena wzrosła o <strong>11.9%</strong> w ciągu ostatnich 6 miesięcy
            </p>
          </div>
        </div>
      </div>

      {/* Funnel */}
      <div className="p-5 rounded-2xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-white mb-1" style={{ fontWeight: 600 }}>Lejek konwersji – Ten miesiąc</p>
        <p className="text-xs mb-5" style={{ color: '#475569' }}>Od pierwszego kontaktu do aktywnej subskrypcji</p>
        <div className="grid grid-cols-5 gap-2">
          {[
            { label: 'Nowe zapytania', value: 18, color: '#475569' },
            { label: 'Demo / Trial', value: 12, color: '#2563EB' },
            { label: 'Aktywowani', value: 9, color: '#06B6D4' },
            { label: 'Subskrypcja', value: 7, color: '#10B981' },
            { label: 'Upgrade', value: 2, color: '#8B5CF6' },
          ].map(({ label, value, color }, i, arr) => (
            <div key={label} className="text-center">
              <div className="mx-auto mb-2 flex items-end justify-center rounded-lg" style={{ height: `${Math.round((value / arr[0].value) * 100)}px`, minHeight: 30, background: `${color}20`, border: `1px solid ${color}40` }}>
                <span className="pb-2 text-lg" style={{ color, fontWeight: 800 }}>{value}</span>
              </div>
              <p className="text-xs" style={{ color: '#475569', lineHeight: 1.3 }}>{label}</p>
              {i > 0 && <p className="text-xs mt-1" style={{ color: '#334155' }}>{Math.round((value / arr[i - 1].value) * 100)}%</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
