<div class="overlay" ng-if="center == null">
	<ul class="location-controls holder" ng-controller="MapControlsController">
		<li>
			<h2>Let us know your location</h2>
			<a ng-click="getCurrentPosition()" class="geolocation go-link">Go!</a>
		</li>
		<li>
			<form ng-if="geoResults == null" ng-submit="inputAddress(address)">
				<input ng-class="address == '' ? 'required' : ''" ng-model="address" type="text" class="address" placeholder="Or click here and type address" autocomplete="off" />
				<input type="submit" class="geocoding go-link" value="Go!" />
			</form>
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
</div>