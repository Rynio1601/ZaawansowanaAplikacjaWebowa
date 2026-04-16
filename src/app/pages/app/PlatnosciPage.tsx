import { useState, useEffect } from 'react';
import { CreditCard, TrendingUp, AlertCircle, Check, X, Plus, Download, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getPayments, addPayment } from '../../utils/api';
import { toast } from 'sonner';

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.FC<any> }> = {
  paid: { label: 'Opłacona', color: '#34D399', bg: 'rgba(16,185,129,0.1)', icon: Check },
  pending: { label: 'Oczekująca', color: '#FCD34D', bg: 'rgba(245,158,11,0.1)', icon: Clock },
  overdue: { label: 'Zaległa', color: '#F87171', bg: 'rgba(239,68,68,0.1)', icon: AlertCircle },
};

export function PlatnosciPage() {
  const { getAuthHeader } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const response = await getPayments(getAuthHeader());
      setTransactions(response.payments || []);
    } catch (error) {
      console.error('Error loading payments:', error);
      toast.error('Błąd pobierania płatności');
    } finally {
      setLoading(false);
    }
  };

  const paid = transactions.filter(t => t.status === 'paid').reduce((a, t) => a + (t.amount || 0), 0);
  const pending = transactions.filter(t => t.status === 'pending').reduce((a, t) => a + (t.amount || 0), 0);
  const overdue = transactions.filter(t => t.status === 'overdue').reduce((a, t) => a + (t.amount || 0), 0);

  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p style={{ color: '#64748B' }}>Ładowanie płatności...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white" style={{ fontSize: '1.4rem', fontWeight: 700 }}>Płatności</h1>
          <p className="text-sm mt-1" style={{ color: '#475569' }}>Zarządzaj subskrypcjami i fakturami</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
            style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)', color: '#94A3B8' }}>
            <Download size={16} /> Eksportuj
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm"
            style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)', fontWeight: 600 }}>
            <Plus size={16} /> Dodaj płatność
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Przychód (ten mies.)', value: paid, icon: CreditCard, color: '#10B981', bg: 'rgba(16,185,129,0.1)', change: '+18%' },
          { label: 'Oczekujące', value: pending, icon: Clock, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', change: `${transactions.filter(t => t.status === 'pending').length} transakcji` },
          { label: 'Zaległości', value: overdue, icon: AlertCircle, color: '#EF4444', bg: 'rgba(239,68,68,0.1)', change: `${transactions.filter(t => t.status === 'overdue').length} transakcji` },
        ].map(({ label, value, icon: Icon, color, bg, change }) => (
          <div key={label} className="p-5 rounded-2xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                <Icon size={18} style={{ color }} />
              </div>
              <span className="text-xs px-2 py-1 rounded-lg" style={{ background: bg, color }}>{change}</span>
            </div>
            <p className="text-white" style={{ fontWeight: 800, fontSize: '1.6rem', letterSpacing: '-0.02em' }}>
              {value.toLocaleString('pl-PL')} zł
            </p>
            <p className="text-sm mt-1" style={{ color: '#475569' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Overdue alert */}
      {overdue > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5" style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <AlertCircle size={16} style={{ color: '#F87171' }} />
          <p className="text-sm" style={{ color: '#F87171' }}>
            Masz <strong>{transactions.filter(t => t.status === 'overdue').length} zaległą płatność</strong> na łączną kwotę {overdue} zł. Wyślij przypomnienie do klientów.
          </p>
          <button className="ml-auto text-xs px-3 py-1.5 rounded-lg flex-shrink-0" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#F87171' }}>
            Wyślij przypomnienie
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[['all', 'Wszystkie'], ['paid', 'Opłacone'], ['pending', 'Oczekujące'], ['overdue', 'Zaległe']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className="px-3 py-2 rounded-xl text-sm transition-all"
            style={{
              background: filter === val ? 'rgba(37,99,235,0.15)' : '#0A0F1A',
              border: filter === val ? '1px solid rgba(37,99,235,0.4)' : '1px solid rgba(255,255,255,0.06)',
              color: filter === val ? '#60A5FA' : '#475569',
              fontWeight: filter === val ? 600 : 400,
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* Transactions table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['ID', 'Klient', 'Typ', 'Kwota', 'Data', 'Status', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs" style={{ color: '#475569', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => {
                const st = statusConfig[t.status];
                const Icon = st.icon;
                return (
                  <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-mono" style={{ color: '#475569' }}>#{t.id}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs text-white" style={{ background: 'linear-gradient(135deg, #1E3A5F, #0D2A4F)', fontWeight: 700 }}>
                          {t.client.charAt(0)}
                        </div>
                        <span className="text-sm text-white">{t.client}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm" style={{ color: '#64748B' }}>{t.type}</td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm text-white" style={{ fontWeight: 600 }}>{t.amount} zł</span>
                    </td>
                    <td className="px-4 py-3.5 text-sm" style={{ color: '#64748B' }}>{t.date}</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full" style={{ background: st.bg, color: st.color }}>
                        <Icon size={10} />
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {t.status === 'overdue' && (
                        <button className="text-xs px-2.5 py-1 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', color: '#F87171' }}>
                          Przypomnij
                        </button>
                      )}
                      {t.status === 'pending' && (
                        <button className="text-xs px-2.5 py-1 rounded-lg" style={{ background: 'rgba(245,158,11,0.1)', color: '#FCD34D' }}>
                          Sprawdź
                        </button>
                      )}
                      {t.status === 'paid' && (
                        <button className="text-xs px-2.5 py-1 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)', color: '#475569' }}>
                          Faktura
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stripe info */}
      <div className="mt-6 p-4 rounded-xl flex items-center gap-3" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
        <CreditCard size={20} style={{ color: '#8B5CF6' }} />
        <div>
          <p className="text-sm text-white" style={{ fontWeight: 600 }}>Automatyczne pobieranie płatności przez Stripe</p>
          <p className="text-xs mt-0.5" style={{ color: '#475569' }}>Subskrypcje klientów są pobierane automatycznie co miesiąc. Skonfiguruj integrację w <span style={{ color: '#60A5FA' }}>Ustawieniach → Płatności</span>.</p>
        </div>
      </div>
    </div>
  );
}