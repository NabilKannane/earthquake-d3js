let Mydiv = document.getElementById("map")

const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';

async function fetchData() {
    try {
      const response = await fetch(url); 
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async function processedData(features) {
    return features
      .map(feature => {

        // Convert magnitude and depth data from strings to numbers
        const magnitude = parseFloat(feature.properties.mag);
        const depth = parseFloat(feature.geometry.coordinates[2]);
  
        // Return processed feature with necessary attributes
        return {
          id: feature.id,
          magnitude,
          depth,
          place: feature.properties.place,
          time: new Date(feature.properties.time),
          coordinates: feature.geometry.coordinates,
        };
      })
      .filter(feature => !isNaN(feature.magnitude) && !isNaN(feature.depth));
  }
  

  async function loadAndProcess() {
    const data = await fetchData();
    const process = await processedData(data.features);
    console.log(process);
    return process;
  }

  // Map visualisation 
  const map = L.map('map').setView([31.110094, -8.37], 5);

        // Add a street view layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);

// Function to get color based on depth
function getColor(depth) {
    if (depth > 90) return 'rgb(255,13,13)';
    else if (depth > 70) return 'rgb(255,78,17)';
    else if (depth > 50) return 'rgb(255,142,21)';
    else if (depth > 30) return 'rgb(250,183,51)';
    else if (depth > 10) return 'rgb(172,179,52)';
    else return 'rgb(105,179,76)';
}


async function visualizeData(features) {
  features.forEach(feature => {
    const magnitude = feature.magnitude;
    const depth = feature.depth;
    const coordinates = feature.coordinates;

    // Définir un rayon proportionnel à la magnitude (en mètres)
    const radius = Math.max(5000, magnitude * 10000); // Rayon minimum : 5000 mètres

    // Créer un marqueur circulaire
    const circle = L.circle([coordinates[1], coordinates[0]], {
        color: getColor(depth),
        fillColor: getColor(depth),
        fillOpacity: 0.6,
        radius: radius // Rayon en mètres
    }).addTo(map);

    // Ajouter un popup avec les détails
    circle.bindPopup(`
        <strong>Location:</strong> ${feature.place}<br>
        <strong>Magnitude:</strong> ${magnitude}<br>
        <strong>Depth:</strong> ${depth} km<br>
        <strong>Time:</strong> ${feature.time.toLocaleString()}
    `);
});

}

// Fonction pour ajouter une légende
function addLegend() {
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'legend');
        const depths = [-10, 10, 30, 50, 70, 90];
        const labels = ['-10 – 10', '10 – 30', '30 – 50', '50 – 70', '70 – 90', '90+'];

        div.innerHTML += '<strong>Depth</strong><br>';
        for (let i = 0; i < depths.length; i++) {
            const color = getColor(depths[i]); // Utiliser la fonction getColor pour obtenir la couleur
            div.innerHTML += `
                <i style="background: ${color}; width: 18px; height: 18px; display: inline-block; margin-right: 5px;"></i>
                ${labels[i]}<br>
            `;
        }
        return div;
    };

    legend.addTo(map);
}



addLegend();

loadAndProcess().then(visualizeData);

