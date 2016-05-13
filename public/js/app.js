function map(SpotsModel){

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

		SpotsModel.updateSpots({lat: lat, lng: lng});

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

}

function newClient(){

	var app = angular.module('app', []);

	app.controller('Ctrl', ['SpotsModel', '$scope', function (SpotsModel, $scope) {

		_.extend(this, {
			removeSpot: function(id){SpotsModel.removeSpot(id);},
			goToSpot: function(coords){SpotsModel.goToSpot(coords);},
			getDistance: function(coords){return SpotsModel.getDistance(coords);}
		});

		$scope.spots = SpotsModel.spots;

		$scope.$on('update:spots', function(){$scope.$apply(function () {$scope.spots = SpotsModel.spots});});

		map(SpotsModel);

	}]);

	app.factory('SpotsModel', ['$rootScope', function($rootScope){

		var SpotsModel =  {

			spots: [],

			updateSpots: function(uCoords){

				this.uCoords = uCoords || this.uCoords || false;

				jQuery.ajax({
					method: "GET",
					url: "/api/spots"
				}).done(jQuery.proxy(function(resp){
					this.spots = resp;
					$rootScope.$broadcast('update:spots');
				}, this));

			},

			removeSpot: function(id){
				jQuery.ajax({
					method: "DELETE",
					url: "/api/spot/" + id
				}).done(jQuery.proxy(this.updateSpots, this));
			},

			getDistance: function(coords){

				var R = 6371, // earth’s radius in kilometres
					φ1 = coords.lat * Math.PI / 180,
					φ2 = this.uCoords.lat * Math.PI / 180,
					Δφ = (this.uCoords.lat - coords.lat) * Math.PI / 180,
					Δλ = (this.uCoords.lng - coords.lng) * Math.PI / 180;

				var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);

				return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1);

			},

			goToSpot: function(){

				console.log(arguments);

			}

		};

		return SpotsModel;


	}]);

	angular.bootstrap(document.documentElement, ['app']); // run application

}

function oldClient(){

	var client = {

		mockup: {
			name: 'cool place',
			desc: 'blabla',
			coords: {lat: +(180 *  Math.random()).toFixed(6), lng: +(180 *  Math.random()).toFixed(6)}
		},

		init: function(){
			this.refresh();
		},

		refresh: function(){
			jQuery.ajax({
				method: "GET",
				url: "/api/spots"
			}).done(jQuery.proxy(this.renderList, this));
		},

		details: function(id){
			jQuery.ajax({
				method: "GET",
				url: "/api/spot/" + id
			}).done(function(resp){
				alert(JSON.stringify(resp.spot));
			});
		},

		create: function(){
			jQuery.ajax({
				method: "POST",
				url: "/api/spot",
				data: this.mockup,
			}).done(jQuery.proxy(this.refresh, this));
		},

		update: function(id){
			jQuery.ajax({
				method: "PUT",
				url: "/api/spot/" + id,
				data: this.mockup
			}).done(jQuery.proxy(this.refresh, this));
		},

		delete: function(id){
			jQuery.ajax({
				method: "DELETE",
				url: "/api/spot/" + id
			}).done(jQuery.proxy(this.refresh, this));
		},

		renderList: function(resp){

			var list = jQuery('.spots-list'), spot;

			list.empty();

			_.each(resp, function(spot){
				list.append(this.createSpot(spot));
			}, this);

			this.reBindEvs();
		},

		createSpot: function(json){
			return '<li>'
				+ json.name
				+ ' <a class="delete" data-id="' + json._id + '" href="#">delete</a>'
				+ ' <a class="details" data-id="'+ json._id + '" href="#">details</a>'
				+ ' <a class="update" data-id="' + json._id + '" href="#">update</a>'
				+ '</li>';
		},

		reBindEvs: function(){

			jQuery('.delete').click(function(e){
				e.preventDefault();
				client.delete(jQuery(e.currentTarget).data('id'));
			});

			jQuery('.details').click(function(e){
				e.preventDefault();
				client.details(jQuery(e.currentTarget).data('id'));
			});

			jQuery('.update').click(function(e){
				e.preventDefault();
				client.update(jQuery(e.currentTarget).data('id'));
			});

		}

	};

	client.init();

	jQuery('.create').click(function(e){

		e.preventDefault();

		client.create();

	});

}

newClient();
oldClient();