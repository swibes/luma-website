// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Header } from '../src/components/Shared';
import { ProductShowcase } from '../src/components/ProductShowcase';
import { productAssets } from '../src/product-assets';

vi.mock('../src/lib/ReleaseProvider', () => ({
  useReleases: () => ({ releases: [], loading: false, error: '', retry: () => {} }),
}));

afterEach(() => {
  cleanup();
  delete productAssets.hero;
});

it('closes mobile navigation with Escape and restores focus to its toggle', async () => {
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  );
  const toggle = screen.getByRole('button', { name: 'Open navigation' });
  fireEvent.click(toggle);
  const menu = screen.getByRole('navigation', { name: 'Mobile navigation' });
  const link = menu.querySelector('a')!;
  link.focus();
  fireEvent.keyDown(link, { key: 'Escape' });
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
  expect(document.activeElement).toBe(toggle);
  await waitFor(() =>
    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).toBeNull(),
  );
});

it('falls back honestly when an approved screenshot fails to load', () => {
  productAssets.hero = {
    path: 'screenshots/home.webp',
    alt: 'Luma home screenshot',
    width: 1600,
    height: 1000,
    caption: 'Luma home — approved capture',
  };
  render(<ProductShowcase />);
  const image = screen.getByRole('img', { name: 'Luma home screenshot' });
  expect(image.getAttribute('width')).toBe('1600');
  expect(screen.getByText('Luma home — approved capture')).toBeTruthy();
  fireEvent.error(image);
  expect(screen.getByRole('img', { name: /Temporary source-based preview/ })).toBeTruthy();
  expect(screen.queryByText('Luma home — approved capture')).toBeNull();
});
