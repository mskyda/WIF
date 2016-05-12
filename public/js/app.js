function newClient(){

	var app = angular.module('app', []);

	app.controller('Ctrl', ['SpotsModel', '$scope', function (SpotsModel, $scope) {

		_.extend(this, {
			remove: function(id){SpotsModel.removeSpot(id);}
		});

		$scope.spots = SpotsModel.spots;

		$scope.$on('update:spots', function(){$scope.$apply(function () {$scope.spots = SpotsModel.spots});});

		SpotsModel.updateSpots();

	}]);

	app.factory('SpotsModel', ['$rootScope', function($rootScope){

		var SpotsModel =  {

			spots: [],

			updateSpots: function(){
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
			}
		}

		return SpotsModel;


	}]);

	angular.bootstrap(document.documentElement, ['app']); // run application

}

function oldClient(){

	var client = {

		mockup: {
			name: 'john smith',
			desc: 'regular guy blabla',
			coords: {lat: 53.551202, lon: 10.002056}
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

		create: function(data){
			jQuery.ajax({
				method: "POST",
				url: "/api/spot",
				data: _.extend({}, this.mockup, data)
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

	jQuery('.open-bar').click(function(e){

		e.preventDefault();

		jQuery('.create-bar').show();

	});

	jQuery('.create').click(function(e){

		e.preventDefault();

		var data = {name: jQuery('.name').val() || 'john smith'}; // serialize

		client.create(data);

		jQuery('.create-bar').hide();

	});

	jQuery('.refresh').click(function(e){
		e.preventDefault();
		client.refresh();
	});

}

function map(){

	function showMap(position) {

		var lat = position.coords ? position.coords.latitude : position.lat,
			lng = position.coords ? position.coords.longitude : position.lng;

		var Map = new google.maps.Map(document.getElementById("map"), {
			center:new google.maps.LatLng(lat, lng),
			zoom: 13,
			mapTypeId:google.maps.MapTypeId.ROADMAP
		});

		jQuery('.closest-spots').removeClass('hide');

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

newClient();
oldClient();
map();
