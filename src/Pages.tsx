import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  AudioLines,
  Cpu,
  SlidersHorizontal,
  Waves,
  Search,
  Github,
  Download,
  Shield,
  Folder,
  Cookie,
  Puzzle,
} from 'lucide-react';
import { config, asset } from './config';
import { PageHeading, DownloadButton, ReleaseStatus } from './components/Shared';
import { useReleases } from './lib/ReleaseProvider';
import { stableRelease, windowsAsset, formatDate, formatSize } from './lib/releases';
import { Waveform } from './components/Waveform';
export function Downloads() {
  const { releases, error } = useReleases();
  const release = stableRelease(releases),
    file = windowsAsset(release);
  return (
    <div className="page-container">
      <PageHeading label="DOWNLOAD LUMA" title="Your next desktop companion.">
        A small space for everything you love to save.
      </PageHeading>
      <ReleaseStatus />
      <section className="download-panel">
        <div>
          <img src={asset('brand/luma-cat.svg')} width="62" height="62" alt="" />
          <h2>Luma for Windows</h2>
          <p>
            {release
              ? `${error ? 'Cached release' : 'Latest stable'} · ${release.tag_name}`
              : 'Official Windows releases'}
          </p>
          <DownloadButton />
          {file && !error && (
            <p className="caption">
              {file.name} · {formatSize(file.size)}
              <br />
              Published {formatDate(release!.published_at)}
            </p>
          )}
        </div>
        <div className="download-details">
          <h3>Before you begin</h3>
          <p>
            The public release provides a Windows executable and portable ZIP. macOS and Linux
            builds are not currently offered.
          </p>
          <p>
            Use a writable folder. Lyra AI features need separately installed models and runtimes;
            compatible NVIDIA acceleration is optional.
          </p>
          <p className="caption">
            The release does not specify a verified minimum Windows version, RAM or GPU model. Check
            release documentation for your setup.
          </p>
          <a href={config.releases}>Read official release details</a>
        </div>
      </section>
      <div className="two-columns prose">
        <section>
          <h2>Up and running.</h2>
          <ol>
            <li>Download the Windows ZIP and extract it into a writable folder.</li>
            <li>Keep Luma.exe, luma-portable.json and optional-packages together.</li>
            <li>
              Open Luma.exe. Portable preferences, projects, caches and default downloads live in
              LumaData beside it.
            </li>
            <li>For Lyra, open Extensions and install the bundled lyra-1.0.0.zip.</li>
          </ol>
        </section>
        <section>
          <h2>Already using Luma?</h2>
          <p>
            Close Luma and back up your executable, optional package and profile. Preserve your
            existing portable marker and LumaData when updating. Update Lyra separately through
            Extensions.
          </p>
          <p>
            The executable is unsigned. Review its origin and release notes before deciding to run
            it. No independent antivirus certification is claimed.
          </p>
          <Link to="/support">Installation and update help</Link>
        </section>
      </div>
      <section className="previous">
        <h2>Previous versions</h2>
        {releases
          .filter((r) => r.id !== release?.id)
          .map((r) => (
            <a
              className="release-row"
              key={r.id}
              href={`${config.releases}/tag/${encodeURIComponent(r.tag_name)}`}
            >
              <span>
                {r.tag_name}
                {r.prerelease ? ' · Prerelease' : ''}
              </span>
              <span>{formatDate(r.published_at)}</span>
              <Download size={18} />
            </a>
          ))}
        {!releases.length && <p>Version history is available on GitHub.</p>}
        <a className="text-link" href={config.releases}>
          All GitHub releases
        </a>
      </section>
    </div>
  );
}
export function Lyra() {
  return (
    <div className="page-container lyra-page">
      <PageHeading label="LYRA — AUDIO LAB" title="Hear what you’ve been missing.">
        A closer look at your sound. An optional audio-processing extension for Luma.
      </PageHeading>
      <div className="lyra-status">
        <img src={asset('brand/lyra-icon.svg')} alt="" />
        Lyra 1.0.0 · Released with Luma 2.1.4
      </div>
      <div className="lyra-display">
        <div className="track-label">
          <AudioLines />
          LYRA AUDIO LAB<span>Illustrative audio preview</span>
        </div>
        <Waveform />
        <div className="stem-tracks">
          {['Vocals', 'Instrumental', 'Mix'].map((t, i) => (
            <div key={t}>
              <span>{t}</span>
              <div style={{ opacity: 1 - i * 0.2 }}>
                <Waveform />
              </div>
              <b>{i === 2 ? 'Mix' : 'Stem'}</b>
            </div>
          ))}
        </div>
      </div>
      <div className="section-heading">
        <h2>
          Take your audio apart.
          <br />
          <span className="muted-heading">Find something new.</span>
        </h2>
      </div>
      <div className="lyra-features">
        {[
          [
            AudioLines,
            'Find the voice.',
            'Optional MelBand vocal and instrumental separation. MDX-Net lead/backing separation is experimental and may contain bleed.',
          ],
          [
            Waves,
            'Explore the space.',
            'Spatial and multichannel tools offer another way to explore your audio. Full Atmos object decoding and preservation are not claimed.',
          ],
          [
            SlidersHorizontal,
            'Shape the mix.',
            'Work with the stem mixer, audio cleanup and export tools. Four- and six-stem AI inference are not implemented.',
          ],
          [
            Cpu,
            'Choose your processing.',
            'Use CPU processing or compatible NVIDIA acceleration. AI runtimes and model weights are installed separately.',
          ],
        ].map(([Icon, title, body]) => {
          const I = Icon as typeof Cpu;
          return (
            <section key={String(title)}>
              <I />
              <h3>{String(title)}</h3>
              <p>{String(body)}</p>
            </section>
          );
        })}
      </div>
      <div className="notice prose">
        <h2>A little preparation. A lot to explore.</h2>
        <p>
          Lyra 1.0.0 requires Luma 2.1.4 or later, below 3.0.0. Install the optional package through
          Extensions, then select the models and runtimes you need. Keep AI storage paths short to
          avoid Windows loader limits.
        </p>
        <p>
          Removing the extension preserves models and runtimes. General Demucs and BS-RoFormer model
          selection is not available in this release.
        </p>
        <Link className="button primary" to="/downloads">
          Get Luma & Lyra
        </Link>
      </div>
    </div>
  );
}
const faqs = [
  [
    'How do I install Luma?',
    'Download the official Windows portable ZIP, extract it to a writable folder, and open Luma.exe. Keep the portable marker and optional-packages together with the executable.',
  ],
  [
    'How do I update without losing my library?',
    'Close Luma and back up the executable, optional packages and profile. Preserve your portable marker and LumaData when replacing files. Do not run two copies against the same profile. Update Lyra through Extensions separately.',
  ],
  [
    'Which platforms are supported?',
    'The current public release supplies Windows downloads. No macOS or Linux package is advertised. On a phone, use this website to explore the app and download it later on your Windows computer.',
  ],
  [
    'Which media formats can I use?',
    'The download interface includes automatic video container selection, MP3, WAV, OGG, Opus and GIF. Release 2.1.4 adds AAC output. Input support and available quality depend on the source and processing tool.',
  ],
  [
    'Why did a download fail?',
    'Check the link, your connection, available disk space and access to the source. Some media requires sign-in or is unavailable in your region. Use only media you own or have permission to save. If the problem persists, report the error on GitHub without cookies or private URLs.',
  ],
  [
    'How does cookie authentication work?',
    'Import a Netscape-format cookies.txt in Settings when authentication is needed. Luma stores a filtered local copy for supported sites and uses cookies only for their site. The copy remains sensitive. Remove it in Settings when no longer needed and delete the original full export. Never attach cookies to a bug report.',
  ],
  [
    'Why does antivirus or Windows show a warning?',
    'The release executable is unsigned and has no independent antivirus certification. A warning alone does not establish whether a file is safe. Verify that it came from the official repository, compare published checksums where available and investigate the warning before running it.',
  ],
  [
    'How do I install Lyra?',
    'In Luma, open Extensions and install the bundled lyra-1.0.0.zip. Lyra 1 requires Luma 2.1.4 or later, below 3.0.0. AI models and runtimes are separate installations.',
  ],
  [
    'Does my GPU work with Lyra?',
    'CPU and compatible NVIDIA processing are supported for the optional AI tools. There is no verified universal GPU/driver compatibility list in the release notes. Check runtime requirements before downloading models. Keep storage paths short.',
  ],
  [
    'How do I report a bug or contact swibes?',
    'Use the official GitHub Issues page with your version, reproducible steps and a redacted error message. You can also contact @swibes on Discord. Do not post cookies, tokens, private media or your full profile.',
  ],
];
export function Support() {
  const [query, setQuery] = useState('');
  const filtered = faqs.filter((f) => f.join(' ').toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="page-container narrow">
      <PageHeading label="LUMA SUPPORT" title="A little help, right here.">
        From your first download to your next audio experiment.
      </PageHeading>
      <label className="search-box">
        <Search />
        <span className="sr-only">Search frequently asked questions</span>
        <input
          id="faq-search"
          name="faq-search"
          type="search"
          placeholder="Search installation, updates, Lyra…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <p className="caption" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? 'topic' : 'topics'}
      </p>
      <div className="faq-list">
        {filtered.map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
        {!filtered.length && <p>No matching topics. Try a different search or ask on GitHub.</p>}
      </div>
      <div className="support-contact">
        <h2>Let’s work it out.</h2>
        <p>
          Report a bug on GitHub, or contact <b>@swibes</b> on Discord.
        </p>
        <a className="button secondary" href={config.issues}>
          <Github size={18} />
          GitHub Issues
        </a>
        <a className="text-link" href={config.developer}>
          swibes on GitHub
        </a>
      </div>
    </div>
  );
}
export function Privacy() {
  return (
    <div className="page-container narrow">
      <PageHeading label="PRIVACY & SECURITY" title="Your media. Your computer.">
        Clear information about what Luma does, and what to keep in mind.
      </PageHeading>
      <div className="prose privacy-content">
        {[
          [
            Shield,
            'This website',
            'This website has no analytics, advertising trackers or account forms. It contacts api.github.com for public release information; GitHub receives ordinary connection information such as your IP address. A local browser cache stores release metadata for 15 minutes. Release links take you to GitHub.',
          ],
          [
            Folder,
            'Your media and application data',
            'Media conversion and editing tools process files locally. Downloads contact the source services. Portable mode stores preferences, projects, caches and default downloads in LumaData beside the executable. Without a portable marker, the standalone executable uses the Windows local application profile. Keep personal profiles out of public uploads.',
          ],
          [
            Cookie,
            'Authentication cookies',
            'Luma imports and filters Netscape-format cookies for supported sites. Requests use cookies only for the corresponding site; the application’s interface states they are not sent to swibes or a Luma server. The saved copy is sensitive to anyone with access to your computer. Remove it in Settings when no longer needed.',
          ],
          [
            Puzzle,
            'Optional extensions and connections',
            'Lyra is optional. AI models and runtimes are downloaded separately, and uninstalling Lyra preserves these files. Optional Discord Rich Presence communicates activity to Discord when enabled. Downloaded media, models and extensions should come from sources you trust.',
          ],
          [
            Shield,
            'Security has limits',
            'The current executable is unsigned. Release notes do not claim independent antivirus certification or complete GPU, clean-machine and production-update acceptance. This website does not guarantee software safety. Review release notes and published checksums, keep backups and avoid sharing private diagnostics without checking their contents.',
          ],
        ].map(([Icon, title, body]) => {
          const I = Icon as typeof Shield;
          return (
            <section key={String(title)}>
              <I />
              <h2>{String(title)}</h2>
              <p>{String(body)}</p>
            </section>
          );
        })}
        <p>
          Application descriptions verified against the public Luma 2.1.4 source and release
          documents. <a href={`${config.releases}/tag/v2.1.4`}>Read the source release.</a>
        </p>
      </div>
    </div>
  );
}
