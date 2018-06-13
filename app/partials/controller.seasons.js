'use strict';

angular.module('f1Champions')
	.controller('seasonsController', function($scope, $location, SeasonsService) {

	// ERGAST API VARIABLES
	const ergastApi = '//ergast.com/api'
	const series = 'f1'
	$scope.seasonStart = 2005;
	$scope.seasonEnd = 2015;

	// VARIABLES
	$scope.loading = true;
	$scope.seasons = [];

	// ITERATE THROUGH SEASONS FROM START AND END CONSTRAINTS AND GET SEASON WINNERS
	for (let season = $scope.seasonStart; season <= $scope.seasonEnd; season++) {
		$scope.seasons.push({'season': season});

		let apiQuerySeasons = `${ergastApi}/${series}/${season}/driverStandings.json`;

		SeasonsService.getData(apiQuerySeasons).then(function (response) {

			let winner = response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings[0].Driver;
			$scope.seasons[season - $scope.seasonStart].winner = `${winner.givenName} ${winner.familyName}`;

			// HIDE LOADING ELEMENT ON LAST ITEM
			if (season == $scope.seasonEnd) {
				$scope.loading = false;
			}

		}, function (error) {
			console.log(error);
			$scope.loading = false;
		});
	}

	// ITERATE THROUGH ALL SEASONS AND GET SEASON WINNERS
	/*$scope.seasons.reduce(function (allSeasons, season, seasonIndex, seasonArray) {
		let apiQuerySeason = `${ergastApi}/${series}/${season.season}/driverStandings.json`;

		SeasonsService.getData(apiQuerySeason).then(function (response) {
			console.log(response.data.MRData.StandingsTable.StandingsLists.DriverStandings);

			let winner = response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings[0].Driver;
			$scope.seasons[seasonIndex].season_reveal = season.season;
			$scope.seasons[seasonIndex].winner = `${winner.givenName} ${winner.familyName}`;

			if ((seasonIndex == seasonArray.length -1)) {
				$scope.loading = false;
			}

		}, function (error) {
			console.log(error);
			$scope.loading = false;
		});
	});*/

	$scope.viewSeason = function(season) {
		let apiQuerySeason = `${ergastApi}/${series}/${season.season}.json`;

		$location.path(`/season/${season}`);
	}

});