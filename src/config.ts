export const config = {
  owner: 'swibes',
  repository: 'Luma',
  github: 'https://github.com/swibes/Luma',
  releases: 'https://github.com/swibes/Luma/releases',
  issues: 'https://github.com/swibes/Luma/issues',
  developer: 'https://github.com/swibes',
  cacheKey: 'luma-public-releases-v1',
  cacheMs: 15 * 60 * 1000,
  // Fail closed when a future release changes its naming convention.
  windowsPatterns: [/^Luma-[\d.]+-Windows\.zip$/i, /^Luma(?:-[\d.]+)?(?:-Setup)?\.exe$/i],
  verifiedVersion: '2.1.4',
};
export const asset = (path: string) => `${import.meta.env.BASE_URL}assets/${path}`;
