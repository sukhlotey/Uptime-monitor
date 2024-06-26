import Signup from "./pages/Signup";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import ProtectedRoute from "./pages/ProtectedRoute";
import PublicRoute from "./pages/PublicRoute"; // Import the new PublicRoute component
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" exact element={<LandingPage />} />
          <Route
            path="/dashboard"
            exact
            element={<ProtectedRoute element={Home} />}
          />
          <Route
            path="/login"
            exact
            element={<PublicRoute element={Login} />}
          />
          <Route
            path="/signup"
            exact
            element={<PublicRoute element={Signup} />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
