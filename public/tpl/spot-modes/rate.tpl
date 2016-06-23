<div class="rate-mode mode-holder" ng-controller="RateModeController">
	<div class="wrapper">
		<span class="label">Rate this Spot:</span>
		<ng-include src="'tpl/star-rate.tpl'"></ng-include>
	</div>
	<div ng-if="rating != null">
		<div class="wrapper">
			<span class="label">Add a comment:</span>
			<textarea ng-model="$parent.message" placeholder="minimum 20 chars"></textarea>
		</div>
		<div id="recaptcha"></div>
		<a ng-class="message.length >= 20 ? '' : 'disabled'" class="cta" ng-click="onSubmitRating()">Send</a>
	</div>
</div>