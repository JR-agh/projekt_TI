import React, { useState } from 'react';
import Register from './pages/Register';
import Login from './pages/Login';
import GymClassesList from './components/GymClassesList';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('gym_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [view, setView] = useState('login');
    const [refreshKey, setRefreshKey] = useState(0);

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        localStorage.setItem('gym_user', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('gym_user');
        setView('login');
    };

    if (user) {
        return (
            <div className="main-screen">
                <div className="panel-card">
                    <div className="top-bar">
                        <h1 className="welcome-heading">Witaj w GymApp, {user.firstName}!</h1>
                        <button onClick={handleLogout} className="logout-btn">
                            Wyloguj się
                        </button>
                    </div>
                    <p className="info-text">Twój adres e-mail: <span className="bold-text">{user.email}</span></p>
                    <p className="info-text">Twoja rola w systemie: <span className="user-role">{user.role}</span></p>
                    {/* panel administratora: */}
                    {user.role?.toLowerCase() === 'admin' && (<AdminPanel onClassAdded={() => setRefreshKey(prev => prev + 1)} />)}
                    <GymClassesList userId={user.id} key={refreshKey} />
                </div>
            </div>
        );
    }

    // Ekran początkowy: 
    return (
        <div>
            {view === 'login' ? (
                <Login onLoginSuccess={handleLoginSuccess} onNavigateToRegister={() => setView('register')} />
            ) : (
                <Register onNavigateToLogin={() => setView('login')} />
            )}
        </div>
    );
}

export default App;