<section class="sub-nav">
	<div class="wrapper" ng-if="center == null">
		<h2><strong>Search spots :</strong> use one of the buttons below</h2>
	</div>
	<div class="wrapper" ng-if="center != null && spots.length > 0">
		<h2>Top {{limit}} closest spots:</h2>
		<nav>
			<a ng-repeat="spot in spots | orderBy:orderProp | limitTo:limit" ng-click="goToSpot(spot)">
				{{spot.distance}} km
			</a>
		</nav>
		<a class="reset-location" ng-click="resetLocation()">Change location</a>
	</div>
</section>