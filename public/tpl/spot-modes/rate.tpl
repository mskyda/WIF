<div class="rate-mode mode-holder" ng-controller="RateModeController">
	<div class="wrapper">
		<span class="label">Rate this Spot:</span>
		<ng-include src="'tpl/star-rate.tpl'"></ng-include>
	</div>
	<div ng-if="rating != null" class="wrapper">
		<span class="label">Add a comment:</span>
		<textarea ng-model="$parent.message" placeholder="minimum 20 chars"></textarea>
	</div>
	<div ng-if="message.length > 20">
		<div id="recaptcha"></div>
		<a class="cta" ng-click="onSubmitRating()">Send</a>
	</div>
</div>