// src/pages/confessions/post/PostConfession.tsx
import PostForm from "../../../components/post/PostForm";
import { supabase } from "../../../lib/supabaseClient";
import { useCampusStore } from "../../../store/useCampusStore";
import { useUserStore } from "../../../store/useUserStore";

const PostConfession = () => {
  const campus = useCampusStore((s) => s.campus);
  const user = useUserStore((s) => s.user);

  const fields = [
    { name: "content", label: "Your Confession", type: "textarea", required: true },
  ];

  const handleSubmit = async (formData: FormData) => {
    if (!user?.id || !campus?.id) {
      throw new Error("Please login and select a campus first");
    }

    const content = formData.get("content") as string;

    // Save to Supabase
    const { error } = await supabase
      .from("confessions")
      .insert([{
        content,
        campus_id: parseInt(campus.id),
        user_id: user.id,
      }]);

    if (error) throw error;
    return true;
  };

  return (
    <PostForm
      title="Post a Confession"
      fields={fields}
      submitUrl="" // Not used
      onBeforeSubmit={handleSubmit}
    />
  );
};

export default PostConfession;