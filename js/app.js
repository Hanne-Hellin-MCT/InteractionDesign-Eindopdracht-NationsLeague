let data;
let teamnames = document.querySelector('.js-teamnames');
let players = document.querySelector('.js-players');
let games = document.querySelector('.js-games');

// data inladen
let loaddata = async () => {
    console.log('Loading data...');
    try {
        const response = await fetch('../assets/GroupA.json');
        const json = await response.json();
        data = json;
        console.log(data);
        // Nadat de data is geladen, roep showTeams aan
        showTeams();
        showGames();

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
        imgElement.src = player.image;
        imgElement.alt = "";

        const nameElement = document.createElement("h4");
        nameElement.classList.add("c-player__name");
        nameElement.textContent = player.name;

        playerElement.appendChild(imgElement);
        playerElement.appendChild(nameElement);

        positionElement.appendChild(playerElement);
    });
}


let showGames = () => {
    inhoud = '';
    // Controleer of data niet leeg is
    if (data) {
        data.matches.forEach(game => {
            console.log(game);
            inhoud += `<div class="c-game">
            <div class="c-game__hometeam">
                <img class="c-game__logo" src="/assets/img/${game.home_team}.png" height="40" width="auto" alt="${game.home_team}">
                <h4 class="c-game__name">${game.home_team}</h4>
            </div>
            <div class="c-game__info">
                <span class="c-game__date">${game.date}</span>
                <p class="c-game__time">${game.time}</p>
                <!-- <p class="c-game__stadion">${game.stadion}</p> -->
            </div>
            <div class="c-game__awayteam">
                <img class="c-game__logo" src="/assets/img/${game.away_team}.png" height="40" width="auto" alt="${game.away_team}">
                <h4 class="c-game__name">${game.away_team}</h4>
            </div>
            <h3 class="c-game__score--home">${game.home_goals}</h3>
            <div class="c-game__separator">-</div>
            <h3 class="c-game__score--away">${game.away_goals}</h3>

            <button class="c-game_detailsbtn" onclick="showDetails('${game.matchid}')">Details</button>
        </div>`
        });
    } else {
        console.error('Geen gegevens beschikbaar. Zorg ervoor dat de gegevens correct zijn geladen.');
    }
    games.innerHTML = inhoud;
}

// Functie om details te tonen in het dialoogvenster
let showDetails = (matchid) => {
    // Hier zou je de rest van de gegevens moeten ophalen op basis van gameId
    const game = data.matches.find(match => match.matchid === parseInt(matchid));

    console.log(game);
    if (game) {
        document.querySelector('.js-gameinfo__hometeam').innerHTML = game.home_team;
        document.querySelector('.js-gaminfo__homeimg').src = `/assets/img/${game.home_team}.png`;
        document.querySelector('.js-gaminfo__homeimg').alt = game.home_team;
        document.querySelector('.js-gameinfo__awayteam').innerHTML = game.away_team;
        document.querySelector('.js-gaminfo__awayimg').src = `/assets/img/${game.away_team}.png`;
        document.querySelector('.js-gaminfo__awayimg').alt = game.away_team;
        document.querySelector('.js-gameinfo__date').innerHTML = game.date;
        document.querySelector('.js-gameinfo__time').innerHTML = game.time;
        document.querySelector('.js-gameinfo__stadion').innerHTML = game.stadion;
        document.querySelector('.js-gameinfo__homegoals').innerHTML = game.home_goals;
        document.querySelector('.js-gameinfo__awaygoals').innerHTML = game.away_goals;

        document.body.classList.add('modal-open'); // Voeg een klasse toe om scrollen te voorkomen

        // Voeg de blur-klasse toe aan alle elementen die moeten vervagen
        const elementsToBlur = document.querySelectorAll('.blur-background');
        elementsToBlur.forEach(element => {
            element.classList.add('blur-background');
        });
        document.getElementById('myDialog').showModal();
        document.getElementById('closeBtn').addEventListener('click', function () {
            document.getElementById('myDialog').close();
            document.body.classList.remove('modal-open'); // Verwijder de klasse om scrollen weer toe te staan
        });
    } else {
        console.error('Geen gegevens beschikbaar voor gameId: ', matchid);
    }
}

// Roep loaddata aan
loaddata();

