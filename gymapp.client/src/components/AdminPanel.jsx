import React, { useState } from 'react';

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
                setFormData({ name: '', room: '', maxCapacity: 10, startTime: '', endTime: '', trainerId: 1 });
                if (onClassAdded) onClassAdded();
            } else {
                setMessage('❌ Błąd: ' + text);
            }
        } catch (err) {
            setMessage('❌ Brak połączenia z serwerem.');
        }
    };

    return (
        <div className="bg-gray-900 text-white p-6 rounded-xl shadow-lg mb-10">
            <h3 className="text-xl font-bold text-amber-400 mb-4">🛠️ Panel Administratora: Dodaj nowe zajęcia</h3>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-400">Nazwa zajęć</label>
                    <input type="text" name="name" required value={formData.name} onChange={handleChange}
                        className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded p-2 text-white text-sm focus:outline-none focus:border-amber-400" />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-400">Sala / Lokalizacja</label>
                    <input type="text" name="room" required value={formData.room} onChange={handleChange}
                        className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded p-2 text-white text-sm focus:outline-none focus:border-amber-400" />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-400">Maksymalna liczba osób</label>
                    <input type="number" name="maxCapacity" required min="1" value={formData.maxCapacity} onChange={handleChange}
                        className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded p-2 text-white text-sm focus:outline-none focus:border-amber-400" />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-400">ID Trenera (odpowiedzialnego)</label>
                    <input type="number" name="trainerId" required value={formData.trainerId} onChange={handleChange}
                        className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded p-2 text-white text-sm focus:outline-none focus:border-amber-400" />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-400">Czas rozpoczęcia</label>
                    <input type="datetime-local" name="startTime" required value={formData.startTime} onChange={handleChange}
                        className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded p-2 text-white text-sm focus:outline-none focus:border-amber-400" />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-400">Czas zakończenia</label>
                    <input type="datetime-local" name="endTime" required value={formData.endTime} onChange={handleChange}
                        className="mt-1 block w-full bg-gray-800 border border-gray-700 rounded p-2 text-white text-sm focus:outline-none focus:border-amber-400" />
                </div>

                <div className="md:col-span-2 flex items-center justify-between mt-2">
                    {message && <p className="text-sm font-medium">{message}</p>}
                    <button type="submit" className="ml-auto bg-amber-500 text-gray-950 font-bold px-6 py-2 rounded hover:bg-amber-400 transition text-sm">
                        Dodaj do bazy danych
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AdminPanel;