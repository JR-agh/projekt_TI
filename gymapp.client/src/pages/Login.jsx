import React, { useState } from 'react';
import './Login.css';

function Login({ onLoginSuccess, onNavigateToRegister }) {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 

        try {
            const response = await fetch('https://localhost:7276/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Email: formData.email,
                    Password: formData.password
                })
            });

            if (response.ok) {
                const data = await response.json();
                onLoginSuccess(data.user);
            }

            else {
                setError('Nieprawidłowy e-mail lub hasło.');
            }

        } catch (err) {
          
            console.error("Błąd sieci:", err);
            setError('Brak połączenia z serwerem. Upewnij się, że backend jest uruchomiony.');
        }
    };

    return (
        <div className="gym-split-container">
            <div className="gym-auth-form-side">
                <div className="gym-auth-card">
                    <div className="gym-auth-header">
                        <h2>Zaloguj się</h2>
                        <p>Wprowadź swoje dane, aby przejść do panelu.</p>
                    </div>

                    <form className="gym-auth-form" onSubmit={handleSubmit}>
                        <div className="gym-form-group">
                            <label>Adres e-mail</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="twoj@email.com"
                            />
                        </div>

                        <div className="gym-form-group">
                            <label>Hasło</label>
                            <input
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div
                                className="gym-error-message"
                                style={{
                                    backgroundColor: 'rgba(234, 32, 39, 0.15)',
                                    border: '1px solid #ea2027',
                                    color: '#ff7675',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    marginTop: '15px',
                                    fontSize: '14px'
                                }}
                            >
                                {error}
                            </div>
                        )}

                        <button type="submit" className="gym-btn-primary">
                            Zaloguj się
                        </button>
                    </form>

                    <div className="gym-auth-footer">
                        <span>Nie masz jeszcze konta?</span>
                        <button type="button" onClick={onNavigateToRegister} className="gym-link-btn">
                            Zarejestruj się
                        </button>
                    </div>
                </div>
            </div>

            <div className="gym-auth-visual-side">
                <div className="gym-visual-overlay"></div>
                <div className="gym-visual-content">
                    <span className="gym-badge">GymApp Premium</span>
                    <h1>Witaj w strefie siły</h1>
                    <p className="gym-quote">
                        "Twój jedyny limit to Ten, który sam sobie postawisz. Zaloguj się, zaplanuj trening i zrealizuj swoje cele."
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;