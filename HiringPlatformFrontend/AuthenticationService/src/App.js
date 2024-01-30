import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import i18n from "./util/i18n.ts";
import { I18nextProvider } from 'react-i18next';
import HeaderPage from "./components/HeaderPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import AboutPage from "./components/AboutPage";
import TokenPage from "./components/TokenPage";

function App() {
  return (
      <I18nextProvider i18n={i18n}>
          <Router>
            <div>
              <HeaderPage />
              <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/token/:emailParam" element={<TokenPage />}/>
                  <Route path="/" element={<AboutPage />} />
                  <Route path="*" element={<LoginPage />} />
              </Routes>
            </div>
          </Router>
      </I18nextProvider>
  );
}

export default App;
