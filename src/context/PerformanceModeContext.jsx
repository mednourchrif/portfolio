import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'portfolio-performance-mode';
const PerformanceModeContext = createContext(null);

function getInitialMode() {
  if (typeof window === 'undefined') return 'cinematic';

  const savedMode = window.localStorage.getItem(STORAGE_KEY);
  if (savedMode === 'smooth' || savedMode === 'cinematic') {
    return savedMode;
  }

  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  return prefersReducedMotion ? 'smooth' : 'cinematic';
}

export function PerformanceModeProvider({ children }) {
  const [mode, setMode] = useState(getInitialMode);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, mode);
    document.documentElement.setAttribute('data-performance-mode', mode);
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      isSmooth: mode === 'smooth',
    }),
    [mode]
  );

  return (
    <PerformanceModeContext.Provider value={value}>
      {children}
    </PerformanceModeContext.Provider>
  );
}

export function usePerformanceMode() {
  const context = useContext(PerformanceModeContext);
  if (!context) {
    throw new Error('usePerformanceMode must be used within PerformanceModeProvider');
  }
  return context;
}
