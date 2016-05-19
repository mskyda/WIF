<div class="closest-spots wrapper" ng-if="spots.length > 0">
	<h2>Closest {{limit}} spots:</h2>
	<ul>
		<li >
			<a ng-repeat="spot in spots | orderBy:orderProp | limitTo:limit" ng-click="goToSpot(spot)">{{spot.name}} ({{spot.distance}} km)</a>
		</li>
	</ul>
</div>