// Application des conventions de marges pour D3.
var margin = {top: 20, right: 20, bottom: 20, left: 20};

var width = 450 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// Données à afficher.
bleu = [86, 51, 42, 29, 89, 56, 73, 37, 81, 57, 54, 74, 72, 85, 56, 60, 72,
        75, 57, 89, 53, 77, 97, 77, 60, 86, 86, 60, 53, 77, 74, 50, 64, 90,
        51, 90, 73, 86, 55, 74, 64, 57, 75, 66, 58, 79, 55, 65, 62, 68, 20,
        50, 82, 76, 79, 71, 63, 78, 69, 76, 53, 91, 92, 83, 47, 72, 91, 80,
        51, 71, 64, 75, 78, 49, 92, 52, 82, 78, 57, 41, 28];
rouge = [56, 77, 74, 50, 64, 90, 51, 90, 67, 98, 100, 54, 65];
vert = [62, 68, 50, 11, 63, 18, 69, 16, 53];

// Fonction pour calculer les statistiques d'un diagramme de boîte.
function calculerStatistiques(donnees) {
    donnees.sort(d3.ascending);
    const q1 = d3.quantile(donnees, 0.25);
    const mediane = d3.quantile(donnees, 0.5);
    const q3 = d3.quantile(donnees, 0.75);
    const iqr = q3 - q1; // Intervalle interquartile
    const min = Math.max(d3.min(donnees), q1 - 1.5 * iqr); // Min avec limite de moustache
    const max = Math.min(d3.max(donnees), q3 + 1.5 * iqr); // Max avec limite de moustache
    console.log({min, q1, mediane, q3, max})
    return {min, q1, mediane, q3, max};
}

// Fonction pour dessiner un diagramme de boîte (box plot).
function moustache(svg, donnees, y, h, strokeC, fillC, x) {
    const stats = calculerStatistiques(donnees);

    // Dessiner la boîte (Q1 à Q3)
    svg.append("rect")
        .attr("x", x(stats.q1))
        .attr("y", y - h / 2)
        .attr("width", x(stats.q3) - x(stats.q1))
        .attr("height", h)
        .attr("stroke", strokeC)
        .attr("fill", fillC);

    // Ligne médiane
    svg.append("line")
        .attr("x1", x(stats.mediane))
        .attr("x2", x(stats.mediane))
        .attr("y1", y - h / 2)
        .attr("y2", y + h / 2)
        .attr("stroke", strokeC);

    // Ligne des moustaches (min à max)
    svg.append("line")
        .attr("x1", x(stats.min))
        .attr("x2", x(stats.max))
        .attr("y1", y)
        .attr("y2", y)
        .attr("stroke", strokeC);

    // Caps des moustaches (traits verticaux aux extrémités)
    svg.append("line")
        .attr("x1", x(stats.min))
        .attr("x2", x(stats.min))
        .attr("y1", y - h / 4)
        .attr("y2", y + h / 4)
        .attr("stroke", strokeC);

    svg.append("line")
        .attr("x1", x(stats.max))
        .attr("x2", x(stats.max))
        .attr("y1", y - h / 4)
        .attr("y2", y + h / 4)
        .attr("stroke", strokeC);
}

// Créer la visualisation lorsque la page est chargée
function myfct () {
    // Mettre en place la surface de dessin
    const svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Définir la fonction d'échelle pour l'axe des x
    const x = d3.scaleLinear()
        .domain([0, 100]) // Domaine basé sur les données (0 à 100)
        .range([0, width]); // Plage de pixels

    // Ajouter l'axe des x
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    // Afficher les diagrammes de boîte pour chaque jeu de données
    moustache(svg, bleu, 50, 30, "blue", "lightblue", x);
    moustache(svg, vert, 130, 30, "green", "lightgreen", x);
    moustache(svg, rouge, 210, 30, "red", "pink", x);
};


d3.select(window).on("load", myfct)