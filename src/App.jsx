import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "../src/pages/Home.jsx"
import Works from "../src/pages/Works.jsx"
import { useState } from 'react';


function App() {
  const [isDark, setIsDark] = useState(false)
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home isDark={isDark} setIsDark={setIsDark} />} />
        <Route path="/works" element={<Works isDark={isDark} setIsDark={setIsDark} />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
