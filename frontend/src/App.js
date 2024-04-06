// App.js
import React from 'react';
import Navbar from "./navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Verify from './pages/Verify';
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from './pages/AuthContext'; // Import the UserProvider

const App = () => {
    return (
        <AuthProvider> {/* Wrap your App with UserProvider */}
            <>
                <Navbar />
                <div className="container">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/verify/:username" element={<Verify />} />
                    </Routes>
                </div>
            </>
        </AuthProvider>
    );
}

export default App;
