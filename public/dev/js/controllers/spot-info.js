angular.module('controllers').controller('SpotInfoController', function($scope, $rootScope, $state, Spot){

	angular.extend($scope, {

		toggleMode: function(mode){

			$scope.mode = $scope.mode !== mode ? mode : null;

		},

		onSpotLoaded: function(resp){

			resp.spot.coords.lat = +(+resp.spot.coords.lat).toFixed(4);

			resp.spot.coords.lng = +(+resp.spot.coords.lng).toFixed(4);

			angular.extend($scope, {
				spot     : resp.spot,
				spotFound: true
			});

			$scope.$watch('spot.rating', function(rating){

				$scope.rating = Math.round(rating);

			});

			$scope.$watch('transportType', function(index) {

				if(index) { $rootScope.$broadcast('map:direction', $scope.directions[index].data); }

			});

			if($rootScope.activeSpot.infoWindow){

				$rootScope.activeSpot.infoWindow.close();

				$rootScope.activeSpot.infoWindow = false;

			}

			$rootScope.center ? $scope.getDirections() : $scope.directions = false;

		},

		getDirections: function(){

			var dServive = new google.maps.DirectionsService,
				dTypes = [
					{ mode: 'DRIVING' },
					{ mode: 'WALKING' },
					{ mode: 'BICYCLING' },
					{ mode: 'TRANSIT' }
				], counter = 0;

			angular.forEach(dTypes, function(obj, index){

				dServive.route({
					origin                  : new google.maps.LatLng($rootScope.center.lat, $rootScope.center.lng),
					destination             : new google.maps.LatLng($scope.spot.coords.lat, $scope.spot.coords.lng),
					travelMode              : google.maps.TravelMode[obj.mode],
					provideRouteAlternatives: false
				}, function(resp) {

					if(resp && resp.status === 'OK'){

						angular.extend(obj, {
							data : resp,
							index: index,
							way  : '( ' + resp.routes[0].legs[0].distance.text + ' / ' + resp.routes[0].legs[0].duration.text + ' )'
						});

					}

					counter++;

					if(counter === dTypes.length) { $scope.$apply(function(){ $scope.directions = dTypes; }); }

				});

			});

		},

		manageExistingSpot: function(owner){

			$scope.spot.owner = owner;

			if($scope.mode === 'edit'){

				$rootScope.activeSpot = $scope.spot;

				$scope.$emit('toggle:popup', { goTo: 'manage' });

			} else { $scope.removeDialog = true; }

		},

		onDeleteSpot: function(confirm){

			if(!confirm){

				$scope.removeDialog = false;

				$scope.toggleMode();

			} else {

				Spot.delete({ id: $scope.spot._id + '+' + $scope.spot.owner }).$promise.then(function(){

					if($rootScope.activeSpot.marker) { $rootScope.activeSpot.marker.setMap(null); }

					var index = $rootScope.spots.indexOf($rootScope.activeSpot);

					if(index > -1) { $rootScope.spots.splice(index, 1); }

					$scope.$emit('toggle:popup');

					$rootScope.$broadcast('map:direction', false);

					$rootScope.total--;

				});

			}

		}

	});

	Spot.get({ id: $rootScope.activeSpot._id || $rootScope.activeSpot }).$promise.then($scope.onSpotLoaded, function(){ $scope.spotFound = false; });

});