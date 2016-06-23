<div class="mode-holder">
	<form ng-if="removeDialog != true" ng-controller="LoginController" ng-submit="onSendCredentials()">
		<div class="wrapper">
			<span class="label">Enter your user ID:</span>
			<input ng-model="userID" placeholder="user ID (32 chars)" type="password" autocomplete="off"/>
		</div>
		<span ng-if="unauthorized == true" class="errorMsg">User ID is wrong</span>
		<div ng-if="captchaPassed != true" id="recaptcha"></div>
		<input ng-class="userID.length < 32 ? 'disabled' : ''" type="submit" class="cta" value="Send" />
	</form>
	<div ng-if="removeDialog == true">
		<h3>Delete this spot? Sure?</h3>
		<ul class="actions wrapper">
			<li><a ng-click="onDeleteSpot(false)">No</a></li>
			<li><a ng-click="onDeleteSpot(true)">Yes</a></li>
		</ul>
	</div>
</div>