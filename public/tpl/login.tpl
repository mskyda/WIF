<div ng-controller="LoginController">
	<h2><strong>Add spot:</strong> enter your email <a ng-click="onPopupEmail()">(why?)</a></h2>
	<input ng-model="userEmail" placeholder="email" type="email" ng-pattern="/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/" />
	<label for="have-id">I have user ID:</label>
	<input id="have-id" ng-model="haveUserID" type="checkbox" />
	<input ng-model="$parent.userID" placeholder="User ID" type="password" ng-if="haveUserID == true" />
	<a class="wizard-next" ng-if="userEmail.length && haveUserID != true" ng-click="sendCredentials()">Send email</a>
	<a class="wizard-next" ng-if="userEmail.length > 5 && userID.length" ng-click="$parent.wizardGo(1)">Next step</a>
</div>