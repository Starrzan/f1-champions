'use strict';

angular.module('f1Champions')
	.controller('seasonController', function($scope, $rootScope, $state, $stateParams, SeasonsService) {

	// ERGAST API VARIABLES
	const ergastApi = '//ergast.com/api'
	const series = 'f1'
	$scope.seasonStart = 2005;
	$scope.seasonEnd = 2015;

	// VARIABLES
	$scope.loading = true;
	$scope.season = $stateParams.season;
	$scope.$state = $state;
	$rootScope.state = $state.current.name;

	// SEASON ROUNDS AND WINNERS
	let apiQueryRounds = `${ergastApi}/${series}/${$scope.season}.json`;

	// GET SEASON DATA
	SeasonsService.getData(apiQueryRounds).then(function (response) {

		$rootScope.seasons[$scope.season].rounds = response.data.MRData.RaceTable.Races;

		console.log(response);

		for (let round = 0; round < $rootScope.seasons[$scope.season].rounds.length; round++) {

			let apiQueryRound = `${ergastApi}/${series}/${$scope.season}/${round+1}/results.json`;

			SeasonsService.getData(apiQueryRound).then(function (response) {
				let winner = response.data.MRData.RaceTable.Races[0].Results[0].Driver;

				$rootScope.seasons[$scope.season].rounds[round].winner = `${winner.givenName} ${winner.familyName}`;

				if ((round == $rootScope.seasons[$scope.season].rounds.length -1)) {
					$scope.loading = false;
				}
			});

		}
	}, function (error) {
		console.log(error);
		$scope.loading = false;
	});

});