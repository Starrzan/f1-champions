'use strict';

angular.module('f1Champions')
	.controller('seasonController', function ($scope, $rootScope, $state, $stateParams, AppService) {

	// Variables
	$scope.season = $stateParams.season; // Used in ng-repeat
	$scope.$state = $state;
	$rootScope.state = $state.current.name;

	// If global listing object does not contain round data then do API call and load data into global object (feature feature)
	//console.log(AppService.checkStoredObject($rootScope.f1Champions.seasons[$scope.season], 'rounds'));

	// Show loading element
	$scope.loading = true;

	// If page is accessed via page refresh or direct URL then set season property of global listiting object
	if (typeof $rootScope.f1Champions.seasons[$scope.season] === 'undefined') {

		$rootScope.f1Champions.seasons[$scope.season] = {
			'season': $scope.season
		};

		// Set Ergast API Query to get all season winners
		let apiQuerySeasons = `${$rootScope.f1Champions.ergastApi}/${$rootScope.f1Champions.series}/${$scope.season}/driverStandings.json`;

		AppService.getData(apiQuerySeasons).then(function (response) {

			// Get season winner
			let champion = response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings[0].Driver;

			// Set season data in global listing object
			$rootScope.f1Champions.seasons[$scope.season].champion = {
				'name': `${champion.givenName} ${champion.familyName}`
			};

			return champion;

		}, function (error) {

			console.log(error);
			$scope.loading = false;

		});

	}

	// Initialise rounds object in global listiting object
	$rootScope.f1Champions.seasons[$scope.season].rounds = {};

	// Set Ergast API Query to get all rounds
	let apiQueryRounds = `${$rootScope.f1Champions.ergastApi}/${$rootScope.f1Champions.series}/${$scope.season}.json`;

	// Get season rounds
	AppService.getData(apiQueryRounds).then(function (response) {

		// Temporary variable containing all rounds to be used for loop
		let rounds = response.data.MRData.RaceTable.Races;

		// Iterate through season and store round winners
		for (let round = 0; round < rounds.length; round++) {

			// If global listing object does not contain round data then do API call and load data into global object (feature feature)
			//console.log(AppService.checkStoredObject($rootScope.f1Champions.seasons[$scope.season].rounds, 'round'));

			// Show loading element
			$scope.loading = true;

			// Set Ergast API Query to get round results
			let apiQueryRound = `${$rootScope.f1Champions.ergastApi}/${$rootScope.f1Champions.series}/${$scope.season}/${round+1}/results.json`;

			AppService.getData(apiQueryRound).then(function (response) {

				// Get round winner
				let winner = response.data.MRData.RaceTable.Races[0].Results[0].Driver;

				// Set round data in global listing object
				$rootScope.f1Champions.seasons[$scope.season].rounds[round] = {
					'round': rounds[round].round,
					'name': rounds[round].raceName
				}

				// Set round winner data in global listing object
				$rootScope.f1Champions.seasons[$scope.season].rounds[round].winner = {
					'name': `${winner.givenName} ${winner.familyName}`
				};

				return winner;

			}).then(function (response) {

				// Extract driver image from Wikipedia article field
				let apiQueryWikiDriver = AppService.getWikiArticleImageData(response.url);

				AppService.getData(apiQueryWikiDriver).then(function (response) {

					// Set winner image in global listing object
					$rootScope.f1Champions.seasons[$scope.season].rounds[round].winner.image = AppService.getWikiArticleImageSrc(response);

					// Update global listing object in localStorage (future feature)
					//AppService.storeObject('f1Champions', $rootScope.f1Champions);

				});

			}).then(function (response) {

				// Extract country code from country
				let apiQueryRestCountries = AppService.getCountryCode(rounds[round].Circuit.Location.country);

				AppService.getData(apiQueryRestCountries).then(function (response) {

					// Set round country in global listing object
					$rootScope.f1Champions.seasons[$scope.season].rounds[round].country = `http://www.countryflags.io/${response.data[0].alpha2Code}/flat/64.png`;

					// Update global listing object in localStorage (future feature)
					//AppService.storeObject('f1Champions', $rootScope.f1Champions);

				});

			}).then(function (response) {

				// Extract circuit image from Wikipedia article field
				let apiQueryWikiRound = AppService.getWikiArticleImageData(rounds[round].url);

				AppService.getData(apiQueryWikiRound).then(function (response) {

					// Set round circuit in global listing object
					$rootScope.f1Champions.seasons[$scope.season].rounds[round].circuit = AppService.getWikiArticleImageSrc(response);

					// Update global listing object in localStorage (future feature)
					//AppService.storeObject('f1Champions', $rootScope.f1Champions);

					// Hide loading element on last item
					if ((round == rounds.length - 1)) {

						$scope.loading = false;

					}

				});

			}).catch(function (error) {

				console.log(error);
				$scope.loading = false;

			});

			/*} else {
					$scope.loading = false;
				}*/

		}

	}, function (error) {

		console.log(error);
		$scope.loading = false;

	});

	/*} else {

		$scope.loading = false;

	}*/

});