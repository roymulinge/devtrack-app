
import React from "react";
import Navbar from "./Components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
function App() {
 
  return (
    <>
    <Router>
      <Navbar />
       <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
       </Routes>
    </Router>
      
    </>
  )
}

export default App
