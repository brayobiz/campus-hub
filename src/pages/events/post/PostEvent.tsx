// src/pages/events/post/PostEvent.tsx
import PostForm from "../../../components/post/PostForm";

const PostEvent = () => {
  const fields = [
    { name: "title", label: "Event Title", type: "text", required: true },
    { name: "description", label: "Event Description", type: "textarea", required: true },
    { name: "date", label: "Event Date", type: "text", required: true }, // could use date picker later
    { name: "location", label: "Location", type: "text", required: true },
    { name: "banner", label: "Event Banner", type: "file", required: false }, // optional image
  ];

  const submitUrl = "/api/events"; // replace with your backend endpoint

  return (
    <PostForm 
      title="Post a New Event" 
      fields={fields} 
      submitUrl={submitUrl} 
    />
  );
};

export default PostEvent;