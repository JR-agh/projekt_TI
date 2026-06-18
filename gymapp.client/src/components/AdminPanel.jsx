import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

function AdminPanel({ onClassAdded }) {
    const [formData, setFormData] = useState({
        name: '',
        room: '',
        maxCapacity: 10,
        startTime: '',
        durationMinutes: 60, 
        trainerId: 2
    });

    const [message, setMessage] = useState('');
    const [classesList, setClassesList] = useState([]);

    const API_URL = 'https://localhost:7276/api/gymclasses';

    // pobieranie zajec
    const fetchClasses = async () => {
        try {
            const response = await fetch(API_URL);
            if (response.ok) {
                const data = await response.json();
                setClassesList(data); 
            }
        } catch (err) {
            console.error("Error fetching classes:", err);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'maxCapacity' || name === 'trainerId' || name === 'durationMinutes' ? parseInt(value) : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setMessage('');

        // obliczanie czasu zakonczenia
        const start = new Date(formData.startTime);
        const end = new Date(start.getTime() + formData.durationMinutes * 60000);

        const year = end.getFullYear();
        const month = String(end.getMonth() + 1).padStart(2, '0');
        const day = String(end.getDate()).padStart(2, '0');
        const hours = String(end.getHours()).padStart(2, '0');
        const minutes = String(end.getMinutes()).padStart(2, '0');
        const formattedEndTime = `${year}-${month}-${day}T${hours}:${minutes}`;


        const payloadForBackend = {
            name: formData.name,
            room: formData.room,
            maxCapacity: formData.maxCapacity,
            startTime: formData.startTime,
            endTime: formattedEndTime,
            trainerId: formData.trainerId
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payloadForBackend)
            });

            const text = await response.text();

            if (response.ok) {
                setMessage('✅ Zajęcia zostały pomyślnie dodane do bazy danych!');
                setFormData({ name: '', room: '', maxCapacity: 10, startTime: '', durationMinutes: 60, trainerId: 2 });
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

    // usuwanie zajec
    const handleDelete = async (classId) => {
        // okienko potwierdzające chęć usunięcia
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
        <div className="admin-panel-container">
            <h3 className="admin-panel-title">Panel Administratora: Dodaj nowe zajęcia</h3>

            {/* formularz dodawania nowych zajęć */}
            <form onSubmit={handleSubmit} className="admin-form-grid">
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
                    <label>Czas trwania (w minutach)</label>
                    <input type="number" name="durationMinutes" required min="1" value={formData.durationMinutes} onChange={handleChange} placeholder="np. 60" />
                </div>

                {/* dodanie zajęć*/}
                <div className="admin-form-bottom">
                    {message && <p className="admin-message">{message}</p>}
                    <button type="submit" className="admin-btn-submit">
                        Dodaj zajęcia do grafiku 
                    </button>
                </div>
            </form>

            <hr className="admin-separator" />
            <h3 className="admin-panel-title">Zarządzaj istniejącymi zajęciami</h3>

            {/* lista zajec */}
            <div className="admin-classes-list">
                {classesList.length === 0 ? (
                    <p className="admin-empty-list">Brak zaplanowanych zajęć w bazie.</p>
                ) : (
                    classesList.map((c) => (
                        <div key={c.id} className="admin-class-item">
                            <div className="admin-class-info">
                                <strong>{c.name}</strong> — Sala: {c.room} <br />
                                <small>
                                    {new Date(c.startTime).toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' })} - {new Date(c.endTime).toLocaleTimeString('pl-PL', { timeStyle: 'short' })}
                                </small>
                            </div>
                            <button onClick={() => handleDelete(c.id)} className="admin-btn-delete">
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