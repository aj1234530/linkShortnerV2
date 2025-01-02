import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CreateLink from "./CreateLink";
import UrlRedirectnew from "./components/UrlRedirectnew";
import SignupPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";
import Root from "./pages/Root";
import NotFound from "./components/NotFound";
import Dashboard from "./pages/Dashboard";
import Links from "./pages/Core/Links";
import Analytics from "./pages/Core/Analytics";
function App() {
  //for dynamic route , can we use something like zustand or redux st such it is  there as look as auth sessio
  //user will reset as we refesh
  return (
    <>
      <Router>
        <Routes>
          {/* how to convert it into the spa */}
          <Route path="/" element={<Root />}></Route>
          <Route path="/signup" element={<SignupPage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          {/*we need to  useParams for the dynamic route on frontend also */}
          <Route path="/:user?/dashboard" element={<Dashboard />}></Route>

          <Route path="/createlink" element={<CreateLink />}></Route>
          <Route path="/analytics" element={<Analytics />}></Route>
          <Route path="/:user?/links" element={<Links />}></Route>
          <Route path="/user/*" element={<UrlRedirectnew />}></Route>
          {/* anyother router outside of these */}
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
