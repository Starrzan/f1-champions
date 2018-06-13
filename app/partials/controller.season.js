'use strict';

angular.module('f1Champions')
	.controller('seasonController', function($scope, $stateParams, SeasonsService) {

	// ERGAST API VARIABLES
	const ergastApi = '//ergast.com/api'
	const series = 'f1'
	$scope.seasonStart = 2005;
	$scope.seasonEnd = 2015;

	// VARIABLES
	$scope.loading = true;
	$scope.season = $stateParams.season;
	$scope.rounds = [];

	// SEASON ROUNDS AND WINNERS
	let apiQueryRounds = `${ergastApi}/${series}/${$scope.season}.json`;

	// GET SEASON DATA
	SeasonsService.getData(apiQueryRounds).then(function (response) {
		$scope.rounds = response.data.MRData.RaceTable.Races;

		console.log(response);

		for (let round = 0; round < $scope.rounds.length; round++) {

			let apiQueryRound = `${ergastApi}/${series}/${$scope.season}/${round+1}/results.json`;

			SeasonsService.getData(apiQueryRound).then(function (response) {
				let winner = response.data.MRData.RaceTable.Races[0].Results[0].Driver;

				$scope.rounds[round].winner = `${winner.givenName} ${winner.familyName}`;

				if ((round == $scope.rounds.length -1)) {
					$scope.loading = false;
				}
			});

		}
	}, function (error) {
		console.log(error);
		$scope.loading = false;
	});

});