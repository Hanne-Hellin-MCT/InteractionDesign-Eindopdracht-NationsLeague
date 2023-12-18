let data;
let teamnames = document.querySelector('.js-teamnames');
let players = document.querySelector('.js-players');
let games = document.querySelector('.js-games');
const $legendEl = document.querySelector(`.js-legend`);
const $chartEl = document.querySelector(`.js-chart`);

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
        showRanking();


    } catch (error) {
        console.error('Er is een fout opgetreden bij het laden van de gegevens:', error);
    }
}

let showTeams = () => {
    inhoud = '';
    // Controleer of data niet leeg is
    if (data) {
        data.teams.forEach(team => {
            renderLegendAndChart(team.name);
            console.log(team.name);
            inhoud += `<button class="c-team o-button-reset " onclick="toggleTeam(this, '${team.name}')" >
                <div class="c-team__logo">
                    <img src="./assets/img/${team.name}.png" alt="${team.name}">
                </div>
                <h3 class="c-team__name">${team.name}</h3>
            </button>`
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

    // Als geen enkel team actief is, verwijder de spelers met animatie
    if (!document.querySelector('.c-team--active')) {
        console.log('Geen enkel team actief');
        players.classList.add('o-hide-accessible');
        players.classList.add('inactive');
    } else {
        // Als een team actief is, toon de spelers met animatie
        players.classList.remove('o-hide-accessible');
        players.classList.remove('inactive');
    }
};


let showPlayers = (teamName) => {
    // Zoek het team in de JSON-gegevens
    const team = data.teams.find((t) => t.name === teamName);

    if (team) {
        console.log(`Spelers van team ${teamName}:`);
        // Loop door de spelers van het gevonden team
        updatePaths(teamName);
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


const showcards = (teamName) => {
    team = data.teams.find(team => team.name === teamName);
    document.querySelector('.js-stands_yellowcard').innerHTML = team.stands.yellow_cards;
    document.querySelector('.js-stands_redcard').innerHTML = team.stands.red_cards;
}

const renderLegend = (legendData) => {
    console.log("standen");
    $legendEl.innerHTML = ``;
    $legendEl.innerHTML += `<ul class="legend c-stands__legend "></ul>`;
    const $legend = document.querySelector(`.legend`);

    console.log(legendData);

    $legend.innerHTML += legendData.map(({ key, value, color }) => {
        return `<li class="legend__item"><span class="legend__key">${key}</span><span class="legend__item__color" style="background-color:var(${color});"></span>
        <span class="legend__value">${value}</li>`;
    }).join(``);
}

const cos = Math.cos;
const sin = Math.sin;
const π = Math.PI;

const f_matrix_times = (([[a, b], [c, d]], [x, y]) => [a * x + b * y, c * x + d * y]);
const f_rotate_matrix = (x => [[cos(x), -sin(x)], [sin(x), cos(x)]]);
const f_vec_add = (([a1, a2], [b1, b2]) => [a1 + b1, a2 + b2]);

const drawArc = (([cx, cy], [rx, ry], [t1, Δ], φ,) => {
    // convert t1 from degree to radian
    t1 = t1 / 360 * 2 * π;
    // convert Δ from degree to radian
    Δ = Δ / 360 * 2 * π;
    Δ = Δ % (2 * π);
    // convert φ from degree to radian
    φ = φ / 360 * 2 * π;
    const rotMatrix = f_rotate_matrix(φ);
    const [sX, sY] = (f_vec_add(f_matrix_times(rotMatrix, [rx * cos(t1), ry * sin(t1)]), [cx, cy]));
    const [eX, eY] = (f_vec_add(f_matrix_times(rotMatrix, [rx * cos(t1 + Δ), ry * sin(t1 + Δ)]), [cx, cy]));
    const fA = ((Δ > π) ? 1 : 0);
    const fS = ((Δ > 0) ? 1 : 0);
    const d = `M ${sX} ${sY} A ${[rx, ry, φ / (2 * π) * 360, fA, fS, eX, eY].join(" ")}`;
    return d;
});


const renderChart = (teamName, legendData) => {
    const $svg = document.createElementNS(`http://www.w3.org/2000/svg`, `svg`);
    $svg.setAttribute(`width`, `100%`);
    $svg.setAttribute(`height`, `100%`);
    $svg.setAttribute(`viewBox`, `0 0 400 200`);
    $svg.setAttribute(`fill`, `none`);
    $svg.classList.add(`chart`);

    // Remove existing chart if any
    const existingChart = document.querySelector('.chart');
    if (existingChart) {
        existingChart.remove();
    }

    console.log(`Render chart for ${teamName}`)
    console.log(legendData)

    $chartEl.appendChild($svg);

    legendData.forEach((item, i) => {
        const { key, color, value } = item;
        console.log(`Setting color for ${key} to: ${color} and the value ${value}`);
        const $path = document.createElementNS(`http://www.w3.org/2000/svg`, `path`);
        $path.setAttribute(`class`, `chart__path`);
        $path.setAttribute(`stroke-width`, 30);
        $path.style.setProperty(`--strokeColor`, `var(${color})`);
        $path.setAttribute(`id`, `chart__path--${key}`);

        $path.setAttribute(`d`, drawArc([200, 200], [175, 175], [180, 180], 0));

        $svg.insertBefore($path, $svg.firstChild);
    });
}

const updatePaths = (teamName) => {
    const team = data.teams.find(team => team.name === teamName);
    const { won, draw, lost } = team.stands;
    const legendData = [
        { key: "Won", value: won, color: "--global-color-primary-700" },
        { key: "Draw", value: draw, color: "--global-color-primary-500" },
        { key: "Lost", value: lost, color: "--global-color-primary-300" }
    ];
    $legendEl.innerHTML = ``;
    $legendEl.innerHTML += `<ul class="legend c-stands__legend "></ul>`;
    const $legend = document.querySelector(`.legend`);

    console.log(legendData);

    $legend.innerHTML += legendData.map(({ key, value, color }) => {
        return `<li class="legend__item"><span class="legend__key">${key}</span><span class="legend__item__color" style="background-color:var(${color});"></span>
        <span class="legend__value">${value}</li>`;
    }).join(``);



    document.querySelector('.js-stands_yellowcard').innerHTML = team.stands.yellow_cards;
    document.querySelector('.js-stands_redcard').innerHTML = team.stands.red_cards;

    const $paths = document.querySelectorAll('.chart__path');
    const totalValue = legendData.reduce((total, { value }) => total + value, 0);
    let totalOffset = 0;
    $paths.forEach(($path, i) => {
        const length = $path.getTotalLength();
        const gap = 0;

        $path.setAttribute('pathLength', length);
        $path.style.setProperty('--path-length', length);

        const legendItem = legendData[i];
        if (legendItem) {
            const { value, color } = legendItem;
            const percentage = (value / totalValue);
            const dasharray = length * percentage;

            $path.style.setProperty('--stroke-dasharray', dasharray);
            $path.style.setProperty('--stroke-dashoffset', totalOffset * -1);
            $path.style.setProperty(`--strokeColor`, `var(${color})`);

            totalOffset += dasharray + gap;
        }
    });
};


const renderLegendAndChart = (teamName) => {
    const team = data.teams.find(team => team.name === teamName);

    if (!team) {
        console.error(`Team not found: ${teamName}`);
        return;
    }

    const { won, draw, lost } = team.stands;

    const legendData = [
        { key: "Won", value: won, color: "--global-color-primary-700" },
        { key: "Draw", value: draw, color: "--global-color-primary-500" },
        { key: "Lost", value: lost, color: "--global-color-primary-500" }
    ];

    // Remove existing legend if any
    const existingLegend = document.querySelector('.legend');
    if (existingLegend) {
        existingLegend.remove();
    }

    renderLegend(legendData);
    renderChart(teamName, legendData);
    showcards(teamName);
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

            <button class="c-game__detailsbtn"  tabindex="0" onclick="showDetails('${game.matchid}')">Details</button>
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



const showRanking = () => {
    rankingdata = []
    data.teams.forEach(team => {
        console.log(team.stands);
        let points = team.stands.won * 3 + team.stands.draw;
        let goaldifference = team.stands.goals_for - team.stands.goals_against;
        rankingdata.push({ teamname: team.name, stands: team.stands, points: points, goaldifference: goaldifference });
    });
    rankingdata.sort(function (a, b) {
        // Eerst sorteren op meeste punten (points)
        if (b.points !== a.points) {
            return b.points - a.points;
        }
        // Als punten gelijk zijn, sorteer op hoogste doelsaldo (goaldifference)
        return b.goaldifference - a.goaldifference;
    });
    console.log(rankingdata);

    const rankingContainer = document.querySelector('.c-ranking');

    rankingdata.forEach((team, i) => {
        const teamElement = document.createElement('div');
        teamElement.classList.add('c-ranking__teams');

        teamElement.innerHTML = `
        <div class="c-ranking__teamname">
        <h3 class="c-ranking__position">${i + 1}</h3>
        <div class="c-ranking__logo">
        <img src="/assets/img/${team.teamname}.png" alt="">
        </div>
        <h3 class="c-ranking__name">${team.teamname}</h3>
        </div>
        <p class="c-ranking__played ">${team.stands.played}</p>
        <p class="c-ranking__won ">${team.stands.won}</p>
        <p class="c-ranking__draw ">${team.stands.draw}</p>
        <p class="c-ranking__lost ">${team.stands.lost}</p>
        <p class="c-ranking__goalsfor" >${team.stands.goals_for}</p>
        <p class="c-ranking__goalsagainst">${team.stands.goals_against}</p>
        <p class="c-ranking__goalsdifference">${team.goaldifference}</p>
        <p class="c-ranking__points ">${team.points}</p>
        `;

        rankingContainer.appendChild(teamElement);

        if (i === 0) {
            teamElement.classList.add('c-ranking__teams--first');
        }


    });

};




// document.addEventListener("DOMContentLoaded", function () {
//     setTimeout(function () {
//         document.querySelector('.c-overlay').addEventListener('mouseover', function () {
//             var overlay = document.querySelector('.c-overlay');
//             overlay.classList.add('slide-out');
//             document.querySelector('.js-pagina').classList.add('slide-in');


//         });
//     }, 2000);
//     setTimeout(function () {
//         var overlay = document.querySelector('.c-overlay');
//         overlay.classList.add('slide-out');
//     }, 5000);


//     // Voeg een event listener toe voor de hover-interactie

// });



// Roep loaddata aan
loaddata();
