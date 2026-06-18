# Uruchamianie aplikacji

## Potrzebne narzędzia

* Visual Studio 2022 lub nowsze
* Node.js (w wersji LTS - zalecana wersja 18 lub nowsza)
* SQL Server Express LocalDB

## Konfiguracja i uruchomienie bazy danych

W konsoli managera pakietów Nuget należy wpisać polecenie `Update-Database -Project GymApp.Server -StartupProject GymApp.Server`.

## Instalacja zależności i uruchumienie Frontendu

W terminalu w folderze projektu `gymapp.client` należy wpisać następujące polecenia:

```
npm install
npm run dev
```
## Pierwsze odpalenie aplikacji

Po wykonaniu powyższych kroków należy wejść w ustawienia głównego rozwiązania i w zakładce *Startup project* zaznaczyć opcję *Multiple startup projects* oraz ustawić zarówno `GymApp.Server`, jak i `gymapp.client` na *start*. Od tego momentu naciśnięcie zielonej strzałki z napisem *Start* powinno uruchamiać aplikację.

# Elementy działającej aplikacji

## Ekran logowania

![Ekran logowania](images/ekran_logowania.png)

Pierwszy ekran jaki pojawia się po uruchomieniu strony. Można się tutaj zalogować przy wykorzystaniu intuicyjnego formularza lub nacisnąć przycisk "Zarejestruj się", jeżeli nie ma się jeszcze konta.

## Ekran rejestracji

![Ekran rejestracji](images/ekran_rejestracji.png)

Korzystając z formularza na stronie można założyć konto. Oczywiście e-mail musi przejść walidację oraz hasło musi spełniać wymagania (musi być długie na minimum 6 znaków).

## Ekran użytkownika

### Powitanie, e-mail oraz rola użytkownika

![Ekran użytkownika 1](images/ekran_user1.png)

Po zalogowaniu się na samej górze pojawia się nagłowek z powitaniem; przycisk, który umożliwia wylogowanie się; wyświetlają się tam również adres e-mail przypisany do konta i rola konta w systemie (klient, trener lub administrator).

### Zarezerwowane treningi

![Ekran użytkownika 2](images/ekran_user2.png)

Poniżej znajduje się fragment strony, na którym wyświetla się lista zajęć, na które się zapisaliśmy. Znajdują się tu informacje o czasie treningu oraz jego położeniu. Można tam również odwołać rezerwację i zwolnić miejsce dla kogoś innego, jeżeli akurat nie możemy się pojawić. Przed przypadkowym wypisanym z zajęć chroni nas okno dialogowe, w którym należy potwierdzić rezygnację z rezerwacji. Jeżeli nie jesteśmy zapisani na żaden trening to ta sekcja strony nie pojawia się.

### Dostępne zajęcia

![Ekran użytkownika 3](images/ekran_user3.png)

Na samym dole strony znajduje się lista zajęć, na które możemy się zapisać oraz liczba dostępnych na nich miejsc. Tutaj również są informacje o czasie położeniu treningów. Po kliknięciu "Zapisz się" pojawia się napis "Jesteś zapisany(a)", a kolor kafelka zmienia się na zielony.

## Ekran administratora

Jeżeli jesteśmy zalogowani na konto z uprawnieniami administratora pojawiają się dwa dodatkowe panele.

### Dodawanie zajęć

![Ekran administratora](images/ekran_admin1.png)

W pierwszym panelu możemy dodawać zajęcia. Należy wypełnić odpowiedni formularz, żeby pojawiły się zajęcia przypisane do odpowiedniego prowadzącego. Od razu po dodaniu zajęć klienci mogą się na nie rejestrować.

### Usuwanie zajęć

![Ekran administratora2](images/ekran_admin2.png)

Znajduje się tu lista wszystkich zajęć. Jeżeli z jakiegoś powodu zajęcia nie mogą się odbyć, można je usunąć za pomocą czerwonego przycisku po prawej stronie panelu.
