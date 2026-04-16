import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { useState } from 'react';
import { LayoutDashboard, Users, Dumbbell, TrendingUp, CreditCard, BarChart3, Calendar, Settings, LogOut, Menu, X, ChevronDown, Zap, ChevronLeft, ChevronRight, Search, Bell, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { path: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/app/klienci', label: 'Klienci', icon: Users },
  { path: '/app/plany', label: 'Plany', icon: Dumbbell },
  { path: '/app/progres', label: 'Postęp', icon: TrendingUp },
  { path: '/app/platnosci', label: 'Płatności', icon: CreditCard },
  { path: '/app/raporty', label: 'Raporty', icon: BarChart3 },
  { path: '/app/grafik', label: 'Grafik', icon: Calendar },
  { path: '/app/ustawienia', label: 'Ustawienia', icon: Settings },
];

export function AppLayout() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => location.pathname === path || (path === '/app/dashboard' && location.pathname === '/app');

  const handleLogout = async () => {
    await signOut();
    navigate('/logowanie');
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#06080F', color: '#F1F5F9' }}>
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:relative z-50 h-full flex flex-col transition-all duration-300
        ${collapsed ? 'w-16' : 'w-64'}
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `} style={{ background: '#0A0F1A', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>
                <Zap size={16} className="text-white" />
              </div>
              <span className="text-white" style={{ fontWeight: 700, fontSize: '1rem' }}>TrainerPro</span>
            </Link>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto" style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>
              <Zap size={16} className="text-white" />
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="hidden md:flex p-1 rounded-lg transition-colors"
            style={{ color: '#475569' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#94A3B8')}
            onMouseLeave={e => (e.currentTarget.style.color = '#475569')}>
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Trial Banner */}
        {!collapsed && (
          <div className="mx-3 my-3 px-3 py-2.5 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(6,182,212,0.15))', border: '1px solid rgba(37,99,235,0.3)' }}>
            <p className="text-xs" style={{ color: '#60A5FA', fontWeight: 600 }}>🎯 Trial: 11 dni pozostało</p>
            <Link to="/cennik" className="text-xs mt-1 block" style={{ color: '#94A3B8' }}>Kup subskrypcję →</Link>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all duration-200"
              style={{
                color: isActive(path) ? '#fff' : '#475569',
                background: isActive(path) ? 'linear-gradient(135deg, rgba(37,99,235,0.2), rgba(6,182,212,0.1))' : 'transparent',
                fontWeight: isActive(path) ? 600 : 400,
              }}
              onMouseEnter={e => { if (!isActive(path)) { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.color = '#94A3B8'; } }}
              onMouseLeave={e => { if (!isActive(path)) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#475569'; } }}>
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span className="text-sm">{label}</span>}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
          <Link to="/app/ustawienia"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all"
            style={{ color: isActive('/app/ustawienia') ? '#fff' : '#475569' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#94A3B8')}
            onMouseLeave={e => (e.currentTarget.style.color = '#475569')}>
            <Settings size={18} />
            {!collapsed && <span className="text-sm">Ustawienia</span>}
          </Link>
          <button
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
            style={{ color: '#475569' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#EF4444')}
            onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
            onClick={handleLogout}>
            <LogOut size={18} />
            {!collapsed && <span className="text-sm">Wyloguj się</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-4" style={{ background: '#0A0F1A', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileSidebarOpen(true)} className="md:hidden p-2 rounded-lg" style={{ color: '#94A3B8' }}>
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: '#0D1525', border: '1px solid rgba(255,255,255,0.06)', minWidth: 260 }}>
              <Search size={16} style={{ color: '#475569' }} />
              <input placeholder="Szukaj klienta, planu..." className="bg-transparent text-sm outline-none w-full" style={{ color: '#94A3B8' }} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl transition-colors" style={{ background: '#0D1525' }}>
              <Bell size={18} style={{ color: '#94A3B8' }} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: '#2563EB' }} />
            </button>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer" style={{ background: '#0D1525' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563EB, #06B6D4)' }}>
                <User size={14} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-xs" style={{ color: '#F1F5F9', fontWeight: 600 }}>{user?.name || 'Demo User'}</p>
                <p className="text-xs" style={{ color: '#475569' }}>{user?.plan === 'trial' ? 'Plan Trial' : 'Plan Pro'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}