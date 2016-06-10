<section class="map-holder" ng-controller="MapController">
	<ng-include src="'tpl/map-controls.tpl'"></ng-include>
	<div id="map" ng-if="center != null"></div>
</section>