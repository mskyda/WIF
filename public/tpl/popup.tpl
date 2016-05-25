<div class="popup-overlay" ng-click="togglePopup()" ng-if="popupHTML != null || popupTPL != null">
	<div class="popup-holder wrapper">
		<div class="popup-frame">
			<div class="popup">
				<ng-bind-html ng-bind-html="popupHTML"></ng-bind-html>
				<ng-include ng-if="popupTPL != null" src="popupTPL"></ng-include>
			</div>
		</div>
	</div>
</div>