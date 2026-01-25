// src/lib/lead/managerContext.store.ts
import { writable } from 'svelte/store';

export type LeadRef = 'site_catalog__model' | 'site_catalog__frame';

export type ManagerLeadPayloadV1 = {
  ModelID: string;
  MarketingTitle: string;
  SitePriceUAH: string; // exactly as shown in UI (e.g. "Ціну уточнюйте" or "1234 грн")
  Image: string; // exactly the image user saw (main/preview)
  ref: string; // dynamic ref payload for ManyChat
  DiopterContext?: string; // present ONLY when explicit diopter choice exists
};

export const managerLeadPayload = writable<ManagerLeadPayloadV1 | null>(null);
