<div class="mode-holder">
	<form ng-if="removeDialog != true" ng-controller="LoginController" ng-submit="onSendCredentials()">
		<div class="wrapper">
			<span class="label" translate="enterUserID"></span>
			<input ng-model="userID" placeholder="{{'userID' | translate}} (32 {{'chars' | translate}})" type="password" autocomplete="off"/>
		</div>
		<span ng-if="unauthorized == true" class="errorMsg" translate="wrongUserID"></span>
		<div ng-if="captchaPassed != true" id="recaptcha"></div>
		<input ng-class="userID.length < 32 ? 'disabled' : ''" type="submit" class="cta" value="{{ 'send' | translate }}" />
	</form>
	<div ng-if="removeDialog == true">
		<h3 translate="deleteConfirmation"></h3>
		<ul class="actions wrapper">
			<li><a ng-click="onDeleteSpot(false)" translate="buttonNo"></a></li>
			<li><a ng-click="onDeleteSpot(true)" translate="buttonYes"></a></li>
		</ul>
	</div>
</div>