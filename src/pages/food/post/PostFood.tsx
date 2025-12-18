// src/pages/food/post/PostFood.tsx
import PostForm from "../../../components/post/PostForm";
import { supabase } from "../../../lib/supabaseClient";
import { useCampusStore } from "../../../store/useCampusStore";
import { useUserStore } from "../../../store/useUserStore";

const PostFood = () => {
  const campus = useCampusStore((s) => s.campus);
  const user = useUserStore((s) => s.user);

  const fields = [
    { name: "name", label: "Food Name", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea", required: true },
    { name: "price", label: "Price (KSh)", type: "text", required: true },
    { name: "image", label: "Food Image", type: "file", required: false },
    { name: "contact", label: "Contact Information", type: "text", required: true },
  ];

  const handleSubmit = async (formData: FormData) => {
    if (!user?.id || !campus?.id) {
      throw new Error("Please login and select a campus first");
    }

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const priceStr = formData.get("price") as string;
    const contact = formData.get("contact") as string;

    // Parse price
    const price = parseFloat(priceStr.replace(/[^\d.]/g, ""));

    // Handle image upload
    let imageUrl: string | null = null;
    const imageFile = formData.get("image") as File;
    
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `food/${user.id}/${fileName}`;

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
      .from("food")
      .insert([{
        name,
        description,
        price,
        image: imageUrl || "🍲", // Default emoji if no image
        contact,
        campus_id: campus.id,
        user_id: user.id,
      }]);

    if (error) throw error;
    return true;
  };

  return (
    <PostForm
      title="Post a New Food Item"
      fields={fields}
      submitUrl="" // Not used
      onBeforeSubmit={handleSubmit}
    />
  );
};

export default PostFood;