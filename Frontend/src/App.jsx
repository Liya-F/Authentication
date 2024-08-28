// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Register } from './components/register';
import { Login } from './components/login';
import { Profile } from './components/profile';
import {Home} from './components/home';
const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
