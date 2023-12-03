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
                    <img src="./assets/img/${team.name}.png" alt="${team.name}">
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
            if (game.played == 1) {
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
        </div>`}

            if (game.played == 0) {
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
            <h3 class="c-game__score--home"></h3>
            <div class="c-game__separator">-</div>
            <h3 class="c-game__score--away"></h3>         
        </div>`
            }

        });
    } else {
        console.error('Geen gegevens beschikbaar. Zorg ervoor dat de gegevens correct zijn geladen.');
    }
    games.innerHTML = inhoud;
}


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


        let homescorers = game.home_scorers
        let inhoudhomescorers = ""
        for (const scorerData of homescorers) {
            const scorer = scorerData.scorer;
            const time = scorerData.time;
            console.log(`Scorer: ${scorer}, Time: ${time}`);
            inhoudhomescorers += `<div class="c-gameinfo_scorer">
            <p class="c-gameinfo__scoretime ">'${time}</p><svg xmlns="http://www.w3.org/2000/svg" class="c-gameinfo__svg" height="24" viewBox="0 -960 960 960" width="24">
                <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm200-500 54-18 16-54q-32-48-77-82.5T574-786l-54 38v56l160 112Zm-400 0 160-112v-56l-54-38q-54 17-99 51.5T210-652l16 54 54 18Zm-42 308 46-4 30-54-58-174-56-20-40 30q0 65 18 118.5T238-272Zm242 112q26 0 51-4t49-12l28-60-26-44H378l-26 44 28 60q24 8 49 12t51 4Zm-90-200h180l56-160-146-102-144 102 54 160Zm332 88q42-50 60-103.5T800-494l-40-28-56 18-58 174 30 54 46 4Z" />
            </svg>
            <p>${scorer}</p>
        </div>`
        }

        document.querySelector('.js-gameinfo__homescorers').innerHTML = inhoudhomescorers;

        let awayscorers = game.away_scorers
        let inhoudawayscorers = ""
        for (const scorerData of awayscorers) {
            const scorer = scorerData.scorer;
            const time = scorerData.time;
            console.log(`Scorer: ${scorer}, Time: ${time}`);
            inhoudawayscorers += `<div class="c-gameinfo_scorer">
            <p class="c-gameinfo__scoretime ">'${time}</p><svg xmlns="http://www.w3.org/2000/svg" class="c-gameinfo__svg" height="24" viewBox="0 -960 960 960" width="24">
                <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm200-500 54-18 16-54q-32-48-77-82.5T574-786l-54 38v56l160 112Zm-400 0 160-112v-56l-54-38q-54 17-99 51.5T210-652l16 54 54 18Zm-42 308 46-4 30-54-58-174-56-20-40 30q0 65 18 118.5T238-272Zm242 112q26 0 51-4t49-12l28-60-26-44H378l-26 44 28 60q24 8 49 12t51 4Zm-90-200h180l56-160-146-102-144 102 54 160Zm332 88q42-50 60-103.5T800-494l-40-28-56 18-58 174 30 54 46 4Z" />

            </svg>
            <p>${scorer}</p>
        </div>`

        }

        document.querySelector('.js-gameinfo__awayscorers').innerHTML = inhoudawayscorers;

        let statistics = game.statistics;
        let inhoud = '';

        for (const key in statistics) {
            if (statistics.hasOwnProperty(key)) {
                const statistic = statistics[key];
                console.log(statistic);
                homebarpercentage = statistic.home / (statistic.home + statistic.away) * 100;
                console.log(homebarpercentage);
                awaybarpercentage = 100 - homebarpercentage;
                const statLabel = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
                const barColor = (statistic.home === 0 && statistic.away === 0) ? 'gray' : '#4652af';

                inhoud += `
                    <span class="c-gamestatistics__grafiek">
                        <p class="c-gamestatistics__homewaarde">${statistic.home}</p>
                        <span class="c-gamestatistics__label">
                            <p class="js-gameinfo__statisticlabel">${statLabel}</p>
                        </span>
                        <span class="c-gamestatistics__barcontainer">
                            <span class="bar home-bar js-gameinfo__homebar" style="width: ${homebarpercentage}%; "></span>
                            <span class="bar away-bar js-gameinfo__awaybar" style="width: ${awaybarpercentage}%; background-color: ${barColor}; left: ${homebarpercentage}%; "></span>
                        </span>
                        <p class="c-gamestatistics__awaywaarde js-gameinfo__awaystatistic">${statistic.away}</p>
                    </span>
                `;
            }
        }
        document.querySelector('.js-gamestatistics').innerHTML = inhoud;




        document.body.classList.add('modal-open'); //scrollklasse


        // Voeg een animatieklasse toe bij het openen van het dialoogvenster
        const dialog = document.getElementById('myDialog');
        // dialog.classList.add('dialog-fade-in');


        setTimeout(function () {

            dialog.showModal();
        }, 300);

        setTimeout(function () {
            document.querySelectorAll('.home-bar').forEach(bar => {
                bar.classList.add('animate-homebar');
            });
        }, 300);


        // Voeg een eventlistener toe aan het sluitknop-element
        document.getElementById('closeBtn').addEventListener('click', function () {
            // Voeg een animatieklasse toe bij het sluiten van het dialoogvenster
            // dialog.classList.add('dialog-fade-out');

            // Wacht tot de animatie is voltooid en sluit dan pas het dialoogvenster
            setTimeout(function () {
                dialog.close();
                dialog.classList.remove('dialog-fade-out');
                document.body.classList.remove('modal-open'); // Verwijder de klasse om scrollen weer toe te staan
            }, 300); // Pas de duur van de animatie hier aan
            dialog.close();
            document.querySelectorAll('.home-bar').forEach(bar => {
                bar.classList.remove('animate-barHome');
            });

        });
    } else {
        console.error('Geen gegevens beschikbaar voor gameId: ', matchid);
    }
}


// Roep loaddata aan
loaddata();

