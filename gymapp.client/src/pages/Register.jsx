import React, { useState } from 'react';
import './Register.css'; // Import dedykowanego pliku CSS

function Register({ onNavigateToLogin }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await fetch('https://localhost:7276/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setMessage('Rejestracja udana! Możesz się teraz zalogować.');
                setFormData({ firstName: '', lastName: '', email: '', password: '' });
            } else {
                const errorText = await response.text();
                setError(errorText || 'Coś poszło nie tak podczas rejestracji.');
            }
        } catch (err) {
            console.error("Szczegóły błędu sieci/CORS:", err);
            setError('Brak połączenia z serwerem. Upewnij się, że backend jest uruchomiony.');
        }
    };

    return (
        <div className="gym-split-container-reg">
            {/* LEWA STRONA: Formularz rejestracji */}
            <div className="gym-reg-form-side">
                <div className="gym-reg-card">
                    <div className="gym-reg-header">
                        <h2>Stwórz konto</h2>
                        <p>Zrób pierwszy krok w stronę lepszej formy.</p>
                    </div>

                    <form className="gym-reg-form" onSubmit={handleSubmit}>
                        <div className="gym-reg-row">
                            <div className="gym-reg-group">
                                <label>Imię</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="Jan"
                                />
                            </div>

                            <div className="gym-reg-group">
                                <label>Nazwisko</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Kowalski"
                                />
                            </div>
                        </div>

                        <div className="gym-reg-group">
                            <label>Adres e-mail</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="kowalski@gym.pl"
                            />
                        </div>

                        <div className="gym-reg-group">
                            <label>Hasło (min. 6 znaków)</label>
                            <input
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                            />
                        </div>

                        {message && <div className="gym-reg-success">{message}</div>}
                        {error && <div className="gym-reg-error">{error}</div>}

                        <button type="submit" className="gym-reg-btn">
                            Zarejestruj się
                        </button>
                    </form>

                    <div className="gym-reg-footer">
                        <span>Masz już konto?</span>
                        <button type="button" onClick={onNavigateToLogin} className="gym-reg-link">
                            Zaloguj się
                        </button>
                    </div>
                </div>
            </div>

            {/* PRAWA STRONA: Panel motywacyjny */}
            <div className="gym-reg-visual-side">
                <div className="gym-reg-overlay"></div>
                <div className="gym-reg-content">
                    <span className="gym-reg-badge">Dołącz do klubu</span>
                    <h1>Zbuduj swoją najlepszą formę</h1>
                    <p className="gym-reg-quote">
                        "Sukces to suma małych wysiłków, powtarzanych dzień po dniu. Zapisz się na zajęcia grupowe i trenuj z najlepszymi."
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;