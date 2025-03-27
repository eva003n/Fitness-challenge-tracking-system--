import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUpPage from "./pages/authentication";
import PublicRoute from "./components/common/PublicRoute.jsx";
import PrivateRoute from "./components/common/PrivateRoute.jsx";
import Challenge from "./pages/challenges/challenge.jsx";
import Challenges from "./pages/challenges/challenges.jsx";
import Dashboard from "./pages/dashboard";
import Redirect from "./pages/redirect";
import Profile from "./pages/profile";
import Notifications from "./pages/notifications";

import { useAuth } from "./context/authProvider.js";
import ActivityUpdate from "./pages/challenges/activityLog";
import NewChallenge from "./pages/challenges/create.jsx";
import EditChallenge from "./pages/challenges/challenge.edit.jsx";
import Reports from "./pages/reports.jsx";
import Home from "./pages/home.jsx";

import About from "./pages/about.jsx";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import Overview from "./pages/admin/overview.jsx";
import Analytics from "./pages/admin/analytics.jsx";
import Settings from "./pages/admin/settings.jsx";
import CreateChallenge from "./pages/admin/challenges/create";
import Edit from "./pages/admin/challenges/edit.jsx";
import ChallengesPage from "./pages/admin/challenges/challengeHome.jsx";
import Users from "./pages/admin/users.jsx";
import Explore from "./pages/challenges/explore.jsx";

const RoutePaths = () => {
  // const [isLoading, setIsLoading] = useState(true);
  const { user, token } = useAuth();

  return (
    <Routes>
      {/* Public routes for unauthenticated users */}
      <Route path="/" element={<PublicRoute />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="faq" element={<h1>FQA</h1>} />
        <Route path="login" element={<SignUpPage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="redirect" element={<Redirect />} />
      </Route>

      {/* Private routes for logged in users */}
      <Route element={<PrivateRoute />}>
        {/* Normal users routes  */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="reports" element={<Reports />} />
        <Route path="notifications" element={<Notifications />} />
        {/*Nested challenge routes */}
        <Route path="challenges">
          <Route index element={<Challenges />} />
          {/*details of a specific challenge */}
          <Route path=":id" element={<Challenge />} />
          <Route path="challenge/:id" element={<EditChallenge />} />
          <Route path="new" element={<NewChallenge />} />
          <Route path="explore" element={<Explore/>} />
          <Route path="activity/:id" element={<ActivityUpdate />} />
        </Route>
        {/* Admin routes, for only admins */}
        <Route path="admin" element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Overview />} />
          <Route path="challenges">
            <Route index element={<ChallengesPage />} />
            <Route path="Create" element={<CreateChallenge />} />
            <Route path=":id" element={<Edit />} />
          </Route>
          <Route path="users" element={<Users />} />

          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />

        </Route>
      </Route>

      {/* Not found routes */}
      <Route
        path="*"
        element={<h1 className="text-white">404 Page Not found</h1>}
      />
    </Routes>
  );
};

export default RoutePaths;
