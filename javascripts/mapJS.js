  var map;
  var infowindow;
  var marker=[];
  var last_places_count=0;
  var directionsService ="";
  var directionsDisplay ="";

/* instance variable for referencing place of origin; */
  var r_loc ;

  /* main callback function */

  function initLocate(){

    /* prompt user a confirmation that he wants to share his/her location or not*/
    var confirmation = confirm("Press OK to share your location.");

    if(confirmation == true){

        /* if user shares his location than check browser supports geolocation feature or not */
        if(navigator.geolocation){
          /* check wheteher browser supports geolocation feature or not
             and if it is then load browser with user's current location using html geolocation feature.
           */
           navigator.geolocation.getCurrentPosition(function(p){

             var LatLng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);
             r_loc =LatLng;
             initMap(LatLng);
           });
        }
        else{
            alert("geolocation is not supported in this browser.");

            /* set default location */
            var default_loc = {lat: 37.773972, lng: -122.431297};

            /* set place of origin to default location */
            r_loc = default_loc;
            initMap(default_loc);
        }
    }
    else{
      /* otherwise set default location */
      var default_loc = {lat: 37.773972, lng: -122.431297};

      /* set place of origin to default location */
      r_loc =default_loc;
      initMap(default_loc);
    }
  }


  /* function to initialize google map */
  function initMap(current_loc) {

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
            radius: 1500,         // Here the radius is set to 1500 so that all the gas stations within this radius will show up on the map.
            type: ['gas_station']
      }, processResults);         // callback function to process response


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
      }else
      {
          map.setCenter(place.geometry.location);
          current_loc=place.geometry.location;
          r_loc = current_loc; // set location of origin

      }

      // Here there is an autocomplete box, so that the user can type in a charactar and there will be a drop down box.

      document.getElementById('places').innerHTML ="";
      service.nearbySearch({
              location: current_loc,
              radius: 1500,
              type: ['gas_station']
      }, processResults);// callback function to process response

      });

  }

  /* function for processing query results */
  function processResults(results, status, pagination) {

    if (status !== google.maps.places.PlacesServiceStatus.OK) {
        return;
    } else {
        createMarkers(results);  // function to draw markers on google map

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

 /* function to create markers on map */
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

          /* Here im creating a marker
             so that wherever there is a gas station in that set radius
             a marker with the above charectaristics would pop up. */

          marker[i] = new google.maps.Marker({
                map: map,
                icon: image,
                title: place.name,
                info: place.vicinity,
                position: place.geometry.location
          });


          /* add click listner */
    	  marker[i].addListener('click', function() {

              var directionsDisplay0 = new google.maps.DirectionsRenderer;
              directionsDisplay0.setMap(null);
              map.setZoom(18);

              map.setCenter(this.getPosition());

              var d_loc=this.getPosition();
              var origin_place_id=r_loc;
              var destination_place_id=d_loc;

              route(origin_place_id,destination_place_id,google.maps.TravelMode.DRIVING); // call function to show direction

        });

        /* append list element in place bar */
        placesList.innerHTML += '<li><div>' + place.name +'</div>'+'<div><font color=blue><b>Proximity</b>:&nbsp;' + place.vicinity + '</font></div>' +'</li>';

    	  google.maps.event.addListener(marker[i], 'click', function() {

            var infoWindowContent = this.title;
            infowindow.setContent(infoWindowContent);
            infowindow.open(map,this);

        });

        bounds.extend(place.geometry.location);
      }
      map.fitBounds(bounds);

  }

  /*  function for setting direction and show travel time  */
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

            /* set direction on map */
            directionsDisplay.setDirections(response);
    	    directionsDisplay.setMap(map);

            /* add traffic layer */
            var trafficLayer = new google.maps.TrafficLayer();
            trafficLayer.setMap(map);

            /* calculate estimated travel time and and display them via alert */
            var point = response.routes[ 0 ].legs[ 0 ];
            alert( 'Estimated travel time of your selected Gas Station is : \n' + point.duration.text + ' (' + point.distance.text + ')');

          } else {
            window.alert('Directions request failed due to ' + status);
          }
      });
  }
