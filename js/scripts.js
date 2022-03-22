
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

$.getJSON('./data/nta_svi.geojson', function(rawData) {
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

// Add Sensor location source

map.on('load', function() {
  map.addSource('sensors', {
    type: 'geojson',
    // Use a URL for the value for the `data` property.
    data: './data/sensorLocations.geojson'
  });

  // Add Floodplain Geojson layers

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
      'fill-color': '#add8e6',
      'fill-opacity': 0.7,
      'fill-outline-color': '#ccc',
    }
  });

  // map.addSource('2020_500yr', {
  //   type: 'geojson',
  //   // Use a URL for the value for the `data` property.
  //   data: './data/SLR_2020s_500yr_floodplain.geojson'
  // });
  //
  // map.addLayer({
  //   'id': '2020_500yr-fill',
  //   'type': 'fill',
  //   'source': '2020_500yr',
  //   'paint': {
  //     'fill-color': '#adade6',
  //     'fill-opacity': 0.7,
  //     'fill-outline-color': '#ccc',
  //   }
  // });

  map.addSource('2050_100yr', {
    type: 'geojson',
    // Use a URL for the value for the `data` property.
    data: './data/SLR_2050s_100yr_floodplain.geojson'
  });

  map.addLayer({
    'id': '2050_100yr-fill',
    'type': 'fill',
    'source': '2050_100yr',
    'paint': {
      'fill-color': '#adade6',
      'fill-opacity': 0.7,
      'fill-outline-color': '#ccc',
    }
  });



  map.setLayoutProperty('2020_100yr-fill', 'visibility', 'none');
  map.setLayoutProperty('2050_100yr-fill', 'visibility', 'none');


// Add Social Vulnerability Data Layers

let hoveredStateId = null;

  map.addSource('svi', {
    type: 'geojson',
    data: './data/nta_svi.geojson'
  })

  map.addLayer({
    id: 'sviTheme1-fill',
    type: 'fill',
    source: 'svi',
    paint: {
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'RPL_THEME1'],
        0.04,
        '#fee5d9',
        0.24,
        '#fcbba1',
        0.46,
        '#fc9272',
        0.64,
        '#fb6a4a',
        0.82,
        '#de2d26',
        1,
        '#a50f15',
      ],
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        1,
        0.6
]
    }
  }, '2020_100yr-fill');

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
        0.02,
        '#fee5d9',
        0.15,
        '#fcbba1',
        0.35,
        '#fc9272',
        0.51,
        '#fb6a4a',
        0.71,
        '#de2d26',
        0.94,
        '#a50f15',
      ]
    }
  }, '2020_100yr-fill');

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
  }, '2020_100yr-fill');

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
  },'2020_100yr-fill');

  // add sensor fill and hover layer

  map.addLayer({
    'id': 'sensors-circle',
    'type': 'circle',
    'source': 'sensors',
    'paint': {
      'circle-color': 'MidnightBlue',
      'circle-stroke-color': 'azure',
      'circle-stroke-width': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        10,
        2
],
      'circle-stroke-opacity': 0.6,
      'circle-opacity': 0.8,
      'circle-radius': 5,
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
    map.setLayoutProperty('sviTheme2-fill', 'fill-opacity', 1);
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

    let floodID = null;

    map.on('mousemove', 'sensors', function(event){

      // If quakeID for the hovered feature is not null,
      // use removeFeatureState to reset to the default behavior
      if (floodID) {
        map.removeFeatureState({
          source: 'sensors',
          id: 'sensors-circle'
        });
      }

      floodID = event.features[0].id;

      // When the mouse moves over the earthquakes-viz layer, update the
      // feature state for the feature under the mouse
      map.setFeatureState(
        {
          source: 'sensors',
          id: 'sensor-circle'
        },
        {
          hover: true
        }
      );
    });

  // Create a popup, but don't add it to the map yet.
  const hoverpopup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });

  const popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: true
  });

  map.on('mouseenter', 'sensors-circle', function(e) {
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = 'pointer'
    // Copy coordinates array.
    const coordinates = e.features[0].geometry.coordinates.slice();
    const street = e.features[0].properties.Street;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    var hoverpopupContent = `<h7><strong>${street}</strong></h7>`

    // Populate the popup and set its coordinates
    // based on the feature found.
    popup.setLngLat(coordinates).setHTML(hoverpopupContent).addTo(map);
  });

  map.on('click', 'sensors-circle', function(e) {

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
      <h5>${street}</h5>
        <p><strong>Neighborhood:</strong> ${nhood}</p>
        <p><strong>Mounted To:</strong> ${mountTo}</p>
        <p><strong>Mounted Over:</strong> ${mountOver}</p>
        <iframe src="https://floodnet-grafana.sonycproject.com/d-solo/jU-HInknk/rooftop-rig?orgId=1&refresh=5s&from=1647283686954&to=1647888486954&theme=light&panelId=2" width="100%" height="200" frameborder="0"></iframe>
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
      map.setLayoutProperty('2050_100yr-fill', 'visibility', 'none');
  });

  $('#2050s-btn').on('click', function() {
      map.setLayoutProperty('2020_100yr-fill', 'visibility', 'none');
      map.setLayoutProperty('2050_100yr-fill', 'visibility', 'visible');

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
 map.setLayoutProperty('2050_100yr-fill', 'visibility', 'none');
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

    var ntaCode = featureOfInterestProperties['ntacode']
    // look up the feature in cleanData that matches this boro_cd code
    featureOfInterestGeometry = theData.features.find(function(feature) {
      return feature.properties['ntacode'] === ntaCode
    })
    console.log(theData)
    console.log('the geometry', featureOfInterestGeometry)
    // use this geometry to update the source for the selected layer
    map.getSource('selected-feature').setData(featureOfInterestGeometry)

    var ntaname = featureOfInterestProperties["ntaname"]
    var boroname = featureOfInterestProperties["boroname"]
    var pop = featureOfInterestProperties["E_TOTPOP"]
    var theme1 = featureOfInterestProperties['RPL_THEME1']
    var theme2 = featureOfInterestProperties['RPL_THEME2']
    var theme3 = featureOfInterestProperties['RPL_THEME3']
    var theme4 = featureOfInterestProperties['RPL_THEME4']

    var pov = featureOfInterestProperties["EP_POV"]
    var unemp = featureOfInterestProperties["EP_UNEMP"]
    var pci = featureOfInterestProperties["EP_PCI"]
    var nohsdp = featureOfInterestProperties["EP_NOHSDP"]

    var visibility1 = map.getLayoutProperty('sviTheme1-fill', 'visibility');
    var visibility2 = map.getLayoutProperty('sviTheme2-fill', 'visibility');
    var visibility3 = map.getLayoutProperty('sviTheme3-fill', 'visibility');
    var visibility4 = map.getLayoutProperty('sviTheme4-fill', 'visibility');

    if (visibility1 === 'visible') {
      $('#sidebar-content-area').html(`
        <h4>${ntaname} (${boroname})</h4>
        <h7><strong>SVI Score: </strong> ${theme1}</h7>
        <p><strong>2010 Population: </strong> ${pop}</p>
        <p><strong>% Below Poverty Line: </strong>${pov}</p>
        <p><strong>Unemployment Rate: </strong>${unemp}</p>
        <p><strong>Per Capita Income: </strong>${pci}</p>
        <p><strong>$ w/o HS Degree: </strong>${nohsdp}</p>
      `);
    } else if (visibility2 === 'visible') {
      $('#sidebar-content-area').html(`
        <h4>${ntaname} (${boroname})</h4>
        <h5><strong>SVI Score:</strong> ${theme2}</h5>
        <p><strong>2010 Population:</strong> ${pop}</p>
        `);
    } else if (visibility3 === 'visible') {
      $('#sidebar-content-area').html(`
        <h4>${ntaname} (${boroname})</h4>
        <h5><strong>SVI Score:</strong> ${theme3}</h5>
        <p><strong>2010 Population:</strong> ${pop}</p>`);
    } else if (visibility4 === 'visible') {
      $('#sidebar-content-area').html(`
        <h4>${ntaname} (${boroname})</h4>
        <h5><strong> SVI Score:</strong> ${theme4}</h5>
        <p><strong>2010 Population:</strong> ${pop}</p>`)
    } else {
    }
  });
// <h5><strong>SVI Metric - Socioeconimic Status:</strong> ${theme2}</h5>
// <h5><strong>SVI Metric - Household Composition & Disability:</strong> ${theme2}</h5>
// <h5><strong>SVI Metric - Minority Status and Language:</strong> ${theme3}</h5>
// <h5><strong> SVI Metric - Housing Type & Transportation:</strong> ${theme4}</h5>

})
