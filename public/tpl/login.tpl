<div ng-controller="LoginController">
	<h2><strong>Add spot:</strong> enter your email <a ng-click="onPopupEmail()">(why?)</a></h2>
	<input ng-model="userEmail" placeholder="email" type="email" ng-pattern="/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/" />
	<label for="have-id">I have user ID:</label>
	<input id="have-id" ng-model="haveUserID" type="checkbox" />
	<input ng-model="$parent.userID" placeholder="User ID (60 chars)" type="password" ng-required="true" ng-if="haveUserID == true" />
	<a class="wizard-control" ng-if="userEmail.length && haveUserID != true" ng-click="onSendCredentials()">Send email</a>
	<a class="wizard-control" ng-if="userEmail.length > 5 && userID.length > 50" ng-click="onSendCredentials()">Next &gt;</a>
</div>