import { createBrowserRouter } from 'react-router';
import { LandingLayout } from './components/LandingLayout';
import { AuthenticatedLayout } from './components/AuthenticatedLayout';
import { LandingPage } from './pages/LandingPage';
import { CennikPage } from './pages/CennikPage';
import { DemoPage } from './pages/DemoPage';
import { RejestracjaPage } from './pages/RejestracjaPage';
import { LogowaniePage } from './pages/LogowaniePage';
import { PersonaPage } from './pages/PersonaPage';
import { DashboardPage } from './pages/app/DashboardPage';
import { KlienciPage } from './pages/app/KlienciPage';
import { PlanyPage } from './pages/app/PlanyPage';
import { ProgresPage } from './pages/app/ProgresPage';
import { PlatnosciPage } from './pages/app/PlatnosciPage';
import { RaportyPage } from './pages/app/RaportyPage';
import { UstawieniaPage } from './pages/app/UstawieniaPage';
import { GrafikPage } from './pages/app/GrafikPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LandingLayout,
    children: [
      { index: true, Component: LandingPage },
      { path: 'cennik', Component: CennikPage },
      { path: 'demo', Component: DemoPage },
      { path: 'rejestracja', Component: RejestracjaPage },
      { path: 'logowanie', Component: LogowaniePage },
      { path: 'dla-trenera-personalnego', element: <PersonaPage persona="stationary" /> },
      { path: 'dla-trenera-online', element: <PersonaPage persona="online" /> },
      { path: 'dla-studia-treningowego', element: <PersonaPage persona="studio" /> },
    ],
  },
  {
    path: '/app',
    Component: AuthenticatedLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: 'dashboard', Component: DashboardPage },
      { path: 'klienci', Component: KlienciPage },
      { path: 'plany', Component: PlanyPage },
      { path: 'progres', Component: ProgresPage },
      { path: 'platnosci', Component: PlatnosciPage },
      { path: 'raporty', Component: RaportyPage },
      { path: 'grafik', Component: GrafikPage },
      { path: 'ustawienia', Component: UstawieniaPage },
    ],
  },
]);