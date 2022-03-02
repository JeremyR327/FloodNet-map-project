//
// var LandUseLookup = (code) => {
//   switch (code) {
//     case 1:
//       return {
//         color: '#f4f455',
//         description: '1 & 2 Family',
//       };
//     case 2:
//       return {
//         color: '#f7d496',
//         description: 'Multifamily Walk-up',
//       };
//     case 3:
//       return {
//         color: '#FF9900',
//         description: 'Multifamily Elevator',
//       };
//     case 4:
//       return {
//         color: '#f7cabf',
//         description: 'Mixed Res. & Commercial',
//       };
//     case 5:
//       return {
//         color: '#ea6661',
//         description: 'Commercial & Office',
//       };
//     case 6:
//       return {
//         color: '#d36ff4',
//         description: 'Industrial & Manufacturing',
//       };
//     case 7:
//       return {
//         color: '#dac0e8',
//         description: 'Transportation & Utility',
//       };
//     case 8:
//       return {
//         color: '#5CA2D1',
//         description: 'Public Facilities & Institutions',
//       };
//     case 9:
//       return {
//         color: '#8ece7c',
//         description: 'Open Space & Outdoor Recreation',
//       };
//     case 10:
//       return {
//         color: '#bab8b6',
//         description: 'Parking Facilities',
//       };
//     case 11:
//       return {
//         color: '#5f5f60',
//         description: 'Vacant Land',
//       };
//     case 12:
//       return {
//         color: '#5f5f60',
//         description: 'Other',
//       };
//     default:
//       return {
//         color: '#5f5f60',
//         description: 'Other',
//       };
//   }
// };

mapboxgl.accessToken = 'pk.eyJ1IjoiamVyZW15cjMyNyIsImEiOiJja3poZzIxcGgwcG9vMm5xcnY2NmZpcmtiIn0.Psz_nx06Mc4XL7qDq1zwVg'

// lngLat for the fountain in Washington Square Park
var wspCenter = [-73.907456, 40.720831]

var map = new mapboxgl.Map({
  container: 'mapContainer', // HTML container id
  style: 'mapbox://styles/mapbox/dark-v9', // style URL
  center: wspCenter, // starting position as [lng, lat]
  zoom: 9.5,
  // minZoom: 9,
  // maxZoom: 14
});

map.on('load', function() {
  map.addSource('sensors', {
    type: 'geojson',
    // Use a URL for the value for the `data` property.
    data: './data/sensorLocations.geojson'
  });

  map.addSource('hightide', {
    type: 'geojson',
    // Use a URL for the value for the `data` property.
    data: './data/futurehightide.geojson'
  });

  map.addLayer({
    'id': 'hightide-fill',
    'type': 'fill',
    'source': 'hightide',
    'paint': {
      'fill-color': 'lightblue',
      'fill-opacity': 0.3,
      'fill-outline-color': '#ccc',
    }
  });
  //
  // map.setPaintProperty('nyu-study-area-fill', 'fill-color', [
  //   'match',
  //   ['get', 'LandUse'],
  //   '01', '#f4f455',
  //   '02', '#f7d496',
  //   '03', '#FF9900',
  //   '04', '#f7cabf',
  //   '05', '#ea6661',
  //   '06', '#d36ff4',
  //   '07', '#dac0e8',
  //   '08', '#5CA2D1',
  //   '09', '#8ece7c',
  //   '10', '#bab8b6',
  //   '11', '#5f5f60',
  //   '12', '#5f5f60',
  //   /* other */ '#000'
  // ]);

  map.addLayer({
    'id': 'sensors-circle',
    'type': 'circle',
    'source': 'sensors',
    'paint': {
      'circle-color': 'goldenrod',
      'circle-opacity': 0.8,
      'circle-radius': ['*', 1.1, ['number', ['get', 'mag']]],
    }
  });

  // Create a popup, but don't add it to the map yet.
  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: true
  });

  map.on('mouseenter', 'sensors-circle', function(e) {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', 'sensors-circle', function(e) {
    map.getCanvas().style.cursor = '';
    popup.remove()
  });

  map.on('mouseenter', 'sensors-circle', function(e) {
    // Change the cursor style as a UI indicator.

    // Copy coordinates array.
    const coordinates = e.features[0].geometry.coordinates.slice();
    const street = e.features[0].properties.Street;
    const nhood = e.features[0].properties.Neighbourhood;
    const mountTo = e.features[0].properties.mounted_to;
    const mountOver = e.features[0].properties.mounted_over;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    var popupContent = `
      <h2>${street}</h2>
        <p><strong>Neighborhood:</strong> ${nhood}</p>
        <p><strong>Mounted Over:</strong> ${mountTo}</p>
        <p><strong>Mounted Over:</strong> ${mountOver}</p>
    `

    // Populate the popup and set its coordinates
    // based on the feature found.
    popup.setLngLat(coordinates).setHTML(popupContent).addTo(map);
  });


})
