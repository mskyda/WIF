angular.module('controllers', ['ngCookies'])

    /////////////////////////////////////////////////////////////////////////////

    .controller('AppController', function($scope, $sce, $rootScope, $timeout, $translate, $cookies, Spot){

        angular.extend($scope, {

            siteLang: $cookies.get('wif.siteLang') || $translate.use(),

            resetLocation: function(){ $rootScope.center = null; },

            togglePopup: function(e, data){

                $scope.popupTPL = data && data.tpl ? data.tpl : null;

                $scope.popupHTML = data && data.html ? $sce.trustAsHtml(data.html) : null;

            },

            changeLang: function(){

                if($scope.siteLang !== $translate.use()){

                    $cookies.put('wif.siteLang', $scope.siteLang);

                    $translate.use($scope.siteLang);

                }

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

        $scope.$watch('siteLang', $scope.changeLang);

        Spot.get().$promise.then(function(resp){ $rootScope.total = resp.total; });

    })

    /////////////////////////////////////////////////////////////////////////////

    .controller('SearchSpotsController', function($scope, $rootScope){

        // Todo: spot page (by id in URL)

        /*$rootScope.activeSpot = '57566a5e639fab110032cbe6';

        $scope.$emit('toggle:popup', {tpl: 'tpl/spot-info.tpl'});*/

        angular.extend($scope, {
            orderProp: 'distance',
            limit: 5,
            goToSpot: function(spot){

                google.maps.event.trigger(spot.marker, 'click');

            }
        });

    })

    /////////////////////////////////////////////////////////////////////////////

    .controller('ManageSpotsController', function($scope, $state, $rootScope, Spot){

        $rootScope.activeSpot = $rootScope.activeSpot || new Spot();

        var isEdit = !!$rootScope.activeSpot.owner;

        angular.extend($scope, {

            title: isEdit ? 'Edit' : 'Add',

            spot: $rootScope.activeSpot,

            wizardGo: function(val){

                if(Math.abs(val) !== 1) return;

                $scope.spot.step += val;

            },

            manageSpot: function(){

                delete $scope.spot.step;

                if(isEdit){

                    Spot.update({id: $scope.spot._id}, $scope.spot).$promise.then($scope.onManageComplete);

                } else {

                    Spot.save($scope.spot, function(){

                        $rootScope.total++;

                        $scope.onManageComplete();

                    });

                }

            },

            onManageComplete: function(){

                angular.forEach($rootScope.spots, function(spot){spot.marker.setMap(null)});

                $rootScope.spots = [];

                $state.go('search');

            }

        });

        $scope.spot.step = isEdit ? 1 : 0;

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

                $scope.$watchCollection('[userEmail, userID]', function() { $scope.unauthorized = null; });

            },

            onPopupEmail: function(){ // Todo: put html into template

                $scope.$emit('toggle:popup', {tpl: 'tpl/email-info.tpl'});

            },

            onSendCredentials: function() {

                if($scope.haveUserID && $scope.userID.length < 32) return;

                if(!$scope.captchaPassed){

                    if(!$scope.mode) $scope.$emit('toggle:popup', {html: '<div id="recaptcha"></div>'});

                    $scope.$emit('open:captcha', function(){

                        if(!$scope.mode) $scope.togglePopup();

                        $scope.captchaPassed = true;

                        $scope.sendCredentials();

                    });

                } else $scope.sendCredentials();

            },

            sendCredentials: function(){

                if($scope.unauthorized) return;

                $http({
                    method: 'POST',
                    url: '/api/auth',
                    data: {
                        userEmail: $scope.userEmail,
                        userID: $scope.userID,
                        spotID: $scope.spot._id
                    }
                }).then(function() {

                    if($scope.spot._id){

                        $scope.manageExistingSpot($scope.userID);

                    } else if($scope.userID){

                        $scope.onLoginSuccess()

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

    })

    /////////////////////////////////////////////////////////////////////////////


    .controller('SpotInfoController', function($scope, $rootScope, $state, Spot){

        angular.extend($scope, {

            toggleMode: function(mode){

                $scope.mode = $scope.mode !==  mode ? mode : null;

            },

            onSpotLoaded: function(resp){

                resp.spot.coords.lat = +(+resp.spot.coords.lat).toFixed(4);

                resp.spot.coords.lng = +(+resp.spot.coords.lng).toFixed(4);

                angular.extend($scope, {spot: resp.spot});

                $scope.$watch('spot.rating', function(rating){

                    $scope.rating = Math.round(rating);

                });

                $scope.$watch('transportType', function(index) {

                    if(index) $rootScope.$broadcast('map:direction', $scope.directions[index].data);

                });

                if($rootScope.activeSpot.infoWindow){

                    $rootScope.activeSpot.infoWindow.close();

                    $rootScope.activeSpot.infoWindow = false;

                }

                $rootScope.center ? $scope.getDirections() : $scope.directions = false;

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

            },

            manageExistingSpot: function(owner){

                $scope.spot.owner = owner;

                if($scope.mode === 'edit'){

                    $scope.$emit('toggle:popup');

                    $rootScope.activeSpot = $scope.spot;

                    $state.go('manage');

                } else $scope.removeDialog = true;

            },

            onDeleteSpot: function(confirm){

                if(!confirm){

                    $scope.removeDialog = false;

                    $scope.toggleMode();

                } else {

                    Spot.delete({id: $scope.spot._id + '+' + $scope.spot.owner}).$promise.then(function(){

                        if($rootScope.activeSpot.marker) $rootScope.activeSpot.marker.setMap(null);

                        var index = $rootScope.spots.indexOf($rootScope.activeSpot);

                        if (index > -1) $rootScope.spots.splice(index, 1);

                        $scope.$emit('toggle:popup');

                        $rootScope.$broadcast('map:direction', false);

                        $rootScope.total--;

                    });

                }

            }

        });

        Spot.get({id: $rootScope.activeSpot._id ||  $rootScope.activeSpot}).$promise.then($scope.onSpotLoaded, function(){$scope.notFound = true;});

    })

    /////////////////////////////////////////////////////////////////////////////


    .controller('StarRateController', function($scope){

        if($scope.comment && $scope.comment.rating){

            $scope.rating = $scope.comment.rating;

        }

        if($scope.rating){

            $scope.rating = Math.round($scope.rating);

        }

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

                if($scope.message.length >= 20){

                    $scope.$emit('open:captcha', $scope.submitRating);

                }

            },

            submitRating: function(){

                Spot.update({id: $scope.spot._id}, {comment: {
                    rating: $scope.rating,
                    message: $scope.message
                }}).$promise.then(function(resp){

                    $scope.spot.comments = resp.spot.comments;

                    $scope.spot.rating = resp.spot.rating;

                    angular.forEach($rootScope.spots, function(spot){

                        if(spot._id === $scope.spot._id) spot.rating = $scope.spot.rating;

                    });

                    $scope.toggleMode();

                });

            }

        });

    })

    /////////////////////////////////////////////////////////////////////////////

    .controller('MapController', function($scope, $rootScope, $timeout, $compile, $state, Spot){

        angular.extend($scope, {

            renderDirection: function(e, data){

                if($scope.dRenderer) $scope.dRenderer.setMap(null);

                if(data){

                    $scope.dRenderer = new google.maps.DirectionsRenderer({
                        suppressMarkers: true,
                        map: $scope.map
                    });

                    $scope.dRenderer.setDirections(data);

                }

            },

            renderMap: function(position){

                $rootScope.spots = false;

                $rootScope.center = {
                    lat: position.coords ? position.coords.latitude : position.lat,
                    lng: position.coords ? position.coords.longitude : position.lng
                };

                $timeout(function(){

                    $scope.map = new google.maps.Map(document.querySelector('#map'), {
                        center: new google.maps.LatLng($rootScope.center.lat, $rootScope.center.lng),
                        zoom: 14, // Todo: "radius" control
                        disableDoubleClickZoom: true,
                        mapTypeId: google.maps.MapTypeId.SATELLITE
                    });

                    $scope.renderUserMarker();

                    $scope.updateMap();

                    google.maps.event.addListener($scope.map, 'dblclick', $scope.renderPositionMarker);

                });

            },

            renderUserMarker: function(){

                new google.maps.Marker({
                    position: $rootScope.center,
                    map: $scope.map,
                    icon: './img/user.png'
                });

            },

            updateMap: function(){

                $scope.closeInfoWindows();

                $rootScope.$broadcast('map:direction', false);

                if($scope.state === 'search'){

                    if(!$rootScope.spots.length){

                        Spot.query($rootScope.center).$promise.then($scope.onSpotsLoaded);

                    } else {

                        $scope.renderSpotMarkers();

                    }

                }

                if($scope.positionMarker) $scope.positionMarker.setMap(null);

            },

            renderPositionMarker: function(e){

                if(!$rootScope.activeSpot || !$rootScope.activeSpot.step || $rootScope.activeSpot.step !== 1) return;

                var coords = {lat: +e.latLng.lat().toFixed(4), lng: +e.latLng.lng().toFixed(4)};

                if($scope.positionMarker) $scope.positionMarker.setMap(null);

                $scope.positionMarker = new google.maps.Marker({
                    position: coords,
                    map: $scope.map
                });

                $scope.$apply(function(){$rootScope.activeSpot.coords = coords});

            },

            onSpotsLoaded: function(spots){

                angular.forEach(spots, function(spot){

                    spot.distance = $scope.getDistance(spot.coords, $rootScope.center);

                });

                $rootScope.spots = spots;

                $scope.renderSpotMarkers();

            },

            renderSpotMarkers: function(){

                angular.forEach($rootScope.spots, function(spot){

                    spot.marker = new google.maps.Marker({
                        position: {
                            lat: +spot.coords.lat,
                            lng: +spot.coords.lng
                        },
                        map: $scope.map,
                        icon: './img/favicon.ico'
                    });

                    spot.marker.addListener('click', function(){$scope.openInfoWindow(spot)});

                });

            },

            removeSpotMarkers: function(){

                angular.forEach($rootScope.spots, function(spot){

                    if(!$rootScope.activeSpot || !$rootScope.activeSpot.owner || spot._id !== $rootScope.activeSpot._id){

                        spot.marker.setMap(null);

                    }
                });

            },

            getDistance: function(p1, p2){

                var R = 6371, // earth’s radius
                    φ1 = p1.lat * Math.PI / 180,
                    φ2 = p2.lat * Math.PI / 180,
                    Δφ = (p2.lat - p1.lat) * Math.PI / 180,
                    Δλ = (p2.lng - p1.lng) * Math.PI / 180;

                var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);

                return +(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1);

            },

            openInfoWindow: function(spot){

                if($scope.state !== 'search') return;

                var html = '<a class="open-spot" ng-click="openSpot()">' + spot.name + '<ng-include src="\'tpl/star-rate.tpl\'"></ng-include></a>';

                spot.infoWindow = spot.infoWindow || new google.maps.InfoWindow({
                    content: $compile(html)($scope)[0]
                });

                $scope.closeInfoWindows();

                $rootScope.activeSpot = spot;

                $timeout(function(){

                    $scope.rating = spot.rating;

                    $scope.map.panTo(new google.maps.LatLng(spot.coords.lat, spot.coords.lng));

                    spot.infoWindow.open($scope.map, spot.marker);

                });

            },

            closeInfoWindows: function(){

                angular.forEach($rootScope.spots, function(spot){

                    if(spot.infoWindow) spot.infoWindow.close();

                });

            },

            openSpot: function(){

                $scope.$emit('toggle:popup', {tpl: 'tpl/spot-info.tpl'});

            }

        });

        $scope.$on('map:direction', $scope.renderDirection);

        $rootScope.$on('$stateChangeStart', function(e, state){

            if(state) $scope.state = state.name;

            if($scope.map && $scope.state !== 'about'){

                if($scope.state === 'search') $rootScope.activeSpot = false;

                $scope.removeSpotMarkers();

                $scope.updateMap();

            }

        });

        $timeout(function(){$scope.state = $state.current.name});

    })

    /////////////////////////////////////////////////////////////////////////////

    .controller('MapControlsController', function($scope, $http){

        angular.extend($scope, {

            getCurrentPosition: function(){

                navigator.geolocation.getCurrentPosition(function(c){

                    $scope.$apply($scope.$parent.renderMap(c));

                });

            },

            inputAddress: function(address){

                $scope.address = address || '';

                if(address){

                    $http({
                        method: 'GET',
                        url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + 'AIzaSyDW3irgXC2Ogys9XTVV8oaJ6lXbpNTTap0'
                    }).success(function (resp){

                        $scope.geoResults = resp.results;

                    });

                }

            },

            resetSearch: function(){

                $scope.geoResults = null;

            }

        });

    })

    /////////////////////////////////////////////////////////////////////////////

    .controller('GalleryController', function($scope){

        angular.extend($scope, {

            slidesLength: 13,

            index : 0,

            slides: ['slide1', 'slide2'],

            changeSlide: function(){

                $scope.$apply(function(){

                    if($scope.slides.length < $scope.slidesLength) $scope.slides.push('slide' + ($scope.slides.length + 1));

                    $scope.index === $scope.slides.length - 1 ? $scope.index = 0 : $scope.index++;

                });

            }

        });

        setInterval($scope.changeSlide, 5000);

    });