<div class="closest-spots wrapper" ng-if="spots.length > 0">
	<h2>Closest spots:</h2>
	<ul>
		<li ng-repeat="spot in spots">
			<a href="#" ng-click="ctrl.goToSpot(spot.coords)">{{ spot.name }} ({{ ctrl.getDistance(spot.coords) }} km)</a>
			<!--<a href="#" ng-click="ctrl.removeSpot(spot._id)">Remove</a>-->
		</li>
	</ul>
</div>

<div id="map">

<ul class="location-controls wrapper">
	<li>
		<h2>Let us know about your location</h2>
		<a href="#" class="geolocation go-link">Go!</a>
	</li>
	<li>
		<input type="text" class="address" placeholder="Or click here and type address" />
		<a href="#" class="geocoding go-link">Go!</a>
	</li>
</ul>

</div>