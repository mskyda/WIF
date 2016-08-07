angular.module('controllers').controller('StarRateController', function($scope){

	if($scope.comment && $scope.comment.rating){

		$scope.rating = $scope.comment.rating;

	}

	if($scope.rating){

		$scope.rating = Math.round($scope.rating);

	}

	$scope.stars = [];

	for(var i = 0; i < 5; i++){

		$scope.stars.push({ i: i + 1 });

	}

});