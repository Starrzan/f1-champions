'use strict';

angular.module('f1Champions')
	.controller('seasonController', function($scope, $rootScope, $state, $stateParams, $window, SeasonsService) {

	// Variables
	$scope.season = $stateParams.season; // Used in ng-repeat
	$scope.$state = $state;
	$rootScope.state = $state.current.name;

	// If global listing object does not contain rounds data then do API call and load data into global object
	if (typeof $rootScope.f1Champions.seasons[$scope.season].rounds === 'undefined') {

		$scope.loading = true;

		$rootScope.f1Champions.seasons[$scope.season].rounds = {};

		let apiQueryRounds = `${$rootScope.f1Champions.ergastApi}/${$rootScope.f1Champions.series}/${$scope.season}.json`;

		// Get season rounds
		SeasonsService.getData(apiQueryRounds).then(function (response) {

			// Temporary variable containing all rounds to be used for loop
			let rounds = response.data.MRData.RaceTable.Races;

			// Iterate through season and store round winners
			for (let round = 0; round <= rounds.length; round++) {

				// If global listing object does not contain round data then do API call and load data into global object
				if (typeof $rootScope.f1Champions.seasons[$scope.season].rounds[round] === 'undefined') {

					$scope.loading = true;

					let apiQueryRound = `${$rootScope.f1Champions.ergastApi}/${$rootScope.f1Champions.series}/${$scope.season}/${round+1}/results.json`;

					SeasonsService.getData(apiQueryRound).then(function (response) {

						let winner = response.data.MRData.RaceTable.Races[0].Results[0].Driver;

						$rootScope.f1Champions.seasons[$scope.season].rounds = rounds;
						$rootScope.f1Champions.seasons[$scope.season].rounds[round].winner = `${winner.givenName} ${winner.familyName}`;

						// Update global listing object in localStorage
						$window.localStorage.setItem('f1Champions', JSON.stringify($rootScope.f1Champions));

						// Hide loading element on last item
						if ((round == rounds.length -1)) {
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

		}, function (error) {
			console.log(error);
			$scope.loading = false;
		});

	} else {
		$scope.loading = false;
	}

});