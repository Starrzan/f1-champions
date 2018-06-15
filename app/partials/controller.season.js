'use strict';

angular.module('f1Champions')
	.controller('seasonController', function($scope, $rootScope, $state, $stateParams, $window, SeasonsService) {

	// Variables
	$scope.season = $stateParams.season; // Used in ng-repeat
	$scope.$state = $state;
	$rootScope.state = $state.current.name;

	// If global listing object does not contain rounds data then do API call and load data into global object
	if (typeof $rootScope.f1Champions.seasons[$scope.season].rounds === 'undefined') {

		// Start loading element
		$scope.loading = true;

		//  Initialise rounds object in global listiting object
		$rootScope.f1Champions.seasons[$scope.season].rounds = {};

		// Set Ergast API Query to get all rounds
		let apiQueryRounds = `${$rootScope.f1Champions.ergastApi}/${$rootScope.f1Champions.series}/${$scope.season}.json`;

		// Get season rounds
		SeasonsService.getData(apiQueryRounds).then(function (response) {

			// Temporary variable containing all rounds to be used for loop
			let rounds = response.data.MRData.RaceTable.Races;

			// Iterate through season and store round winners
			for (let round = 0; round < rounds.length; round++) {

				// If global listing object does not contain round data then do API call and load data into global object
				if (typeof $rootScope.f1Champions.seasons[$scope.season].rounds[round] === 'undefined') {

					// Start loading element
					$scope.loading = true;

					// Set Ergast API Query to get round results
					let apiQueryRound = `${$rootScope.f1Champions.ergastApi}/${$rootScope.f1Champions.series}/${$scope.season}/${round+1}/results.json`;

					SeasonsService.getData(apiQueryRound).then(function (response) {

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

					}).then(function(response) {

						// Extract driver image from Wikipedia article field
						let driverWiki = decodeURI(response.url).match(/[^/]+(?=\/$|$)/);
						let apiQueryWikiDriver = `https://en.wikipedia.org/w/api.php?action=query&titles=${driverWiki}&prop=pageimages&format=json&origin=*&pithumbsize=50`;

						SeasonsService.getData(apiQueryWikiDriver).then(function (response) {

							// Access Wikipedia object to get image source and set winner image in global listing object
							for (let page in response.data.query.pages) {
								$rootScope.f1Champions.seasons[$scope.season].rounds[round].winner.image =
									response.data.query.pages[page].thumbnail.source;
							};

							// Update global listing object in localStorage
							$window.localStorage.setItem('f1Champions', JSON.stringify($rootScope.f1Champions));

						});

					}).then(function(response) {

						// Get round country
						let country = rounds[round].Circuit.Location.country;

						// Extract country code from country
						console.log(country);
						let apiQueryRestCountries = `https://restcountries.eu/rest/v2/name/${country}?fullText=true`;

						SeasonsService.getData(apiQueryRestCountries).then(function (response) {

							// Access Country Names object to get image source
							let countryCode = response.data[0].alpha2Code;
							console.log(countryCode);

							// Set round country in global listing object
							$rootScope.f1Champions.seasons[$scope.season].rounds[round].country =
								`http://www.countryflags.io/${countryCode}/flat/64.png`;

							// Update global listing object in localStorage
							$window.localStorage.setItem('f1Champions', JSON.stringify($rootScope.f1Champions));

						});

					}).then(function(response) {

						// Extract circuit image from Wikipedia article field
						let roundWiki = decodeURI(rounds[round].url).match(/[^/]+(?=\/$|$)/);
						let apiQueryWikiRound = `https://en.wikipedia.org/w/api.php?action=query&titles=${roundWiki}&prop=pageimages&format=json&origin=*&pithumbsize=50`;

						SeasonsService.getData(apiQueryWikiRound).then(function (response) {

							// Access Wikipedia object to get image source and set round circuit in global listing object
							for (let page in response.data.query.pages) {
								$rootScope.f1Champions.seasons[$scope.season].rounds[round].circuit =
									response.data.query.pages[page].thumbnail.source;
							};

							// Update global listing object in localStorage
							$window.localStorage.setItem('f1Champions', JSON.stringify($rootScope.f1Champions));

							// Hide loading element on last item
							if ((round == rounds.length - 1)) {
								$scope.loading = false;
							}

						});

					}).catch(function (error) {
						console.log(error);
						$scope.loading = false;
					});

				} else {
					$scope.loading = false;
				}

			}

		}, function(error) {
			console.log(error);
			$scope.loading = false;
		});

	} else {
		$scope.loading = false;
	}

});