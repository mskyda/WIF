<section class="sub-nav">
	<div class="wrapper" ng-if="center == null">
		<h2><strong translate="searchHeading"></strong> {{ 'wizardTip1' | translate }}</h2>
	</div>
	<div class="wrapper" ng-if="center != null && spots.length > 0">
		<h2>{{limit}} <span translate="searchClosest"></span></h2>
		<nav>
			<a ng-repeat="spot in spots | orderBy:orderProp | limitTo:limit" ng-click="goToSpot(spot)">
				{{spot.distance}} {{ 'kilometer' | translate }}
			</a>
		</nav>
		<a class="reset-location" ng-click="resetLocation()" translate="changeLocation"></a>
	</div>
</section>