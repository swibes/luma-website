import { Link } from 'react-router-dom';
import {
  Download,
  ArrowLeftRight,
  AudioLines,
  Zap,
  Layers,
  Shield,
  Scissors,
  Library,
  Tags,
  Puzzle,
  ListMusic,
  Monitor,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useReleases } from './lib/ReleaseProvider';
import { stableRelease } from './lib/releases';
import { asset } from './config';
import { DownloadButton, Reveal } from './components/Shared';
import { Customizer } from './components/Preview';
import { ProductShowcase } from './components/ProductShowcase';
import { Waveform } from './components/Waveform';
export default function Home() {
  const { releases, loading, error } = useReleases();
  const release = stableRelease(releases);
  const reduce = useReducedMotion();
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <Link to="/changelog" className="release-pill">
            <span />
            {loading
              ? 'Checking latest release'
              : error
                ? 'Explore Luma releases'
                : release
                  ? `Luma ${release.tag_name} · Available now`
                  : 'Explore Luma releases'}
          </Link>
          <h1>
            Luma
            <br />
            <span>Your media, in one place.</span>
          </h1>
          <p>
            A modern, customizable media toolkit for downloading, converting,
            <br className="desktop-break" /> organizing and editing — built for creators, collectors
            and everyday use.
          </p>
          <div className="hero-actions">
            <DownloadButton />
            <Link className="button secondary" to="/#features">
              Explore Features
            </Link>
          </div>
          <div className="highlights">
            <span>
              <Zap />
              Fast
            </span>
            <span>
              <Layers />
              All-in-One
            </span>
            <span>
              <Shield />
              Local Processing
            </span>
          </div>
          <p className="mobile-note">Built for your Windows desktop.</p>
        </div>
        <div className="showcase">
          <div className="horizon" />
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 45 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15 }}
            className="hero-product"
          >
            <ProductShowcase />
          </motion.div>
        </div>
        <div className="hero-summary">
          <Link to="/#features">
            <Download />
            <span>
              <b>Save what you love.</b>
              <small>Bring your media together.</small>
            </span>
          </Link>
          <Link to="/#editing">
            <ArrowLeftRight />
            <span>
              <b>Convert & edit.</b>
              <small>Give every file a new possibility.</small>
            </span>
          </Link>
          <Link to="/lyra">
            <AudioLines />
            <span>
              <b>Go deeper with Lyra.</b>
              <small>A new perspective on your sound.</small>
            </span>
          </Link>
        </div>
      </section>
      <section className="section" id="features">
        <Reveal>
          <div className="section-heading">
            <p className="eyebrow">LESS SWITCHING. MORE CREATING.</p>
            <h2>
              One home for
              <br />
              <span className="muted-heading">everything you save.</span>
            </h2>
            <p>
              From the first download to the final edit.
              <br />
              The tools you need, with room to make them your own.
            </p>
            <p className="caption">Features verified against the public Luma 2.1.4 source.</p>
          </div>
        </Reveal>
        <Reveal className="editorial">
          <div className="editorial-copy">
            <Download className="feature-icon" />
            <h3>
              A link.
              <br />A world of possibilities.
            </h3>
            <p>
              Save media you own or have permission to download. Choose the quality and format,
              queue a playlist, and keep track of your downloads in one place.
            </p>
            <div className="inline-labels">
              <span>Playlists & batches</span>
              <span>Download management</span>
            </div>
          </div>
          <div className="download-art">
            <div className="art-toolbar">
              <img src={asset('brand/luma-cat.svg')} alt="" /> YOUR NEXT COLLECTION
            </div>
            <div className="art-link">
              Paste a media link <Download size={18} />
            </div>
            {['Video · automatic container', 'MP3 · 320 kbps audio', 'WAV · uncompressed'].map(
              (x, i) => (
                <div className="format-row" key={x}>
                  <span>
                    {i === 0 ? <Monitor /> : <AudioLines />}
                    {x}
                  </span>
                  <span className="format-tag">{['MP4', 'MP3', 'WAV'][i]}</span>
                </div>
              ),
            )}
            <p className="caption">Illustrative format preview</p>
          </div>
        </Reveal>
        <Reveal className="editorial reverse">
          <div className="editing-art" id="editing">
            <div className="track-label">
              <Scissors size={18} /> AUDIO & VIDEO TOOLS <span>Export a copy</span>
            </div>
            <Waveform />
            <div className="trim-line">
              <i />
              <span>Keep the part that matters.</span>
              <i />
            </div>
            <div className="editing-controls">
              <span>
                Speed <b>1.0×</b>
              </span>
              <span>
                Pitch <b>0 st</b>
              </span>
              <span>
                Format <b>WAV</b>
              </span>
            </div>
            <p className="caption">Illustrative editing preview</p>
          </div>
          <div className="editorial-copy">
            <Scissors className="feature-icon" />
            <h3>
              A better fit.
              <br />
              Down to the last second.
            </h3>
            <p>
              Convert formats, trim audio and video, and adjust audio speed and pitch. Create a new
              version while keeping your original close at hand.
            </p>
            <div className="inline-labels">
              <span>Conversion</span>
              <span>Trimming</span>
              <span>Audio adjustments</span>
            </div>
          </div>
        </Reveal>
        <div className="feature-strip">
          {[
            [Library, 'A place for your library', 'Browse and organize the media you keep.'],
            [
              Tags,
              'The details, refined.',
              'Edit metadata and artwork for a more considered collection.',
            ],
            [Puzzle, 'Room to grow.', 'Optional extensions and Discord Rich Presence.'],
          ].map(([Icon, title, body]) => {
            const I = Icon as typeof Library;
            return (
              <Reveal key={String(title)}>
                <I />
                <h3>{String(title)}</h3>
                <p>{String(body)}</p>
              </Reveal>
            );
          })}
        </div>
      </section>
      <Reveal>
        <section className="lyra-teaser section">
          <div className="lyra-mark">
            <img src={asset('brand/lyra-icon.svg')} alt="" />
            LYRA — AUDIO LAB
          </div>
          <h2>
            Hear what you’ve
            <br />
            <span>been missing.</span>
          </h2>
          <p>
            Separate vocals. Explore space. Shape your mix.
            <br />
            An optional audio lab, right inside Luma.
          </p>
          <Waveform />
          <Link className="button secondary" to="/lyra">
            Explore Lyra
          </Link>
          <p className="caption">
            Lyra 1.0.0 · Optional extension · AI models installed separately
          </p>
        </section>
      </Reveal>
      <Reveal>
        <Customizer />
      </Reveal>
      <section className="closing section">
        <img src={asset('brand/luma-cat.svg')} width="64" height="64" alt="Luma cat" />
        <h2>Make room for your media.</h2>
        <p>Meet your next desktop companion.</p>
        <DownloadButton />
        <p className="caption">For Windows · Developed by swibes</p>
      </section>
    </>
  );
}
