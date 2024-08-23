import Introduction from "./components/Introduction";
import Navbar from "./components//Navbar";
import About from "./components/About";
import Skills from "./components/Skills";
import Works from "./components/Works";
import Footer from "./components/Footer";


function App() {
  return (
    <>
      <div className="flex flex-col md:mx-auto md:w-1/2">
        <Navbar />
        <Introduction />
        <About />
        <Skills />
        <Works />
        <Footer />
      </div>
    </>
  );
}

export default App;
