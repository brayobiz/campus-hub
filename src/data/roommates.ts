// Data fetched from Supabase at runtime, no mock data
export type RoommatePost = {
	id: string;
	title?: string;
	campus?: string;
	roomType?: string;
	description?: string;
	image?: string;
	budget?: number;
	contact?: string;
};

export const roommatePosts: RoommatePost[] = [];