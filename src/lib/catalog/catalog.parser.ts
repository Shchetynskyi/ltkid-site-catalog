import Papa from 'papaparse';
import type { CatalogItem } from './catalog.types';

type RawRow = Record<string, string>;

export function parseCatalogCsv(csv: string): CatalogItem[] {
	const { data } = Papa.parse<RawRow>(csv, {
		header: true,
		skipEmptyLines: true
	});

	return data
		.filter((row) => isShow(row))
		.map((row) => mapRow(row));
}

function isShow(row: RawRow): boolean {
	const v = (row['Показувати'] || '').toLowerCase();
	return v === 'так' || v === 'true';
}

function mapRow(row: RawRow): CatalogItem {
	return {
		modelId: row['ModelID'],
		marketingTitle: row['Маркетингова назва'],
		gender: row['Стать'] as CatalogItem['gender'],
		previewImage: row['Прев’ю'],
		mainImage: row['Фото (URL)'],
		price: Number(row['Price']),
		tryOn: isTrue(row['TryOn']),
		aiPreview: isTrue(row['AIPreview']),
		frameWidth: row['Ширина оправи (мм)']
			? Number(row['Ширина оправи (мм)'])
			: null
	};
}

function isTrue(value?: string): boolean {
	if (!value) return false;
	return value.toLowerCase() === 'true' || value.toLowerCase() === 'так';
}
