import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './i18n';
import './index.css';
import { SpeedInsights } from "@vercel/speed-insights/react"
import { PerformanceModeProvider } from './context/PerformanceModeContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PerformanceModeProvider>
      <BrowserRouter>
        <SpeedInsights />
        <App />
      </BrowserRouter>
    </PerformanceModeProvider>
  </React.StrictMode>
);
