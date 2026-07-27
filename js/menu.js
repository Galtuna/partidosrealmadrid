const seasons = ["2627", "2526", "2425", "2324", "2223", "2122", "2021", "1920", "1819", "1718", "1617", "1516", "1415", "1314"];
const seasonsByCategory = {
    m: seasons,
    f: ["2627", "2526", "2425", "2324"]
};

const menuConfig = [
    {
        label: { m: "Temporada", f: "Temporada" },
        page: "indexTemporada.html",
        query: "?temporada={season}&categoria={category}",
        availableIn: ["m", "f"]
    },
    {
        label: { m: "LaLiga", f: "Liga F" },
        page: "competicion.html",
        query: "?temporada={season}&competicion=liga&categoria={category}",
        availableIn: ["m", "f"],
        championsm: ["2324", "2122", "1920", "1617"],
        championsf: []
    },
    {
        label: { m: "Champions League", f: "Champions League" },
        page: "competicion.html",
        query: "?temporada={season}&competicion=cham&categoria={category}",
        availableIn: ["m", "f"],
        championsm: ["2324", "2122", "1718", "1617", "1516", "1314"],
        championsf: []
    },
    {
        label: { m: "Copa del Rey", f: "Copa de la Reina" },
        page: "competicion.html",
        query: "?temporada={season}&competicion=copa&categoria={category}",
        availableIn: ["m", "f"],
        championsm: ["2223", "1314"],
        championsf: []
    },
    {
        label: { m: "Supercopa España", f: "Supercopa España" },
        page: "competicion.html",
        query: "?temporada={season}&competicion=sces&categoria={category}",
        availableIn: ["m", "f"],
        seasonsm: ["2627", "2526", "2425", "2324", "2223", "2122", "2021", "1920", "1718", "1415"],
        seasonsf: ["2627", "2526", "2425", "2324"],
        championsm: ["2324", "2122", "1920", "1718"],
        championsf: []
    },
    {
        label: { m: "Supercopa Europa", f: "Supercopa Europa" },
        page: "competicion.html",
        query: "?temporada={season}&competicion=sceu&categoria={category}",
        availableIn: ["m"],
        seasonsm: ["2425", "2223", "1819", "1718", "1617", "1415"],
        championsm: ["2425", "2223", "1718", "1617", "1415"],
        championsf: []
    },
    {
        label: { m: "Mundialito / Copa Intercontinental", f: "Mundialito / Copa Intercontinental" },
        page: "competicion.html",
        query: "?temporada={season}&competicion=intc&categoria={category}",
        availableIn: ["m"],
        seasonsm: ["2425", "2223", "1819", "1718", "1617", "1415"],
        championsm: ["2425", "2223", "1819", "1718", "1617", "1415"],
        championsf: []
    },
    {
        label: { m: "Mundial de Clubes", f: "Mundial de Clubes" },
        page: "competicion.html",
        query: "?temporada={season}&competicion=mund&categoria={category}",
        availableIn: ["m"],
        seasonsm: ["2425"],
        championsm: [],
        championsf: []
    }
];

function buildMenuFromData() {
    const nav = document.getElementById('competitionsNav');
    if (!nav) {
        return;
    }

    const category = nav.dataset.category || "m";
    const activeMenu = menuConfig.filter((item) => item.availableIn.includes(category));
    const itemSeasons = seasonsByCategory[category] || seasons;

    activeMenu.forEach((item) => {
        const dropdown = document.createElement("div");
        dropdown.className = "competition-dropdown";

        const button = document.createElement("button");
        button.type = "button";
        button.className = "dropbtn";
        button.textContent = item.label[category] || item.label.m;
        dropdown.appendChild(button);

        const content = document.createElement("div");
        content.className = "dropdown-content";

        const seasonsForItem = item[`seasons${category}`] || itemSeasons;
        const championsForCategory = new Set(item[`champions${category}`] || []);

        seasonsForItem.forEach((season) => {
            const enlace = document.createElement("a");
            enlace.href = `${item.page}${item.query.replace("{season}", season).replace("{category}", category)}`;
            enlace.textContent = season;

            if (championsForCategory.has(season)) {
                const icon = document.createElement("img");
                icon.src = "img/ico/campeon.png";
                icon.alt = "Campeón";
                enlace.appendChild(icon);
            }

            content.appendChild(enlace);
        });

        dropdown.appendChild(content);
        nav.appendChild(dropdown);
    });
}

document.addEventListener("DOMContentLoaded", buildMenuFromData);
