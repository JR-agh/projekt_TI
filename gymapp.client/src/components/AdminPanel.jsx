import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

function AdminPanel({ onClassAdded }) {
    const [formData, setFormData] = useState({
        name: '',
        room: '',
        maxCapacity: 10,
        startTime: '',
        endTime: '',
        trainerId: 2
    });
    const [message, setMessage] = useState('');
    const [classesList, setClassesList] = useState([]); 

    const API_URL = 'https://localhost:7276/api/gymclasses';

    // Funkcja pobierająca zajęcia 
    const fetchClasses = async () => {
        try {
            const response = await fetch(API_URL);
            if (response.ok) {
                const data = await response.json();
                setClassesList(data);
            }
        } catch (err) {
            console.error("Błąd pobierania zajęć:", err);
        }
    };

    // Pobranie danych na starcie komponentu
    useEffect(() => {
        fetchClasses();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'maxCapacity' || name === 'trainerId' ? parseInt(value) : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const text = await response.text();

            if (response.ok) {
                setMessage('✅ Zajęcia zostały pomyślnie dodane do bazy danych!');
                setFormData({ name: '', room: '', maxCapacity: 10, startTime: '', endTime: '', trainerId: 2 });
                fetchClasses(); 
                if (onClassAdded) onClassAdded();
            } else {
                if (text.includes("FOREIGN KEY") || text.includes("TrainerId")) {
                    setMessage('❌ Błąd: Podany trener (ID: ' + formData.trainerId + ') nie istnieje w systemie.');
                }
                else if (text.includes("date") || text.includes("time") || text.includes("overlap") || text.includes("termin")) {
                    setMessage('❌ Błąd: Nieprawidłowy termin zajęć. Sprawdź czy godziny są poprawne lub czy sala/trener są wolni.');
                }
                else {
                    setMessage('❌ Błąd: ' + text);
                }
            }
        } catch (err) {
            setMessage('❌ Brak połączenia z serwerem.');
        }
    };

    // Funkcja usuwania zajęć
    const handleDelete = async (classId) => {
        if (!window.confirm("Czy na pewno chcesz usunąć te zajęcia? Spowoduje to anulowanie rezerwacji uczestników.")) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${classId}`, {
                method: 'DELETE'
            });

            const text = await response.text();

            if (response.ok) {
                setMessage('🗑️ ' + text);
                fetchClasses(); 
                if (onClassAdded) onClassAdded();
            } else {
                setMessage('❌ Błąd podczas usuwania: ' + text);
            }
        } catch (err) {
            setMessage('❌ Brak połączenia z serwerem podczas usuwania.');
        }
    };

    return (
        <div className="admin-panel-kontener">
            <h3 className="admin-panel-tytul">Panel Administratora: Dodaj nowe zajęcia</h3>

            <form onSubmit={handleSubmit} className="admin-formularz-siatka">
                <div className="admin-form-group">
                    <label>Nazwa zajęć</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange} />
                </div>

                <div className="admin-form-group">
                    <label>Sala / Lokalizacja</label>
                    <input type="text" name="room" required value={formData.room} onChange={handleChange} />
                </div>

                <div className="admin-form-group">
                    <label>Maksymalna liczba osób</label>
                    <input type="number" name="maxCapacity" required min="1" value={formData.maxCapacity} onChange={handleChange} />
                </div>

                <div className="admin-form-group">
                    <label>ID Trenera (odpowiedzialnego)</label>
                    <input type="number" name="trainerId" required value={formData.trainerId} onChange={handleChange} />
                </div>

                <div className="admin-form-group">
                    <label>Czas rozpoczęcia</label>
                    <input type="datetime-local" name="startTime" required value={formData.startTime} onChange={handleChange} />
                </div>

                <div className="admin-form-group">
                    <label>Czas zakończenia</label>
                    <input type="datetime-local" name="endTime" required value={formData.endTime} onChange={handleChange} />
                </div>

                <div className="admin-form-dol">
                    {message && <p className="admin-wiadomosc">{message}</p>}
                    <button type="submit" className="admin-btn-wyslij">
                        Dodaj do bazy danych
                    </button>
                </div>
            </form>

            <hr className="admin-separator" />
            <h3 className="admin-panel-tytul">Zarządzaj istniejącymi zajęciami</h3>

            <div className="admin-lista-zajec">
                {classesList.length === 0 ? (
                    <p className="admin-pusta-lista">Brak zaplanowanych zajęć w bazie.</p>
                ) : (
                    classesList.map((c) => (
                        <div key={c.id} className="admin-zajecia-item">
                            <div className="admin-zajecia-info">
                                <strong>{c.name}</strong> — Sala: {c.room} <br />
                                <small>
                                    {new Date(c.startTime).toLocaleString()} - {new Date(c.endTime).toLocaleTimeString()}
                                </small>
                            </div>
                            <button
                                onClick={() => handleDelete(c.id)}
                                className="admin-btn-usun"
                            >
                                Usuń
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default AdminPanel;