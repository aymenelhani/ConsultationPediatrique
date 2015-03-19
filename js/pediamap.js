var selectedCircleRadius="Tarif";
var selectedCircleColor="Dlai_rendez_vous";
var limiteVilleLayer = new L.featureGroup();
var defaultColor = colorbrewer.Pastel2[5];
var colorScale = d3.scale.quantize().range(defaultColor).domain([0,60])


limiteVilleLayer.on('click', function(evt) { 
deleteLimiteLayer()
     })		

		//Instanciation de l'objet map
		var map = L.map('map', {
			//layers: [ign, cassini_routes,cassini_urbain,cassini_hydro_l,cassini_hydro_s],
			fullscreenControl: true,
			fullscreenControlOptions: { // optional
			title:"Fullscreen !"
			}
		});

		//définition de l'emprise initiale de la map
		map.setView([48.75, 2], 8);

		//Ajout Layer Fond de plan OSM
		var mapbox = L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="http://mapbox.com">Mapbox</a>',
			id: 'examples.map-i875mjb7'
		});
		mapbox.addTo(map);

		//Ajout du fond OSM
		var osm = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
		osm.addTo(map);
	
	
 

		// detect fullscreen toggling
		map.on('enterFullscreen', function(){
			if(window.console) window.console.log('enterFullscreen');
		});
		map.on('exitFullscreen', function(){
			if(window.console) window.console.log('exitFullscreen');
		});


		var allLimiteVilleLayer = new L.featureGroup();
		d3.csv("data/donneFinal.csv",function(data){
			 
			data.forEach(function(elem,index,tab){
				
		 $.get("https://nominatim.openstreetmap.org/search.php?q="+elem.Ville+"&format=json&polygon_geojson=1",
	function(data){
		if(data[0] != undefined){	
		 
var states = [{
    "type": "Feature",
    "properties": {"party": "Republican"},
    "geometry": {
        "type": "Polygon",
        "coordinates": data[0].geojson.coordinates
         
    }
}];


 
 allLimiteVilleLayer.addLayer(L.geoJson(states, {
    style: {
    color: "#d1f2f1",
    weight: 2,
    opacity: 0.9
}
}));
}
 
	});//get		
   
			})			

		});//csv

		//défintion des layers pour le contrôleur de couches

		var baseLayers = {
			"OSM":osm,
			"OSM MapBox":mapbox		

		};


		var overlays = {
			"Limite admin": allLimiteVilleLayer
		
		};

		//controleur de couches
		L.control.layers(baseLayers, overlays).addTo(map);

		//Ajout de l'échelle
		L.control.scale().addTo(map);

		//Ajout Geocoder
       // var osmGeocoder = new L.Control.OSMGeocoder();
		//map.addControl(osmGeocoder);		
	

		//ajout des titres et sous-titres
		/*var title = new L.Control();
		title.onAdd = function (map) {
			this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
			this.update();
			return this._div;
	    };
	    title.update = function () {
			this._div.innerHTML = '<h2>Les transports en <br> Ile-de-France </h2>2014<br><center><img src="img/stif_logo.png" /><br><img src="img/sncf_logo.png" /><br><img src="img/autolib_logo.png" /></center>'
		};
		title.addTo(map);	*/	


		var circles = new L.featureGroup();
		circles.on("layeradd",function(evt){
			console.log("add layer added");  

		})
		.on("layerremove",function(evt){
			console.log("add layer added");	

		})
		.on('click', function(evt) { 
circles.bindPopup(evt.layer.tarif)
deleteLimiteLayer()
drawLimiteVille(evt.layer.ville)
     })		 
		.on("mouseout",function(){
    	console.log("mouse out circle");    	

    })
    .on('mouseover',function(event){					  
				 console.log( event.layer.tarif)
				
				})
    
