// src/pages/events/post/PostEvent.tsx
import PostForm from "../../../components/post/PostForm";
import { supabase } from "../../../lib/supabaseClient";
import { useCampusStore } from "../../../store/useCampusStore";
import { useUserStore } from "../../../store/useUserStore";
import { useNavigate } from "react-router-dom";

const PostEvent = () => {
  const campus = useCampusStore((s) => s.campus);
  const user = useUserStore((s) => s.user);
  const navigate = useNavigate();

  const fields = [
    { name: "title", label: "Event Title", type: "text", required: true },
    { name: "description", label: "Event Description", type: "textarea", required: true },
    { name: "date", label: "Event Date", type: "date", required: true },
    { name: "location", label: "Location", type: "text", required: true },
    { name: "banner", label: "Event Banner", type: "file", required: false },
  ];

  const handleSubmit = async (formData: FormData) => {
    if (!user?.id || !campus?.id) {
      throw new Error("Please login and select a campus first");
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const date = formData.get("date") as string;
    const location = formData.get("location") as string;

    // Handle banner upload
    let bannerUrl: string | null = null;
    const bannerFile = formData.get("banner") as File;
    
    if (bannerFile && bannerFile.size > 0) {
      const fileExt = bannerFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `events/${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, bannerFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      bannerUrl = publicUrl;
    }

    // Save to Supabase
    const { error } = await supabase
      .from("events")
      .insert([{
        title,
        description,
        date,
        location,
        banner: bannerUrl,
        campus_id: parseInt(campus.id),
        user_id: user.id,
      }]);

    if (error) throw error;
    return true;
  };

  return (
    <PostForm
      title="Post a New Event"
      fields={fields}
      submitUrl="" // Not used
      onBeforeSubmit={handleSubmit}
      onSuccess={() => navigate("/events")}
    />
  );
};

export default PostEvent;