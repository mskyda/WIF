<div ng-controller="LoginController">
	<h2><strong>Add spot:</strong> enter your email <a ng-click="onPopupEmail()">(why?)</a></h2>
	<input ng-model="email" placeholder="email" type="email" ng-pattern="/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/" />
	<label for="have-password">I have password:</label>
	<input id="have-password" ng-model="havePass" type="checkbox" />
	<input ng-model="$parent.password" placeholder="password" type="password" ng-if="havePass == true" />
	<a class="wizard-next" ng-if="email.length && havePass != true" ng-click="sendEmail()">Send email</a>
	<a class="wizard-next" ng-if="email.length > 5 && password.length" ng-click="$parent.wizardGo(1)">Next step</a>
</div>