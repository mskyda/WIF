angular.module('controllers').controller('LoginController', function($scope, $http, $timeout, $cookies, $translate){

	angular.extend($scope, {

		init: function(){

			if($cookies.get('wif.userEmail') && $cookies.get('wif.userID')){

				$scope.userEmail = $cookies.get('wif.userEmail');

				$scope.userID = $cookies.get('wif.userID');

				$scope.haveUserID = true;

			}

			$scope.$watchCollection('[userEmail, userID]', function() { $scope.unauthorized = null; });

		},

		onPopupEmail: function(){

			$scope.$emit('toggle:popup', { tpl: 'tpl/email-info.tpl' });

		},

		onSendCredentials: function() {

			if($scope.haveUserID && $scope.userID.length < 32) { return; }

			if(!$scope.captchaPassed){

				if(!$scope.mode) { $scope.$emit('toggle:popup', { html: '<div id="recaptcha"></div>' }); }

				$scope.$emit('open:captcha', function(){

					if(!$scope.mode) { $scope.togglePopup(); }

					$scope.captchaPassed = true;

					$scope.sendCredentials();

				});

			} else { $scope.sendCredentials(); }

		},

		sendCredentials: function(){

			if($scope.unauthorized) { return; }

			$http({
				method: 'POST',
				url   : '/api/auth',
				data  : {
					lang     : $translate.use(),
					userEmail: $scope.userEmail,
					userID   : $scope.haveUserID !== false && $scope.userID,
					spotID   : $scope.spot._id
				}
			}).then(function() {

				if($scope.spot._id){

					$scope.manageExistingSpot($scope.userID);

				} else if($scope.haveUserID !== false && $scope.userID){

					$scope.onLoginSuccess();

				} else {

					$scope.haveUserID = true;

				}

			}, function(){

				$scope.unauthorized = true;

			});

		},

		onLoginSuccess: function(){

			$cookies.put('wif.userEmail', $scope.userEmail);

			$cookies.put('wif.userID', $scope.userID);

			$scope.spot.owner = $scope.userID;

			$scope.wizardGo(1);

		}

	});

	$scope.init();

});