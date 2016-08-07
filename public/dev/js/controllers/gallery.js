angular.module('controllers').controller('GalleryController', function($scope){

	angular.extend($scope, {

		slidesLength: 13,
		index       : 0,
		slides      : [ 'slide1', 'slide2' ],

		changeSlide: function(){

			$scope.$apply(function(){

				if($scope.slides.length < $scope.slidesLength) { $scope.slides.push('slide' + ($scope.slides.length + 1)); }

				$scope.index === $scope.slides.length - 1 ? $scope.index = 0 : $scope.index++;

			});

		}

	});

	setInterval($scope.changeSlide, 5000);

});