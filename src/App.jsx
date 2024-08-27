import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "../src/pages/Home.jsx"
import Works from "../src/pages/Works.jsx"


function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/works" element={<Works />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
