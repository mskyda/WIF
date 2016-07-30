<div class="container overlay" ng-controller="MapControlsController">
	<ng-include ng-if="map == null" src="'tpl/gallery.tpl'"></ng-include>
	<div class="container overlay">
		<ul class="location-controls container">
			<li>
				<div class="holder">
					<h2 translate="titleGeolocation"></h2>
					<a ng-click="getCurrentPosition()" class="geolocation go-link">OK</a>
				</div>
			</li>
			<li>
				<div class="holder">
					<h2 ng-if="geoResults == null" translate="titleGeocoding"></h2>
					<form ng-if="geoResults == null" ng-submit="inputAddress(address)">
						<input ng-class="address == '' ? 'required' : ''" ng-model="address" type="text" class="address" autocomplete="off" />
						<input type="submit" class="geocoding go-link" value="OK" />
					</form>
					<div ng-if="geoResults.length != null">
						<div ng-if="geoResults.length > 0">
							<h2 translate="searchResults"></h2>
							<ul class="geocoding-results">
								<li ng-repeat="res in geoResults">
									<a ng-click="renderMap(res.geometry.location)">{{ res.formatted_address }}</a>
								</li>
							</ul>
						</div>
						<h2 ng-if="geoResults.length == 0" translate="nothingFound"></h2>
						<a ng-click="resetSearch()" translate="repeatSearch"></a>
					</div>
				</div>
			</li>
		</ul>
	</div>
</div>