import React, { useEffect, useState } from 'react';

function GymClassesList({ userId }) {
    const [classes, setClasses] = useState([]);
    const [userBookedClassIds, setUserBookedClassIds] = useState([]);
    const [loading, setLoading] = useState(true);


    const fetchData = async () => {
        try {
            const resAll = await fetch('https://localhost:7276/api/gymclasses');
            const allData = await resAll.json();

            const resUser = await fetch(`https://localhost:7276/api/gymclasses/user/${userId}`);
            const userData = await resUser.json();

            setClasses(allData);
            setUserBookedClassIds(userData.map(c => c.id));
            setLoading(false);
        } catch (err) {
            console.error("Błąd pobierania danych:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [userId]);

    const handleBooking = async (classId) => {
        try {
            const response = await fetch(`https://localhost:7276/api/gymclasses/${classId}/book?userId=${userId}`, {
                method: 'POST'
            });

            const message = await response.text();

            if (response.ok) {
                fetchData();
            } else {
                alert(`Błąd: ${message}`);
            }
        } catch (err) {
            alert("Błąd połączenia z serwerem.");
        }
    };

    if (loading) return <p className="text-gray-500 animate-pulse">Ładowanie grafiku zajęć...</p>;

    const myBookedClasses = classes.filter(c => userBookedClassIds.includes(c.id));

    return (
        <div className="space-y-10">
            {/* zajęcia, na które jest się zapisanym */}
            {myBookedClasses.length > 0 && (
                <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                    <h3 className="text-lg font-bold text-indigo-900 mb-4">⭐ Twoje zarezerwowane treningi</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {myBookedClasses.map(c => (
                            <div key={c.id} className="bg-white p-4 rounded-lg shadow-sm border border-indigo-200">
                                <h4 className="font-bold text-gray-950">{c.name}</h4>
                                <p className="text-xs text-gray-500 mt-1">📍 {c.room}</p>
                                <p className="text-xs font-medium text-indigo-600 mt-2">
                                    📅 {new Date(c.startTime).toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' })}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {/* grafik wszystkich zajęć */ }
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Dostępne zajęcia fitness</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((c) => {
                        const isEnrolled = userBookedClassIds.includes(c.id);
                        const isFull = c.currentEnrollment >= c.maxCapacity;

                        return (
                            <div key={c.id} className={`bg-white border rounded-lg shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition ${isEnrolled ? 'border-green-300 bg-green-50/20' : 'border-gray-200'}`}>
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-lg font-bold text-indigo-600">{c.name}</h4>
                                        <span className="text-xs font-semibold px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                                            Max: {c.maxCapacity} osób
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">📍 Lokalizacja: <span className="font-medium text-gray-800">{c.room}</span></p>
                                </div>

                                <div className="border-t pt-3 mt-4 text-xs text-gray-500 space-y-1">
                                    <p>🕒 Początek: <span className="font-medium text-gray-700">{new Date(c.startTime).toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' })}</span></p>
                                    <p>⏳ Koniec: <span className="font-medium text-gray-700">{new Date(c.endTime).toLocaleString('pl-PL', { timeStyle: 'short' })}</span></p>

                                    {isEnrolled ? (
                                        <button
                                            disabled
                                            className="w-full mt-4 bg-green-100 text-green-700 py-2 rounded font-medium cursor-not-allowed text-center"
                                        >
                                            ✓ Jesteś zapisany(a)
                                        </button>
                                    ) : isFull ? (
                                        <button
                                            disabled
                                            className="w-full mt-4 bg-gray-100 text-gray-400 py-2 rounded font-medium cursor-not-allowed text-center"
                                        >
                                            Brak wolnych miejsc
                                        </button>
                                    ) : (
                                        <button
                                            className="w-full mt-4 bg-indigo-600 text-white py-2 rounded font-medium hover:bg-indigo-700 transition"
                                            onClick={() => handleBooking(c.id)}
                                        >
                                            Zapisz się
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default GymClassesList;