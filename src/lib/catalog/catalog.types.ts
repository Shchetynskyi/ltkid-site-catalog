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

  hasManufacturerDiopters: boolean;
}
