
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Intro from "./pages/Intro";
import Resume from "./pages/Resume";
import CareerRoadmap from "./pages/CareerRoadmap";
import InterviewQnA from "./pages/InterviewQnA";
import AIDoubtSolver from "./pages/AIDoubtSolver";
import AICodeReviewer from "./pages/AICodeReviewer";
import FeedbackForm from "./pages/FeedbackForm";
import About from "./pages/About";

function App() {
  return (
    <Router>
      <Routes>

        {/* Intro page loads first */}
        <Route path="/" element={<Intro />} />

        {/* Main Home page */}
        <Route path="/home" element={<Home />} />

        {/* Feature pages */}
        <Route path="/resume" element={<Resume />} />
        <Route path="/roadmaps" element={<CareerRoadmap />} />
        <Route path="/jobs" element={<InterviewQnA />} />
        <Route path="/doubts" element={<AIDoubtSolver />} />
        <Route path="/code-review" element={<AICodeReviewer />} />
        <Route path="/ui" element={<FeedbackForm />} />
        <Route path="/about" element={<About />} />

      </Routes>
    </Router>
  );
}

export default App;

