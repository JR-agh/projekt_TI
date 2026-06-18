import React, { useEffect, useState } from 'react';
import './GymClassesList.css';

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
            alert("Błąd logowania.");
        }
    };

    const handleCancel = async (classId) => {
        if (!window.confirm("Czy na pewno chcesz zrezygnować z tych zajęć?")) return;

        try {
            const response = await fetch(`https://localhost:7276/api/gymclasses/${classId}/cancel?userId=${userId}`, {
                method: 'DELETE'
            });

            const message = await response.text();

            if (response.ok) {
                fetchData();
            } else {
                alert(`Błąd: ${message}`);
            }
        } catch (err) {
            alert("Błąd połączenia z serwerem podczas anulowania.");
        }
    };

    if (loading) return <p className="loading-text">Ładowanie grafiku zajęć...</p>;

    const myBookedClasses = classes.filter(c => userBookedClassIds.includes(c.id));

    return (
        <div className="schedule-container">

            {myBookedClasses.length > 0 && (
                <div className="bookings-section">
                    <h3 className="section-title-blue">⭐ Twoje zarezerwowane treningi</h3>
                    <div className="bookings-grid">
                        {myBookedClasses.map(c => (
                            <div key={c.id} className="booking-card">
                                <h4 className="class-name">{c.name}</h4>
                                <p className="class-room"> {c.room}</p>
                                <p className="class-date">
                                    {new Date(c.startTime).toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' })}
                                </p>
                                <button
                                    onClick={() => handleCancel(c.id)}
                                    className="btn-cancel"
                                >
                                    Zrezygnuj z treningu
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="all-classes-section">
                <h3 className="section-title-main">Dostępne zajęcia fitness</h3>
                <div className="classes-grid">
                    {classes.map((c) => {
                        const isEnrolled = userBookedClassIds.includes(c.id);
                        const isFull = c.currentEnrollment >= c.maxCapacity;

                        const cardClass = `class-card ${isEnrolled ? 'enrolled-border' : 'standard-border'}`;

                        return (
                            <div key={c.id} className={cardClass}>
                                <div className="card-content">
                                    <h4 className="class-name">{c.name}</h4>
                                    <p className="class-room"> Lokalizacja: <span className="bold-white">{c.room}</span></p>
                                </div>

                                <div className="card-bottom">
                                    <p className="class-time"> Początek: <span>{new Date(c.startTime).toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' })}</span></p>
                                    <p className="class-time"> Koniec: <span>{new Date(c.endTime).toLocaleString('pl-PL', { timeStyle: 'short' })}</span></p>

                                    <div className="counter-container">
                                        <span className={`spots-badge ${isFull ? 'badge-full' : 'badge-available'}`}>
                                            Zapisanych: {c.currentEnrollment} / {c.maxCapacity}
                                        </span>
                                    </div>

                                    {isEnrolled ? (
                                        <button disabled className="btn-status btn-success">
                                            ✓ Jesteś zapisany(a)
                                        </button>
                                    ) : isFull ? (
                                        <button disabled className="btn-status btn-locked">
                                            Brak wolnych miejsc
                                        </button>
                                    ) : (
                                        <button
                                            className="btn-status btn-join"
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