// src/lib/catalog/catalog.types.ts

export type CatalogItem = {
  modelId: string;
  marketingTitle: string;

  // NOTE: keep open to unexpected values from sheet, but we do rely on 'унісекс'
  gender: 'жіноча' | 'чоловіча' | 'унісекс' | string;

  previewImage: string;
  mainImage: string;

  price: number;

  tryOn: boolean;
  aiPreview: boolean;

  frameWidth: number | null;

  // v1.2 semantic field: used only for ready/frames categorization (NOT UI)
  hasManufacturerDiopters: boolean;
};
