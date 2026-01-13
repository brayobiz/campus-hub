import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to Alerts as the single notification center
    navigate("/alerts", { replace: true });
  }, [navigate]);

  return null; // This component will redirect immediately
};

export default Notifications;
