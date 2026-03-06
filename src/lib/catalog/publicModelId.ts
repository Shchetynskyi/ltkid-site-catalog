// src/lib/catalog/publicModelId.ts
const SUFFIX_RE = /-(NONE|BB|PHOTO|TINT)$/i;

export function getPublicModelId(modelId: string | null | undefined): string | null {
  if (!modelId) return null;
  return modelId.replace(SUFFIX_RE, "");
}
