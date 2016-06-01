angular.module('controllers',[])

    /////////////////////////////////////////////////////////////////////////////

    .controller('AppController', function($scope, $sce, $rootScope, $timeout, Spot){

        angular.extend($scope, {

            resetLocation: function(){

                $rootScope.center = null;

            },

            togglePopup: function(e, data){

                $scope.popupTPL = data && data.tpl ? data.tpl : null;

                $scope.popupHTML = data && data.html ? $sce.trustAsHtml(data.html) : null;

            },

            openCaptcha: function(e, cb){

                $timeout(function () {

                    grecaptcha.render('recaptcha', {
                        sitekey: '6LdOiyATAAAAAN7jOqxZQp7yyKVbbV-hHnKZhdO6',
                        callback: cb
                    });

                });

            }

        });

        $scope.$on('open:captcha', $scope.openCaptcha);

        $scope.$on('toggle:popup', $scope.togglePopup);

        Spot.get().$promise.then(function(resp){

            $scope.total = resp.total;

            /*$rootScope.activeSpot = '57457267bf6dd61700d38e9e';

            $scope.$emit('toggle:popup', {tpl: 'tpl/spot-info.tpl'});*/

        });

    })

    /////////////////////////////////////////////////////////////////////////////

    .controller('SearchPageController', function($scope){

        angular.extend($scope, {
            orderProp: 'distance',
            limit: 5,
            goToSpot: function(spot){

                $scope.$broadcast('map:goto', spot);

            }
        });

    })

    /////////////////////////////////////////////////////////////////////////////

    .controller('ManagePageController', function($scope, $state, Spot){

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

    /////////////////////////////////////////////////////////////////////////////

    .controller('LoginController', function($scope, $http, $timeout, $cookies){

        angular.extend($scope, {

            init: function(){

                if($cookies.get('wif.userEmail') && $cookies.get('wif.userID')){

                    $scope.userEmail = $cookies.get('wif.userEmail');

                    $scope.userID = $cookies.get('wif.userID');

                    $scope.haveUserID = true;

                }

                $scope.$watchCollection('[userEmail, userID]', function() {$scope.unauthorized = null});

            },

            onPopupEmail: function(){ // todo: put html into template

                $scope.$emit('toggle:popup', {tpl: 'tpl/email-info.tpl'});

            },

            onSendCredentials: function() {

                if(!$scope.captchaPassed){

                    $scope.$emit('toggle:popup', {html: '<div id="recaptcha"></div>'});

                    $scope.$emit('open:captcha', function(){

                        $scope.togglePopup();

                        $scope.captchaPassed = true;

                        $scope.sendCredentials();

                    });

                } else $scope.sendCredentials();

            },

            sendCredentials: function(){

                if($scope.unauthorized) return;

                $http({
                    method: 'POST',
                    url: '/api/account',
                    data: {
                        userEmail: $scope.userEmail,
                        userID: $scope.userID
                    }
                }).then(function() {

                    $scope.userID ? $scope.onLoginSuccess() : $scope.haveUserID = true;

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

    })

    /////////////////////////////////////////////////////////////////////////////

    .controller('AboutPageController', function($scope){



    })

    /////////////////////////////////////////////////////////////////////////////


    .controller('SpotInfoController', function($scope, $rootScope, Spot){

        angular.extend($scope, {

            toggleMode: function(mode){

                $scope.mode = $scope.mode !==  mode ? mode : null;

            },

            onSpotLoaded: function(resp){

                angular.extend($scope, {spot: resp.spot});

                $scope.$watch('spot.rating', function(rating){

                    $scope.rating = rating;

                });

                $scope.$watch('transportType', function(index) {

                    if(index) $rootScope.$broadcast('map:direction', $scope.directions[index].data);

                });

                $rootScope.center ? $scope.getDirections() : $scope.directions = false;

                $rootScope.activeSpot = resp.spot;

            },

            getDirections: function(){

                var dServive = new google.maps.DirectionsService,
                    dTypes = [
                        {mode: 'DRIVING', name: 'Car'},
                        {mode: 'WALKING', name: 'Walk'},
                        {mode: 'BICYCLING', name: 'Bicycle'},
                        {mode: 'TRANSIT', name: 'Public transport'}
                    ], counter = 0;

                angular.forEach(dTypes, function(obj, index){

                    dServive.route({
                        origin: new google.maps.LatLng($rootScope.center.lat, $rootScope.center.lng),
                        destination: new google.maps.LatLng($scope.spot.coords.lat, $scope.spot.coords.lng),
                        travelMode: google.maps.TravelMode[obj.mode],
                        provideRouteAlternatives: false
                    }, function(resp) {

                        if(resp.status === 'OK'){

                            angular.extend(obj, {
                                data: resp,
                                index: index,
                                way: '( ' + resp.routes[0].legs[0].distance.text + ' / ' + resp.routes[0].legs[0].duration.text + ' )'
                            });

                        }

                        counter++;

                        if(counter === dTypes.length) $scope.$apply(function(){$scope.directions = dTypes});

                    });

                });

            }

        });

        Spot.get({id: $rootScope.activeSpot._id || $rootScope.activeSpot}).$promise.then($scope.onSpotLoaded);

    })

    /////////////////////////////////////////////////////////////////////////////


    .controller('StarRateController', function($scope){

        $scope.stars = [];

        for(var i = 0; i < 5; i++){

            $scope.stars.push({i: i + 1});

        }

    })

    /////////////////////////////////////////////////////////////////////////////


    .controller('RateModeController', function($scope, $rootScope, Spot){

        $scope.rating = null;

        $scope.editableRate = true;

        angular.extend($scope, {

            rate: function(rating){

                $scope.rating = rating;

            },

            onSubmitRating: function(){

                $scope.$emit('open:captcha', $scope.submitRating);

            },

            submitRating: function(){

                Spot.update({id: $scope.spot._id}, {comment: {
                    rating: $scope.rating,
                    message: $scope.message
                }}).$promise.then(function(resp){

                    $scope.spot.comments = resp.spot.comments;

                    $scope.spot.rating = resp.spot.rating;

                    $scope.toggleMode();

                });

            }

        });

    })

    /////////////////////////////////////////////////////////////////////////////

    .controller('MapController', function($scope, $rootScope, $http, $timeout, $compile, Spot){

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

                    $scope.onMapRendered($scope.map);

                });

            },

            renderDirection: function(data){

                $scope.dRenderer = $scope.dRenderer || new google.maps.DirectionsRenderer({
                    suppressMarkers: true,
                    map: $scope.map
                });

                $scope.dRenderer.setDirections(data);

            },

            onMapRendered: function(){

                if($scope.spot){ // add spot page

                    $scope.putUserMarker();

                    google.maps.event.addListener($scope.map, 'dblclick', $scope.onPutNewSpot);

                } else { // search spot page

                    // todo: think, maybe we don't need to load spots on every 'search-map' render

                    Spot.query($rootScope.center).$promise.then($scope.onSpotsLoaded);

                }

            },

            onPutNewSpot: function(e){

                if($scope.step !== 1) return;

                var coords = {lat: e.latLng.lat(), lng: e.latLng.lng()};

                if($scope.marker) $scope.marker.setMap(null);

                $scope.marker = new google.maps.Marker({
                    position: coords,
                    map: $scope.map
                });

                $scope.$apply(function(){$scope.spot.coords = coords});

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

                $rootScope.activeSpot = spot._id; // Todo: spot page (by id in URL)

                spot.infoWindow.open($scope.map, spot.marker);

            },

            renderInfoContent: function(spot){

                return $compile('<div><a ng-click="openSpot()">' + spot.name + '</a>' + (spot.rating ? 'Rating: ' + spot.rating.toFixed(2) + '</div>' : ''))($scope)[0];

            },

            openSpot: function(){

                $scope.$emit('toggle:popup', {tpl: 'tpl/spot-info.tpl'});

            }

        });

        $scope.$on('map:goto', function(ev, spot){

            $scope.map.panTo(new google.maps.LatLng(spot.coords.lat, spot.coords.lng));

            $scope.openInfoWindow(spot);

        });

        $scope.$on('map:direction', function(ev, data){

            $scope.renderDirection(data);

        });

        if($rootScope.center) $scope.renderMap($rootScope.center);

    });