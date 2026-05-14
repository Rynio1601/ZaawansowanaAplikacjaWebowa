import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, Users, X, Filter, Search, Calendar as CalendarIcon, Grid } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getSessions, createSession, updateSession, deleteSession } from '../../utils/api';
import { toast } from 'sonner';
import ExportButton from '../../components/ExportButton';
import { exportScheduleToFile } from '../../../utils/exportUtils';
import CalendarView from '../../components/CalendarView';

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const DAYS = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd'];
const DATES = ['3 mar', '4 mar', '5 mar', '6 mar', '7 mar', '8 mar', '9 mar'];

export function GrafikPage() {
  const { getAuthHeader } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchClient, setSearchClient] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid');
  const todayIdx = 2; // Wednesday (index 2)

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const response = await getSessions(getAuthHeader());
      setSessions(response.sessions || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
      toast.error('Błąd pobierania sesji');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (sessionData: any) => {
    try {
      const response = await createSession(sessionData, getAuthHeader());
      if (response.success) {
        toast.success('Sesja dodana');
        setSessions([response.session, ...sessions]);
        setShowAdd(false);
      }
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('Błąd dodawania sesji');
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Czy na pewno chcesz usunąć tę sesję?')) return;

    try {
      await deleteSession(sessionId, getAuthHeader());
      toast.success('Sesja usunięta');
      setSessions(sessions.filter(s => s.id !== sessionId));
      setSelected(null);
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Błąd usuwania sesji');
    }
  };

  const filteredSessions = sessions.filter(s => {
    const matchClient = !searchClient || s.client?.toLowerCase().includes(searchClient.toLowerCase());
    const matchType = filterType === 'all' || s.type === filterType;
    return matchClient && matchType;
  });

  const exportSessions = sessions.map(s => ({
    date: DATES[s.day],
    time: `${s.hour}:00`,
    clientName: s.client,
    type: s.type,
    status: 'scheduled',
    notes: s.notes || '',
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p style={{ color: '#64748B' }}>Ładowanie grafiku...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white" style={{ fontSize: '1.4rem', fontWeight: 700 }}>Grafik</h1>
          <p className="text-sm mt-1" style={{ color: '#475569' }}>3–9 marca 2026 · {sessions.length} sesji w tym tygodniu</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
            <button
              onClick={() => setViewMode('grid')}
              className="p-2 rounded-lg transition-all"
              style={{
                background: viewMode === 'grid' ? 'rgba(37,99,235,0.15)' : 'transparent',
                color: viewMode === 'grid' ? '#60A5FA' : '#475569',
              }}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className="p-2 rounded-lg transition-all"
              style={{
                background: viewMode === 'calendar' ? 'rgba(37,99,235,0.15)' : 'transparent',
                color: viewMode === 'calendar' ? '#60A5FA' : '#475569',
              }}
            >
              <CalendarIcon size={16} />
            </button>
          </div>
          <ExportButton
            onExportPDF={() => exportScheduleToFile(exportSessions, 'pdf')}
            onExportExcel={() => exportScheduleToFile(exportSessions, 'excel')}
          />
          {viewMode === 'grid' && (
            <>
              <button className="p-2 rounded-xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)', color: '#475569' }}>
                <ChevronLeft size={18} />
              </button>
              <button className="px-3 py-2 rounded-xl text-sm" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)', color: '#94A3B8' }}>
                Dziś
              </button>
              <button className="p-2 rounded-xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)', color: '#475569' }}>
                <ChevronRight size={18} />
              </button>
            </>
          )}
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm ml-2"
            style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)', fontWeight: 600 }}>
            <Plus size={16} /> Dodaj sesję
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-3 mb-5">
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl flex-1" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
            <Search size={16} style={{ color: '#475569' }} />
            <input
              value={searchClient}
              onChange={e => setSearchClient(e.target.value)}
              placeholder="Szukaj klienta..."
              className="bg-transparent text-sm outline-none w-full"
              style={{ color: '#94A3B8' }}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all"
            style={{
              background: showFilters ? 'rgba(37,99,235,0.15)' : '#0A0F1A',
              border: showFilters ? '1px solid rgba(37,99,235,0.4)' : '1px solid rgba(255,255,255,0.06)',
              color: showFilters ? '#60A5FA' : '#475569',
              fontWeight: showFilters ? 600 : 400,
            }}
          >
            <Filter size={16} />
            Filtry
          </button>
        </div>

        {showFilters && (
          <div className="p-4 rounded-xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
            <label className="block text-xs mb-2" style={{ color: '#64748B' }}>Typ treningu:</label>
            <div className="flex flex-wrap gap-2">
              {['all', 'Trening siłowy', 'Cardio', 'Funkcjonalny', 'Stretching'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className="px-3 py-1.5 rounded-lg text-xs transition-all"
                  style={{
                    background: filterType === type ? 'rgba(37,99,235,0.15)' : '#0D1525',
                    border: filterType === type ? '1px solid rgba(37,99,235,0.4)' : '1px solid rgba(255,255,255,0.06)',
                    color: filterType === type ? '#60A5FA' : '#475569',
                    fontWeight: filterType === type ? 600 : 400,
                  }}
                >
                  {type === 'all' ? 'Wszystkie' : type}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {viewMode === 'calendar' ? (
        <CalendarView
          sessions={filteredSessions.map(s => ({
            id: s.id,
            date: new Date(2026, 2, s.day + 3),
            time: `${s.hour}:00`,
            client: s.client,
            type: s.type,
            color: s.color,
          }))}
          onDateSelect={(date) => console.log('Selected date:', date)}
          onSessionClick={(session) => {
            const originalSession = sessions.find(s => s.id === session.id);
            if (originalSession) setSelected(originalSession);
          }}
        />
      ) : (
        <>
          {/* Summary row */}
          <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Sesje w tygodniu', value: sessions.length.toString(), color: '#2563EB' },
          { label: 'Godziny treningów', value: `${sessions.reduce((a, s) => a + s.duration, 0) / 60}h`, color: '#06B6D4' },
          { label: 'Różnych klientów', value: new Set(sessions.map(s => s.client)).size.toString(), color: '#10B981' },
        ].map(({ label, value, color }) => (
          <div key={label} className="p-4 rounded-2xl" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-white" style={{ fontWeight: 800, fontSize: '1.4rem', color }}>{value}</p>
            <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Header */}
        <div className="grid" style={{ gridTemplateColumns: '60px repeat(7, 1fr)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="p-3" />
          {DAYS.map((day, i) => (
            <div key={day} className="p-3 text-center" style={{ borderLeft: '1px solid rgba(255,255,255,0.04)' }}>
              <p className="text-xs" style={{ color: '#475569' }}>{day}</p>
              <p className="text-sm mt-0.5" style={{
                color: i === todayIdx ? '#fff' : '#64748B',
                fontWeight: i === todayIdx ? 700 : 400,
                background: i === todayIdx ? 'linear-gradient(135deg, #2563EB, #06B6D4)' : 'transparent',
                WebkitBackgroundClip: i === todayIdx ? 'text' : 'initial',
                WebkitTextFillColor: i === todayIdx ? 'transparent' : 'initial',
              }}>{DATES[i]}</p>
            </div>
          ))}
        </div>

        {/* Time grid */}
        <div className="relative overflow-x-auto" style={{ maxHeight: 520, overflowY: 'auto' }}>
          {HOURS.map(hour => (
            <div key={hour} className="grid" style={{ gridTemplateColumns: '60px repeat(7, 1fr)', borderBottom: '1px solid rgba(255,255,255,0.04)', minHeight: 64 }}>
              <div className="px-2 py-2 text-right flex-shrink-0">
                <span className="text-xs" style={{ color: '#334155' }}>{hour}:00</span>
              </div>
              {DAYS.map((_, dayIdx) => {
                const daySessions = filteredSessions.filter(s => s.day === dayIdx && s.hour === hour);
                return (
                  <div key={dayIdx} className="relative p-1" style={{ borderLeft: '1px solid rgba(255,255,255,0.04)', background: dayIdx === todayIdx ? 'rgba(37,99,235,0.02)' : 'transparent' }}>
                    {daySessions.map(session => (
                      <div key={session.id}
                        className="rounded-lg px-2 py-1.5 cursor-pointer transition-all"
                        style={{ background: `${session.color}18`, border: `1px solid ${session.color}40`, marginBottom: 2 }}
                        onClick={() => setSelected(session)}>
                        <p className="text-xs" style={{ color: session.color, fontWeight: 600, lineHeight: 1.3, fontSize: '0.7rem' }}>{session.client.split(' ')[0]}</p>
                        <p className="text-xs" style={{ color: `${session.color}99`, fontSize: '0.65rem' }}>{session.type}</p>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
        </>
      )}

      {/* Session detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={() => setSelected(null)}>
          <div className="w-full max-w-sm rounded-2xl p-6" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.08)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="w-3 h-8 rounded" style={{ background: selected.color }} />
              <button onClick={() => setSelected(null)} style={{ color: '#475569' }}><X size={18} /></button>
            </div>
            <p className="text-white mb-1" style={{ fontWeight: 700, fontSize: '1.1rem' }}>{selected.type}</p>
            <div className="space-y-3 mt-4">
              {[
                { icon: Users, label: 'Klient', val: selected.client },
                { icon: Clock, label: 'Godzina', val: `${selected.hour}:00 – ${selected.hour}:${String(selected.duration).padStart(2, '0')}` },
                { icon: Clock, label: 'Czas trwania', val: `${selected.duration} min` },
              ].map(({ icon: Icon, label, val }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon size={15} style={{ color: '#475569' }} />
                  <span className="text-xs" style={{ color: '#64748B' }}>{label}:</span>
                  <span className="text-sm text-white">{val}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-5">
              <button className="flex-1 py-2.5 rounded-xl text-sm text-white" style={{ background: `${selected.color}25`, border: `1px solid ${selected.color}50`, color: selected.color, fontWeight: 600 }}>
                Edytuj
              </button>
              <button onClick={() => handleDeleteSession(selected.id)} className="flex-1 py-2.5 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#F87171' }}>
                Usuń
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add session modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={() => setShowAdd(false)}>
          <div className="w-full max-w-sm rounded-2xl p-6" style={{ background: '#0A0F1A', border: '1px solid rgba(255,255,255,0.08)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <p className="text-white" style={{ fontWeight: 700 }}>Nowa sesja</p>
              <button onClick={() => setShowAdd(false)} style={{ color: '#475569' }}><X size={18} /></button>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Klient', type: 'select', options: ['Anna Kowalska', 'Marcin Nowak', 'Piotr Zając', 'Tomasz Krawczyk', 'Marta Lewandowska'] },
                { label: 'Dzień', type: 'select', options: DAYS.map((d, i) => `${d}, ${DATES[i]}`) },
                { label: 'Godzina', type: 'select', options: HOURS.map(h => `${h}:00`) },
                { label: 'Czas trwania', type: 'select', options: ['30 min', '45 min', '60 min', '90 min', '120 min'] },
              ].map(({ label, type, options }) => (
                <div key={label}>
                  <label className="block text-xs mb-1.5" style={{ color: '#64748B' }}>{label}</label>
                  <select className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: '#0D1525', border: '1px solid rgba(255,255,255,0.06)', color: '#F1F5F9' }}>
                    {options?.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <button onClick={() => setShowAdd(false)} className="w-full py-3 rounded-xl text-white text-sm mt-1"
                style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)', fontWeight: 600 }}>
                Dodaj sesję
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}