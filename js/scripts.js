
mapboxgl.accessToken = 'pk.eyJ1IjoiamVyZW15cjMyNyIsImEiOiJja3poZzIxcGgwcG9vMm5xcnY2NmZpcmtiIn0.Psz_nx06Mc4XL7qDq1zwVg'

// lngLat for the fountain in Washington Square Park
var wspCenter = [-73.907456, 40.720831]

var theData;

$.getJSON('./data/svi.geojson', function(rawData) {
  console.log( "Data Loaded" );
  console.log(rawData)
  theData = rawData
})



var map = new mapboxgl.Map({
  container: 'mapContainer', // HTML container id
  style: 'mapbox://styles/mapbox/dark-v9', // style URL
  center: wspCenter, // starting position as [lng, lat]
  zoom: 9.5,
  minZoom: 8,
  maxZoom: 14
});

map.on('load', function() {
  map.addSource('sensors', {
    type: 'geojson',
    // Use a URL for the value for the `data` property.
    data: './data/sensorLocations.geojson'
  });

  map.addSource('svi', {
    type: 'geojson',
    data: './data/svi.geojson'
  })

  map.addLayer({
    id: 'sviTheme1-fill',
    type: 'fill',
    source: 'svi',
    paint: {
      'fill-opacity': 0.6,
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'RPL_THEME1'],
        -999,
        'transparent',
        0,
        '#fee5d9',
        0.22,
        '#fcbba1',
        0.44,
        '#fc9272',
        0.64,
        '#fb6a4a',
        0.82,
        '#de2d26',
        1,
        '#a50f15',
      ]
    }
  });

  map.addLayer({
    id: 'sviTheme2-fill',
    type: 'fill',
    source: 'svi',
    paint: {
      'fill-opacity': 0.6,
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'RPL_THEME2'],
        -999,
        'transparent',
        0,
        '#fee5d9',
        0.16,
        '#fcbba1',
        0.35,
        '#fc9272',
        0.54,
        '#fb6a4a',
        0.76,
        '#de2d26',
        1,
        '#a50f15',
      ]
    }
  });

  map.addLayer({
    id: 'sviTheme3-fill',
    type: 'fill',
    source: 'svi',
    paint: {
      'fill-opacity': 0.6,
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'RPL_THEME3'],
        -999,
        'transparent',
        0,
        '#fee5d9',
        0.38,
        '#fcbba1',
        0.57,
        '#fc9272',
        0.73,
        '#fb6a4a',
        0.87,
        '#de2d26',
        1,
        '#a50f15',
      ]
    }
  });

  map.addLayer({
    id: 'sviTheme4-fill',
    type: 'fill',
    source: 'svi',
    paint: {
      'fill-opacity': 0.6,
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'RPL_THEME4'],
        -999,
        'transparent',
        0,
        '#fee5d9',
        0.26,
        '#fcbba1',
        0.47,
        '#fc9272',
        0.66,
        '#fb6a4a',
        0.84,
        '#de2d26',
        1,
        '#a50f15',
      ]
    }
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

    map.setLayoutProperty('sviTheme1-fill', 'visibility', 'none');
    map.setLayoutProperty('sviTheme2-fill', 'visibility', 'none');
    map.setLayoutProperty('sviTheme3-fill', 'visibility', 'none');
    map.setLayoutProperty('sviTheme4-fill', 'visibility', 'none');
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
      'circle-stroke-color': 'steelblue',
      'circle-stroke-width': 2,
      'circle-stroke-opacity': 0.6,
      'circle-opacity': 0.8,
      'circle-radius': 5,
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

  $('#toggle-theme1').on('click', function() {
    var visibility = map.getLayoutProperty('sviTheme1-fill', 'visibility');
    if (visibility === 'none') {
      map.setLayoutProperty('sviTheme1-fill', 'visibility', 'visible');
      map.setLayoutProperty('sviTheme2-fill', 'visibility', 'none');
      map.setLayoutProperty('sviTheme3-fill', 'visibility', 'none');
      map.setLayoutProperty('sviTheme4-fill', 'visibility', 'none');
    }
    else {
      map.setLayoutProperty('sviTheme1-fill', 'visibility', 'none');
    }
});

  $('#toggle-theme2').on('click', function() {
    var visibility = map.getLayoutProperty('sviTheme2-fill', 'visibility');
    if (visibility === 'none') {
      map.setLayoutProperty('sviTheme2-fill', 'visibility', 'visible');
      map.setLayoutProperty('sviTheme1-fill', 'visibility', 'none');
      map.setLayoutProperty('sviTheme3-fill', 'visibility', 'none');
      map.setLayoutProperty('sviTheme4-fill', 'visibility', 'none');
    }
    else {
      map.setLayoutProperty('sviTheme2-fill', 'visibility', 'none');
    }
  });

  $('#toggle-theme3').on('click', function() {
    var visibility = map.getLayoutProperty('sviTheme3-fill', 'visibility');
    if (visibility === 'none') {
      map.setLayoutProperty('sviTheme3-fill', 'visibility', 'visible');
      map.setLayoutProperty('sviTheme1-fill', 'visibility', 'none');
      map.setLayoutProperty('sviTheme2-fill', 'visibility', 'none');
      map.setLayoutProperty('sviTheme4-fill', 'visibility', 'none');
    }
    else {
      map.setLayoutProperty('sviTheme3-fill', 'visibility', 'none');
    }
  });

  $('#toggle-theme4').on('click', function() {
    var visibility = map.getLayoutProperty('sviTheme4-fill', 'visibility');
    if (visibility === 'none') {
      map.setLayoutProperty('sviTheme4-fill', 'visibility', 'visible');
      map.setLayoutProperty('sviTheme1-fill', 'visibility', 'none');
      map.setLayoutProperty('sviTheme2-fill', 'visibility', 'none');
      map.setLayoutProperty('sviTheme3-fill', 'visibility', 'none');
    }
    else {
      map.setLayoutProperty('sviTheme4-fill', 'visibility', 'none');
    }
  });

  $('#toggle-flood').on('click', function() {
    var visibility = map.getLayoutProperty('hightide-fill', 'visibility');
    if (visibility === 'none') {
      map.setLayoutProperty('hightide-fill', 'visibility', 'visible');
    }
    else {
      map.setLayoutProperty('hightide-fill', 'visibility', 'none');
    }
  });

// Highlight and Select Census Track
// initialize a source with dummy data
  map.addSource('selected-feature', {
    type: 'geojson',
    data: {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -13.7109375,
          34.88593094075317
        ]
      }
    }
  });

  map.addLayer({
    id: 'selected-feature-fill',
    type: 'fill',
    source: 'selected-feature',
    paint: {
      'fill-opacity': 0.5,
      'fill-color': 'yellow'
    }
  });

  map.addLayer({
    id: 'selected-feature-line',
    type: 'line',
    source: 'selected-feature',
    paint: {
      'line-color': 'gray',
      'line-width': 2,
      'line-opacity':0.5,
      'line-dasharray': [1, 1]
    }
  });


  map.on('click', function(e) {
    var features = map.queryRenderedFeatures(e.point)
    var featureOfInterestProperties = features[0].properties



    var censusTract = featureOfInterestProperties['LOCATION']
    // look up the feature in cleanData that matches this boro_cd code
    featureOfInterestGeometry = theData.features.find(function(feature) {
      return feature.properties['LOCATION'] === censusTract
    })
    console.log(theData)
    console.log('the geometry', featureOfInterestGeometry)
    // use this geometry to update the source for the selected layer
    map.getSource('selected-feature').setData(featureOfInterestGeometry)
  });

})
