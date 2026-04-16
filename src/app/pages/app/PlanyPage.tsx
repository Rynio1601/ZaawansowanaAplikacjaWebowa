import { useState, useEffect } from 'react';
import { Plus, Search, Copy, Send, Edit2, Dumbbell, Clock, Users, ChevronRight, X, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getPlans, createPlan, deletePlan } from '../../utils/api';
import { toast } from 'sonner';

const categoryColors: Record<string, string> = {
  'Redukcja': '#EF4444',
  'Siła': '#2563EB',
  'Masa': '#06B6D4',
  'Wytrzymałość': '#10B981',
  'Rehabilitacja': '#F59E0B',
  'Fitness': '#8B5CF6',
};

export function PlanyPage() {
  const { getAuthHeader } = useAuth();
  const [plans, setPlans] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newPlan, setNewPlan] = useState({
    name: '',
    level: 'Średniozaawansowany',
    duration: '',
    sessionsPerWeek: 3,
    category: 'Redukcja',
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const response = await getPlans(getAuthHeader());
      setPlans(response.plans || []);
    } catch (error) {
      console.error('Error loading plans:', error);
      toast.error('Błąd pobierania planów');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await createPlan({
        ...newPlan,
        clients: 0,
        lastEdited: new Date().toISOString().split('T')[0],
        days: [],
      }, getAuthHeader());

      if (response.success) {
        toast.success('Plan utworzony pomyślnie');
        setPlans([response.plan, ...plans]);
        setNewPlan({ name: '', level: 'Średniozaawansowany', duration: '', sessionsPerWeek: 3, category: 'Redukcja' });
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error creating plan:', error);
      toast.error('Błąd tworzenia planu');
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Czy na pewno chcesz usunąć ten plan?')) return;

    try {
      await deletePlan(planId, getAuthHeader());
      toast.success('Plan usunięty');
      setPlans(plans.filter(p => p.id !== planId));
      setSelected(null);
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error('Błąd usuwania planu');
    }
  };

  const filtered = plans.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p style={{ color: '#64748B' }}>Ładowanie planów...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white" style={{ fontSize: '1.4rem', fontWeight: 700 }}>Plany treningowe</h1>
          <p className="text-sm mt-1" style={{ color: '#475569' }}>{plans.length} planów · {plans.reduce((a, p) => a + p.clients, 0)} przypisanych klientów</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm"
          style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)', fontWeight: 600 }}>
          <Plus size={16} /> Nowy plan
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-5 max-w-sm" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
        <Search size={16} style={{ color: '#475569' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Szukaj planu..."
          className="bg-transparent text-sm outline-none w-full" style={{ color: '#94A3B8' }} />
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(plan => {
          const color = categoryColors[plan.category] || '#2563EB';
          return (
            <div key={plan.id} className="p-5 rounded-2xl cursor-pointer transition-all"
              style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = `${color}40`)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
              onClick={() => setSelected(plan)}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
                  <Dumbbell size={18} style={{ color }} />
                </div>
                <span className="text-xs px-2 py-1 rounded-full" style={{ background: `${color}15`, color }}>{plan.category}</span>
              </div>
              <p className="text-white mb-1" style={{ fontWeight: 700 }}>{plan.name}</p>
              <p className="text-xs mb-4" style={{ color: '#475569' }}>{plan.level}</p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { icon: Clock, val: plan.duration },
                  { icon: Dumbbell, val: `${plan.sessionsPerWeek}x/tydzień` },
                  { icon: Users, val: `${plan.clients} klientów` },
                ].map(({ icon: Icon, val }) => (
                  <div key={val} className="flex items-center gap-1.5">
                    <Icon size={12} style={{ color: '#475569' }} />
                    <span className="text-xs" style={{ color: '#64748B' }}>{val}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-1"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#94A3B8' }}
                  onClick={e => e.stopPropagation()}>
                  <Copy size={12} /> Kopiuj
                </button>
                <button className="flex-1 py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-1"
                  style={{ background: `${color}15`, border: `1px solid ${color}40`, color }}
                  onClick={e => e.stopPropagation()}>
                  <Send size={12} /> Wyślij
                </button>
                <button className="flex-1 py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-1"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#94A3B8' }}
                  onClick={e => {
                    e.stopPropagation();
                    handleDeletePlan(plan.id);
                  }}>
                  <Trash2 size={12} /> Usuń
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Plan detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={() => setSelected(null)}>
          <div className="w-full max-w-2xl rounded-2xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.08)', maxHeight: '85vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, background: '#0A0F1A', zIndex: 1 }}>
              <div>
                <p className="text-white" style={{ fontWeight: 700, fontSize: '1.05rem' }}>{selected.name}</p>
                <p className="text-xs" style={{ color: '#475569' }}>{selected.level} · {selected.duration} · {selected.sessionsPerWeek}x/tydzień</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ color: '#475569' }}><X size={20} /></button>
            </div>
            <div className="p-6">
              {selected.days.length > 0 ? (
                <div className="space-y-4">
                  {selected.days.map(day => (
                    <div key={day.name}>
                      <p className="text-white mb-3" style={{ fontWeight: 600 }}>{day.name}</p>
                      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                        <table className="w-full text-sm">
                          <thead>
                            <tr style={{ background: '#0D1525' }}>
                              {['Ćwiczenie', 'Serie', 'Powtórzenia', 'Przerwa', 'Ciężar'].map(h => (
                                <th key={h} className="px-4 py-2 text-left text-xs" style={{ color: '#475569' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {day.exercises.map((ex, i) => (
                              <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                                <td className="px-4 py-2.5 text-sm text-white">{ex.name}</td>
                                <td className="px-4 py-2.5 text-xs" style={{ color: '#64748B' }}>{ex.sets}</td>
                                <td className="px-4 py-2.5 text-xs" style={{ color: '#64748B' }}>{ex.reps}</td>
                                <td className="px-4 py-2.5 text-xs" style={{ color: '#64748B' }}>{ex.rest}</td>
                                <td className="px-4 py-2.5 text-xs" style={{ color: '#60A5FA' }}>{ex.weight}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Dumbbell size={32} style={{ color: '#2D3748', margin: '0 auto 12px' }} />
                  <p className="text-sm" style={{ color: '#475569' }}>Plan nie zawiera jeszcze ćwiczeń. Kliknij „Edytuj", żeby dodać trening.</p>
                </div>
              )}
              <div className="flex gap-2 mt-6">
                <button className="flex-1 py-2.5 rounded-xl text-sm text-white flex items-center justify-center gap-1.5"
                  style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)', fontWeight: 600 }}>
                  <Edit2 size={14} /> Edytuj plan
                </button>
                <button className="flex-1 py-2.5 rounded-xl text-sm flex items-center justify-center gap-1.5"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94A3B8' }}>
                  <Send size={14} /> Wyślij klientowi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New plan modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.08)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <p className="text-white" style={{ fontWeight: 700 }}>Nowy plan treningowy</p>
              <button onClick={() => setShowModal(false)} style={{ color: '#475569' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreatePlan} className="space-y-3">
              {[
                { key: 'name', label: 'Nazwa planu', placeholder: 'np. FBW 3x Redukcja' },
                { key: 'duration', label: 'Czas trwania', placeholder: 'np. 8 tygodni' },
                { key: 'sessionsPerWeek', label: 'Sesji w tygodniu', placeholder: '3', type: 'number' },
              ].map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label className="block text-xs mb-1.5" style={{ color: '#64748B' }}>{label}</label>
                  <input required type={type || 'text'} value={newPlan[key as keyof typeof newPlan]} onChange={e => setNewPlan({ ...newPlan, [key]: e.target.value })}
                    placeholder={placeholder} className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#0D1525', border: '1px solid rgba(255,255,255,0.06)', color: '#F1F5F9' }} />
                </div>
              ))}
              <div>
                <label className="block text-xs mb-1.5" style={{ color: '#64748B' }}>Poziom zaawansowania</label>
                <select required value={newPlan.level} onChange={e => setNewPlan({ ...newPlan, level: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#0D1525', border: '1px solid rgba(255,255,255,0.06)', color: '#F1F5F9' }}>
                  <option value="">Wybierz...</option>
                  {['Początkujący', 'Średniozaawansowany', 'Zaawansowany'].map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1.5" style={{ color: '#64748B' }}>Kategoria</label>
                <select required value={newPlan.category} onChange={e => setNewPlan({ ...newPlan, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: '#0D1525', border: '1px solid rgba(255,255,255,0.06)', color: '#F1F5F9' }}>
                  <option value="">Wybierz...</option>
                  {Object.keys(categoryColors).map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full py-3 rounded-xl text-white text-sm"
                style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)', fontWeight: 600 }}>
                Utwórz plan
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}