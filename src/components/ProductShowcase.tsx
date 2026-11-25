import { useState } from 'react';
import { asset } from '../config';
import { productAssets } from '../product-assets';
import { Preview } from './Preview';

export function ProductShowcase() {
  const [failed, setFailed] = useState(false);
  const screenshot = productAssets.hero;
  const available = screenshot && !failed;
  return (
    <>
      {available ? (
        <img
          className="product-window product-screenshot"
          src={asset(screenshot.path)}
          alt={screenshot.alt}
          width={screenshot.width}
          height={screenshot.height}
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <Preview />
      )}
      <p className="caption">
        {available
          ? screenshot.caption
          : 'Luma 2.1.4 · Source-based interface illustration · Temporary preview'}
      </p>
    </>
  );
}
