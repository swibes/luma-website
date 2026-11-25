import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { config } from './config';
import { PageHeading, ReleaseStatus } from './components/Shared';
import { useReleases } from './lib/ReleaseProvider';
import { formatDate } from './lib/releases';
export function Changelog() {
  const { releases, loading } = useReleases();
  return (
    <div className="page-container narrow">
      <PageHeading label="THE CHANGELOG" title="Always moving forward.">
        Updates, improvements and the details that make a difference. Directly from the official
        GitHub releases.
      </PageHeading>
      <ReleaseStatus />
      <div className="timeline">
        {releases.map((r) => (
          <article key={r.id} className="release-entry">
            <div className="release-meta">
              <span>{r.prerelease ? 'Prerelease' : 'Stable release'}</span>
              <time dateTime={r.published_at}>{formatDate(r.published_at)}</time>
            </div>
            <h2>{r.tag_name}</h2>
            <div className="prose markdown">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                skipHtml
                components={{
                  img: () => null,
                  h1: ({ children }) => <h3>{children}</h3>,
                  h2: ({ children }) => <h3>{children}</h3>,
                  h3: ({ children }) => <h4>{children}</h4>,
                  h4: ({ children }) => <h5>{children}</h5>,
                  h5: ({ children }) => <h6>{children}</h6>,
                  a: ({ href, children }) => {
                    let safe = false;
                    try {
                      safe = !!href && new URL(href).protocol === 'https:';
                    } catch {}
                    return safe ? (
                      <a href={href} rel="noopener noreferrer">
                        {children}
                      </a>
                    ) : (
                      <span>{children}</span>
                    );
                  },
                }}
              >
                {r.body || 'No release notes were provided for this version.'}
              </ReactMarkdown>
            </div>
            <a
              className="text-link"
              href={`${config.releases}/tag/${encodeURIComponent(r.tag_name)}`}
            >
              View release on GitHub
            </a>
          </article>
        ))}
      </div>
      {!loading && !releases.length && (
        <div className="empty-state">
          <h2>Find the full history on GitHub.</h2>
          <p>Release notes will appear here when the connection is available.</p>
          <a className="button secondary" href={config.releases}>
            Open GitHub Releases
          </a>
        </div>
      )}
    </div>
  );
}
