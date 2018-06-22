// TEST TEST TEST //
console.log("TEST: Map will go here")
// TEST END TEST //

var mapboxAccessToken = "pk.eyJ1IjoiZHlsYnVyZ2VyIiwiYSI6ImNqaHNkZXpyYTAxdDAzcXJ6dzA3NHR5dXMifQ.oZt5CGSYffy4dZqIFSQciQ";
var myMap = L.map('map').setView([37.8, -96], 4);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    id: 'mapbox.light',
}).addTo(myMap);

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var earthquakeData = d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createMap(data.features);
  })
console.log(earthquakeData);

function createMap(earthquakeData) {

    function getColor(d) {
        return d > 5 ? 'red' :
            d > 4  ? '#FF8080' :
            d > 3  ? 'orange' :
            d > 2  ? 'yellow' :
            d > 1   ? 'lightgreen' :
            d > 0   ? 'lightblue' :
                        'cyan';
    }

    function style(feature) {
        return {
            fillColor: getColor(feature.properties.mag),
        };
    }

    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.mag + " "
        + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    L.geoJson(earthquakeData, {
        style: style,
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag*4,
                stroke: true,
                weight: 1,
                opacity: 1.5,
                fillOpacity: 0.75
            });
        }
    }).addTo(myMap);
    // L.geoJson(earthquakeData).addTo(map);
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 1, 2, 3, 4,5],
    labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
            labels.push('<li style="background:' + getColor(grades[i] + 1) + '"></li> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+'));
    }
    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    console.log(div)

    return div;
    };

    legend.addTo(myMap);

}