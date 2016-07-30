<div class="container" ng-if="popupHTML != null || popupTPL != null">
	<div class="container overlay" ng-click="togglePopup()"></div>
	<div class="holder wrapper">
		<div class="popup-frame">
			<div class="popup">
				<div class="wrapper">
					<a ng-click="togglePopup()" class="close-popup" translate="buttonClose"></a>
				</div>
				<ng-bind-html ng-bind-html="popupHTML"></ng-bind-html>
				<ng-include ng-if="popupTPL != null" src="popupTPL"></ng-include>
			</div>
		</div>
	</div>
</div>