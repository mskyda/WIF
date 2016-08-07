angular.module('controllers').controller('RateModeController', function($scope, $rootScope, Spot){

	$scope.rating = null;

	$scope.editableRate = true;

	angular.extend($scope, {

		rate: function(rating){

			$scope.rating = rating;

		},

		onSubmitRating: function(){

			if($scope.message.length >= 20){

				$scope.$emit('open:captcha', $scope.submitRating);

			}

		},

		submitRating: function(){

			Spot.update({ id: $scope.spot._id }, {
				comment:
				{
					rating : $scope.rating,
					message: $scope.message
				}
			}).$promise.then(function(resp){

				$scope.spot.comments = resp.spot.comments;

				$scope.spot.rating = resp.spot.rating;

				angular.forEach($rootScope.spots, function(spot){

					if(spot._id === $scope.spot._id) { spot.rating = $scope.spot.rating; }

				});

				$scope.toggleMode();

			});

		}

	});

});