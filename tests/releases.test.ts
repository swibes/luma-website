import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  fetchReleases,
  parseReleases,
  stableRelease,
  validDownload,
  windowsAsset,
  type Release,
} from '../src/lib/releases';
const release = (overrides: Partial<Release> = {}): Release => ({
  id: 1,
  tag_name: 'v2.1.4',
  name: 'Luma',
  body: 'Notes',
  published_at: '2026-11-02T03:50:06Z',
  draft: false,
  prerelease: false,
  assets: [],
  ...overrides,
});
const asset = (
  name: string,
  url = `https://github.com/swibes/Luma/releases/download/v2.1.4/${name}`,
) => ({ name, size: 1234, state: 'uploaded', browser_download_url: url });
afterEach(() => vi.unstubAllGlobals());
describe('official downloads', () => {
  it('prefers the Windows ZIP over the executable and source', () => {
    expect(
      windowsAsset(
        release({
          assets: [
            asset('Luma.exe'),
            asset('Luma-2.1.4-Source.zip'),
            asset('Luma-2.1.4-Windows.zip'),
          ],
        }),
      )?.name,
    ).toBe('Luma-2.1.4-Windows.zip');
  });
  it('rejects unrelated, old and partial-version assets', () => {
    for (const name of [
      'lyra-1.0.0.zip',
      'Luma-2.1.3-Windows.zip',
      'Luma-2.1.40-Windows.zip',
      'source.zip',
    ])
      expect(windowsAsset(release({ assets: [asset(name)] }))).toBeUndefined();
  });
  it('never downloads a prerelease or draft', () => {
    for (const flag of ['draft', 'prerelease'])
      expect(windowsAsset(release({ [flag]: true, assets: [asset('Luma.exe')] }))).toBeUndefined();
  });
  it('rejects external destinations, HTTP and other tags', () => {
    for (const url of [
      'http://github.com/swibes/Luma/releases/download/v2.1.4/Luma.exe',
      'https://evil.example/Luma.exe',
      'https://github.com/other/Luma/releases/download/v2.1.4/Luma.exe',
      'https://github.com/swibes/Luma/releases/download/v2.1.3/Luma.exe',
    ])
      expect(validDownload(url, 'v2.1.4')).toBe(false);
  });
  it('handles malformed assets', () =>
    expect(windowsAsset(release({ assets: [null as never] }))).toBeUndefined());
  it('filters drafts and selects stable independently of prereleases', () => {
    const data = parseReleases([
      release(),
      release({ id: 2, draft: true }),
      release({ id: 3, prerelease: true, published_at: '2026-11-03T00:00:00Z' }),
    ]);
    expect(data).toHaveLength(2);
    expect(stableRelease(data)?.id).toBe(1);
  });
  it('rejects invalid API responses', () =>
    expect(() => parseReleases({ message: 'rate limited' })).toThrow());
  it('reports API failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 403 }));
    await expect(fetchReleases()).rejects.toThrow('request limit');
  });
  it('propagates network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    await expect(fetchReleases()).rejects.toThrow('offline');
  });
});

it('rejects a download URL whose filename differs from its asset label', () => {
  expect(
    windowsAsset(
      release({
        assets: [
          asset('Luma.exe', 'https://github.com/swibes/Luma/releases/download/v2.1.4/Source.zip'),
        ],
      }),
    ),
  ).toBeUndefined();
});
