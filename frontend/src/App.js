import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Intro from "./pages/Intro";
import Login from "./pages/Login";
import Register from "./pages/Register"; // ✅ must match exact filename
import Resume from "./pages/Resume";
import CareerRoadmap from "./pages/CareerRoadmap";
import InterviewQnA from "./pages/InterviewQnA";
import AIDoubtSolver from "./pages/AIDoubtSolver";
import AICodeReviewer from "./pages/AICodeReviewer";
import  FeedbackForm from "./pages/FeedbackForm";
import About from "./pages/About";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/register" element={<Register />} /> {/* ✅ use lowercase in route */}
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
         <Route path="/resume" element={<Resume />} />
         <Route path="/roadmaps" element={<CareerRoadmap />} />
         <Route path="/jobs" element={<InterviewQnA />} />
          <Route path="/doubts" element={<AIDoubtSolver />} />
           <Route path="/code-review" element={<AICodeReviewer />} />
           <Route path="/ui" element={< FeedbackForm/>} />
            <Route path="/about" element={< About/>} />
          
      
      </Routes>
    </Router>
  );
}

export default App;
