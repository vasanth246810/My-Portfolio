import './App.css';
import { Home } from './component/Home';
import { Navbar } from './component/Navbar';
import About from './component/About';
import  Projects  from './component/Projects';
import Contact from './component/contact';
// import summa from './component/summa';
function App() {
  return (
   <div className='App'>
    <Navbar />
    <Home />
    <About />
    <Projects />
    <Contact />
    </div>
  );
}

export default App;
