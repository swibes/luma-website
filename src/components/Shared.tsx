import { Download, Github, Menu, X } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { config, asset } from '../config';
import { useReleases } from '../lib/ReleaseProvider';
import { stableRelease, windowsAsset } from '../lib/releases';
export function DownloadButton({ small = false }: { small?: boolean }) {
  const { releases, loading, error } = useReleases();
  const installer = !loading && !error && windowsAsset(stableRelease(releases));
  return (
    <a
      className={`button primary ${small ? 'small' : ''}`}
      href={installer ? installer.browser_download_url : config.releases}
      aria-label={installer ? 'Download Luma for Windows' : 'View official Luma releases on GitHub'}
    >
      <Download size={17} />
      {small
        ? 'Download'
        : installer
          ? 'Download for Windows'
          : loading
            ? 'Checking releases…'
            : 'View Windows releases'}
    </a>
  );
}
export function Brand() {
  return (
    <Link to="/" className="brand" aria-label="Luma home">
      <img src={asset('brand/luma-cat.svg')} width="36" height="36" alt="" />
      <span>Luma</span>
    </Link>
  );
}
const links = [
  ['/#features', 'Features'],
  ['/lyra', 'Lyra'],
  ['/downloads', 'Downloads'],
  ['/changelog', 'Changelog'],
  ['/support', 'Support'],
];
export function Header() {
  const [open, setOpen] = useState(false),
    [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [location]);
  useEffect(() => {
    const listener = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', listener, { passive: true });
    return () => window.removeEventListener('scroll', listener);
  }, []);
  useEffect(() => {
    if (!open) return;
    const listener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        document.getElementById('menu-toggle')?.focus();
      }
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [open]);
  return (
    <header className={scrolled ? 'site-header scrolled' : 'site-header'}>
      <div className="nav-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([to, label]) => (
            <NavLink key={label} to={to}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="nav-actions">
          <a href={config.github} className="button secondary small github-button">
            <Github size={17} />
            View on GitHub
          </a>
          <DownloadButton small />
        </div>
        <button
          id="menu-toggle"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close navigation' : 'Open navigation'}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            className="mobile-nav"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {links.map(([to, label]) => (
              <Link to={to} key={label} onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}
            <a href={config.github}>View on GitHub</a>
            <DownloadButton />
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div>
        <Brand />
        <p>Your media, in one place.</p>
      </div>
      <nav aria-label="Footer navigation">
        {[...links, ['/privacy', 'Privacy'], [config.github, 'GitHub']].map(([to, label]) =>
          to.startsWith('http') ? (
            <a href={to} key={label}>
              {label}
            </a>
          ) : (
            <Link to={to} key={label}>
              {label}
            </Link>
          ),
        )}
      </nav>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Luma.</span>
        <span>Designed and developed by swibes.</span>
      </div>
    </footer>
  );
}
export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
export function PageHeading({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="page-heading">
      <p className="eyebrow">{label}</p>
      <h1>{title}</h1>
      <p>{children}</p>
    </div>
  );
}
export function ReleaseStatus() {
  const { loading, error, retry } = useReleases();
  return (
    <div aria-live="polite">
      {loading ? (
        <p className="status-message">Checking the official GitHub releases…</p>
      ) : error ? (
        <p className="status-message">
          {error}{' '}
          <button className="text-button" onClick={retry}>
            Try again
          </button>
        </p>
      ) : null}
    </div>
  );
}
