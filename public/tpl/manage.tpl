<section class="sub-nav">
	<h2><strong>{{title}} spot :&nbsp;</strong></h2>
	<span class="title" ng-if="center == null">use one of the buttons below</span>
	<div ng-if="center != null">
		<ng-include ng-if="spot.step == 0" src="'tpl/login.tpl'"></ng-include>
		<div ng-if="spot.step == 1">
			<div ng-if="spot.coords == null">
				<span class="title">choose place on map with double-click</span>
				<a class="reset-location" ng-click="resetLocation()">Change location</a>
			</div>
			<div ng-if="spot.coords != null">
				<span class="title">Lat.: {{spot.coords.lat}}; Lng.: {{spot.coords.lng}}</span>
				<a class="wizard-control" ng-click="wizardGo(1)"><span class="desktop-only">Next </span>&gt;</a>
			</div>
		</div>
		<form ng-if="spot.step == 2">
			<span class="title">enter the spot-name</span>
			<input ng-model="spot.name" placeholder="minimum 6 chars" type="text" autocomplete="off" />
			<a class="wizard-control" ng-class="spot.name.length > 5 ? '' : 'disabled'" ng-click="spot.name.length > 5 ? wizardGo(1) : false"><span class="desktop-only">Next </span>&gt;</a>
			<a class="wizard-control" ng-click="wizardGo(-1)">&lt; <span class="desktop-only">Back</span></a>
			<input type="submit" style="display: none;" />
		</form>
		<div ng-if="spot.step == 3">
			<span class="title">describe the spot</span>
			<textarea ng-model="spot.desc" placeholder="minimum 20 chars"></textarea>
			<a class="cta" ng-class="spot.desc.length > 20 ? '' : 'disabled'" ng-click="spot.desc.length > 20 ? manageSpot() : false">{{title}}</a>
			<a class="wizard-control" ng-click="wizardGo(-1)">&lt; <span class="desktop-only">Back</span></a>
		</div>
	</div>
</section>