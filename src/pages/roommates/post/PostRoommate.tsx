// src/pages/roommates/post/PostRoommate.tsx
import PostForm from "../../../components/post/PostForm";

const PostRoommate = () => {
  const fields = [
    { name: "name", label: "Your Name", type: "text", required: true },
    { name: "campus", label: "Campus / Area", type: "text", required: true },
    { name: "roomType", label: "Room Type (Single/Shared)", type: "text", required: true },
    { name: "budget", label: "Budget per Month (Ksh)", type: "text" },
    { name: "contact", label: "Phone / WhatsApp", type: "text", required: true },
    { name: "description", label: "Additional Info / Preferences", type: "textarea" },
    { name: "image", label: "Upload Room Photo (optional)", type: "file" },
  ];

  return <PostForm title="Find / Offer a Roommate" fields={fields} submitUrl="/api/roommates" />;
};

export default PostRoommate;