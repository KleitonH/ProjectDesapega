import Login from "./pages/LoginPage/Login";
import Home from "./pages/HomePage/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";  

function App() {
    return (
            <Routes>
                <Route path="/" element={<Login/>} />
                <Route path="/home" element={<Home/>} />
            </Routes>
    );
}

export default App;
