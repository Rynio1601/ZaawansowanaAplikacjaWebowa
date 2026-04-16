import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { Users, TrendingUp, CreditCard, Dumbbell, ArrowRight, AlertCircle, Check, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useAuth } from '../../contexts/AuthContext';
import { getDashboardStats } from '../../utils/api';

const revenueData = [
  { month: 'Paź', value: 8200, id: 'oct' },
  { month: 'Lis', value: 9400, id: 'nov' },
  { month: 'Gru', value: 8800, id: 'dec' },
  { month: 'Sty', value: 10200, id: 'jan' },
  { month: 'Lut', value: 11400, id: 'feb' },
  { month: 'Mar', value: 12840, id: 'mar' },
];

const clientsData = [
  { month: 'Paź', active: 22, new: 3, id: 'oct' },
  { month: 'Lis', active: 25, new: 4, id: 'nov' },
  { month: 'Gru', active: 24, new: 2, id: 'dec' },
  { month: 'Sty', active: 27, new: 5, id: 'jan' },
  { month: 'Lut', active: 30, new: 4, id: 'feb' },
  { month: 'Mar', active: 32, new: 4, id: 'mar' },
];

const onboardingSteps = [
  { text: 'Dodaj pierwszego klienta', done: true },
  { text: 'Stwórz plan treningowy', done: true },
  { text: 'Wyślij plan do klienta', done: true },
  { text: 'Skonfiguruj płatności', done: false },
  { text: 'Zaproś do aplikacji mobilnej', done: false },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3 py-2 rounded-lg text-sm" style={{ background: '#0D1525', border: '1px solid rgba(255,255,255,0.1)' }}>
        <p style={{ color: '#64748B', marginBottom: 2 }}>{label}</p>
        <p style={{ color: '#60A5FA', fontWeight: 700 }}>{payload[0].value.toLocaleString()} {payload[0].name === 'value' ? 'zł' : ''}</p>
      </div>
    );
  }
  return null;
};

