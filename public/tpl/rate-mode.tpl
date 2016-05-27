<div class="rate-mode mode-holder" ng-controller="RateModeController">
	<div class="wrapper">
		<span>Rate this Spot:</span>
		<ng-include src="'tpl/star-rate.tpl'"></ng-include>
	</div>
	<div class="wrapper">
		<span>Add a comment:</span>
		<textarea ng-model="comment"></textarea>
	</div>
	<div class="wrapper">
		<a class="cta">Send</a>
	</div>
</div>