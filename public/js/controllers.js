angular.module('wif.controllers',[]).controller('SpotsPageController',function($scope,$state,$window,Spot){

    // todo - refactor

    function showMap(position) {

        var lat = position.coords ? position.coords.latitude : position.lat,
            lng = position.coords ? position.coords.longitude : position.lng;

        var map = new google.maps.Map(document.getElementById("map"), {
            center:new google.maps.LatLng(lat, lng),
            zoom: 13,
            mapTypeId:google.maps.MapTypeId.ROADMAP
        });

        var userMarker = new google.maps.Marker({
            position: {lat: lat, lng: lng},
            map: map,
            icon: './img/user.png'
        });

        $scope.spots = Spot.query();

    }

    jQuery('.location-controls .geolocation').click(function(e){

        e.preventDefault();

        navigator.geolocation.getCurrentPosition(showMap);

    });

    jQuery('.location-controls .geocoding').click(function(e){

        e.preventDefault();

        var address = jQuery('.location-controls .address').val();

        if(!address) return; // todo input validation

        jQuery.ajax({
            method: "POST",
            url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + 'AIzaSyDW3irgXC2Ogys9XTVV8oaJ6lXbpNTTap0'
        }).done(function(resp){

            // todo: results selection

            showMap(resp.results[0].geometry.location);

        });

    });

    // todo - end refactor

}).controller('AddPageController',function($scope,$state,$stateParams,Spot){

    var mock = {
        name: 'cool place',
        desc: 'blabla',
        coords: {lat: +(180 * Math.random()).toFixed(6), lng: +(180 * Math.random()).toFixed(6)}
    };

    $scope.spot=new Spot(mock);

    $scope.addSpot=function(){
        $scope.spot.$save(function(){
            $state.go('spots');
        });
    }

}).controller('AboutPageController',function($scope,$state,$stateParams,Spot){



}).controller('Test',function($scope,$state,$stateParams,Spot){

    console.log(123);

});