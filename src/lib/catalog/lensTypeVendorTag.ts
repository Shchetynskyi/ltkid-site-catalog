// src/lib/catalog/lensTypeVendorTag.ts
export function getLensTypeVendorTag(
  type: string | null | undefined
): string | null {
  if (!type) return null;

  const t = type.trim().toUpperCase();

  switch (t) {
    case "NONE":
      return null;
    case "BB":
      return "Blue blocker";
    case "PHOTO":
      return "ФХС";
    case "TINT":
      return "тон.";
    default:
      return null;
  }
}
