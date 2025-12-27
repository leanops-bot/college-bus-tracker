import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import DriverDashboard from './components/DriverDashboard';
import StudentDashboard from './components/StudentDashboard';

function App() {
    return (
        <BrowserRouter>
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/driver" element={<DriverDashboard />} />
                    <Route path="/student" element={<StudentDashboard />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

const Home = () => {
    const navigate = useNavigate();
    return (
        <div className="home-container" style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>College Bus Tracker</h1>
            <p>Welcome! Please select your role to continue.</p>
            <button onClick={() => navigate('/login')} style={{ marginTop: '20px', padding: '15px 30px', fontSize: '1.2em' }}>
                Get Started
            </button>
        </div>
    )
};

export default App;
