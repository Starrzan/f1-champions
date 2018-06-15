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

			// Start loading element
			$scope.loading = true;

			// Set Ergast API Query to get all season winners
			let apiQuerySeasons = `${$rootScope.f1Champions.ergastApi}/${$rootScope.f1Champions.series}/${season}/driverStandings.json`;

			SeasonsService.getData(apiQuerySeasons).then(function (response) {

				// Get season winner
				let champion = response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings[0].Driver;

				// Set season data in global listing object
				$rootScope.f1Champions.seasons[season] = {
					'season': season,
					'champion': {
						'name': `${champion.givenName} ${champion.familyName}`
					}
				};

				return champion;

			}).then(function (response) {

				// Extract driver image from Wikipedia article field
				let driverWiki = decodeURI(response.url).match(/[^/]+(?=\/$|$)/);
				let apiQueryWikiDriver = `https://en.wikipedia.org/w/api.php?action=query&titles=${driverWiki}&prop=pageimages&format=json&origin=*&pithumbsize=50`;

				SeasonsService.getData(apiQueryWikiDriver).then(function (response) {

					// Access Wikipedia object to get image source and set driver image in global listing object
					for (let page in response.data.query.pages) {
						$rootScope.f1Champions.seasons[season].champion.image =
							response.data.query.pages[page].thumbnail.source;
					};

					// Update global listing object in localStorage
					$window.localStorage.setItem('f1Champions', JSON.stringify($rootScope.f1Champions));

					// Hide loading element on last item
					if (season == $rootScope.f1Champions.seasonEnd) {
						$scope.loading = false;
					}

					return this;

				});

				return this;

			}).catch(function (error) {
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