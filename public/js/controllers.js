angular.module('wif.controllers',[])

    .controller('AppController', function($scope, $sce, $rootScope, Spot){

        angular.extend($scope, {

            resetLocation: function(){

                $rootScope.center = null;

            },

            togglePopup: function(e, html){

                $scope.popupHTML = html ? $sce.trustAsHtml(html) : null;

            }

        });

        $scope.$on('toggle:popup', $scope.togglePopup);

        Spot.get().$promise.then(function(resp){

            $scope.total = resp.total;

        });

    })

    .controller('SearchPageController', function($scope){

        angular.extend($scope, {
            orderProp: 'distance',
            limit: 5,
            goToSpot: function(spot){
                $scope.$broadcast('map:goto', spot);
            }
        });

    })

    .controller('ManagePageController', function($scope, $state, $rootScope, $timeout, Spot){

        $scope.spot = new Spot();

        angular.extend($scope, {

            step: 0,

            wizardGo: function(val){

                if(Math.abs(val) !== 1) return;

                $scope.step += val;

            },

            addSpot: function(){

                $scope.spot.$save(function(resp){

                    $scope.$parent.total = resp.total;

                    $state.go('search');

                });

            }

        });

    })

    .controller('LoginController', function($scope, $http, $timeout){

        angular.extend($scope, {

            onPopupEmail: function(){
                $scope.$emit('toggle:popup', '' +
                    '<h2>Why do we need your email?</h2>' +
                    '<p>Only creator of Spot have an ability to manage(edit/delete) it. For it you will receive and email with your User ID. Email wont be used for anything else.</p>');
            },

            // Todo: cache credentials

            onSendCredentials: function() {

                if(!$scope.userID){

                    $scope.$emit('toggle:popup', '<div id="recaptcha"></div>');

                    $timeout(function () {

                        grecaptcha.render('recaptcha', {
                            sitekey: '6LdOiyATAAAAAN7jOqxZQp7yyKVbbV-hHnKZhdO6',
                            callback: function(){

                                $scope.$emit('toggle:popup');

                                $scope.sendCredentials();

                            }
                        });

                    });

                } else $scope.sendCredentials();

            },

            sendCredentials: function(){

                $http({
                    method: 'POST',
                    url: '/api/account',
                    data: {
                        userEmail: $scope.userEmail,
                        userID: $scope.userID
                    }
                }).then(function() {

                    if(!$scope.userID){

                        $scope.haveUserID = true;

                    } else {

                        $scope.$parent.spot.owner = $scope.userID;

                        $scope.$parent.wizardGo(1);

                    }

                }, function(){

                    $scope.userID = '';

                });

            }

        });

    })

    .controller('AboutPageController', function($scope, Spot){



    })

    .controller('MapController', function($scope, $rootScope, $http, $timeout, Spot){

        angular.extend($scope, {

            getCurrentPosition: function(){

                navigator.geolocation.getCurrentPosition(function(c){
                    $scope.$apply($scope.renderMap(c));
                });

            },

            inputAddress: function(){

                var input = document.querySelector('.location-controls .address');

                if (input.value){

                    $http({
                        method: 'GET',
                        url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + input.value + '&key=' + 'AIzaSyDW3irgXC2Ogys9XTVV8oaJ6lXbpNTTap0'
                    }).success(function (resp){

                        $scope.geoResults = resp.results;

                    });

                } else input.className += ' required';

            },

            resetSearch: function(){

                $scope.geoResults = null;

            },

            renderMap: function(position){

                $rootScope.center = $rootScope.center || {
                    lat: +(position.coords ? position.coords.latitude : position.lat).toFixed(6),
                    lng: +(position.coords ? position.coords.longitude : position.lng).toFixed(6)
                };

                $timeout(function(){

                    $scope.map = new google.maps.Map(document.querySelector('#map'), {
                        center: new google.maps.LatLng($rootScope.center.lat, $rootScope.center.lng),
                        zoom: 13,
                        disableDoubleClickZoom: true,
                        mapTypeId: google.maps.MapTypeId.SATELLITE
                    });

                    $scope.onMapRendered();

                });

            },

            onMapRendered: function(){

                if($scope.$parent.spot){ // add spot page

                    $scope.putUserMarker();

                    google.maps.event.addListener($scope.map, 'dblclick', $scope.onPutNewSpot);

                } else { // search spot page

                    // todo: think, maybe we don't need to load spots on every 'search-map' render

                    Spot.query($rootScope.center).$promise.then($scope.onSpotsLoaded);

                }

            },

            onPutNewSpot: function(e){

                if($scope.$parent.step !== 1) return;

                var coords = {lat: e.latLng.lat(), lng: e.latLng.lng()};

                if($scope.$parent.marker) $scope.$parent.marker.setMap(null);

                $scope.$parent.marker = new google.maps.Marker({
                    position: coords,
                    map: $scope.map
                });

                $scope.$apply(function(){

                    $scope.$parent.spot.coords = coords;

                });

            },

            onSpotsLoaded: function(spots){

                angular.forEach(spots, function(spot){

                    spot.distance = $scope.getDistance(spot.coords, $rootScope.center);

                });

                $rootScope.spots = spots;

                $scope.putUserMarker();

                $scope.putSpotMarkers();

            },

            putUserMarker: function(){

                new google.maps.Marker({
                    position: $rootScope.center,
                    map: $scope.map,
                    icon: './img/user.png'
                });

            },

            putSpotMarkers: function(){

                angular.forEach($rootScope.spots, function(spot){

                    spot.marker = new google.maps.Marker({
                        position: spot.coords,
                        map: $scope.map,
                        icon: './img/favicon.ico'
                    });

                    spot.marker.addListener('click', function(){$scope.openInfoWindow(spot)});

                });

            },

            getDistance: function(p1, p2){

                var R = 6371, // earth’s radius in kilometres
                    φ1 = p1.lat * Math.PI / 180,
                    φ2 = p2.lat * Math.PI / 180,
                    Δφ = (p2.lat - p1.lat) * Math.PI / 180,
                    Δλ = (p2.lng - p1.lng) * Math.PI / 180;

                var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);

                return +(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1);

            },

            openInfoWindow: function(spot){

                spot.infoWindow = spot.infoWindow || new google.maps.InfoWindow({
                    content: $scope.renderInfoContent(spot)
                });

                angular.forEach($rootScope.spots, function(spot){

                    if(spot.infoWindow) spot.infoWindow.close();

                });

                spot.infoWindow.open($scope.map, spot.marker);

            },

            renderInfoContent: function(spot){

                return '<h2>' + spot.name + '</h2>';

            }

        });

        $scope.$on('map:goto', function(ev, spot){

            $scope.map.panTo(new google.maps.LatLng(spot.coords.lat, spot.coords.lng));

            $scope.openInfoWindow(spot);

        });

        if($rootScope.center){

            $scope.renderMap($rootScope.center);

        }

    });