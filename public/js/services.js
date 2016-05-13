angular.module('wif.services',[]).factory('Spot',function($resource){
    return $resource('/api/spots/:id',{id:'@_id'},{
        update: {
            method: 'PUT'
        }
    });
});