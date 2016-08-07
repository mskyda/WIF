angular.module('controllers').controller('MapControlsController', function($scope, $http){

	angular.extend($scope, {

		getCurrentPosition: function(){

			navigator.geolocation.getCurrentPosition(function(c){

				$scope.$apply($scope.$parent.renderMap(c));

			});

		},

		inputAddress: function(address){

			$scope.address = address || '';

			if(address){

				$http({
					method: 'GET',
					url   : 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + 'AIzaSyDW3irgXC2Ogys9XTVV8oaJ6lXbpNTTap0'
				}).success(function (resp){

					$scope.geoResults = resp.results;

				});

			}

		},

		resetSearch: function(){

			$scope.geoResults = null;

		}

	});

});