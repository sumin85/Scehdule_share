import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import SideBar from './components/SideBar';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Notifications from './pages/Category/Notifications';
import Friend from './pages/Category/Friend';
import Mypage from './pages/Mypage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/sign/register';
import NaverCallback from './pages/NaverCallback';
import MySchedule from './pages/Category/MySchedule';
import Setting from './pages/Category/Setting';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
    <ErrorBoundary>
    <Header onToggleSidebar={() => setSidebarOpen((s) => !s)} />
    </ErrorBoundary>

    <div className="app-main">
      <SideBar sidebarOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Mobile overlay */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
      <div className="app-content">
        <ErrorBoundary>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/friend" element={<Friend />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/callback/naver" element={<NaverCallback />} />
          <Route path="/MySchedule" element={<MySchedule />} />
          <Route path="/Setting" element={<Setting />} />
        </Routes>
        </ErrorBoundary>
      </div>
    </div>
    </>
  );
}

export default App;
