// src/pages/marketplace/post/PostMarketplace.tsx
import PostForm from "../../../components/post/PostForm";

const PostMarketplace = () => {
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
      label: "Price (in USD)",
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
      name: "images",
      label: "Upload Images",
      type: "file",
      required: true,
      multiple: true, // allows multiple images
    },
  ];

  return (
    <PostForm
      title="Post a Marketplace Item"
      fields={fields}
      submitUrl="/api/marketplace/posts" // replace with your backend endpoint
    />
  );
};

export default PostMarketplace;