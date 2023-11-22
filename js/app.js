let data;
let teamnames = document.querySelector('.js-teamnames');
let players = document.querySelector('.js-players');

// data inladen
let loaddata = async () => {
    try {
        const response = await fetch('../assets/GroupA.json');
        const json = await response.json();
        data = json;
        console.log(data);
        // Nadat de data is geladen, roep showTeams aan
        showTeams();
    } catch (error) {
        console.error('Er is een fout opgetreden bij het laden van de gegevens:', error);
    }
}

let showTeams = () => {
    inhoud = '';
    // Controleer of data niet leeg is
    if (data) {
        data.teams.forEach(team => {
            console.log(team.name);
            inhoud += `<div class="c-team" onclick="toggleTeam(this, '${team.name}')">
                <div class="c-team__logo">
                    <img src="/assets/img/${team.name}.png" alt="${team.name}">
                </div>
                <h3 class="c-team__name">${team.name}</h3>
            </div>`
        });
    } else {
        console.error('Geen gegevens beschikbaar. Zorg ervoor dat de gegevens correct zijn geladen.');
    }
    teamnames.innerHTML = inhoud;
};

let toggleTeam = (element, teamName) => {
    // Controleer of het team al actief is
    const isActive = element.classList.contains('c-team--active');

    // Verwijder eerst de klasse van alle teams
    document.querySelectorAll('.c-team').forEach(el => {
        el.classList.remove('c-team--active');
    });

    // Als het team al actief is, maak het inactief, anders maak het actief
    if (!isActive) {
        element.classList.add('c-team--active');
        // spelers van het team tonen
        showPlayers(teamName);
    }

    //als geen enkel team actief is, verwijder de spelers
    if (!document.querySelector('.c-team--active')) {
        console.log('geen enkel team actief');
        players.classList.add('o-hide-accessible');
        players.classList.add('active');
    } else {
        players.classList.remove('o-hide-accessible');
        players.classList.remove('active');
    }
};


let showPlayers = (teamName) => {
    // Zoek het team in de JSON-gegevens
    const team = data.teams.find((t) => t.name === teamName);

    if (team) {
        console.log(`Spelers van team ${teamName}:`);
        // Loop door de spelers van het gevonden team
        insertPlayersInHTML("goalkeepers", team.players.filter(player => player.position === "Keeper"));
        insertPlayersInHTML("defenders", team.players.filter(player => player.position === "Defender"));
        insertPlayersInHTML("midfielders", team.players.filter(player => player.position === "Midfielder"));
        insertPlayersInHTML("forwards", team.players.filter(player => player.position === "Forward"));


        team.players.forEach((player) => {
            console.log(`- ${player.name}, Positie: ${player.position}`);
        });
    } else {
        console.log(`Team ${teamName} niet gevonden.`);
    }
};

// Functie om spelers in de HTML in te voegen
function insertPlayersInHTML(position, players) {
    const positionElement = document.querySelector(`.js-${position}`);
    positionElement.innerHTML = ""; // Leeg de inhoud van de positiediv

    players.forEach((player) => {
        const playerElement = document.createElement("div");
        playerElement.classList.add("c-player");

        const imgElement = document.createElement("img");
        imgElement.classList.add("c-player__img");
        // imgElement.src = `assets/img/netherlands/${player.name.toLowerCase().replace(/\s/g, '')}.png`;
        imgElement.src = `../assets/img/netherlands/daphnevandomslaar.png`;
        imgElement.alt = "";

        const nameElement = document.createElement("h4");
        nameElement.classList.add("c-player__name");
        nameElement.textContent = player.name;

        playerElement.appendChild(imgElement);
        playerElement.appendChild(nameElement);

        positionElement.appendChild(playerElement);
    });
}


// Roep loaddata aan
loaddata();
