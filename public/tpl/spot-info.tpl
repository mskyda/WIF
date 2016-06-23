<div class="spot-info" ng-controller="SpotInfoController">
	<h2 ng-if="notFound">Sorry, Spot with this ID is not found</h2>
	<h2>{{spot.name}}</h2>
	<ng-include src="'tpl/star-rate.tpl'"></ng-include>
	<p><span class="quote">"</span>{{spot.desc}}<span class="quote">"</span></p>
	<div class="section navigation" ng-show="directions.length">
		<dl class="wrapper">
			<dt>Coordinates:</dt>
			<dd>{{spot.coords.lat}}, {{spot.coords.lng}}</dd>
			<dt>Get direction:</dt>
			<dd>
				<select ng-model="transportType">
					<option value="" disabled selected>Transport type</option>
					<option ng-repeat="direction in directions" ng-disabled="!direction.way" value="{{direction.index}}">{{direction.name}} {{direction.way}}</option>
				</select>
			</dd>
		</dl>
	</div>
	<div class="section">
		<h3>Interested in?</h3>
		<ul class="actions wrapper">
			<li><a ng-class="mode == 'rate' ? 'active' : ''" ng-click="toggleMode('rate')">Rate this plase</a></li>
			<li><a ng-class="mode && mode == 'reviews' ? 'active' : ''" ng-click="toggleMode('reviews')">Read reviews ({{spot.comments.length}})</a></li>
		</ul>
		<ng-include ng-if="mode == 'rate'" src="'tpl/spot-modes/rate.tpl'"></ng-include>
		<ng-include ng-if="mode == 'reviews'" src="'tpl/spot-modes/reviews.tpl'"></ng-include>
	</div>
	<div class="section">
	<h3>Spot-creator?</h3>
		<ul class="actions wrapper">
			<li><a ng-class="mode == 'edit' ? 'active' : ''" ng-click="toggleMode('edit')">Edit Spot</a></li>
			<li><a ng-class="mode == 'delete' ? 'active' : ''" ng-click="toggleMode('delete')">Delete Spot</a></li>
		</ul>
		<ng-include ng-if="mode == 'edit'" src="'tpl/spot-modes/edit-delete.tpl'"></ng-include>
		<ng-include ng-if="mode == 'delete'" src="'tpl/spot-modes/edit-delete.tpl'"></ng-include>
	</div>
</div>