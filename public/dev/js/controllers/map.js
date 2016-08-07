angular.module('controllers').controller('MapController', function($scope, $rootScope, $timeout, $compile, $state, $location, Spot){

	angular.extend($scope, {

		renderDirection: function(e, data){

			if($scope.dRenderer) { $scope.dRenderer.setMap(null); }

			if(data){

				$scope.dRenderer = new google.maps.DirectionsRenderer({
					suppressMarkers: true,
					map            : $scope.map
				});

				$scope.dRenderer.setDirections(data);

			}

		},

		renderMap: function(position){

			$rootScope.spots = false;

			$rootScope.center = {
				lat: position.coords ? position.coords.latitude : position.lat,
				lng: position.coords ? position.coords.longitude : position.lng
			};

			$timeout(function(){

				$scope.map = new google.maps.Map(document.querySelector('#map'), {
					center                : new google.maps.LatLng($rootScope.center.lat, $rootScope.center.lng),
					zoom                  : 14, // Todo: "radius" control
					disableDoubleClickZoom: true,
					mapTypeId             : google.maps.MapTypeId.SATELLITE
				});

				$scope.renderUserMarker();

				$scope.updateMap();

				google.maps.event.addListener($scope.map, 'dblclick', $scope.renderPositionMarker);

			});

		},

		renderUserMarker: function(){

			new google.maps.Marker({
				position: $rootScope.center,
				map     : $scope.map,
				icon    : './img/user.png'
			});

		},

		updateMap: function(){

			$scope.closeInfoWindows();

			$rootScope.$broadcast('map:direction', false);

			if($scope.state === 'search'){

				if(!$rootScope.spots.length){

					Spot.query($rootScope.center).$promise.then($scope.onSpotsLoaded);

				} else {

					$scope.renderSpotMarkers();

				}

			}

			if($scope.positionMarker) { $scope.positionMarker.setMap(null); }

		},

		renderPositionMarker: function(e){

			if(!$rootScope.activeSpot || !$rootScope.activeSpot.step || $rootScope.activeSpot.step !== 1) { return; }

			var coords = { lat: +e.latLng.lat().toFixed(4), lng: +e.latLng.lng().toFixed(4) };

			if($scope.positionMarker) { $scope.positionMarker.setMap(null); }

			$scope.positionMarker = new google.maps.Marker({
				position: coords,
				map     : $scope.map
			});

			$scope.$apply(function(){ $rootScope.activeSpot.coords = coords; });

		},

		onSpotsLoaded: function(spots){

			angular.forEach(spots, function(spot){

				spot.distance = $scope.getDistance(spot.coords, $rootScope.center);

			});

			$rootScope.spots = spots;

			$scope.renderSpotMarkers();

		},

		renderSpotMarkers: function(){

			angular.forEach($rootScope.spots, function(spot){

				spot.marker = new google.maps.Marker({
					position: {
						lat: +spot.coords.lat,
						lng: +spot.coords.lng
					},
					map : $scope.map,
					icon: './img/favicon.ico'
				});

				spot.marker.addListener('click', function(){ $scope.openInfoWindow(spot); });

			});

		},

		removeSpotMarkers: function(){

			angular.forEach($rootScope.spots, function(spot){

				if(!$rootScope.activeSpot || !$rootScope.activeSpot.owner || spot._id !== $rootScope.activeSpot._id){

					spot.marker.setMap(null);

				}
			});

		},

		getDistance: function(p1, p2){

			var R = 6371, // earth’s radius
				φ1 = p1.lat * Math.PI / 180,
				φ2 = p2.lat * Math.PI / 180,
				Δφ = (p2.lat - p1.lat) * Math.PI / 180,
				Δλ = (p2.lng - p1.lng) * Math.PI / 180;

			var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);

			return +(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1);

		},

		openInfoWindow: function(spot){

			if($scope.state !== 'search') { return; }

			var html = '<a class="open-spot" ng-click="openSpot()">' + spot.name + '<ng-include src="\'tpl/star-rate.tpl\'"></ng-include></a>';

			spot.infoWindow = spot.infoWindow || new google.maps.InfoWindow({ content: $compile(html)($scope)[0] });

			$scope.closeInfoWindows();

			$rootScope.activeSpot = spot;

			$timeout(function(){

				$scope.rating = spot.rating;

				$scope.map.panTo(new google.maps.LatLng(spot.coords.lat, spot.coords.lng));

				spot.infoWindow.open($scope.map, spot.marker);

			});

		},

		closeInfoWindows: function(){

			angular.forEach($rootScope.spots, function(spot){

				if(spot.infoWindow) { spot.infoWindow.close(); }

			});

		},

		openSpot: function(){

			$location.url($state.current.name + '/' + $rootScope.activeSpot._id);

		}

	});

	$scope.$on('map:direction', $scope.renderDirection);

	$rootScope.$on('$stateChangeStart', function(e, state){

		if($state.current.name === state.name) { return; } // change of query params without main-state change

		if(state) { $scope.state = state.name; }

		if($scope.map && $scope.state !== 'about'){

			if($scope.state === 'search') { $rootScope.activeSpot = false; }

			$scope.removeSpotMarkers();

			$scope.updateMap();

		}

	});

	$timeout(function(){ $scope.state = $state.current.name; });

});