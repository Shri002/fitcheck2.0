// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Dashboard from './pages/Dashboard';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Resources from './pages/Resources';
import Survey from './pages/Survey';
import PastEntries from './pages/PastEntries';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/survey" element={<Survey />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/past-entries" element={<PastEntries />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;