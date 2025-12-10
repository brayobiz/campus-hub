import { Routes, Route } from "react-router-dom";
import { useAuthSession } from "./lib/authHook";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import CampusPicker from "./pages/Auth/CampusPicker";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Alerts from "./pages/Alerts";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

import ConfessionsFeed from "./pages/confessions/ConfessionsFeed";
import PostConfession from "./pages/confessions/post/PostConfession";

import MarketplaceFeed from "./pages/marketplace/MarketplaceFeed";
import PostMarketplace from "./pages/marketplace/post/PostMarketplace";

import EventsFeed from "./pages/events/EventsFeed";
import PostEvent from "./pages/events/post/PostEvent";

import FoodFeed from "./pages/food/FoodFeed";
import PostFood from "./pages/food/post/PostFood";

import NotesFeed from "./pages/notes/NotesFeed";
import PostNote from "./pages/notes/post/PostNote";

import RoommatesFeed from "./pages/roommates/RoommatesFeed";
import PostRoommate from "./pages/roommates/post/PostRoommate";
import PostModal from "./components/PostModal";

const App = () => {
  const { loading } = useAuthSession();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PostModal />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/auth/campuspicker" element={<CampusPicker />} />

        {/* Protected routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <Explore />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alerts"
          element={
            <ProtectedRoute>
              <Alerts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/confessions"
          element={
            <ProtectedRoute>
              <ConfessionsFeed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/confessions/post"
          element={
            <ProtectedRoute>
              <PostConfession />
            </ProtectedRoute>
          }
        />

        <Route
          path="/marketplace"
          element={
            <ProtectedRoute>
              <MarketplaceFeed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketplace/new"
          element={
            <ProtectedRoute>
              <PostMarketplace />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <EventsFeed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/new"
          element={
            <ProtectedRoute>
              <PostEvent />
            </ProtectedRoute>
          }
        />

        <Route
          path="/food"
          element={
            <ProtectedRoute>
              <FoodFeed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/food/new"
          element={
            <ProtectedRoute>
              <PostFood />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <NotesFeed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notes/new"
          element={
            <ProtectedRoute>
              <PostNote />
            </ProtectedRoute>
          }
        />

        <Route
          path="/roommates"
          element={
            <ProtectedRoute>
              <RoommatesFeed />
            </ProtectedRoute>
          }
        />
        <Route
          path="/roommates/new"
          element={
            <ProtectedRoute>
              <PostRoommate />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;