angular.module('wif.controllers',[])

    .controller('AppController', function($scope, Spot){

        $scope.ammount = Spot.get();

    })

    .controller('SpotsPageController', function($scope, $rootScope){

        angular.extend($scope, {
            orderProp: 'distance',
            limit: 5,
            goToSpot: function(spot){

                $scope.$broadcast('map:goto', spot);

            },
            resetLocation: function(){

                $rootScope.center = null;


            }
        });

    })

    .controller('AddPageController', function($scope, $state, Spot){

        $scope.spot = new Spot({
            name: 'cool place',
            desc: 'blabla'
        });

        $scope.addSpot = function(){

            $scope.spot.$save(function(resp){

                $scope.$parent.ammount.total = resp.total;

                $state.go('spots');

            });
        }

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

                if (!input.value){

                    input.className += ' required';

                    return;

                }

                $http({
                    method: "GET",
                    url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + input.value + '&key=' + 'AIzaSyDW3irgXC2Ogys9XTVV8oaJ6lXbpNTTap0',
                }).success(function (resp){

                    $scope.geoResults = resp.results;

                });

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

                    $scope.map = new google.maps.Map(document.getElementById("map"), {
                        center: new google.maps.LatLng($rootScope.center.lat, $rootScope.center.lng),
                        zoom: 13,
                        disableDoubleClickZoom: true,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    });

                    $scope.onMapRendered();

                });

            },

            onMapRendered: function(){

                if($scope.$parent.spot){

                    google.maps.event.addListener($scope.map, 'dblclick', function(e) {

                        var coords = {lat: e.latLng.lat(), lng: e.latLng.lng()};

                        if($scope.$parent.marker) $scope.$parent.marker.setMap(null);

                        $scope.$parent.marker = new google.maps.Marker({
                            position: coords,
                            map: $scope.map
                        });

                        $scope.$apply(function(){

                            $scope.$parent.spot.coords = coords;

                        });

                    });

                } else if ($rootScope.spots) {

                    $scope.putMarkers();

                } else {

                    $scope.loadSpots();

                }

            },

            loadSpots: function(){

                Spot.query($rootScope.center).$promise.then(function(spots) {

                    angular.forEach(spots, function(spot){spot.distance = $scope.getDistance(spot.coords, $rootScope.center)});

                    $rootScope.spots = spots;

                    $scope.putMarkers();

                });

            },

            putMarkers: function(){

                new google.maps.Marker({
                    position: $rootScope.center,
                    map: $scope.map,
                    icon: './img/user.png'
                });

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

                spot.infoWindow = spot.openInfoWindow || new google.maps.InfoWindow({
                    content: $scope.renderInfoContent(spot)
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