var app = angular.module('app', []);


app.controller('Ctrl', ['MatesModel', '$scope', function (MatesModel, $scope) {

	_.extend(this, {
		remove: function(id){MatesModel.removeMate(id);}
	});

	$scope.mates = MatesModel.mates;

	$scope.$on('update:mates', function(){$scope.$apply(function () {$scope.mates = MatesModel.mates});});

	MatesModel.updateMates();

}]);

app.factory('MatesModel', ['$rootScope', function($rootScope){

	var MatesModel =  {

		mates: [],

		updateMates: function(){
			jQuery.ajax({
				method: "GET",
				url: "/api/mates"
			}).done(jQuery.proxy(function(resp){
				this.mates = resp;
				$rootScope.$broadcast('update:mates');
			}, this));
		},

		removeMate: function(id){
			jQuery.ajax({
				method: "DELETE",
				url: "/api/mate/" + id
			}).done(jQuery.proxy(this.updateMates, this));
		}
	}

	return MatesModel;


}])

/*app.directive('composeEmail', function(service){
	return {
		restrict: 'EA',
		replace: true,
		scope: true,
		controllerAs: 'compose',
		controller: function () {
			this.data = service.data;
		},
		link: function ($scope, $element, $attrs) {
		},
		template: [
			'<div class="compose-email" ng-bind="compose.data">',
			'</div>'
		].join('')
	};
});*/

angular.bootstrap(document.documentElement, ['app']); // run application




var client = {

	mockup: {
		name: 'john smith',
		desc: 'regular guy blabla',
		coords: {lat: 53.551202, lon: 10.002056},
		pic: 'https://upload.wikimedia.org/wikipedia/en/5/5c/Spongebob-squarepants.png',
		contact: {phone : '', email: 'sf@sf.com', skype: ''},
		duration: 10 * 60 * 1000 // '10m'
	},

	init: function(){
		this.refresh();
	},

	refresh: function(){
		jQuery.ajax({
			method: "GET",
			url: "/api/mates"
		}).done(jQuery.proxy(this.renderList, this));
	},

	details: function(id){
		jQuery.ajax({
			method: "GET",
			url: "/api/mate/" + id
		}).done(function(resp){
			alert(JSON.stringify(resp.mate));
		});
	},

	create: function(data){
		jQuery.ajax({
			method: "POST",
			url: "/api/mate",
			data: _.extend({}, this.mockup, data)
		}).done(jQuery.proxy(this.refresh, this));
	},

	update: function(id){
		jQuery.ajax({
			method: "PUT",
			url: "/api/mate/" + id,
			data: this.mockup
		}).done(jQuery.proxy(this.refresh, this));
	},

	delete: function(id){
		jQuery.ajax({
			method: "DELETE",
			url: "/api/mate/" + id
		}).done(jQuery.proxy(this.refresh, this));
	},

	renderList: function(resp){

		var list = jQuery('.mates-list'), mate;

		list.empty();

		_.each(resp, function(mate){
			list.append(this.createMate(mate));
		}, this);

		this.reBindEvs();
	},

	createMate: function(json){
		return '<li>'
			+ '<img height="30px;" src="' + json.pic + '"/>'
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
