<form ng-controller="LoginController" ng-submit="onSendCredentials()">
	<span class="title">{{ 'enterEmail' | translate }} <a ng-click="onPopupEmail()">(?)</a></span>
	<input ng-class="unauthorized == true ? 'required' : ''" ng-model="userEmail" placeholder="{{ 'email' | translate }}" type="email" ng-pattern="/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/" autocomplete="off" />
	<div class="checkbox-holder">
		<label for="have-id" translate="haveUserID"></label>
		<input id="have-id" ng-model="haveUserID" type="checkbox" />
	</div>
	<input ng-class="unauthorized == true ? 'required' : ''" ng-model="$parent.userID" placeholder="{{ 'userID' | translate }} (32 {{ 'chars' | translate }})" type="password" ng-if="haveUserID == true" autocomplete="off" />
	<a class="wizard-control" ng-if="haveUserID != true" ng-class="userEmail.length > 5 ? '' : 'disabled'" ng-click="userEmail.length > 5 ? onSendCredentials() : false" translate="receiveUserID"></a>
	<a class="wizard-control" ng-if="haveUserID == true" ng-class="userEmail.length > 5 && userID.length > 31 ? '' : 'disabled'" ng-click="userEmail.length > 5 && userID.length > 31 ? onSendCredentials() : false">
		<span class="desktop-only">{{ 'next' | translate }} </span>&gt;
	</a>
	<input type="submit" style="display: none;" />
</form>