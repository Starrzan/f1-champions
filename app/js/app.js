'use strict';

// Declare app level module
angular.module('f1Champions', [
	'ngSanitize',
	'ui.router',
	'ngMaterial'
])

	// Enable pretty urls
	.config(['$locationProvider', function ($locationProvider) {
		$locationProvider.html5Mode(true);
	}])

	.config(function ($stateProvider, $urlRouterProvider) {

	// Routing
	$stateProvider
		.state('seasons', {
		url: '/',
		templateUrl: 'partials/seasons.html',
		controller: 'SeasonsController'
	})
		.state('season', {
		url: '/season/:season',
		templateUrl: 'partials/season.html',
		controller: 'SeasonController'
	})
	;

	// Catch all routes
	$urlRouterProvider.otherwise('/');

})

	// Set Material Design palette colors
	.config(function($mdThemingProvider) {
	$mdThemingProvider.theme('default')
		.primaryPalette('red')
		.accentPalette('grey');
})

	// Main controller to instansiate global app object and main UI functions
	.controller('appController', function ($scope, $rootScope, $window, $timeout, $mdDialog, $sanitize, AppService) {

	// Variables
	$rootScope.state; //Used for back button state check

	// Global app object object is populated with race data on user request and remains stored in storage for quicker access and less http requests
	$rootScope.f1Champions = {};
	$rootScope.f1Champions.appTitle = `F1 World Champions`;
	$rootScope.f1Champions.appVersion = `Version: 0.2.4`;
	$rootScope.f1Champions.author = `Coded by <a href="http://chronicles.co.za" target="_blank">Starrzan</a>`;

	// Ergast API constants
	$rootScope.f1Champions.ergastApi = '//ergast.com/api/f1';
	$rootScope.f1Champions.seasonStart = 2005;
	$rootScope.f1Champions.seasonEnd = 2015;

	// Initialise seasons object
	$rootScope.f1Champions.seasons = {};

	// About popup
	$scope.showAbout = function() {

		$mdDialog.show({
			controller: dialogController,
			templateUrl: 'partials/about.html',
			parent: angular.element(document.body),
			clickOutsideToClose:true,
			scope: $scope,
			preserveScope:true,
			openFrom: {
				top: -150,
				left: 1500,
				width: 30,
				height: 80
			},
			closeTo: {
				top: 50,
				right: 50
			}
		});

	};

	// Back to top
	$scope.backToTop = function() {

		if ($window.pageYOffset > 0) {
			$window.scrollBy(0, -10);
			$timeout($scope.backToTop, 0);
		}

	}

	// About dialog controller
	function dialogController($scope, $rootScope, $window, $location, $mdDialog, AppService) {

		/*// Remove the global app storage item and reload state
		$scope.resetData = function() {

			AppService.removeStoredObject('f1Champions');

			$mdDialog.cancel();

			$location.path('/');

			$window.location.reload();

		}*/

		$scope.close = function() {

			$mdDialog.cancel();

		};

	}

});