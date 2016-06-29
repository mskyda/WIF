<section class="sub-nav">
	<h2><strong>{{ ('spot' + title) | translate }} :&nbsp;</strong></h2>
	<span class="title" ng-if="center == null" translate="manageTip1"></span>
	<div ng-if="center != null">
		<ng-include ng-if="spot.step == 0" src="'tpl/login.tpl'"></ng-include>
		<div ng-if="spot.step == 1">
			<div ng-if="spot.coords == null">
				<span class="title" translate="manageTip2"></span>
				<a class="reset-location" ng-click="resetLocation()" translate="changeLocation"></a>
			</div>
			<div ng-if="spot.coords != null">
				<span class="title">{{ 'latitude' | translate }} : {{spot.coords.lat}}; {{ 'longitude' | translate }} : {{spot.coords.lng}}</span>
				<a class="wizard-control" ng-click="wizardGo(1)">
					<span class="desktop-only">{{ 'next' | translate }} </span>&gt;
				</a>
			</div>
		</div>
		<form ng-if="spot.step == 2">
			<span class="title" translate="manageTip3"></span>
			<input ng-model="spot.name" placeholder="{{ 'minimum' | translate }} 6 {{ 'chars' | translate }}" type="text" autocomplete="off" />
			<a class="wizard-control" ng-class="spot.name.length > 5 ? '' : 'disabled'" ng-click="spot.name.length > 5 ? wizardGo(1) : false">
				<span class="desktop-only">{{ 'next' | translate }} </span>&gt;
			</a>
			<a class="wizard-control" ng-click="wizardGo(-1)">
				&lt; <span class="desktop-only" translate="back"></span>
			</a>
			<input type="submit" style="display: none;" />
		</form>
		<div ng-if="spot.step == 3">
			<span class="title" translate="manageTip4"></span>
			<textarea ng-model="spot.desc" placeholder="{{ 'minimum' | translate }} 20 {{ 'chars' | translate }}"></textarea>
			<a class="cta" ng-class="spot.desc.length > 20 ? '' : 'disabled'" ng-click="spot.desc.length > 20 ? manageSpot() : false">{{ ('button' + title) | translate }}</a>
			<a class="wizard-control" ng-click="wizardGo(-1)">
				&lt; <span class="desktop-only" translate="back"></span>
			</a>
		</div>
	</div>
</section>