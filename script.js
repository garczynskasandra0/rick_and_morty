
/*console.log("JavaScript działa!");*/
const adresAPI =
    "https://rickandmortyapi.com/api/character";

const kontenerPostaci = document.getElementById("postacie");

const poleWiadomosci = document.getElementById("wiadomosc");

const kontenerPaginacji = document.getElementById("paginacja");


const przyciskPoprzedniej =  document.getElementById("poprzedniaStrona");


const przyciskNastepnej = document.getElementById("nastepnaStrona");


const informacjaOStronie = document.getElementById("informacjaOStronie");

let aktualnaStrona = 1;

let liczbaStron = 1;

// SPRAWDZANIE ADRESU STRONY

function sprawdzAdresStrony() {


    const sciezka = window.location.pathname;



    /* /character/NUMER */

    const znalezionyID = sciezka.match(  /^\/character\/(\d+)$/  );


    if (znalezionyID) {

        const idPostaci = znalezionyID[1];

        pokazSzczegoly(idPostaci);

    } else {
        pobierzPostacie(aktualnaStrona);
    }
}


// POBIERANIE POSTACI

async function pobierzPostacie(strona) {

    pokazLadowanie();

    kontenerPostaci.innerHTML = "";


    try {

        const odpowiedz = await fetch(`${adresAPI}?page=${strona}` );

        if (!odpowiedz.ok) {

            throw new Error(
                "Błąd API"
            );
        }

        const dane = await odpowiedz.json();

        liczbaStron =  dane.info.pages;

        wyswietlPostacie(
            dane.results
        );

        aktualizujPaginacje(
            dane.info
        );


        ukryjLadowanie();


    } catch (blad) {



        pokazBlad(
            "Nie udało się pobrać postaci z API."
        );

        console.error(blad);
    }
}

// WYŚWIETLANIE POSTACI

function wyswietlPostacie(postacie) {


    kontenerPostaci.innerHTML = "";

    kontenerPostaci.style.display = "grid";


    postacie.forEach(
        function(postac) {

            const karta = document.createElement("article");

            karta.classList.add("postac");

            karta.innerHTML = `

                <img
                    src="${postac.image}"
                    alt="${postac.name}"
                >

                <div class="informacje-postaci">

                    <h2>
                        ${postac.name}
                    </h2>


                    <p>
                        Status:

                        <strong
                            class="${postac.status.toLowerCase()}"
                        >
                            ${postac.status}
                        </strong>
                    </p>


                    <p>
                        Gatunek:
                        ${postac.species}
                    </p>


                    <p>
                        Płeć:
                        ${postac.gender}
                    </p>

                </div>

            `;

            karta.addEventListener(
                "click",
                function() {

                    window.location.href =  `/character/${postac.id}`;
                }
            );

            kontenerPostaci.appendChild(
                karta
            );

        }
    );
}

// PAGINACJA

function aktualizujPaginacje(info) {

    informacjaOStronie.textContent = `Page ${aktualnaStrona} / ${liczbaStron}`;

    przyciskPoprzedniej.disabled = info.prev === null;

    przyciskNastepnej.disabled = info.next === null;
}

// PRZYCISK POPRZEDNIEJ STRONY

przyciskPoprzedniej.addEventListener(
    "click",
    function() {
        if (aktualnaStrona > 1) {

            aktualnaStrona--;

            pobierzPostacie(
                aktualnaStrona
            );
        }

    }
);

// PRZYCISK NASTEPNEJ STRONY

przyciskNastepnej.addEventListener(
    "click",
    function() {
        if (
            aktualnaStrona <
            liczbaStron
        ) {

            aktualnaStrona++;

            pobierzPostacie(
                aktualnaStrona
            );
        }

    }
);

// POBIERANIE SZCZEGÓŁÓW POSTACI

async function pokazSzczegoly(idPostaci) {

    pokazLadowanie();

    kontenerPaginacji.style.display = "none";


    try {
        const odpowiedz =
            await fetch(
                `${adresAPI}/${idPostaci}`
            );


        if (!odpowiedz.ok) {

            throw new Error(
                "Postać nie istnieje"
            );
        }

        const postac = await odpowiedz.json();

        wyswietlSzczegoly( postac );

        ukryjLadowanie();

    } catch (blad) {

        pokazBlad( "Nie znaleziono takiej postaci." );

        console.error(blad);
    }
}

// WYŚWIETLANIE SZCZEGÓŁÓW

function wyswietlSzczegoly(postac) {


    kontenerPostaci.style.display ="block";

    kontenerPostaci.innerHTML = `

        <div class="szczegoly">

            <!-- Zdjęcie -->
            <img
                src="${postac.image}"
                alt="${postac.name}"
            >


            <div class="informacje-szczegolowe">

                <!-- Imię -->
                <h1>
                    ${postac.name}
                </h1>


                <!-- Status -->
                <p>
                    <strong>Status:</strong>
                    ${postac.status}
                </p>


                <!-- Gatunek -->
                <p>
                    <strong>Gatunek:</strong>
                    ${postac.species}
                </p>


                <!-- Płeć -->
                <p>
                    <strong>Płeć:</strong>
                    ${postac.gender}
                </p>


                <!-- Typ -->
                <p>
                    <strong>Typ:</strong>

                    ${
                        postac.type ||
                        "Brak"
                    }

                </p>


                <!-- Origin -->
                <p>
                    <strong>Origin:</strong>

                    ${postac.origin.name}

                </p>


                <!-- Location -->
                <p>
                    <strong>Location:</strong>

                    ${postac.location.name}

                </p>


                <!-- Liczba odcinków -->
                <p>
                    <strong>
                        Liczba odcinków:
                    </strong>

                    ${postac.episode.length}

                </p>


                <!-- Przycisk powrotu -->
                <button
                    class="przycisk-powrotu"
                    id="przyciskPowrotu"
                >
                    ← Wróć do listy
                </button>

            </div>

        </div>

    `;

    const przyciskPowrotu = document.getElementById( "przyciskPowrotu" );

    przyciskPowrotu.addEventListener(
        "click",
        wrocDoListy
    );
}

// POWRÓT DO LISTY

function wrocDoListy() {

    window.location.href = "/";
}

//ŁADWANIE

function pokazLadowanie() {

    poleWiadomosci.textContent =
        "Ładowanie...";
}

// UKRYWANIE ŁADOWANIA

function ukryjLadowanie() {

    poleWiadomosci.textContent = "";
}

// OBSŁUGA BŁĘDÓW

function pokazBlad(tekst) {

    poleWiadomosci.innerHTML = `

        <p>
            ${tekst}
        </p>


        <button
            class="przycisk-powrotu"
            onclick="wrocDoListy()"
        >
            ← Wróć do listy
        </button>

    `;
}

// START

sprawdzAdresStrony();