// src/pages/marketplace/post/PostMarketplace.tsx
import PostForm from "../../../components/post/PostForm";
import { supabase } from "../../../lib/supabaseClient";
import { useCampusStore } from "../../../store/useCampusStore";
import { useUserStore } from "../../../store/useUserStore";
import { useNavigate } from "react-router-dom";

const PostMarketplace = () => {
  const campus = useCampusStore((s) => s.campus);
  const user = useUserStore((s) => s.user);
  const navigate = useNavigate();

  const fields = [
    {
      name: "title",
      label: "Product Title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Product Description",
      type: "textarea",
      required: true,
    },
    {
      name: "price",
      label: "Price (in KSh)",
      type: "text",
      required: true,
    },
    {
      name: "category",
      label: "Category",
      type: "text",
      required: true,
    },
    {
      name: "contact",
      label: "Contact Info",
      type: "text",
      required: true,
    },
    {
      name: "images",
      label: "Upload Images",
      type: "file",
      required: false,
      multiple: true,
    },
  ];

  const handleSubmit = async (formData: FormData) => {
    if (!user?.id || !campus?.id) {
      throw new Error("Please login and select a campus first");
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priceStr = formData.get("price") as string;
    const category = formData.get("category") as string;
    const contact = formData.get("contact") as string;

    // Parse price (remove KSh and commas)
    const price = parseFloat(priceStr.replace(/[^\d.]/g, ""));

    // Handle image uploads to Supabase Storage
    const images: string[] = [];
    const imageFiles = formData.getAll("images") as File[];
    
    for (const file of imageFiles) {
      if (file.size > 0) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `marketplace/${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('uploads')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('uploads')
          .getPublicUrl(filePath);

        images.push(publicUrl);
      }
    }

    // Save to Supabase
    const { error } = await supabase
      .from("marketplace")
      .insert([{
        title,
        description,
        price,
        category,
        contact,
        images: images.length > 0 ? images : null,
        campus_id: parseInt(campus.id),
        user_id: user.id,
      }]);

    if (error) throw error;
    return true;
  };

  return (
    <PostForm
      title="Post a Marketplace Item"
      fields={fields}
      submitUrl="" // Not used since we handle submission
      onBeforeSubmit={handleSubmit}
      onSuccess={() => navigate("/marketplace")}
    />
  );
};

export default PostMarketplace;