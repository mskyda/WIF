<div ng-controller="LoginController">
	<h2><strong>Add spot :</strong> enter your email <a ng-click="onPopupEmail()">(why?)</a></h2>
	<input ng-class="unauthorized == true ? 'required' : ''" ng-model="userEmail" placeholder="email" type="email" ng-pattern="/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/" autocomplete="off" />
	<div class="checkbox-holder">
		<label for="have-id">I have user ID</label>
		<input id="have-id" ng-model="haveUserID" type="checkbox" />
	</div>
	<input ng-class="unauthorized == true ? 'required' : ''" ng-model="$parent.userID" placeholder="user ID (60 chars)" type="password" ng-if="haveUserID == true" autocomplete="off" />
	<a class="wizard-control" ng-if="userEmail.length && haveUserID != true" ng-click="onSendCredentials()">Send email</a>
	<a class="wizard-control" ng-if="userEmail.length > 5 && userID.length >= 60 && haveUserID" ng-click="onSendCredentials()"><span class="desktop-only">Next </span>&gt;</a>
</div>