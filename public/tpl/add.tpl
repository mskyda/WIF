<h2 ng-if="center != null"><a ng-click="addSpot()">ADD SPOT</a></h2>

<section id="map" ng-controller="MapController">

	<ul class="location-controls wrapper" ng-if="center == null">
		<li>
			<h2>Let us know about your location</h2>
			<a ng-click="getCurrentPosition()" class="geolocation go-link">Go!</a>
		</li>
		<li>
			<div ng-if="geoResults == null">
				<input type="text" class="address" placeholder="Or click here and type address" />
				<a ng-click="inputAddress()" class="geocoding go-link">Go!</a>
			</div>
			<div ng-if="geoResults.length != null">
				<div ng-if="geoResults.length > 0">
					<h2>Search results:</h2>
					<ul class="geocoding-results">
						<li ng-repeat="res in geoResults">
							<a ng-click="renderMap(res.geometry.location)">{{ res.formatted_address }}</a>
						</li>
					</ul>
				</div>
				<h2 ng-if="geoResults.length == 0">Nothing found. Check address.</h2>
				<a ng-click="resetSearch()">Search once again</a>
			</div>
		</li>
	</ul>

</section>