<ul id="gallery" ng-controller="GalleryController">
	<li ng-class="index == $index ? 'active' : ''" ng-repeat="slide in slides" style="background-image: url(/img/gallery-img/{{$index}}.jpg);">
		<h3 class="title">{{ slide | translate }}</h3>
	</li>
</ul>