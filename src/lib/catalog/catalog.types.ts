// src/lib/catalog/catalog.types.ts

export interface CatalogItem {
  modelId: string;
  marketingTitle: string;
  gender: string;

  previewImage: string;
  mainImage: string;

  price: number;

  tryOn: boolean;
  aiPreview: boolean;

  frameWidth: number | null;

  // SSOT: список діоптрій як рядок (може бути порожній)
  DiopterValues?: string;

  // legacy поле (НЕ використовується для READY/FRAMES)
  hasManufacturerDiopters: boolean;
}
