import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Auth/Login";
import CampusPicker from "./pages/Auth/CampusPicker";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Alerts from "./pages/Alerts";
import Profile from "./pages/Profile";

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

const App = () => {
  return (
  <>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/campuspicker" element={<CampusPicker />} />
      <Route path="/home" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/alerts" element={<Alerts />} />
      <Route path="/profile" element={<Profile />} />
      
      <Route path="/confessions" element={ <ConfessionsFeed />} />
      <Route path="/confessions/post" element={<PostConfession />} />
      
      <Route path="/marketplace" element={ <MarketplaceFeed />} />
      <Route path="/marketplace/new" element={<PostMarketplace />} />
      
      <Route path="/events" element={<EventsFeed />} />
      <Route path="/events/new" element={<PostEvent />} />
      
      <Route path="/food" element={<FoodFeed />} />
      <Route path="/food/new" element={<PostFood />} />
      
      <Route path="/notes" element={<NotesFeed />} />
      <Route path="/notes/new" element={<PostNote />} />
      
      <Route path="/roommates" element={ <RoommatesFeed />} />
      <Route path="/roommates/new" element={<PostRoommate />} />

    </Routes>
  </>
  );
};

export default App;