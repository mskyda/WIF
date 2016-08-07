angular.module('controllers').controller('SearchSpotsController', function($scope, $rootScope, $stateParams){

	$rootScope.activeSpot = $stateParams.spotID || false;

	$scope.$emit('toggle:popup', $rootScope.activeSpot ? { tpl: 'tpl/spot-info.tpl' } : false);

	angular.extend($scope, {
		orderProp: 'distance',
		limit    : 5,
		goToSpot : function(spot){

			google.maps.event.trigger(spot.marker, 'click');

		}
	});

});