export function DashboardPage() {
  const { user, getAuthHeader } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [recentClients, setRecentClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const authHeader = getAuthHeader();
      
      // Skip API call if no auth token
      if (!authHeader) {
        console.warn('No auth header available, using default values');
        setStats({
          activeClients: 0,
          totalRevenue: 0,
          totalPlans: 0,
          retention: 100,
          totalClients: 0,
        });
        setRecentClients([]);
        setLoading(false);
        return;
      }
      
      const response = await getDashboardStats(authHeader);
      setStats(response.stats || {
        activeClients: 0,
        totalRevenue: 0,
        totalPlans: 0,
        retention: 100,
        totalClients: 0,
      });
      setRecentClients(response.recentClients || []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      // Użyj domyślnych wartości w przypadku błędu (np. nowy użytkownik bez danych)
      setStats({
        activeClients: 0,
        totalRevenue: 0,
        totalPlans: 0,
        retention: 100,
        totalClients: 0,
      });
      setRecentClients([]);
    } finally {
      setLoading(false);
    }
  };

  const kpiCards = [
    { label: 'Aktywni klienci', value: stats?.activeClients?.toString() || '0', change: '+4', up: true, icon: Users, color: '#2563EB', bg: 'rgba(37,99,235,0.1)' },
    { label: 'MRR', value: `${stats?.totalRevenue?.toLocaleString() || '0'} zł`, change: '+18%', up: true, icon: CreditCard, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
    { label: 'Plany treningowe', value: stats?.totalPlans?.toString() || '0', change: '+3', up: true, icon: Dumbbell, color: '#06B6D4', bg: 'rgba(6,182,212,0.1)' },
    { label: 'Retencja', value: `${stats?.retention || 100}%`, change: '-1%', up: false, icon: TrendingUp, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  ];

  const completedSteps = onboardingSteps.filter(s => s.done).length;
  const progress = Math.round((completedSteps / onboardingSteps.length) * 100);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p style={{ color: '#64748B' }}>Ładowanie danych...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Trial banner */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl mb-6" style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)' }}>
        <div className="flex items-center gap-3">
          <AlertCircle size={16} style={{ color: '#60A5FA' }} />
          <span className="text-sm" style={{ color: '#94A3B8' }}>
            <span style={{ color: '#60A5FA', fontWeight: 600 }}>Twój trial kończy się za 11 dni.</span> Przejdź na plan Pro, żeby nie stracić dostępu.
          </span>
        </div>
        <Link to="/cennik" className="text-xs px-3 py-1.5 rounded-lg text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)', fontWeight: 600 }}>
          Kup subskrypcję
        </Link>
      </div>

      {/* Welcome */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white" style={{ fontSize: '1.4rem', fontWeight: 700 }}>Cześć, Michał! 👋</h1>
          <p className="text-sm mt-1" style={{ color: '#475569' }}>Środa, 5 marca 2026 · Masz 3 sesje treningowe dzisiaj</p>
        </div>
        <Link to="/app/klienci" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm"
          style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)', fontWeight: 600 }}>
          <Plus size={16} /> Dodaj klienta
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpiCards.map(({ label, value, change, up, icon: Icon, color, bg }) => (
          <div key={label} className="p-4 rounded-2xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                <Icon size={17} style={{ color }} />
              </div>
              <span className="text-xs flex items-center gap-0.5" style={{ color: up ? '#34D399' : '#F87171' }}>
                {up ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                {change}
              </span>
            </div>
            <p className="text-white" style={{ fontWeight: 800, fontSize: '1.3rem', letterSpacing: '-0.02em' }}>{value}</p>
            <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue chart */}
        <div className="p-5 rounded-2xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white" style={{ fontWeight: 600, fontSize: '0.95rem' }}>Przychody (MRR)</p>
              <p className="text-xs mt-0.5" style={{ color: '#475569' }}>Ostatnie 6 miesięcy</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(16,185,129,0.1)', color: '#34D399' }}>+18% MoM</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#2563EB" fill="url(#revGrad)" strokeWidth={2} dot={false} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Clients chart */}
        <div className="p-5 rounded-2xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white" style={{ fontWeight: 600, fontSize: '0.95rem' }}>Klienci</p>
              <p className="text-xs mt-0.5" style={{ color: '#475569' }}>Aktywni i nowi</p>
            </div>
            <div className="flex items-center gap-3 text-xs" style={{ color: '#475569' }}>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: '#2563EB' }} /> Aktywni</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: '#06B6D4' }} /> Nowi</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={clientsData} barGap={4}>
              <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0D1525', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#94A3B8', fontSize: 12 }} />
              <Bar key="active-bar" dataKey="active" fill="#2563EB" radius={[4, 4, 0, 0]} name="Aktywni" />
              <Bar key="new-bar" dataKey="new" fill="#06B6D4" radius={[4, 4, 0, 0]} name="Nowi" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent clients */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-white" style={{ fontWeight: 600, fontSize: '0.95rem' }}>Ostatni klienci</p>
            <Link to="/app/klienci" className="text-xs flex items-center gap-1" style={{ color: '#60A5FA' }}>
              Wszyscy <ArrowRight size={12} />
            </Link>
          </div>
          <div>
            {recentClients.length === 0 ? (
              <div className="px-5 py-8 text-center" style={{ color: '#475569' }}>
                <p className="text-sm">Brak klientów. Dodaj pierwszego klienta, aby zobaczyć tutaj listę.</p>
              </div>
            ) : (
              recentClients.map((client, index) => (
                <div key={client.id || `client-${index}`} className="flex items-center gap-3 px-5 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs text-white" style={{ background: 'linear-gradient(135deg, #1E3A5F, #0D2A4F)', fontWeight: 700 }}>
                    {client.name?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-white truncate" style={{ fontWeight: 500 }}>{client.name}</p>
                      <span className="text-xs px-1.5 py-0.5 rounded-full" style={{
                        background: client.status === 'active' ? 'rgba(16,185,129,0.1)' : client.status === 'trial' ? 'rgba(245,158,11,0.1)' : 'rgba(100,116,139,0.1)',
                        color: client.status === 'active' ? '#34D399' : client.status === 'trial' ? '#FCD34D' : '#64748B',
                      }}>
                        {client.status === 'active' ? 'Aktywny' : client.status === 'trial' ? 'Trial' : 'Nieaktywny'}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{client.goal} · {client.plan}</p>
                  </div>
                  <div className="hidden sm:block text-right">
                    <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full" style={{ width: `${client.progress || 0}%`, background: 'linear-gradient(90deg, #2563EB, #06B6D4)' }} />
                    </div>
                    <p className="text-xs mt-1" style={{ color: '#475569' }}>{client.progress || 0}%</p>
                  </div>
                  <div className="flex-shrink-0">
                    {client.paid ? <span className="text-xs" style={{ color: '#34D399' }}>✓ Opł.</span> : <span className="text-xs" style={{ color: '#F87171' }}>✗ Brak</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Onboarding + Quick actions */}
        <div className="space-y-4">
          {/* Onboarding */}
          <div className="p-5 rounded-2xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-white mb-1" style={{ fontWeight: 600, fontSize: '0.95rem' }}>Konfiguracja konta</p>
            <p className="text-xs mb-3" style={{ color: '#475569' }}>{completedSteps}/{onboardingSteps.length} kroków</p>
            <div className="h-1.5 rounded-full overflow-hidden mb-4" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-full rounded-full" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #2563EB, #06B6D4)', transition: 'width 0.5s' }} />
            </div>
            <div className="space-y-2.5">
              {onboardingSteps.map(({ text, done }) => (
                <div key={text} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: done ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)', border: done ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.08)' }}>
                    {done && <Check size={10} style={{ color: '#34D399' }} />}
                  </div>
                  <span className="text-xs" style={{ color: done ? '#94A3B8' : '#475569', textDecoration: done ? 'line-through' : 'none' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="p-5 rounded-2xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-white mb-3" style={{ fontWeight: 600, fontSize: '0.95rem' }}>Szybkie akcje</p>
            <div className="space-y-2">
              {[
                { label: 'Dodaj klienta', path: '/app/klienci', color: '#2563EB' },
                { label: 'Utwórz plan treningowy', path: '/app/plany', color: '#06B6D4' },
                { label: 'Sprawdź płatności', path: '/app/platnosci', color: '#10B981' },
                { label: 'Zobacz raporty', path: '/app/raporty', color: '#8B5CF6' },
              ].map(({ label, path, color }) => (
                <Link key={label} to={path}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-sm"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)', color: '#94A3B8' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${color}40`; (e.currentTarget as HTMLElement).style.color = '#F1F5F9'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.color = '#94A3B8'; }}>
                  {label}
                  <ArrowRight size={14} style={{ color }} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}