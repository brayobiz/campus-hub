// src/data/marketplace.ts - Data fetched from Supabase at runtime, no mock data
export type MarketplacePost = {
	id: string;
	title: string;
	description: string;
	category: string;
	images?: string[];
	price?: number;
	contact?: string;
};

export const marketplacePosts: MarketplacePost[] = [];