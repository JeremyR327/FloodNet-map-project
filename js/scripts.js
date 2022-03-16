
mapboxgl.accessToken = 'pk.eyJ1IjoiamVyZW15cjMyNyIsImEiOiJja3poZzIxcGgwcG9vMm5xcnY2NmZpcmtiIn0.Psz_nx06Mc4XL7qDq1zwVg'

// lngLat for the fountain in Washington Square Park
var wspCenter = [-73.957456, 40.710831]

var theData;

var dummy_geojson = {
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

$.getJSON('./data/svi.geojson', function(rawData) {
  console.log( "Data Loaded" );
  console.log(rawData)
  theData = rawData
})

$('#reset-map').on('click', function() {
  // when this is clicked, let's fly the map to Midtown Manhattan
  map.flyTo({
    center: wspCenter,
    zoom: 9.7
  })
})


var map = new mapboxgl.Map({
  container: 'mapContainer', // HTML container id
  style: 'mapbox://styles/mapbox/dark-v9', // style URL
  center: wspCenter, // starting position as [lng, lat]
  zoom: 9.7,
  minZoom: 8,
  maxZoom: 14
});
map.addControl(new mapboxgl.NavigationControl());

map.on('load', function() {
  map.addSource('sensors', {
    type: 'geojson',
    // Use a URL for the value for the `data` property.
    data: './data/sensorLocations.geojson'
  });

  map.addSource('2020_100yr', {
    type: 'geojson',
    // Use a URL for the value for the `data` property.
    data: './data/SLR_2020s_100yr_floodplain.geojson'
  });

  map.addLayer({
    'id': '2020_100yr-fill',
    'type': 'fill',
    'source': '2020_100yr',
    'paint': {
      'fill-color': 'lightblue',
      'fill-opacity': 0.3,
      'fill-outline-color': '#ccc',
    }
  });

  map.setLayoutProperty('2020_100yr-fill', 'visibility', 'none');
  map.moveLayer('2020_100yr-fill');


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

    map.setLayoutProperty('sviTheme1-fill', 'visibility', 'none');
    map.setLayoutProperty('sviTheme2-fill', 'visibility', 'none');
    map.setLayoutProperty('sviTheme3-fill', 'visibility', 'none');
    map.setLayoutProperty('sviTheme4-fill', 'visibility', 'none');
  //

  map.on('mouseenter', 'sviTheme1-fill', function(e) {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', 'sviTheme1-fill', function(e) {
    map.getCanvas().style.cursor = '';
    popup.remove()
  });

  map.on('mouseenter', 'sviTheme2-fill', function(e) {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', 'sviTheme2-fill', function(e) {
    map.getCanvas().style.cursor = '';
    popup.remove()
  });

  map.on('mouseenter', 'sviTheme3-fill', function(e) {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', 'sviTheme3-fill', function(e) {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = '';
    popup.remove()
  });

  map.on('mouseenter', 'sviTheme4-fill', function(e) {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', 'sviTheme4-fill', function(e) {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = '';
    popup.remove()
  });

  map.addLayer({
    'id': 'sensors-circle',
    'type': 'circle',
    'source': 'sensors',
    'paint': {
      'circle-color': 'MidnightBlue',
      'circle-stroke-color': 'azure',
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
      <h4>${street}</h4>
        <p><strong>Neighborhood:</strong> ${nhood}</p>
        <p><strong>Mounted To:</strong> ${mountTo}</p>
        <p><strong>Mounted Over:</strong> ${mountOver}</p>
    `

    // Populate the popup and set its coordinates
    // based on the feature found.
    popup.setLngLat(coordinates).setHTML(popupContent).addTo(map);
  });

  var reset_highlight = function() {
    console.log('resetting!')
    map.getSource('selected-feature').setData(dummy_geojson)
    console.log(map.getSource('selected-feature'))
    $('#sidebar-content-area').empty()
  }

  $('.btn-primary').on('click', function() {
    reset_highlight()
    map.setLayoutProperty('sviTheme1-fill', 'visibility', 'none');
    map.setLayoutProperty('sviTheme2-fill', 'visibility', 'none');
    map.setLayoutProperty('sviTheme3-fill', 'visibility', 'none');
    map.setLayoutProperty('sviTheme4-fill', 'visibility', 'none');
  });

  $('#toggle-theme1').on('click', function() {
    reset_highlight()
    var visibility = map.getLayoutProperty('sviTheme1-fill', 'visibility');
    map.setLayoutProperty('sviTheme1-fill', 'visibility', 'visible');
    map.setLayoutProperty('sviTheme2-fill', 'visibility', 'none');
    map.setLayoutProperty('sviTheme3-fill', 'visibility', 'none');
    map.setLayoutProperty('sviTheme4-fill', 'visibility', 'none');
});

  $('#toggle-theme2').on('click', function() {
    reset_highlight()
    var visibility = map.getLayoutProperty('sviTheme2-fill', 'visibility');
    map.setLayoutProperty('sviTheme2-fill', 'visibility', 'visible');
    map.setLayoutProperty('sviTheme1-fill', 'visibility', 'none');
    map.setLayoutProperty('sviTheme3-fill', 'visibility', 'none');
    map.setLayoutProperty('sviTheme4-fill', 'visibility', 'none');
  });

  $('#toggle-theme3').on('click', function() {
    reset_highlight()
    var visibility = map.getLayoutProperty('sviTheme3-fill', 'visibility');
      map.setLayoutProperty('sviTheme3-fill', 'visibility', 'visible');
      map.setLayoutProperty('sviTheme1-fill', 'visibility', 'none');
      map.setLayoutProperty('sviTheme2-fill', 'visibility', 'none');
      map.setLayoutProperty('sviTheme4-fill', 'visibility', 'none');
  });

  $('#toggle-theme4').on('click', function() {
    reset_highlight()
    var visibility = map.getLayoutProperty('sviTheme4-fill', 'visibility');
      map.setLayoutProperty('sviTheme4-fill', 'visibility', 'visible');
      map.setLayoutProperty('sviTheme1-fill', 'visibility', 'none');
      map.setLayoutProperty('sviTheme2-fill', 'visibility', 'none');
      map.setLayoutProperty('sviTheme3-fill', 'visibility', 'none');
  });

  $('#2020s-btn').on('click', function() {
    var visibility = map.getLayoutProperty('2020_100yr-fill', 'visibility');
      map.setLayoutProperty('2020_100yr-fill', 'visibility', 'visible');
  });

// Highlight and Select Census Track
// initialize a source with dummy data
  map.addSource('selected-feature', {
    type: 'geojson',
    data: dummy_geojson
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

  map.addSource('hover-feature', {
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
    id: 'hover-feature-fill',
    type: 'fill',
    source: 'hover-feature',
    paint: {
      'fill-opacity': 0.5,
      'fill-color': 'navy'
    }
  });

  $(".list-group .list-group-item").click(function(e) {
   $(".list-group .list-group-item").removeClass("active");
   $(e.target).addClass("active");
  });

  $(".btn-primary").click(function(e) {
   $(".list-group .list-group-item").removeClass("active");
  });

  $(function() {
    var btn = $(".btn-primary");
    var toggled = false;
    btn.on("click", function() {
        if(!toggled)
        {
          toggled = true;
          btn.text("Hide Census Tract SVI Layers");
        } else {
          toggled = false;
          btn.text("Show Census Tract SVI Layers");
        }
    });
});

$(".btn-flood").click(function(e) {
 map.setLayoutProperty('2020_100yr-fill', 'visibility', 'none');
 $(".flood-group .btn-check").removeClass("active");
});

$(function() {
  var btn = $(".btn-flood");
  var toggled = false;
  btn.on("click", function() {
      if(!toggled)
      {
        toggled = true;
        btn.text("Hide Floodplain Layers");
      } else {
        toggled = false;
        btn.text("Show Floodplain Layers");
      }
  });
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

    var tract = featureOfInterestProperties["LOCATION"].split(',').slice(0,2)
    var pop = featureOfInterestProperties["E_TOTPOP"]
    var theme1 = featureOfInterestProperties['RPL_THEME1']
    var theme2 = featureOfInterestProperties['RPL_THEME2']
    var theme3 = featureOfInterestProperties['RPL_THEME3']
    var theme4 = featureOfInterestProperties['RPL_THEME4']

    $('#sidebar-content-area').html(`
      <h4>${tract}</h4>
      <p><strong>2010 Population:</strong> ${pop}</p>
      <p><strong>Socieconomic Status</strong>: ${theme1}</p>
      <p><strong>Household Composition & Disability:</strong> ${theme2}</p>
      <p><strong>Minority Status and Language:</strong> ${theme3}</p>
      <p><strong>Housing Type & Transportation:</strong> ${theme4}</p>
    `)

  });



})
