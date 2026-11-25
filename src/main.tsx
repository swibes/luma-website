import React, { Suspense, lazy, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { ReleaseProvider } from './lib/ReleaseProvider';
import { Header, Footer } from './components/Shared';
import Home from './Home';
import { PageErrorBoundary } from './components/PageErrorBoundary';
import './styles.css';
const Downloads = lazy(() => import('./Pages').then((m) => ({ default: m.Downloads })));
const Changelog = lazy(() => import('./Changelog').then((m) => ({ default: m.Changelog })));
const Lyra = lazy(() => import('./Pages').then((m) => ({ default: m.Lyra })));
const Support = lazy(() => import('./Pages').then((m) => ({ default: m.Support })));
const Privacy = lazy(() => import('./Pages').then((m) => ({ default: m.Privacy })));
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    document.title =
      pathname === '/'
        ? 'Luma — Your media, in one place.'
        : `${pathname.slice(1).replace(/^./, (c) => c.toUpperCase())} — Luma`;
    const id = setTimeout(() => {
      if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
      else {
        window.scrollTo(0, 0);
        document.getElementById('main')?.focus({ preventScroll: true });
      }
    }, 60);
    return () => clearTimeout(id);
  }, [pathname, hash]);
  return null;
}
function App() {
  return (
    <HashRouter>
      <MotionConfig reducedMotion="user">
        <ReleaseProvider>
          <ScrollManager />
          <a
            className="skip-link"
            href="#main"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('main')?.focus();
            }}
          >
            Skip to content
          </a>
          <Header />
          <main id="main" tabIndex={-1}>
            <PageErrorBoundary>
              <Suspense
                fallback={
                  <div className="page-container" role="status">
                    Loading page…
                  </div>
                }
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/downloads" element={<Downloads />} />
                  <Route path="/changelog" element={<Changelog />} />
                  <Route path="/lyra" element={<Lyra />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route
                    path="*"
                    element={
                      <div className="page-container">
                        <h1>Page not found.</h1>
                        <Link to="/">Return to Luma</Link>
                      </div>
                    }
                  />
                </Routes>
              </Suspense>
            </PageErrorBoundary>
          </main>
          <Footer />
        </ReleaseProvider>
      </MotionConfig>
    </HashRouter>
  );
}
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
