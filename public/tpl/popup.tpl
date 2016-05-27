<div class="popup-container" ng-if="popupHTML != null || popupTPL != null">
	<div class="popup-overlay" ng-click="togglePopup()"></div>
	<div class="popup-holder wrapper">
		<div class="popup-frame">
			<div class="popup">
				<div class="wrapper">
					<a ng-click="togglePopup()" class="close-popup">Close</a>
				</div>
				<ng-bind-html ng-bind-html="popupHTML"></ng-bind-html>
				<ng-include ng-if="popupTPL != null" src="popupTPL"></ng-include>
			</div>
		</div>
	</div>
</div>