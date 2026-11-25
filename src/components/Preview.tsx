import { useState, type CSSProperties } from 'react';
import {
  Download,
  House,
  Library,
  Settings,
  Music2,
  Scissors,
  SlidersHorizontal,
  Link,
  Minus,
  Square,
  X,
} from 'lucide-react';
import { asset } from '../config';
export const themes = [
  { name: 'Midnight', bg: '#0b0c10', panel: '#12141a', accent: '#8c7cff' },
  { name: 'Ocean', bg: '#071318', panel: '#0d2027', accent: '#45c8e6' },
  { name: 'Berry', bg: '#160d18', panel: '#211322', accent: '#ec6eb6' },
  { name: 'Forest', bg: '#0b130f', panel: '#111f18', accent: '#69cf91' },
];
export function Preview({ theme = 0, compact = false }: { theme?: number; compact?: boolean }) {
  const t = themes[theme];
  return (
    <div
      className={`product-window ${compact ? 'compact' : ''}`}
      style={
        {
          '--preview-bg': t.bg,
          '--preview-panel': t.panel,
          '--preview-accent': t.accent,
        } as CSSProperties
      }
      role="img"
      aria-label={`Illustrated Luma Classic interface in ${t.name}. Temporary source-based preview, not a screenshot.`}
    >
      <div className="window-title">
        <span>
          <img src={asset('brand/luma-cat.svg')} alt="" /> Luma
        </span>
        <span>
          <Minus />
          <Square />
          <X />
        </span>
      </div>
      <div className="window-body">
        <aside className="product-sidebar">
          <div className="app-brand">
            <img src={asset('brand/luma-cat.svg')} alt="" />
            <div>
              <b>Luma</b>
              <small>save what you love</small>
            </div>
          </div>
          {[
            [House, 'Home'],
            [Download, 'Downloads'],
            [Library, 'YouTube Library'],
            [Settings, 'Settings'],
          ].map(([Icon, label], i) => {
            const I = Icon as typeof House;
            return (
              <div className={i === 0 ? 'selected' : ''} key={String(label)}>
                <I />
                <span>{String(label)}</span>
              </div>
            );
          })}
          <p>Public media you own or have permission to save.</p>
        </aside>
        <div className="product-content">
          <div className="preview-heading">
            <div>
              <small>MEDIA DOWNLOADER</small>
              <h3>Save it your way.</h3>
              <p>Paste a link, pick the quality, and Luma handles the rest.</p>
            </div>
            <span className="ready">Ready</span>
          </div>
          <div className="paste-panel">
            <b>Paste a media link</b>
            <div className="fake-input">
              <Link />
              <span>YouTube, TikTok, X, SoundCloud, Instagram…</span>
              <strong>Fetch</strong>
            </div>
            <div className="platforms">
              {['YouTube', 'SoundCloud', 'TikTok', 'X', 'Instagram', 'Reddit', 'Vimeo'].map((x) => (
                <span key={x}>{x}</span>
              ))}
            </div>
          </div>
          <div className="preview-tools">
            <div>
              <Download />
              <b>Your next download.</b>
              <p>
                Choose your format.
                <br />
                Keep the quality you love.
              </p>
            </div>
            <div>
              <Music2 />
              <b>A little more possibility.</b>
              <p>
                Explore your audio
                <br />
                with Lyra Audio Lab.
              </p>
            </div>
          </div>
          <div className="preview-bottom">
            <span>
              <Scissors /> Trim
            </span>
            <span>
              <SlidersHorizontal /> Convert
            </span>
            <span>
              <Library /> Organize
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
export function Customizer() {
  const [theme, setTheme] = useState(0);
  return (
    <section className="section customization" id="customization">
      <div className="section-heading">
        <p className="eyebrow">YOUR SPACE. YOUR STYLE.</p>
        <h2>Make it yours.</h2>
        <p>From a quiet workspace to something unmistakably you.</p>
      </div>
      <div className="theme-switcher" aria-label="Preview a theme">
        {themes.map((t, i) => (
          <button key={t.name} aria-pressed={theme === i} onClick={() => setTheme(i)}>
            <i style={{ background: t.accent }} />
            {t.name}
          </button>
        ))}
      </div>
      <Preview theme={theme} />
      <p className="caption">
        Illustrated preview · Authentic Luma theme colors · Replaceable with product screenshots
      </p>
      <div className="customization-details">
        <p>
          <b>A layout that fits.</b>
          <br />
          Simple, Classic and Modern Studio.
        </p>
        <p>
          <b>A different atmosphere.</b>
          <br />
          Custom colors, image and animated backgrounds.
        </p>
        <p>
          <b>The finishing touches.</b>
          <br />
          Glass appearance, particles and Lyra colors.
        </p>
      </div>
    </section>
  );
}
