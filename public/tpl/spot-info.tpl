<div class="spot-info" ng-controller="SpotInfoController">
	<h2>{{spot.name}}</h2>
	<ng-include src="'tpl/star-rate.tpl'"></ng-include>
	<p>"{{spot.desc}}"</p>
	<div class="section">
		<h3>Are you interested in?</h3>
		<ul class="actions wrapper">
			<li><a ng-class="mode == 'rate' ? 'active' : ''" ng-click="toggleMode('rate')">Rate this plase</a></li>
			<li><a ng-class="mode && mode == 'reviews' ? 'active' : ''" ng-click="toggleMode('reviews')">Read reviews ({{spot.comments.length}})</a></li>
		</ul>
		<ng-include ng-if="mode == 'rate'" src="'tpl/rate-mode.tpl'"></ng-include>
		<ng-include ng-if="mode == 'reviews'" src="'tpl/reviews-mode.tpl'"></ng-include>
	</div>
	<div class="section">
	<h3>Are you spot-creator?</h3>
		<ul class="actions wrapper">
			<li><a ng-class="mode == 'edit' ? 'active' : ''" ng-click="toggleMode('edit')">Edit Spot</a></li>
			<li><a ng-class="mode == 'delete' ? 'active' : ''" ng-click="toggleMode('delete')">Delete Spot</a></li>
		</ul>
		<ng-include ng-if="mode == 'edit'" src="'tpl/edit-mode.tpl'"></ng-include>
		<ng-include ng-if="mode == 'delete'" src="'tpl/delete-mode.tpl'"></ng-include>
	</div>
</div>