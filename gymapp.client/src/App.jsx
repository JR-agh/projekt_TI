import React, { useState } from 'react';
import Register from './pages/Register';
import Login from './pages/Login';
import GymClassesList from './components/GymClassesList';
import AdminPanel from './components/AdminPanel';

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
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-6xl mx-auto bg-white shadow rounded-lg p-6">
                    <div className="flex justify-between items-center border-b pb-4 mb-4">
                        {/* nagłówek i przycisk wylogowania */   }
                        <h1 className="text-2xl font-bold text-gray-900">Witaj w GymApp, {user.firstName}!</h1>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
                        >
                            Wyloguj się
                        </button>
                    </div>
                    <p className="text-gray-600">Twój adres e-mail: <span className="font-semibold">{user.email}</span></p>
                    <p className="text-gray-600">Twoja rola w systemie: <span className="font-semibold text-indigo-600">{user.role}</span></p>
                    {/* panel administratora: */}
                    {user.role?.toLowerCase() === 'admin' && (
                        <AdminPanel onClassAdded={() => setRefreshKey(prev => prev + 1)} />
                    )}
                    <GymClassesList userId={user.id} key={refreshKey} />
                </div>
            </div>
        );
    }
    // ekran początkowy:
    return (
        <div>
            {view === 'login' ? (
                <Login onLoginSuccess={handleLoginSuccess} />
            ) : (
                <Register />
            )}

            <div className="text-center bg-gray-100 pb-12">
                {view === 'login' ? (
                    <p className="text-sm text-gray-600">
                        Nie masz jeszcze konta?{' '}
                        <button onClick={() => setView('register')} className="text-indigo-600 font-medium hover:underline">
                            Zarejestruj się tutaj
                        </button>
                    </p>
                ) : (
                    <p className="text-sm text-gray-600">
                        Masz już konto?{' '}
                        <button onClick={() => setView('login')} className="text-indigo-600 font-medium hover:underline">
                            Zaloguj się tutaj
                        </button>
                    </p>
                )}
            </div>
        </div>
    );
}

export default App;