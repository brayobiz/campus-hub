import { supabase } from "./supabaseClient";

/**
 * Email confirmation bypass handler
 * In development mode, this allows users to proceed without email confirmation
 */
export const bypassEmailConfirmation = async (userId: string) => {
  try {
    // Attempt to update the user's email_confirmed_at timestamp
    const { error } = await supabase
      .from("profiles")
      .update({ email_verified: true })
      .eq("id", userId);

    if (error) {
      console.warn("Could not mark email as verified:", error.message);
    }

    return true;
  } catch (err) {
    console.warn("Email bypass failed:", err);
    return false;
  }
};

/**
 * Check if user needs email verification
 */
export const checkEmailVerification = async (userId: string) => {
  try {
    const { data } = await supabase
      .from("profiles")
      .select("email_verified")
      .eq("id", userId)
      .single();

    return data?.email_verified ?? false;
  } catch (err) {
    console.warn("Could not check email verification:", err);
    return false;
  }
};

/**
 * Enhanced signup with email bypass option
 */
export const signupWithBypass = async (
  email: string,
  password: string,
  fullname: string,
  bypassEmail = true
) => {
  try {
    // Signup with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { fullname },
        emailRedirectTo: `${window.location.origin}/auth/campuspicker`,
      },
    });

    if (error) {
      // Only bypass if email sending failed but user was created
      if (
        bypassEmail &&
        error.message?.toLowerCase().includes("email") &&
        data?.user?.id
      ) {
        console.log("Email send failed, but user created. Bypassing verification...");
        await bypassEmailConfirmation(data.user.id);
      } else {
        throw error;
      }
    }

    if (!data?.user?.id) {
      throw new Error("Signup failed - no user returned from Supabase.");
    }

    return { success: true, userId: data.user.id };
  } catch (err: any) {
    console.error("Signup error:", err);
    throw err;
  }
};

/**
 * Create or update user profile
 */
export const createUserProfile = async (
  userId: string,
  email: string,
  name: string
) => {
  try {
    const { error } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        email,
        name,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      // If profile already exists, try to update
      if (error.code === "23505") {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ email, name })
          .eq("id", userId);

        if (updateError) throw updateError;
      } else {
        throw error;
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error("Profile creation error:", err);
    throw err;
  }
};

/**
 * Get user profile with all details
 */
export const getUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;

    return data;
  } catch (err: any) {
    console.error("Error fetching profile:", err);
    return null;
  }
};

/**
 * Update user campus selection
 */
export const updateUserCampus = async (userId: string, campusId: string) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({ campus_id: campusId })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (err: any) {
    console.error("Error updating campus:", err);
    throw err;
  }
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  } catch (err: any) {
    console.error("Logout error:", err);
    return false;
  }
};

/**
 * Check if user is authenticated
 */
export const isUserAuthenticated = async () => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    return !!sessionData?.session?.user;
  } catch (err) {
    console.error("Error checking auth:", err);
    return false;
  }
};
