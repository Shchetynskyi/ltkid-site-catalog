// src/lib/config/links.ts

export const MANAGER_LINKS = {
  okuliarko: 'https://m.me/101402489688578',
  plusminus: 'https://m.me/123853797474820'
} as const;

// compatibility export for legacy imports
export const MANAGER_MESSENGER_URL = MANAGER_LINKS.okuliarko;