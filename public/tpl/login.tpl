<form ng-controller="LoginController" ng-submit="onSendCredentials()">
	<h2><strong>Add spot :</strong> enter your email <a ng-click="onPopupEmail()">(why?)</a></h2>
	<input ng-class="unauthorized == true ? 'required' : ''" ng-model="userEmail" placeholder="email" type="email" ng-pattern="/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/" autocomplete="off" />
	<div class="checkbox-holder">
		<label for="have-id">I have user ID</label>
		<input id="have-id" ng-model="haveUserID" type="checkbox" />
	</div>
	<input ng-class="unauthorized == true ? 'required' : ''" ng-model="$parent.userID" placeholder="user ID (32 chars)" type="password" ng-if="haveUserID == true" autocomplete="off" />
	<a class="wizard-control" ng-if="haveUserID != true" ng-class="userEmail.length > 5 ? '' : 'disabled'" ng-click="userEmail.length > 5 ? onSendCredentials() : false">
		Send email
	</a>
	<a class="wizard-control" ng-if="haveUserID == true" ng-class="userEmail.length > 5 && userID.length > 31 ? '' : 'disabled'" ng-click="userEmail.length > 5 && userID.length > 31 ? onSendCredentials() : false">
		<span class="desktop-only">Next </span>&gt;
	</a>
	<input type="submit" style="display: none;" />
</form>