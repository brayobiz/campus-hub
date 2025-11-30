// src/pages/confessions/post/PostConfession.tsx
import PostForm from "../../../components/post/PostForm";

const PostConfession = () => {
  const fields = [
    { name: "content", label: "Your Confession", type: "textarea", required: true },
  ];

  return <PostForm title="Post a Confession" fields={fields} submitUrl="/api/confessions" />;
};

export default PostConfession;