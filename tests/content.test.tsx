// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Privacy } from '../src/Pages';
import { Changelog } from '../src/Changelog';
const state = vi.hoisted(() => ({
  releases: [] as any[],
  loading: false,
  error: '',
  retry: () => {},
}));
vi.mock('../src/lib/ReleaseProvider', () => ({ useReleases: () => state }));
afterEach(() => {
  cleanup();
  state.releases = [];
  state.error = '';
});
describe('published content', () => {
  it('renders release formatting without executable HTML or tracking images', () => {
    state.releases = [
      {
        id: 1,
        tag_name: 'v2.1.4',
        published_at: '2026-11-02T00:00:00Z',
        prerelease: false,
        body: '## Improvements\n\n- **Faster** exports\n\n<script>alert(1)</script>\n\n<img src="https://tracker.example/pixel" onerror="alert(1)">\n\n![pixel](https://tracker.example/pixel)\n\n[unsafe](javascript:alert%281%29)\n\n[Release](https://github.com/swibes/Luma/releases)',
      },
    ];
    const { container } = render(
      <MemoryRouter>
        <Changelog />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: 'Improvements' })).toBeTruthy();
    expect(container.querySelector('strong')?.textContent).toBe('Faster');
    expect(container.querySelector('script,img')).toBeNull();
    expect(container.querySelector('a[href^="javascript:"]')).toBeNull();
    expect(screen.getByRole('link', { name: 'Release' }).getAttribute('href')).toBe(
      'https://github.com/swibes/Luma/releases',
    );
  });
  it('provides official release history when GitHub returns no usable data', () => {
    render(
      <MemoryRouter>
        <Changelog />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Open GitHub Releases' }).getAttribute('href')).toBe(
      'https://github.com/swibes/Luma/releases',
    );
  });
  it('renders the privacy page with the verified source link', () => {
    render(
      <MemoryRouter>
        <Privacy />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      'Your media. Your computer.',
    );
    expect(
      screen.getByRole('link', { name: 'Read the source release.' }).getAttribute('href'),
    ).toContain('/tag/v2.1.4');
  });
});
