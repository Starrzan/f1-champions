'use strict';

// Declare app level module
angular.module('f1Champions', [
	'ngRoute',
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
		controller: 'seasonsController'
	})
		.state('season', {
		url: '/season/:season',
		templateUrl: 'partials/season.html',
		controller: 'seasonController'
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

	// Main controller to instansiate global listing object and main UI functions
	.controller('appController', function ($scope, $rootScope, $state, $window, $timeout, $mdDialog, $sanitize) {

	// Variables
	$rootScope.state; //Used for back button state check

	// Check if global varialbe is set in storage, if not then set
	// Global variable is populated with race data on user request and remains stored in storage for quicker access and less http requests
	if ($window.localStorage.getItem('f1Champions')) {
		$rootScope.f1Champions = JSON.parse($window.localStorage.getItem('f1Champions'));
	} else {
		$rootScope.f1Champions = {};
		$rootScope.f1Champions.appTitle = `F1 World Champions`;
		$rootScope.f1Champions.appVersion = `Version: 0.1.4`;
		$rootScope.f1Champions.author = `Coded by <a href="http://chronicles.co.za" target="_blank">Starrzan</a>`;

		// Ergast API constants
		$rootScope.f1Champions.ergastApi = '//ergast.com/api';
		$rootScope.f1Champions.series = 'f1';
		$rootScope.f1Champions.seasonStart = 2005;
		$rootScope.f1Champions.seasonEnd = 2015;

		// Initialise seasons array
		$rootScope.f1Champions.seasons = {};

		// Store global listing object in localStorage
		$window.localStorage.setItem('f1Champions', JSON.stringify($rootScope.f1Champions));
	}

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
	function dialogController($scope, $rootScope, $window, $location, $mdDialog) {

		// Remove the global listing storage item and reload state
		$scope.resetData = function() {
			$window.localStorage.removeItem('f1Champions');
			$mdDialog.cancel();
			$location.path('/');
			$window.location.reload();
		}

		$scope.close = function() {
			$mdDialog.cancel();
		};

	}

});