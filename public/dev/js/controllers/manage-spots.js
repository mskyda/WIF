angular.module('controllers').controller('ManageSpotsController', function($scope, $state, $rootScope, Spot){

	$rootScope.activeSpot = $rootScope.activeSpot || new Spot();

	var isEdit = !!$rootScope.activeSpot.owner;

	angular.extend($scope, {

		title: isEdit ? 'Edit' : 'Add',

		spot: $rootScope.activeSpot,

		wizardGo: function(val){

			if(Math.abs(val) !== 1) { return; }

			$scope.spot.step += val;

		},

		manageSpot: function(){

			delete $scope.spot.step;

			if(isEdit){

				Spot.update({ id: $scope.spot._id }, $scope.spot).$promise.then($scope.onManageComplete);

			} else {

				Spot.save($scope.spot, function(){

					$rootScope.total++;

					$scope.onManageComplete();

				});

			}

		},

		onManageComplete: function(){

			angular.forEach($rootScope.spots, function(spot){ spot.marker.setMap(null); });

			$rootScope.spots = [];

			$state.go('search');

		}

	});

	$scope.spot.step = isEdit ? 1 : 0;

});