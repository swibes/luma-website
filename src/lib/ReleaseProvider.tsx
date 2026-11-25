import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { config } from '../config';
import { fetchReleases, parseReleases, type Release } from './releases';
const Context = createContext<{
  releases: Release[];
  loading: boolean;
  error: string;
  retry: () => void;
}>({ releases: [], loading: true, error: '', retry: () => {} });
export function ReleaseProvider({ children }: { children: ReactNode }) {
  const [releases, setReleases] = useState<Release[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(''),
    [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    let cached: Release[] = [];
    try {
      const raw = JSON.parse(localStorage.getItem(config.cacheKey) || 'null');
      if (raw) {
        cached = parseReleases(raw.data);
        if (cached.length) setReleases(cached);
        if (
          attempt === 0 &&
          Number.isFinite(raw.time) &&
          Date.now() - raw.time >= 0 &&
          Date.now() - raw.time < config.cacheMs
        ) {
          setLoading(false);
          return;
        }
      }
    } catch {
      /* Storage may be unavailable. */
    }
    setLoading(true);
    setError('');
    const timer = setTimeout(() => controller.abort(), 10000);
    fetchReleases(controller.signal)
      .then((data) => {
        if (!active) return;
        setReleases(data);
        try {
          localStorage.setItem(config.cacheKey, JSON.stringify({ time: Date.now(), data }));
        } catch {
          /* optional cache */
        }
      })
      .catch(() => {
        if (active) {
          setReleases(cached);
          setError(
            cached.length
              ? 'Showing cached releases. GitHub could not be refreshed.'
              : 'Could not reach GitHub. Download from the official releases page.',
          );
        }
      })
      .finally(() => {
        clearTimeout(timer);
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, [attempt]);
  return (
    <Context.Provider value={{ releases, loading, error, retry: () => setAttempt((a) => a + 1) }}>
      {children}
    </Context.Provider>
  );
}
export const useReleases = () => useContext(Context);
