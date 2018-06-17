'use strict';

angular.module('f1Champions')
	.controller('SeasonController', function ($scope, $rootScope, $state, $stateParams, AppService, SeasonsService) {

	// Variables
	let season = $stateParams.season;
	$scope.season = season; // Used in ng-repeat
	$scope.$state = $state;
	$rootScope.state = $state.current.name;

	SeasonsService.saveSeason(season).then(function (response) {

		// Set Ergast API Query to get all rounds
		let apiQueryRounds = `${$rootScope.f1Champions.ergastApi}/${season}.json`;

		// Get season rounds
		AppService.getData(apiQueryRounds).then(function (response) {

			// Initialise rounds object in global app object if not found
			if (typeof $rootScope.f1Champions.seasons[season].rounds  === 'undefined') {

				$rootScope.f1Champions.seasons[season].rounds = {};

			}

			// Set temp season rounds
			let rounds = response.data.MRData.RaceTable.Races;

			// Reduce rounds array and store round winners through promises
			rounds.reduce(function (previousRound, currentRound) {

				// Show loading element
				$scope.loading = true;

				// Set Ergast API Query to get round results
				let apiQueryRound = `${$rootScope.f1Champions.ergastApi}/${currentRound.season}/${currentRound.round}/results.json`;

				AppService.getData(apiQueryRound).then(function (response) {

					// Set round data in global app object
					$rootScope.f1Champions.seasons[currentRound.season].rounds[currentRound.round] = {
						'round': currentRound.round,
						'name': currentRound.raceName,
						'season': currentRound.season
					}

					// Get round winner
					let winner = response.data.MRData.RaceTable.Races[0].Results[0].Driver;

					// Set round winner data in global app object
					$rootScope.f1Champions.seasons[currentRound.season].rounds[currentRound.round].winner = {
						'name': `${winner.givenName} ${winner.familyName}`
					};

					return winner;

				}).then(function (response) {

					// Extract driver image from Wikipedia article field
					let apiQueryWikiDriver = AppService.getWikiArticleImageData(response.url);

					AppService.getData(apiQueryWikiDriver).then(function (response) {

						// Set winner image in global app object
						$rootScope.f1Champions.seasons[currentRound.season].rounds[currentRound.round].winner.image = AppService.getWikiArticleImageSrc(response);

					});

				}).then(function (response) {

					// Extract country code from country
					let apiQueryRestCountries = AppService.getRestCountriesURL(currentRound.Circuit.Location.country);

					AppService.getData(apiQueryRestCountries).then(function (response) {

						// Set round country in global app object
						$rootScope.f1Champions.seasons[currentRound.season].rounds[currentRound.round].country = `http://www.countryflags.io/${response.data[0].alpha2Code}/flat/64.png`;

					});

				}).then(function (response) {

					// Extract circuit image from Wikipedia article field
					let apiQueryWikiRound = AppService.getWikiArticleImageData(currentRound.url);

					AppService.getData(apiQueryWikiRound).then(function (response) {

						// Set round circuit in global app object
						$rootScope.f1Champions.seasons[currentRound.season].rounds[currentRound.round].circuit = AppService.getWikiArticleImageSrc(response);

						// Hide loading element on last item
						if (currentRound.round == rounds.length) {

							$scope.loading = false;

						}

					});

				}).catch(function (error) {

					console.log(error);
					$scope.loading = false;

				});

				// Return promise and call next in array until all are resolved
				return previousRound.then(currentRound);

				// Start reduce with resolved promise
			}, Promise.resolve());


		}).catch(function (error) {

			console.log(error);
			$scope.loading = false;

		});

	})

});