import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import i18n from "./util/i18n.ts";
import { I18nextProvider } from 'react-i18next';
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";

function App() {
  return (
      <I18nextProvider i18n={i18n}>
          <Router>
            <div>
              <Header />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                  <Route path="/" element={<Home />} />

                  <Route path="*" element={<Login />} />
              </Routes>
            </div>
          </Router>
      </I18nextProvider>
  );
}

export default App;
