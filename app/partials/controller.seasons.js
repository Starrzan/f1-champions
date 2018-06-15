'use strict';

angular.module('f1Champions')
	.controller('seasonsController', function($scope, $rootScope, $state, $location, $window, SeasonsService) {

	// Variables
	$scope.$state = $state;
	$rootScope.state = $state.current.name;

	// Iterate through seasons from start and end constraints and store season winners
	for (let season = $rootScope.f1Champions.seasonStart; season <= $rootScope.f1Champions.seasonEnd; season++) {

		// If global listing object does not contain seasons data then do API call and load data into global object
		if (typeof $rootScope.f1Champions.seasons[season] === 'undefined') {

			$scope.loading = true;

			let apiQuerySeasons = `${$rootScope.f1Champions.ergastApi}/${$rootScope.f1Champions.series}/${season}/driverStandings.json`;

			SeasonsService.getData(apiQuerySeasons).then(function (response) {

				let champion = response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings[0].Driver;
				$rootScope.f1Champions.seasons[season] = {'season': season, 'champion': `${champion.givenName} ${champion.familyName}`};

				// Update global listing object in localStorage
				$window.localStorage.setItem('f1Champions', JSON.stringify($rootScope.f1Champions));

				// Hide loading element on last item
				if (season == $rootScope.f1Champions.seasonEnd) {
					$scope.loading = false;
				}

			}, function (error) {
				console.log(error);
				$scope.loading = false;
			});

		} else {
			$scope.loading = false;
		}

	}

	// Set path based on season query parameter
	$scope.viewSeason = function(season) {
		$location.path(`/season/${season}`);
	}

});