// Catalog row as used by frontend (SPEC v1.1)
export interface CatalogItem {
	modelId: string;
	marketingTitle: string;
	gender: 'жіноча' | 'чоловіча' | 'унісекс';
	previewImage: string;
	mainImage: string;
	price: number;
	tryOn: boolean;
	aiPreview: boolean;
	frameWidth: number | null;
}
