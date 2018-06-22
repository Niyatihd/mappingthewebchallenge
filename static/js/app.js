// TEST TEST TEST //
console.log("TEST: Map will go here")
// TEST END TEST //

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createMarkers(data.features);
  

  console.log("created")
})

function createMarkers(earthquakeData) {
    
    // // Define arrays to hold created city and state markers
    // var magMarkers = [];

    // // Loop through locations and create city and state markers
    // for (var i = 0; i < earthquakeData.length; i++) {
    //     // Setting the marker radius for the state by passing population into the markerSize function
    //     magMarkers.push(
    //         L.circle(earthquakeData[i].geometry.coordinates, {
    //         stroke: false,
    //         fillOpacity: 0.75,
    //         color: "white",
    //         fillColor: "white",
    //         radius: markerSize(earthquakeData[i].properties.mag),
    //         })
    //     );
    // }
    // console.log(magMarkers)

    // // Function to determine marker size based on population
    // function markerSize(magValue) {
    //     return magValue * 1000;
    // }
        
    

    // Define variables for our base layers
    var streetmap = L.tileLayer(
        "https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
        "access_token=pk.eyJ1IjoiZHlsYnVyZ2VyIiwiYSI6ImNqaHNkZXpyYTAxdDAzcXJ6dzA3NHR5dXMifQ.oZt5CGSYffy4dZqIFSQciQ"
    );
    var darkmap = L.tileLayer(
        "https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
        "access_token=pk.eyJ1IjoiZHlsYnVyZ2VyIiwiYSI6ImNqaHNkZXpyYTAxdDAzcXJ6dzA3NHR5dXMifQ.oZt5CGSYffy4dZqIFSQciQ"
    );
    
    // Create two separate layer groups: one for cities and one for states
    // var mag = L.layerGroup(magMarkers);

    // Create a baseMaps object
    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
    };
    
    // Create an overlay object
    // var overlayMaps = {
    //     "magnitude": mag,
    // };  
    
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.mag + " "
        + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
      }



// Define a map object
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetmap]
    });

    function getColor(d) {
        return d > 5 ? 'red' :
               d > 4  ? '#FF8080' :
               d > 3  ? 'orange' :
               d > 2  ? 'yellow' :
               d > 1   ? 'lightgreen' :
               d > 0   ? 'lightblue' :
            //    d > 10   ? '#FED976' :
                          'cyan';
    }

    function style(feature) {
        return {
            fillColor: getColor(feature.properties.mag),
            // weight: 2,
            // opacity: 1,
            // color: 'white',
            // dashArray: '3',
            // fillOpacity: 0.7
        };
    }

    L.geoJson(earthquakeData, {
        style: style,
        // style: function(feature) {
        //     var mag = feature.properties.mag;
        //     if (mag >= 5.0) {
        //       return { color: "red" }; 
        //     } 
        //     else if (mag >= 4.0) {
        //       return { color: "#FF8080" };
        //     } 
        //     else if (mag >= 3.0) {
        //       return { color: "orange" };
        //     } 
        //     else if (mag >= 2.0) {
        //         return { color: "yellow" };
        //       } 
        //     else {
        //       return { color: "lightgreen" };
        //     }
        //   },
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag*4,
                stroke: true,
                // fillColor: "#ff7800",
                // color: "black",
                weight: 1,
                opacity: 1.5,
                fillOpacity: 0.75
            });
        }
    }).addTo(myMap);  
    
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5,],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);



}
