angular.module('services', ['ngResource']).factory('Spot',function($resource){
    return $resource('/api/spots/:id',{id:'@_id'},{
        update: {
            method: 'PUT'
        }
    });
});