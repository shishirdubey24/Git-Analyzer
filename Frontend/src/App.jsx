import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./Ui/LandingPage";
import ReportPage from "./Ui/ReportPage";

const App = () => {
     return (
          <Router>
               <Routes>
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="/home" element={<LandingPage />} />
                    <Route path="/report" element={<ReportPage />} />
               </Routes>
          </Router>
     );
};

export default App;