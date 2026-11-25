// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ReleaseProvider } from '../src/lib/ReleaseProvider';
import { DownloadButton, ReleaseStatus } from '../src/components/Shared';
import { config } from '../src/config';

const url = `${config.releases}/download/v2.1.4/Luma-2.1.4-Windows.zip`;
const releases = [
  {
    id: 1,
    tag_name: 'v2.1.4',
    name: 'Luma',
    body: 'Notes',
    published_at: '2026-11-02T03:50:06Z',
    draft: false,
    prerelease: false,
    assets: [
      { name: 'Luma-2.1.4-Windows.zip', size: 1024, state: 'uploaded', browser_download_url: url },
    ],
  },
];
const view = () =>
  render(
    <ReleaseProvider>
      <DownloadButton />
      <ReleaseStatus />
    </ReleaseProvider>,
  );
beforeEach(() => localStorage.clear());
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('release loading and recovery', () => {
  it('uses a fresh cache without another GitHub request', async () => {
    localStorage.setItem(config.cacheKey, JSON.stringify({ time: Date.now(), data: releases }));
    const fetcher = vi.fn();
    vi.stubGlobal('fetch', fetcher);
    view();
    await waitFor(() => expect(screen.getByRole('link').getAttribute('href')).toBe(url));
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('keeps a safe fallback while an expired cache is refreshing', () => {
    localStorage.setItem(
      config.cacheKey,
      JSON.stringify({ time: Date.now() - config.cacheMs - 1, data: releases }),
    );
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise(() => {})),
    );
    view();
    expect(screen.getByRole('link').getAttribute('href')).toBe(config.releases);
    expect(screen.getByText('Checking the official GitHub releases…')).toBeTruthy();
  });
  it('shows a cached-data message and fallback when refresh fails', async () => {
    localStorage.setItem(config.cacheKey, JSON.stringify({ time: 0, data: releases }));
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    view();
    await screen.findByText(/Showing cached releases/);
    expect(screen.getByRole('link').getAttribute('href')).toBe(config.releases);
  });
  it('recovers from failure when the visitor retries', async () => {
    const fetcher = vi
      .fn()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce({ ok: true, json: async () => releases });
    vi.stubGlobal('fetch', fetcher);
    view();
    await screen.findByText(/Could not reach GitHub/);
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    await waitFor(() => expect(screen.getByRole('link').getAttribute('href')).toBe(url));
    expect(JSON.parse(localStorage.getItem(config.cacheKey)!).data).toHaveLength(1);
  });
  it('recovers from corrupt cache data', async () => {
    localStorage.setItem(config.cacheKey, 'invalid json');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => releases }));
    view();
    await waitFor(() => expect(screen.getByRole('link').getAttribute('href')).toBe(url));
  });
  it('works when browser storage is unavailable', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => releases }));
    view();
    await waitFor(() => expect(screen.getByRole('link').getAttribute('href')).toBe(url));
  });
});
