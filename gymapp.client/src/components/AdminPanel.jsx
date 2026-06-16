import React, { useState } from 'react';
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
            const response = await fetch('https://localhost:7276/api/gymclasses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const text = await response.text();

            if (response.ok) {
                setMessage('✅ ' + text);
                setFormData({ name: '', room: '', maxCapacity: 10, startTime: '', endTime: '', trainerId: 2 });
                if (onClassAdded) onClassAdded();
            } else {
                setMessage('❌ Błąd: ' + text);
            }
        } catch (err) {
            setMessage('❌ Brak połączenia z serwerem.');
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
        </div>
    );
}

export default AdminPanel;