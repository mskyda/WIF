<div class="star-rate" ng-controller="StarRateController">
	<ul class="rating">
		<li ng-repeat="star in stars">
			<span ng-if="editableRate == null" class="star" ng-class="rating && rating >= star.i ? 'filled' : ''">&#9733;</span>
			<a ng-if="editableRate != null" ng-click="rate(star.i)" class="star" ng-class="rating && rating >= star.i ? 'filled' : ''">&#9733;</a>
		</li>
	</ul>
</div>