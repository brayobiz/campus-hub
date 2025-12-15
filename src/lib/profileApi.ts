import { supabase } from './supabaseClient';

export type Post = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  likes: number;
  type?: string; // e.g., 'confession', 'marketplace'
};

export type Follower = {
  id: string;
  name: string;
  campus?: string;
};

export type Review = {
  id: string;
  author: string;
  text: string;
  rating: number;
};

export type ProfileData = {
  id: string;
  name: string;
  email?: string;
  year?: string;
  major?: string;
  campus?: string;
  posts: Post[];
  followersCount: number;
  followers: Follower[];
  rating?: number; // 0-5
  reviews?: Review[];
};

/**
 * Fetch complete profile data from Supabase
 * Ready for real backend integration - all API calls use Supabase
 */
export async function fetchProfileData(userId?: string): Promise<ProfileData> {
  if (!userId) throw new Error('No userId provided');

  try {
    // Fetch profile from Supabase 'profiles' table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error || !profile) throw new Error('Profile not found');

    // Fetch posts
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId);
    
    if (postsError) throw new Error('Posts fetch error');

    // Fetch followers
    const { data: followers, error: followersError } = await supabase
      .from('followers')
      .select('id,name,campus')
      .eq('followed_id', userId);
    
    if (followersError) throw new Error('Followers fetch error');

    // Fetch reviews/ratings
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('id,author,text,rating')
      .eq('user_id', userId);
    
    if (reviewsError) throw new Error('Reviews fetch error');

    const rating = reviews && reviews.length > 0
      ? reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / reviews.length
      : undefined;

    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      year: profile.year,
      major: profile.major,
      campus: profile.campus,
      posts: posts ?? [],
      followersCount: followers?.length ?? 0,
      followers: followers ?? [],
      rating,
      reviews: reviews ?? [],
    };
  } catch (error) {
    console.error('Error fetching profile data:', error);
    throw error;
  }
}

/**
 * Fetch user posts from Supabase
 */
export async function fetchUserPosts(userId?: string): Promise<Post[]> {
  const profile = await fetchProfileData(userId);
  return profile.posts;
}

/**
 * Fetch user followers from Supabase
 */
export async function fetchUserFollowers(userId?: string): Promise<Follower[]> {
  const profile = await fetchProfileData(userId);
  return profile.followers;
}

/**
 * Fetch user reviews from Supabase
 */
export async function fetchUserReviews(userId?: string): Promise<Review[]> {
  const profile = await fetchProfileData(userId);
  return profile.reviews ?? [];
}
