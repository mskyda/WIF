<section class="sub-nav">
	<div class="wrapper" ng-if="center == null">
		<h2><strong>{{title}} spot :</strong> use one of the buttons below</h2>
	</div>
	<div ng-if="center != null">
		<ng-include ng-if="spot.step == 0" src="'tpl/login.tpl'"></ng-include>
		<div ng-if="spot.step == 1">
			<div ng-if="spot.coords == null" class="wrapper">
				<h2><strong>{{title}} spot :</strong> choose place on map with double-click</h2>
				<a class="reset-location" ng-click="resetLocation()">Change location</a>
			</div>
			<div ng-if="spot.coords != null" class="wrapper">
				<h2><strong>{{title}} spot :</strong> Lat.: {{spot.coords.lat}}; Lng.: {{spot.coords.lng}}</h2>
				<a class="wizard-control" ng-click="wizardGo(1)"><span class="desktop-only">Next </span>&gt;</a>
			</div>
		</div>
		<div ng-if="spot.step == 2 && spot.coords != null">
			<form ng-if="spot.coords != null" class="wrapper">
				<h2><strong>{{title}} spot :</strong> enter the spot-name</h2>
				<input ng-model="spot.name" placeholder="minimum 6 chars" type="text" autocomplete="off" />
				<a class="wizard-control" ng-if="spot.name.length > 5" ng-click="wizardGo(1)"><span class="desktop-only">Next </span>&gt;</a>
				<a class="wizard-control" ng-click="wizardGo(-1)">&lt; <span class="desktop-only">Back</span></a>
				<input type="submit" style="display: none;" />
			</form>
		</div>
		<div ng-if="spot.step == 3 && spot.coords != null">
			<div ng-if="spot.coords != null" class="wrapper">
				<h2><strong>{{title}} spot :</strong> describe the spot</h2>
				<textarea ng-model="spot.desc" placeholder="minimum 20 chars"></textarea>
				<a class="cta" ng-if="spot.desc.length > 20" ng-click="manageSpot()">{{title}}</a>
				<a class="wizard-control" ng-click="wizardGo(-1)">&lt; <span class="desktop-only">Back</span></a>
			</div>
		</div>
	</div>
</section>