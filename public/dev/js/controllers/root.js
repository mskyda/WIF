angular.module('controllers').controller('RootController', function($scope, $sce, $rootScope, $timeout, $location, $state, Spot){

	angular.extend($scope, {

		resetLocation: function(){ $rootScope.center = null; },

		togglePopup: function(e, data){

			$scope.popupTPL = data && data.tpl ? data.tpl : null;

			$scope.popupHTML = data && data.html ? $sce.trustAsHtml(data.html) : null;

			if(!$scope.popupHTML && !$scope.popupTPL) { $scope.onPopupClose(data && data.goTo); }

		},

		onPopupClose: function(goTo){

			if(goTo || $state.params.spotID){

				$location.url((goTo || $state.current.name) + '/');

			}

		},

		openCaptcha: function(e, cb){

			$timeout(function () {

				grecaptcha.render('recaptcha', {
					sitekey : '6LdOiyATAAAAAN7jOqxZQp7yyKVbbV-hHnKZhdO6',
					callback: cb
				});

			});

		}

	});

	$scope.$on('open:captcha', $scope.openCaptcha);

	$scope.$on('toggle:popup', $scope.togglePopup);

	Spot.get().$promise.then(function(resp){ $rootScope.total = resp.total; });

});