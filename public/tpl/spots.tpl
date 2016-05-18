<div class="closest-spots wrapper" ng-if="spots.length > 0">
	<h2>Closest {{limit}} spots:</h2>
	<ul>
		<li ng-repeat="spot in spots | orderBy:orderProp | limitTo:limit">
			<a ng-click="goToSpot(spot)">{{spot.name}} ({{spot.distance}} km)</a>
			<!--<a href="#" ng-click="ctrl.removeSpot(spot._id)">Remove</a>-->
		</li>
	</ul>
</div>