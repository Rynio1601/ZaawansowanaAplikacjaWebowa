import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/sonner';
import { CookieConsent } from './components/CookieConsent';

// Tymczasowo usuwamy GoogleAnalytics, dodamy go później
export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <CookieConsent />
      <Toaster />
    </AuthProvider>
  );
}