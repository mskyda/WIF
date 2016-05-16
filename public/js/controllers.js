angular.module('wif.controllers',[])

    .controller('AppController', function($scope, Spot){

        $scope.$on('refresh:app', function(ev, data){

            $scope.ammount = data && data.total ? {total: data.total} : Spot.get();

        });

        $scope.ammount = Spot.get();

    })

    .controller('SpotsPageController', function($scope){

        $scope.$on('refresh:closest', function(ev, spots){

            $scope.spots = spots;

        });

        _.extend($scope, {
            orderProp: 'distance',
            limit: 5
        });

    })

    .controller('AddPageController', function($scope, $state, Spot){

        var mock = {
            name: 'cool place',
            desc: 'blabla',
            coords: {lat: +(180 * Math.random()).toFixed(6), lng: +(180 * Math.random()).toFixed(6)}
        };

        $scope.spot = new Spot(mock);

        $scope.addSpot = function(){

            $scope.spot.$save(function(resp){

                $scope.$emit('refresh:app', resp.total);

                $state.go('spots');

            });
        }

    })

    .controller('AboutPageController', function($scope, Spot){



    })

    .controller('MapController', function($scope, $rootScope, $http, Spot){

        _.extend($scope, {

            getCurrentPosition: function(){

                navigator.geolocation.getCurrentPosition($scope.renderMap);

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

                var center = {
                    lat: +(position.coords ? position.coords.latitude : position.lat).toFixed(6),
                    lng: +(position.coords ? position.coords.longitude : position.lng).toFixed(6)
                };

                var map = new google.maps.Map(document.getElementById("map"), {
                    center: new google.maps.LatLng(center.lat, center.lng),
                    zoom: 13,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });

                Spot.query(center).$promise.then(function(spots) {

                    _.each(spots, function(spot){spot.distance = $scope.getDistance(center, spot.coords)});

                    $scope.putMarkers(map, center, spots);

                    $rootScope.$broadcast('refresh:closest', spots);

                });

            },

            putMarkers: function(map, center, spots){

                new google.maps.Marker({
                    position: center,
                    map: map,
                    icon: './img/user.png'
                });

                _.each(spots, function(spot){

                    new google.maps.Marker({
                        position: spot.coords,
                        map: map,
                        icon: './img/favicon.ico'
                    });

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

            }

        });

    });