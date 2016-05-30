<div class="rate-mode mode-holder" ng-controller="RateModeController">
	<div class="wrapper">
		<span>Rate this Spot:</span>
		<ng-include src="'tpl/star-rate.tpl'"></ng-include>
	</div>
	<div ng-if="rating != null" class="wrapper">
		<span>Add a comment:</span>
		<textarea ng-model="$parent.message" placeholder="minimum 20 chars"></textarea>
	</div>
	<div class="wrapper" ng-if="message.length > 20">
		<div id="recaptcha"></div>
		<a class="cta" ng-click="onSubmitRating()">Send</a>
	</div>
</div>