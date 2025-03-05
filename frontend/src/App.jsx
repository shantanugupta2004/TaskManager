import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";

function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/forgot" element={<ForgotPassword/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/home" element={<Home/>}/>
        </Routes>
      </Router>
    
    )
}

export default App
