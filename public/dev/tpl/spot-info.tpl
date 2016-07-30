<div class="spot-info" ng-controller="SpotInfoController">
	<h2 ng-if="!spotFound" translate="spotNotFound"></h2>
	<div ng-if="spotFound">
		<h2>{{spot.name}}</h2>
		<p><a>{{spotLink}}</a></p>
		<ng-include src="'tpl/star-rate.tpl'"></ng-include>
		<p><span class="quote">"</span>{{spot.desc}}<span class="quote">"</span></p>
		<div class="section navigation">
			<dl class="wrapper">
				<dt translate="coordinates"></dt>
				<dd>{{spot.coords.lat}}; {{spot.coords.lng}}</dd>
				<dt ng-show="directions.length" translate="getDirection"></dt>
				<dd ng-show="directions.length">
					<select ng-model="$parent.transportType">
						<option value="" disabled selected translate="transportType"></option>
						<option ng-repeat="direction in directions" ng-disabled="!direction.way" value="{{direction.index}}">{{direction.mode | translate}} {{direction.way}}</option>
					</select>
				</dd>
			</dl>
		</div>
		<div class="section">
			<h3 translate="interestedIn"></h3>
			<ul class="actions wrapper">
				<li><a ng-class="mode == 'rate' ? 'active' : ''" ng-click="toggleMode('rate')" translate="spotRate"></a></li>
				<li><a ng-class="mode && mode == 'reviews' ? 'active' : ''" ng-click="toggleMode('reviews')" translate="readReviews"> ({{spot.comments.length}})</a></li>
			</ul>
			<ng-include ng-if="mode == 'rate'" src="'tpl/spot-modes/rate.tpl'"></ng-include>
			<ng-include ng-if="mode == 'reviews'" src="'tpl/spot-modes/reviews.tpl'"></ng-include>
		</div>
		<div class="section">
		<h3 translate="spotCreator"></h3>
			<ul class="actions wrapper">
				<li><a ng-class="mode == 'edit' ? 'active' : ''" ng-click="toggleMode('edit')" translate="spotEdit"></a></li>
				<li><a ng-class="mode == 'delete' ? 'active' : ''" ng-click="toggleMode('delete')" translate="spotDelete"></a></li>
			</ul>
			<ng-include ng-if="mode == 'edit'" src="'tpl/spot-modes/edit-delete.tpl'"></ng-include>
			<ng-include ng-if="mode == 'delete'" src="'tpl/spot-modes/edit-delete.tpl'"></ng-include>
		</div>
	</div>
</div>