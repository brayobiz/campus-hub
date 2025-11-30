// src/pages/food/post/PostFood.tsx
import PostForm from "../../../components/post/PostForm";

const PostFood = () => {
  const fields = [
    { name: "name", label: "Food Name", type: "text", required: true },
    { name: "description", label: "Description", type: "textarea", required: true },
    { name: "price", label: "Price (KSh)", type: "text", required: true },
    { name: "image", label: "Food Image", type: "file", required: true },
    { name: "contact", label: "Contact Information", type: "text", required: true },
  ];

  const submitUrl = "/api/food"; // replace with your actual backend endpoint

  return (
    <PostForm
      title="Post a New Food Item"
      fields={fields}
      submitUrl={submitUrl}
    />
  );
};

export default PostFood;