export interface CatalogItem {
  modelId: string;
  marketingTitle: string;
  gender: string;

  previewImage: string;
  mainImage: string;

  // ✅ SSOT: єдине поле ціни для сайту
  SitePriceUAH?: string;

  tryOn: boolean;
  aiPreview: boolean;

  frameWidth: number | null;
  frameHeight: number | null;

  // SSOT: список діоптрій як рядок (може бути порожній)
  DiopterValues?: string;

  // технічний код типу лінз (NONE | BB | PHOTO | TINT)
  TypeLens?: string;

  // 🔑 пріоритет каталогу (1 = найвище)
  priority: number | null;

  // legacy поле (НЕ використовується для READY/FRAMES)
  hasManufacturerDiopters: boolean;
}