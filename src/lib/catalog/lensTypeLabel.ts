// src/lib/catalog/lensTypeLabel.ts
export function getLensTypeLabel(type: string | null | undefined): string | null {
  if (!type) return null;

  const t = type.trim().toUpperCase();

  switch (t) {
    case "NONE":
      return null;
    case "BB":
      return "Захист від шкідливого впливу екрана";
    case "PHOTO":
      return "Фотохромні (хамелеон)";
    case "TINT":
      return "Тонові лінзи";
    default:
      return null;
  }
}
