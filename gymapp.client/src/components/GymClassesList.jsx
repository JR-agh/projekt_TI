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

    if (loading) return <p className="tekst-ladowania">Ładowanie grafiku zajęć...</p>;

    const myBookedClasses = classes.filter(c => userBookedClassIds.includes(c.id));

    return (
        <div className="grafik-kontener">

            {/* Sekcja 1: Zajęcia zarezerwowane przez zalogowanego użytkownika */}
            {myBookedClasses.length > 0 && (
                <div className="sekcja-rezerwacji">
                    <h3 className="sekcja-tytul-niebieski">⭐ Twoje zarezerwowane treningi</h3>
                    <div className="siatka-rezerwacji">
                        {myBookedClasses.map(c => (
                            <div key={c.id} className="karta-rezerwacji">
                                <h4 className="nazwa-zajec">{c.name}</h4>
                                <p className="lokalizacja-sala"> {c.room}</p>
                                <p className="data-treningu">
                                     {new Date(c.startTime).toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' })}
                                </p>
                                <button
                                    onClick={() => handleCancel(c.id)}
                                    className="przycisk-rezygnuj"
                                >
                                    Zrezygnuj z treningu
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Sekcja 2: Grafik wszystkich dostępnych zajęć */}
            <div className="sekcja-wszystkie-zajecia">
                <h3 className="sekcja-tytul-glowny">Dostępne zajęcia fitness</h3>
                <div className="siatka-zajec">
                    {classes.map((c) => {
                        const isEnrolled = userBookedClassIds.includes(c.id);
                        const isFull = c.currentEnrollment >= c.maxCapacity;

                        // Dynamiczna klasa: zielona ramka, jeśli użytkownik jest już zapisany
                        const klasaKarty = `karta-zajec ${isEnrolled ? 'zapisany-border' : 'standard-border'}`;

                        return (
                            <div key={c.id} className={klasaKarty}>
                                <div className="zawartosc-karty">
                                    <h4 className="nazwa-zajec">{c.name}</h4>
                                    <p className="lokalizacja-sala"> Lokalizacja: <span className="pogrubienie-ciemne">{c.room}</span></p>
                                </div>

                                <div className="dol-karty">
                                    <p className="czas-zajec"> Początek: <span>{new Date(c.startTime).toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' })}</span></p>
                                    <p className="czas-zajec"> Koniec: <span>{new Date(c.endTime).toLocaleString('pl-PL', { timeStyle: 'short' })}</span></p>

                                    {/* Licznik wolnych miejsc */}
                                    <div className="kontener-licznika">
                                        <span className={`badge-miejsca ${isFull ? 'badge-pelno' : 'badge-wolne'}`}>
                                            Zapisanych: {c.currentEnrollment} / {c.maxCapacity}
                                        </span>
                                    </div>

                                    {/* Warunkowe przyciski (Zapisany / Pełno / Zapisz się) */}
                                    {isEnrolled ? (
                                        <button disabled className="btn-status btn-sukces">
                                            ✓ Jesteś zapisany(a)
                                        </button>
                                    ) : isFull ? (
                                        <button disabled className="btn-status btn-zablokowany">
                                            Brak wolnych miejsc
                                        </button>
                                    ) : (
                                        <button
                                            className="btn-status btn-zapisz"
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