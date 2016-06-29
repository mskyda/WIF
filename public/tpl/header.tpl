<header id="header" class="wrapper">
	<h1 class="logo"><a ui-sref="search">{{ 'siteName' | translate }}</a></h1>
	<div class="header-holder">
		<h2 class="slogan">{{ 'slogan1' | translate }} {{total}} {{ 'slogan2' | translate }}</h2>
		<select class="language-select" ng-model="$parent.siteLang">
			<option value="en">English</option>
			<option value="ru">Русский</option>
			<!--<option value="de">Deutsch</option>
			<option value="pl">Polski</option>-->
		</select>
		<nav class="tabs">
			<a ui-sref="search" ui-sref-active="active">{{ 'navSearch' | translate }}</a>
			<a ui-sref="manage" ui-sref-active="active">{{ 'navManage' | translate }}</a>
			<a ui-sref="about" ui-sref-active="active">{{ 'navAbout' | translate }}</a>
		</nav>
	</div>
</header>