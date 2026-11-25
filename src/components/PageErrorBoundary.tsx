import { Component, type ReactNode } from 'react';
import { config } from '../config';

// A missing route chunk (offline connection or an old tab after an update)
// should leave navigation and the official release destination available.
export class PageErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <section className="page-container narrow" role="alert">
        <h1>This page couldn’t load.</h1>
        <p>Check your connection and reload to get the latest version of the website.</p>
        <div className="hero-actions">
          <button className="button primary" onClick={() => window.location.reload()}>
            Reload page
          </button>
          <a className="button secondary" href={config.releases}>
            Open GitHub Releases
          </a>
        </div>
      </section>
    );
  }
}