function drawCircles(){
	d3.csv("data/donneFinal.csv",function(data){
			console.log(data);
			data.forEach(function(elem,index,tab){
				
				if( (elem.lat && elem.lon) != "NaN")
			 var circle = new L.circle([+elem.lat,+elem.lon],+elem.Tarif*30)
			.setStyle({fill:true, fillColor: colorScale(+elem.Dlai_rendez_vous), fillOpacity:0.6});	
			
            console.log(index,circle);
            if(circle != undefined){
            	circle.tarif = elem.Tarif; 
            	circle.ville = elem.Ville;  
                   
            	circles.addLayer(circle);
            }			
   
			})
			console.log("for each terminé");	  

			circles.addTo(map);

		});//csv
}

drawCircles();

var legend = L.control({position: 'bottomleft'});

		// fonction de creation de la légende
		legend.onAdd = function (map) {
    		var div = L.DomUtil.create('div', 'info legend'),
        		grades = [0,12,15,16,17,18,19,20],
        		labels = [];
			div.innerHTML += '<h4>Tarif </h4><i style="background:#aaa"></i> inconnu<br>';   			

    for(i=0;i<defaultColor.length;i++){
 var bornes=colorScale.invertExtent(defaultColor[i])
 div.innerHTML+="<li> <span style='color:"+defaultColor[i]+";font-size:1.5em'>&#9632;</span> [" + d3.round(bornes[0],1)+", "+ d3.round(bornes[1],1)+"]</li>"
}
div.innerHTML+="</ul>"

    		return div;
		};
		legend.addTo(map);

	
 //onselect event pour le choix de variable représenté par le rayon des cercles
function updateRadius(value){
console.log("update rayon")
selectedCircleRadius = value;

circles.clearLayers();

d3.csv("data/donneFinal.csv",function(data){			
			data.forEach(function(elem,index,tab){
				
				if( (elem.lat && elem.lon) != "NaN")
			 var circle = new L.circle([+elem.lat,+elem.lon],+elem[value]*30)
			.setStyle({fill:true, fillColor: colorScale(+elem[selectedCircleColor]), fillOpacity:0.6});	
			
            console.log(index,circle);
            if(circle != undefined){
            	circle.tarif = elem.Tarif; 
            	circle.ville = elem.Ville;             	

            	circles.addLayer(circle);
            }			
   
			})
			console.log("for each terminé");
			  
			circles.addTo(map);

		}); 

}

//onselect event pour le choix de variable représenté par la couleur
function updateColor(value){
	console.log("update color")

selectedCircleColor = value;

circles.clearLayers();

d3.csv("data/donneFinal.csv",function(data){			
			data.forEach(function(elem,index,tab){
				
				if( (elem.lat && elem.lon) != "NaN")
			 var circle = new L.circle([+elem.lat,+elem.lon],+elem[selectedCircleRadius]*30)
			.setStyle({fill:true, fillColor: colorScale(+elem[value]), fillOpacity:0.6});	
			
            console.log(index,circle);
            if(circle != undefined){
            	circle.tarif = elem.Tarif;
            	circle.ville = elem.Ville;         	
            	circles.addLayer(circle);
            }
			
   
			})
			console.log("for each terminé");
			  circles.addTo(map);

		});

}


function drawLimiteVille(ville){	
	$.get("https://nominatim.openstreetmap.org/search.php?q="+ville+"&format=json&polygon_geojson=1",
	function(data){
	if(data[0] != undefined){		
var states = [{
    "type": "Feature",
    "properties": {"party": "Republican"},
    "geometry": {
        "type": "Polygon",
        "coordinates": data[0].geojson.coordinates
         
    }
}];
 
 limiteVilleLayer.addLayer(L.geoJson(states, {
    style: {
    color: "#ff7800",
    weight: 2,
    opacity: 0.7
}
}));
 }
 limiteVilleLayer.addTo(map);

	});//get
 
	 
}

function deleteLimiteLayer(){
	limiteVilleLayer.clearLayers();

}