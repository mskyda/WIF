<section class="map-holder" ng-controller="MapController">
	<ng-include ng-if="center == null" src="'tpl/map-controls.tpl'"></ng-include>
	<div id="map" class="container"></div>
</section>