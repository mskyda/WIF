<div class="rate-mode mode-holder" ng-controller="RateModeController">
	<div class="wrapper">
		<span class="label" translate="addRate"></span>
		<ng-include src="'tpl/star-rate.tpl'"></ng-include>
	</div>
	<div ng-if="rating != null">
		<div class="wrapper">
			<span class="label" translate="addComment"></span>
			<textarea ng-model="$parent.message" placeholder="{{ 'minimum' | translate }} 20 {{ 'chars' | translate }}"></textarea>
		</div>
		<div id="recaptcha"></div>
		<a ng-class="message.length >= 20 ? '' : 'disabled'" class="cta" ng-click="onSubmitRating()" translate="send"></a>
	</div>
</div>