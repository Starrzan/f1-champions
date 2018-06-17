'use strict';

angular.module('f1Champions')
	.controller('SeasonsController', function ($scope, $rootScope, $state, $location, AppService, SeasonsService) {

	// Variables
	$scope.$state = $state;
	$rootScope.state = $state.current.name;

	// Iterate through seasons from start and end constraints and store season winners
	for (let season = $rootScope.f1Champions.seasonStart; season <= $rootScope.f1Champions.seasonEnd; season++) {

		// Show loading element if loader true
		$scope.loading = true;

		SeasonsService.saveSeason(season).then(function (response) {

			// Hide loading element on last item if loader true
			if (season == $rootScope.f1Champions.seasonEnd) {

				$scope.loading = false;

			}

		}).catch(function (error) {

			console.log(error);
			loader ? this.loading = false : '';

		});

	}

	// Set path based on season query parameter
	$scope.viewSeason = function (season) {

		$location.path(`/season/${season}`);

	}

});