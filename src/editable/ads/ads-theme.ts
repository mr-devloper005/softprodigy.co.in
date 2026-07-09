// ✏️ EDITABLE — theme the ads to match this site. Devs own this file.
// You control the LOOK here (radius, border, shadow, background, label color).
// You CANNOT change the ad's shape/fit from here — that stays locked in
// src/lib/ad-slots.ts, so the ad always displays correctly no matter what.

import type { AdSkin } from '@/lib/ads/ad-frame'

// Site-wide default skin — monochrome ink-on-paper, hairline liner, no shadow.
export const adSkin: AdSkin = {
  radius: '16px',
  border: '1px solid #d9d9d5',
  shadow: 'none',
  background: '#ffffff',
  labelClassName: 'bg-black text-white',
}

export const adSkinBySlot: Partial<Record<string, AdSkin>> = {
  sidebar: { radius: '16px', shadow: 'none', border: '1px solid #d9d9d5' },
  popup: { radius: '16px' },
  header: { radius: '16px', background: '#ffffff' },
}

/** Merge site default + per-slot override for a slot. */
export function skinFor(slot: string): AdSkin {
  return { ...adSkin, ...(adSkinBySlot[slot] ?? {}) }
}
