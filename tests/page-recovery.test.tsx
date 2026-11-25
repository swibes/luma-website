// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { PageErrorBoundary } from '../src/components/PageErrorBoundary';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

it('keeps an official release link available if a route fails', () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  function FailedPage(): never {
    throw new Error('Failed to fetch dynamically imported module');
  }
  render(
    <PageErrorBoundary>
      <FailedPage />
    </PageErrorBoundary>,
  );
  expect(screen.getByRole('alert')).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Reload page' })).toBeTruthy();
  expect(screen.getByRole('link', { name: 'Open GitHub Releases' }).getAttribute('href')).toBe(
    'https://github.com/swibes/Luma/releases',
  );
});

it('renders pages normally when loading succeeds', () => {
  render(
    <PageErrorBoundary>
      <h1>Downloads</h1>
    </PageErrorBoundary>,
  );
  expect(screen.getByRole('heading', { name: 'Downloads' })).toBeTruthy();
  expect(screen.queryByRole('alert')).toBeNull();
});
