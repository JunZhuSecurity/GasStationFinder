var map;
var infowindow;
var marker=[];
var last_places_count=0;
var directionsService ="";
var directionsDisplay ="";
 
  var r_loc = {lat: 37.773972, lng: -122.431297 };
  var current_loc = {lat: 37.773972, lng: -122.431297};
  // Here the user can set their current location by changing the latitude and the longitude.

      function initMap() {
      directionsService = new google.maps.DirectionsService;
	  directionsDisplay = new google.maps.DirectionsRenderer;

        map = new google.maps.Map(document.getElementById('map'), {
          center: current_loc,
          zoom: 20
        });
		
		var service = new google.maps.places.PlacesService(map);
		infowindow = new google.maps.InfoWindow();
		  service.nearbySearch({
          location: current_loc,
          radius: 1500,
          type: ['gas_station']
        }, processResults);
		
		// Here the radius is set to 1500 so that all the gas stations within this radius will show up on the map. 

		 var input = document.getElementById('pac-input');

        var types = document.getElementById('type-selector');
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', map);
		
		 autocomplete.addListener('place_changed', function() {
          infowindow.close();
		  for(var j=0;j<last_places_count+1;j++)
		  {
		  marker[j].setVisible(false);
		  }
	var place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }
{
      map.setCenter(place.geometry.location);
     
	current_loc=place.geometry.location;
	
    }
// Here there is an autocomplete box, so that the user can type in a charectar and there will be a drop down box.

		document.getElementById('places').innerHTML ="";
		service.nearbySearch({
          location: current_loc,
          radius: 1500,
          type: ['gas_station']
        }, processResults);
		

});
      
      }

      function processResults(results, status, pagination) {
	  
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          return;
        } else {
          createMarkers(results);

          if (pagination.hasNextPage) {
            var moreButton = document.getElementById('more');

            moreButton.disabled = false;

            moreButton.addEventListener('click', function() {
              moreButton.disabled = true;
              pagination.nextPage();
            });
          }
        }
      }

      function createMarkers(places) {
        var bounds = new google.maps.LatLngBounds();
        var placesList = document.getElementById('places');

        for (var i = 0, place; place = places[i]; i++) {
		last_places_count=i;
          var image = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
          };

           marker[i] = new google.maps.Marker({
            map: map,
            icon: image,
            title: place.name,
            position: place.geometry.location
          });
		  
		  // Here im creating a marker so that wherever there is a gas station in that set radius a marker with the above charectaristics would pop up.

		  marker[i].addListener('click', function() {
		  var directionsDisplay0 = new google.maps.DirectionsRenderer;
		  directionsDisplay0.setMap(null);
  map.setZoom(18);
	
  map.setCenter(this.getPosition());
  
 var origin_place_id;
  var destination_place_id;
  var d_loc=this.getPosition();
 function oid(didfun,routingfun)
 {
  origin_place_id=r_loc;
  didfun(routingfun);

}  
  
 function did(routingfunfun)
 {destination_place_id= d_loc;
 routingfunfun();

  }
  oid(did,routing);
  function routing()
  {

route(origin_place_id, destination_place_id, google.maps.TravelMode.DRIVING);
  }

  });

          placesList.innerHTML += '<li>' + place.name + '</li>';

	google.maps.event.addListener(marker[i], 'click', function() {
   infowindow.setContent(this.title);
    infowindow.open(map,this);
	
  });
		
          bounds.extend(place.geometry.location);
        }
        map.fitBounds(bounds);
		
      }
	  
	  
	  function route(origin_place_id, destination_place_id, travel_mode) {

	 
    if (!origin_place_id || !destination_place_id) {
	
      return;
    }
	
    directionsService.route({
     
	 origin: origin_place_id,
     destination: destination_place_id,
      travelMode: travel_mode
    }, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
	
        directionsDisplay.setDirections(response);
		directionsDisplay.setMap(map);	
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }