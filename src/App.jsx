import { useState, Suspense, lazy, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import IntroAnimation from './components/IntroAnimation';
import WebGLBackground from './components/WebGLBackground';
import Home from './pages/Home';

const Admin = lazy(() => import('./pages/Admin'));

function VisitorTracker() {
  useEffect(() => {
    const track = async () => {
      try {
        await fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page: window.location.pathname,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
            language: navigator.language,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch {
        // Silent fail
      }
    };
    track();
  }, []);

  return null;
}

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <>
      <WebGLBackground />
      <VisitorTracker />

      {!introComplete && (
        <IntroAnimation onComplete={() => setIntroComplete(true)} />
      )}

      {introComplete && (
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Suspense>
      )}
    </>
  );
}
