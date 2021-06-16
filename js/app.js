//var map = L.map('map');

var map = L.map('map', {
    zoomControl: false
});

var satellite = L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}',{
  attribution: 'Google Satellite'
}).addTo(map);

var cartodb = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
	attribution: 'Carto DB',
}).addTo(map);

// canchis
var estilocanchis = {
  'color': 'rgba(122,184,0)',
  'weight': 2
}
var canchis = L.geoJson(canchis, {
  style: estilocanchis,
  onEachFeature: function (feature,layer) {
      layer.bindTooltip('Distrito: ' + feature.properties.nombdist ,{
       permanent: true,
       direction: 'bottom',
       className: 'provinciaTooltip',
      })
}
}).addTo(map);

// color
function getColor(estados) {

  switch (estados) {
    case 'Colapsado':
      return  "#d7191c";
    case 'Incompleto':
      return "#ff7f00";
    case 'Regular':
      return "#33a02c";
    case 'Bueno':
      return "#2a82ba";
    default:
      return "white";
}
}

// Show

var Colapsado = L.geoJson(estados, {
  filter: function(feature, layer) {
    if (feature.properties.csvEstado === "Colapsado")
      return true;
  },


    pointToLayer: function (feature, latlng) {
      return new L.CircleMarker(latlng, {
          radius: 12,
          fillOpacity: 1,
          color: getColor(feature.properties.csvEstado), 
          fillColor: getColor(feature.properties.csvEstado), 
          weight: 1
        });
  }
}).addTo(map);

var Incompleto = L.geoJson(estados, {
  filter: function(feature, layer) {
    if (feature.properties.csvEstado === "Incompleto")
      return true;
  },


    pointToLayer: function (feature, latlng) {
      return new L.CircleMarker(latlng, {
          radius: 12,
          fillOpacity: 1,
          color: getColor(feature.properties.csvEstado), 
          fillColor: getColor(feature.properties.csvEstado), 
          weight: 1
        });
  }
}).addTo(map);


var Regular = L.geoJson(estados, {
  filter: function(feature, layer) {
    if (feature.properties.csvEstado === "Regular")
      return true;
  },


    pointToLayer: function (feature, latlng) {
      return new L.CircleMarker(latlng, {
          radius: 12,
          fillOpacity: 1,
          color: getColor(feature.properties.csvEstado), 
          fillColor: getColor(feature.properties.csvEstado), 
          weight: 1
        });
  }
}).addTo(map);

var Bueno = L.geoJson(estados, {
  filter: function(feature, layer) {
    if (feature.properties.csvEstado === "Bueno")
      return true;
  },


    pointToLayer: function (feature, latlng) {
      return new L.CircleMarker(latlng, {
          radius: 12,
          fillOpacity: 1,
          color: getColor(feature.properties.csvEstado), 
          fillColor: getColor(feature.properties.csvEstado), 
          weight: 1
        });
  }
}).addTo(map);

// icon
var ccppIcon = L.icon({
  iconUrl: 'images/house.svg',
  iconSize: [12,12]
});

var waterIcon = L.icon({
  iconUrl: 'images/water.svg',
  iconSize: [17,17]
});

var reserIcon = L.icon({
  iconUrl: 'images/reservorio.svg',
  iconSize: [15,15]
});

// Show
var sys_water = L.geoJson(sys, {
  
  filter: function(feature, layer) {
      if (feature.properties.descripcion === 'ccpp' || feature.properties.descripcion === 'reservorio' || feature.properties.descripcion ==='fuente')
        return true;
    },     
  pointToLayer: function (feature, latlng) {

    switch(feature.properties.descripcion) {
        case 'ccpp': return L.marker(latlng, {icon: ccppIcon}).bindPopup("<b>Nombre de Centro Poblado: </b>"+feature.properties.name, {
          autoClose:true,
        })
        break
        case 'reservorio': return L.marker(latlng, {icon: reserIcon})
        break
        case 'fuente': return L.marker(latlng, {icon: waterIcon}).bindPopup(
          "<b>Nombre de Fuente: </b>"+feature.properties.name+"</b><br>"+"<b>Codigo de Sistema: </b>"+feature.properties.Sistema_Codigo + 
          "</b><br>"+"<b>Reporte: </b>" +  '<a href=' + feature.properties.info + '>Clic Reporte!!!</a>', {
          autoClose:true
        })
        break      
        }
    }  
}).addTo(map)




// extend
map.fitBounds(canchis.getBounds());

// Zoom
L.control.zoom({
    position:'topright'
}).addTo(map);

var searchControl = new L.Control.Search({
  layer: sys_water,
  propertyName: 'Sistema_Codigo',
  circleLocation: true
});

searchControl.on('search_locationfound', function(e) {
  e.layer.setStyle({fillColor: '#3f0', color: '#0f0'});
})

map.addControl(searchControl);
// Layer Control
var baseMaps = {
  "Mapa Base - Satelital": satellite,
  "Mapa Base - CartoDB": cartodb
  
};
var overlayMaps = {
  "Canchis": canchis,
  "Sistema de Saneamiento Basico": sys_water,
  "Estado Colapsado": Colapsado,
  "Estado Incompleto":Incompleto,
  "Estado Regular":Regular,
  "Estado Bueno":Bueno

};

var control = L.control.layers(baseMaps,overlayMaps, {
  collapsed: true,
}).addTo(map);

// search bar
var searchControl = new L.esri.Controls.Geosearch({position:'topright'}).addTo(map);

var results = new L.LayerGroup().addTo(map);

searchControl.on('results', function(data){
  results.clearLayers();
  for (var i = data.results.length - 1; i >= 0; i--) {

    results.addLayer(L.marker(data.results[i].latlng));
  }
});

// Medicion
L.control.polylineMeasure({
    position:'topright'
}).addTo(map);

// Coordenadas
L.control.mousePosition({
    position:'bottomright'
}).addTo(map);

// user
map.pm.addControls({

  position: 'topright',
  drawCircle: false,
  drawRectangle: false,
  drawCircleMarker: false,
  cutPolygon: false,
  dragMode: false,
  editMode:false,
  oneBlock:true,
  rotateMode: false

});

/*
// zoom controlado
map.on('zoomend', function() {
  if (map.getZoom() <11){
          map.removeLayer(sys_water);
          map.removeLayer(satellite);
  }
  else {
          map.addLayer(sys_water);
          map.addLayer(satellite);
      }
});
*/

