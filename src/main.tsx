import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppRoutes from './AppRoutes.tsx';
import './index.css';
import 'leaflet/dist/leaflet.css';
import { AuthProvider } from './contexts/AuthContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </StrictMode>
);
