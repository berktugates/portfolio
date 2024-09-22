import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "../context/ThemeProvider.jsx";
import Home from "../src/pages/Home.jsx";
import Works from "../src/pages/Works.jsx";

function App() {

  return (
    <>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/works" element={<Works />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
