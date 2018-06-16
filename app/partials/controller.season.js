'use strict';

angular.module('f1Champions')
	.controller('seasonController', function ($scope, $rootScope, $state, $stateParams, AppService) {

	// Variables
	let season = $stateParams.season;
	$scope.season = season; // Used in ng-repeat
	$scope.$state = $state;
	$rootScope.state = $state.current.name;

	// If global listing object does not contain round data then do API call and load data into global object (feature feature)
	//console.log(AppService.checkStoredObject($rootScope.f1Champions.seasons[season], 'rounds'));

	// Show loading element
	$scope.loading = true;

	// If page is accessed via page refresh or direct URL then set season property of global listiting object
	if (typeof $rootScope.f1Champions.seasons[season] === 'undefined') {

		$rootScope.f1Champions.seasons[season] = {
			'season': season
		};

		// Set Ergast API Query to get all season winners
		let apiQuerySeasons = `${$rootScope.f1Champions.ergastApi}/${$rootScope.f1Champions.series}/${season}/driverStandings.json`;

		AppService.getData(apiQuerySeasons).then(function (response) {

			// Get season winner
			let champion = response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings[0].Driver;

			// Set season data in global listing object
			$rootScope.f1Champions.seasons[season].champion = {
				'name': `${champion.givenName} ${champion.familyName}`
			};

			return champion;

		}).then(function (response) {

			// Extract driver image from Wikipedia article field
			let apiQueryWikiDriver = AppService.getWikiArticleImageData(response.url);

			AppService.getData(apiQueryWikiDriver).then(function (response) {

				$rootScope.f1Champions.seasons[season].champion.image = AppService.getWikiArticleImageSrc(response);

				// Update global listing object in localStorage (future feature)
				//AppService.storeObject('f1Champions', $rootScope.f1Champions);

			}).catch(function (error) {

				console.log(error);
				$scope.loading = false;

			})

		}).catch(function (error) {

			console.log(error);
			$scope.loading = false;

		})
	}

	// Set Ergast API Query to get all rounds
	let apiQueryRounds = `${$rootScope.f1Champions.ergastApi}/${$rootScope.f1Champions.series}/${season}.json`;

	// Get season rounds
	AppService.getData(apiQueryRounds).then(function (response) {

		// Initialise rounds object in global listing object if not found
		if (typeof $rootScope.f1Champions.seasons[season].rounds  === 'undefined') {

			$rootScope.f1Champions.seasons[season].rounds = {};

		}

		// Set temp season rounds
		let rounds = response.data.MRData.RaceTable.Races;

		// Iterate through rounds promise and store round winners
		rounds.reduce(function(previousRound, currentRound) {

			// If global listing object does not contain round data then do API call and load data into global object (feature feature)
			//console.log(AppService.checkStoredObject($rootScope.f1Champions.seasons[season].rounds, 'round'));

			// Show loading element
			$scope.loading = true;

			// Set Ergast API Query to get round results
			let apiQueryRound = `${$rootScope.f1Champions.ergastApi}/${$rootScope.f1Champions.series}/${season}/${currentRound.round}/results.json`;

			AppService.getData(apiQueryRound).then(function (response) {

				// Set round data in global listing object
				$rootScope.f1Champions.seasons[season].rounds[currentRound.round] = {
					'round': currentRound.round,
					'name': currentRound.raceName,
					'season': currentRound.season
				}

				// Get round winner
				let winner = response.data.MRData.RaceTable.Races[0].Results[0].Driver;

				// Set round winner data in global listing object
				$rootScope.f1Champions.seasons[season].rounds[currentRound.round].winner = {
					'name': `${winner.givenName} ${winner.familyName}`
				};

				return winner;

			}).then(function (response) {

				// Extract driver image from Wikipedia article field
				let apiQueryWikiDriver = AppService.getWikiArticleImageData(response.url);

				AppService.getData(apiQueryWikiDriver).then(function (response) {

					// Set winner image in global listing object
					$rootScope.f1Champions.seasons[season].rounds[currentRound.round].winner.image = AppService.getWikiArticleImageSrc(response);

					// Update global listing object in localStorage (future feature)
					//AppService.storeObject('f1Champions', $rootScope.f1Champions);

				});

			}).then(function (response) {

				// Extract country code from country
				let apiQueryRestCountries = AppService.getRestCountriesURL(currentRound.Circuit.Location.country);

				AppService.getData(apiQueryRestCountries).then(function (response) {

					// Set round country in global listing object
					$rootScope.f1Champions.seasons[season].rounds[currentRound.round].country = `http://www.countryflags.io/${response.data[0].alpha2Code}/flat/64.png`;

					// Update global listing object in localStorage (future feature)
					//AppService.storeObject('f1Champions', $rootScope.f1Champions);

				});

			}).then(function (response) {

				// Extract circuit image from Wikipedia article field
				let apiQueryWikiRound = AppService.getWikiArticleImageData(currentRound.url);

				AppService.getData(apiQueryWikiRound).then(function (response) {

					// Set round circuit in global listing object
					$rootScope.f1Champions.seasons[season].rounds[currentRound.round].circuit = AppService.getWikiArticleImageSrc(response);

					// Update global listing object in localStorage (future feature)
					//AppService.storeObject('f1Champions', $rootScope.f1Champions);

					// Hide loading element on last item
					if (currentRound.round == rounds.length) {

						$scope.loading = false;

					}

				});

			}).catch(function (error) {

				console.log(error);
				$scope.loading = false;

			})

			return previousRound.then(currentRound);

		}, Promise.resolve());

		/*} else {
			$scope.loading = false;
		}*/

	}).catch(function (error) {

		console.log(error);
		$scope.loading = false;

	});

	/*} else {

		$scope.loading = false;

	}*/

});