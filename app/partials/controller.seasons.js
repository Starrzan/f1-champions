'use strict';

angular.module('f1Champions')
	.controller('seasonsController', function ($scope, $rootScope, $state, $location, AppService, $q) {

	// Variables
	$scope.$state = $state;
	$rootScope.state = $state.current.name;

	// Used to hide loading element when all promises are resolved
	let seasonsPromises = [];

	// Iterate through seasons from start and end constraints and store season winners
	for (let season = $rootScope.f1Champions.seasonStart; season <= $rootScope.f1Champions.seasonEnd; season++) {

		// If global listing object does not contain season data then do API call and load data into global object
		if (typeof $rootScope.f1Champions.seasons[season] === 'undefined') {

			// Show loading element
			$scope.loading = true;

			// Set Ergast API Query to get all season winners
			let apiQuerySeasons = `${$rootScope.f1Champions.ergastApi}/${$rootScope.f1Champions.series}/${season}/driverStandings.json`;

			let seasonPromise = AppService.getData(apiQuerySeasons).then(function (response) {

				// Get season winner
				let champion = response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings[0].Driver;

				// Set season data in global listing object
				$rootScope.f1Champions.seasons[season] = {
					'season': season,
					'champion': {
						'name': `${champion.givenName} ${champion.familyName}`,
					}
				}

				// Update global listing object in localStorage (future feature)
				//AppService.storeObject('f1Champions', $rootScope.f1Champions);

				return champion;

			}).then(function (response) {

				// Extract driver image from Wikipedia article field
				let apiQueryWikiDriver = AppService.getWikiArticleImageData(response.url);

				AppService.getData(apiQueryWikiDriver).then(function (response) {

					$rootScope.f1Champions.seasons[season].champion.image = (AppService.getWikiArticleImageSrc(response));

					// Update global listing object in localStorage (future feature)
					//AppService.storeObject('f1Champions', $rootScope.f1Champions);

					// Hide loading element on last item
					if (season == $rootScope.f1Champions.seasonEnd) {

						$scope.loading = false;

					}

				}).catch(function (error) {

					console.log(error);
					$scope.loading = false;

				})

			}).catch(function (error) {

				console.log(error);
				$scope.loading = false;

			})

		}

	}

	// Set path based on season query parameter
	$scope.viewSeason = function (season) {

		$location.path(`/season/${season}`);

	}

});