// src/pages/roommates/post/PostRoommate.tsx
import PostForm from "../../../components/post/PostForm";
import { supabase } from "../../../lib/supabaseClient";
import { useCampusStore } from "../../../store/useCampusStore";
import { useUserStore } from "../../../store/useUserStore";

const PostRoommate = () => {
  const campus = useCampusStore((s) => s.campus);
  const user = useUserStore((s) => s.user);

  const fields = [
    { name: "title", label: "Post Title", type: "text", required: true },
    { name: "roomType", label: "Room Type (Single/Shared)", type: "text", required: true },
    { name: "budget", label: "Budget per Month (KSh)", type: "text" },
    { name: "contact", label: "Phone / WhatsApp", type: "text", required: true },
    { name: "description", label: "Additional Info / Preferences", type: "textarea", required: true },
    { name: "image", label: "Upload Room Photo (optional)", type: "file" },
  ];

  const handleSubmit = async (formData: FormData) => {
    if (!user?.id || !campus?.id) {
      throw new Error("Please login and select a campus first");
    }

    const title = formData.get("title") as string;
    const roomType = formData.get("roomType") as string;
    const budgetStr = formData.get("budget") as string;
    const contact = formData.get("contact") as string;
    const description = formData.get("description") as string;

    // Parse budget
    const budget = budgetStr ? parseFloat(budgetStr.replace(/[^\d.]/g, "")) : null;

    // Handle image upload
    let imageUrl: string | null = null;
    const imageFile = formData.get("image") as File;
    
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `roommates/${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      imageUrl = publicUrl;
    }

    // Save to Supabase
    const { error } = await supabase
      .from("roommates")
      .insert([{
        title,
        room_type: roomType,
        budget: budget ? parseFloat(budgetStr.replace(/[^\d.]/g, "")) : null,
        contact,
        description,
        image: imageUrl,
        campus_id: parseInt(campus.id),
        user_id: user.id,
      }]);

    if (error) throw error;
    return true;
  };

  return (
    <PostForm
      title="Find / Offer a Roommate"
      fields={fields}
      submitUrl="" // Not used
      onBeforeSubmit={handleSubmit}
    />
  );
};

export default PostRoommate;