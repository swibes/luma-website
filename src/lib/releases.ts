import { config } from '../config';
export interface ReleaseAsset {
  name: string;
  size: number;
  browser_download_url: string;
  state: string;
}
export interface Release {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  draft: boolean;
  prerelease: boolean;
  assets: ReleaseAsset[];
}
export function parseReleases(input: unknown): Release[] {
  if (!Array.isArray(input)) throw new Error('Invalid release response');
  return input
    .filter(
      (r): r is Release =>
        !!r &&
        typeof r.id === 'number' &&
        typeof r.tag_name === 'string' &&
        typeof r.published_at === 'string' &&
        Number.isFinite(Date.parse(r.published_at)) &&
        typeof r.draft === 'boolean' &&
        typeof r.prerelease === 'boolean' &&
        Array.isArray(r.assets),
    )
    .filter((r) => !r.draft)
    .map((r) => ({
      ...r,
      body: typeof r.body === 'string' ? r.body : '',
      name: typeof r.name === 'string' ? r.name : r.tag_name,
    }))
    .sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at));
}
export const stableRelease = (releases: Release[]) =>
  releases.find((r) => !r.draft && !r.prerelease);
export function validDownload(url: string, tag: string): boolean {
  try {
    const u = new URL(url);
    return (
      u.protocol === 'https:' &&
      u.hostname === 'github.com' &&
      !u.username &&
      !u.password &&
      !u.port &&
      !u.search &&
      !u.hash &&
      u.pathname.startsWith(
        `/${config.owner}/${config.repository}/releases/download/${encodeURIComponent(tag)}/`,
      ) &&
      !decodeURIComponent(u.pathname).includes('..')
    );
  } catch {
    return false;
  }
}
export function windowsAsset(release?: Release): ReleaseAsset | undefined {
  if (!release || release.draft || release.prerelease) return;
  for (const pattern of config.windowsPatterns) {
    const found = release.assets.find(
      (a) =>
        !!a &&
        typeof a.name === 'string' &&
        a.state === 'uploaded' &&
        Number.isFinite(a.size) &&
        a.size > 0 &&
        pattern.test(a.name) &&
        (!/\d/.test(a.name) ||
          a.name.match(/\d+(?:\.\d+)+/)?.[0] === release.tag_name.replace(/^v/, '')) &&
        validDownload(a.browser_download_url, release.tag_name) &&
        decodeURIComponent(new URL(a.browser_download_url).pathname.split('/').pop() || '') ===
          a.name,
    );
    if (found) return found;
  }
}
export const formatSize = (size: number) => `${(size / 1024 / 1024).toFixed(1)} MB`;
export const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date));
export async function fetchReleases(signal?: AbortSignal) {
  const response = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repository}/releases?per_page=100`,
    { signal, headers: { Accept: 'application/vnd.github+json' } },
  );
  if (!response.ok)
    throw new Error(
      response.status === 403 || response.status === 429
        ? 'GitHub’s request limit has been reached.'
        : 'GitHub releases are temporarily unavailable.',
    );
  return parseReleases(await response.json());
}
