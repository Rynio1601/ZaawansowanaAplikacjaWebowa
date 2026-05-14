import { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreVertical, Phone, Mail, Calendar, TrendingUp, X, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getClients, createClient, updateClient, deleteClient } from '../../utils/api';
import { toast } from 'sonner';
import ExportButton from '../../components/ExportButton';
import { exportClientsToFile } from '../../../utils/exportUtils';

const statusLabels: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: 'Aktywny', color: '#34D399', bg: 'rgba(16,185,129,0.1)' },
  trial: { label: 'Trial', color: '#FCD34D', bg: 'rgba(245,158,11,0.1)' },
  inactive: { label: 'Nieaktywny', color: '#64748B', bg: 'rgba(100,116,139,0.1)' },
};

export function KlienciPage() {
  const { getAuthHeader } = useAuth();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', goal: '', plan: '' });
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'sessions'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'unpaid'>('all');

  // Pobierz klientów przy załadowaniu strony
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const authHeader = getAuthHeader();
      
      // Skip API call if no auth token
      if (!authHeader) {
        console.warn('No auth header available for clients');
        setClients([]);
        setLoading(false);
        return;
      }
      
      const response = await getClients(authHeader);
      setClients(response.clients || []);
    } catch (error) {
      console.error('Error loading clients:', error);
      toast.error('Błąd pobierania klientów');
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = clients
    .filter(c => {
      const matchSearch = c.name?.toLowerCase().includes(search.toLowerCase()) ||
                         c.email?.toLowerCase().includes(search.toLowerCase()) ||
                         c.phone?.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'all' || c.status === filter;
      const matchPayment = paymentFilter === 'all' ||
                          (paymentFilter === 'paid' && c.paid) ||
                          (paymentFilter === 'unpaid' && !c.paid);
      return matchSearch && matchFilter && matchPayment;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'progress') {
        comparison = (a.progress || 0) - (b.progress || 0);
      } else if (sortBy === 'sessions') {
        comparison = (a.sessions || 0) - (b.sessions || 0);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const addClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createClient({
        ...newClient,
        weight: 70,
        targetWeight: 65,
      }, getAuthHeader());
      
      if (response.success) {
        toast.success('Klient dodany pomyślnie');
        setClients([response.client, ...clients]);
        setNewClient({ name: '', email: '', phone: '', goal: '', plan: '' });
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error creating client:', error);
      toast.error('Błąd dodawania klienta');
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tego klienta?')) return;
    
    try {
      await deleteClient(clientId, getAuthHeader());
      toast.success('Klient usunięty');
      setClients(clients.filter(c => c.id !== clientId));
      setSelected(null);
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Błąd usuwania klienta');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p style={{ color: '#64748B' }}>Ładowanie klientów...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white" style={{ fontSize: '1.4rem', fontWeight: 700 }}>Klienci</h1>
          <p className="text-sm mt-1" style={{ color: '#475569' }}>{clients.length} klientów · {clients.filter(c => c.status === 'active').length} aktywnych</p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton
            onExportPDF={() => exportClientsToFile(filtered, 'pdf')}
            onExportExcel={() => exportClientsToFile(filtered, 'excel')}
          />
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm"
            style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)', fontWeight: 600 }}>
            <Plus size={16} /> Dodaj klienta
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-5">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl flex-1 min-w-48" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Search size={16} style={{ color: '#475569' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Szukaj klienta (imię, email, telefon)..."
              className="bg-transparent text-sm outline-none w-full" style={{ color: '#94A3B8' }} />
          </div>
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all"
            style={{
              background: showAdvancedFilters ? 'rgba(37,99,235,0.15)' : '#0A0F1A',
              border: showAdvancedFilters ? '1px solid rgba(37,99,235,0.4)' : '1px solid rgba(255,255,255,0.06)',
              color: showAdvancedFilters ? '#60A5FA' : '#475569',
              fontWeight: showAdvancedFilters ? 600 : 400,
            }}
          >
            <Filter size={16} />
            Zaawansowane
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs" style={{ color: '#475569' }}>Status:</span>
          {[['all', 'Wszyscy'], ['active', 'Aktywni'], ['trial', 'Trial'], ['inactive', 'Nieaktywni']].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)}
              className="px-3 py-1.5 rounded-lg text-xs transition-all"
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

        {showAdvancedFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <label className="block text-xs mb-2" style={{ color: '#64748B' }}>Płatności:</label>
              <div className="flex gap-2">
                {[['all', 'Wszystkie'], ['paid', 'Opłacone'], ['unpaid', 'Zaległe']].map(([val, label]) => (
                  <button key={val} onClick={() => setPaymentFilter(val as any)}
                    className="px-3 py-1.5 rounded-lg text-xs transition-all flex-1"
                    style={{
                      background: paymentFilter === val ? 'rgba(37,99,235,0.15)' : '#0D1525',
                      border: paymentFilter === val ? '1px solid rgba(37,99,235,0.4)' : '1px solid rgba(255,255,255,0.06)',
                      color: paymentFilter === val ? '#60A5FA' : '#475569',
                      fontWeight: paymentFilter === val ? 600 : 400,
                    }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs mb-2" style={{ color: '#64748B' }}>Sortuj według:</label>
              <div className="flex gap-2">
                {[['name', 'Nazwa'], ['progress', 'Postęp'], ['sessions', 'Sesje']].map(([val, label]) => (
                  <button key={val} onClick={() => setSortBy(val as any)}
                    className="px-3 py-1.5 rounded-lg text-xs transition-all flex-1"
                    style={{
                      background: sortBy === val ? 'rgba(37,99,235,0.15)' : '#0D1525',
                      border: sortBy === val ? '1px solid rgba(37,99,235,0.4)' : '1px solid rgba(255,255,255,0.06)',
                      color: sortBy === val ? '#60A5FA' : '#475569',
                      fontWeight: sortBy === val ? 600 : 400,
                    }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs mb-2" style={{ color: '#64748B' }}>Kolejność:</label>
              <div className="flex gap-2">
                {[['asc', 'Rosnąco'], ['desc', 'Malejąco']].map(([val, label]) => (
                  <button key={val} onClick={() => setSortOrder(val as any)}
                    className="px-3 py-1.5 rounded-lg text-xs transition-all flex-1"
                    style={{
                      background: sortOrder === val ? 'rgba(37,99,235,0.15)' : '#0D1525',
                      border: sortOrder === val ? '1px solid rgba(37,99,235,0.4)' : '1px solid rgba(255,255,255,0.06)',
                      color: sortOrder === val ? '#60A5FA' : '#475569',
                      fontWeight: sortOrder === val ? 600 : 400,
                    }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Klient', 'Cel / Plan', 'Status', 'Postęp', 'Płatność', 'Sesje', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs" style={{ color: '#475569', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(client => {
                const st = statusLabels[client.status];
                return (
                  <tr key={client.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    className="transition-colors cursor-pointer"
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    onClick={() => setSelected(client)}>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, #1E3A5F, #0D2A4F)', fontWeight: 700 }}>
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm text-white" style={{ fontWeight: 500 }}>{client.name}</p>
                          <p className="text-xs" style={{ color: '#475569' }}>{client.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm text-white" style={{ fontWeight: 500 }}>{client.goal}</p>
                      <p className="text-xs" style={{ color: '#475569' }}>{client.plan}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <div className="h-full rounded-full" style={{ width: `${client.progress}%`, background: 'linear-gradient(90deg, #2563EB, #06B6D4)' }} />
                        </div>
                        <span className="text-xs" style={{ color: '#64748B' }}>{client.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs" style={{ color: client.paid ? '#34D399' : '#F87171' }}>
                        {client.paid ? '✓ Opłacono' : '✗ Zaległość'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm" style={{ color: '#64748B' }}>{client.sessions}</td>
                    <td className="px-4 py-3.5">
                      <button className="p-1 rounded-lg" style={{ color: '#475569' }}><MoreVertical size={14} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={() => setSelected(null)}>
          <div className="w-full max-w-lg rounded-2xl p-6" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.08)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg text-white" style={{ background: 'linear-gradient(135deg, #1E3A5F, #0D2A4F)', fontWeight: 700 }}>
                  {selected.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white" style={{ fontWeight: 700, fontSize: '1.05rem' }}>{selected.name}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: statusLabels[selected.status].bg, color: statusLabels[selected.status].color }}>
                    {statusLabels[selected.status].label}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ color: '#475569' }}><X size={20} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { icon: Mail, label: 'Email', val: selected.email },
                { icon: Phone, label: 'Telefon', val: selected.phone },
                { icon: Calendar, label: 'Dołączył/a', val: selected.joined },
                { icon: TrendingUp, label: 'Sesje', val: `${selected.sessions} odbytych` },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} className="flex items-start gap-2 p-3 rounded-xl" style={{ background: '#0D1525' }}>
                  <Icon size={14} style={{ color: '#475569', marginTop: 2 }} />
                  <div>
                    <p className="text-xs" style={{ color: '#475569' }}>{label}</p>
                    <p className="text-sm text-white">{val}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-xl mb-4" style={{ background: '#0D1525' }}>
              <div className="flex justify-between mb-2">
                <span className="text-xs" style={{ color: '#475569' }}>Postęp planu</span>
                <span className="text-xs" style={{ color: '#60A5FA' }}>{selected.progress}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full" style={{ width: `${selected.progress}%`, background: 'linear-gradient(90deg, #2563EB, #06B6D4)' }} />
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 rounded-xl text-sm text-white" style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)', fontWeight: 600 }}>Wyślij wiadomość</button>
              <button className="flex-1 py-2.5 rounded-xl text-sm" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94A3B8' }}>Edytuj profil</button>
              <button
                onClick={() => handleDeleteClient(selected.id)}
                className="py-2.5 px-4 rounded-xl text-sm"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444' }}
              >
                Usuń
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add client modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.08)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <p className="text-white" style={{ fontWeight: 700, fontSize: '1.05rem' }}>Nowy klient</p>
              <button onClick={() => setShowModal(false)} style={{ color: '#475569' }}><X size={20} /></button>
            </div>
            <form onSubmit={addClient} className="space-y-3">
              {[
                { key: 'name', label: 'Imię i nazwisko', placeholder: 'Jan Kowalski' },
                { key: 'email', label: 'Email', placeholder: 'jan@example.com' },
                { key: 'phone', label: 'Telefon', placeholder: '+48 500 000 000' },
                { key: 'goal', label: 'Cel treningowy', placeholder: 'np. Redukcja, Masa, Siła' },
                { key: 'plan', label: 'Plan treningowy', placeholder: 'np. FBW 3x w tygodniu' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs mb-1.5" style={{ color: '#64748B' }}>{label}</label>
                  <input required value={newClient[key as keyof typeof newClient]} onChange={e => setNewClient({ ...newClient, [key]: e.target.value })}
                    placeholder={placeholder} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#0D1525', border: '1px solid rgba(255,255,255,0.06)', color: '#F1F5F9' }} />
                </div>
              ))}
              <button type="submit" className="w-full py-3 rounded-xl text-white text-sm mt-2"
                style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)', fontWeight: 600 }}>
                Dodaj klienta
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}