import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { I18nextProvider } from "react-i18next";
import i18n from "./util/i18n";
import NotFoundPage from "./components/common/notFound/NotFoundPage";
import LoginPage from "./components/auth/LoginPage";
import ForgotPassword from "./components/forgotPassword/ForgotPassword";
import RegisterPage from "./components/auth/RegisterPage";
import ResetPassword from "./components/forgotPassword/ResetPassword";
import TokenPage from "./components/auth/TokenPage";
import AboutPage from "./components/auth/AboutPage";
import EditAccountPage from "./components/account/EditAccountPage";
import ProfilePage from "./components/profile/ProfilePage";
import EditProfilePage from "./components/profile/EditProfilePage";
import JobsPage from "./components/job/JobsPage";
import JobView from "./components/job/JobView";
import ApplicationPage from "./components/application/ApplicationPage";
import CreateCV from "./components/cv/CreateCV";
import AllCvPage from "./components/cv/AllCVPage";
import LoginAdminPage from "./components/auth/LoginAdminPage";
import UsersPage from "./components/admin/users/UsersPage";
import ComplainsPage from "./components/admin/complains/ComplainsPage";
import ActivitiesPage from "./components/admin/charts/ActivitiesPage";
import { setAuthData } from "./redux/actions/authActions";
import { setAdminData } from "./redux/actions/adminActions";
import ContactPage from "./components/contact/ContactPage";
import { setCvActionData } from "./redux/actions/cvActions";
import { setProfileActionData } from "./redux/actions/profileActions";
import { setFilterData } from "./redux/actions/filtersActions";

const Root = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Redux state
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const hasCv = useSelector((state) => state.cv.hasCv);
  const candidate = useSelector((state) => state.auth.candidate);
  const employer = useSelector((state) => state.auth.employer);
  const hasProfile = useSelector((state) => state.profile.hasProfile);
  const isAuthenticatedAdmin = useSelector(
    (state) => state.admin.isAuthenticated,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    // Choose if the user is login or not
    if (isAuthenticated || isAuthenticatedAdmin) {
      if (candidate && candidate.candidateId !== "") {
        if (
          !hasCv &&
          (location.pathname !== "/addCv" || location.pathname !== "/contacts")
        ) {
          navigate("/addCv");
        } else if (hasCv && location.pathname === "/addCv") {
          navigate("/allCv");
        }
      }
      if (employer && employer.employerId !== "") {
        if (!hasProfile && location.pathname !== "/addProfile") {
          navigate("/addProfile");
        } else if (hasProfile && location.pathname === "/addProfile") {
          navigate("/allJobs");
        }
      }
    } else {
      if (
        location.pathname !== "/login" &&
        location.pathname !== "/loginAdmin" &&
        location.pathname !== "/register" &&
        location.pathname !== "/forgotPassword" &&
        !location.pathname.includes("/resetPassword/") &&
        !location.pathname.includes("/token/") &&
        location.pathname !== "/"
      ) {
        navigate("/login");
      }
    }
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      dispatch(
        setFilterData(
          {
            contractType: [],
            employmentRegime: [],
            experience: [],
            industry: "",
            workMode: [],
            cityName: "",
            postingDate: "",
            status: [],
          },
          0,
          false,
          [],
          0,
        ),
      );
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <Routes>
      <Route path="/contacts" element={<ContactPage />} />
      <Route path="/activities" element={<ActivitiesPage />} />
      <Route path="/complains" element={<ComplainsPage />} />
      <Route path="/allUsers" element={<UsersPage />} />
      <Route path="/loginAdmin" element={<LoginAdminPage />} />
      <Route path="/allCv" element={<AllCvPage />} />
      <Route path="/addCv" element={<CreateCV />} />
      <Route path="/applications" element={<ApplicationPage />} />
      <Route path="/viewJob" element={<JobView />} />
      <Route path="/allJobs" element={<JobsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/addProfile" element={<EditProfilePage />} />
      <Route path="/editAccount" element={<EditAccountPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/resetPassword/:emailParam" element={<ResetPassword />} />
      <Route path="/token/:emailParam" element={<TokenPage />} />
      <Route path="/" element={<AboutPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

const App = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <Root></Root>
      </Router>
    </I18nextProvider>
  );
};

export default App;
