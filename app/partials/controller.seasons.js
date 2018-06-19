'use strict';

angular.module('f1Champions')
	.controller('SeasonsController', function ($scope, $rootScope, $state, $location, AppService, SeasonsService) {

	// Variables
	$scope.$state = $state;
	$rootScope.state = $state.current.name; // Used for back button state check which is outside of the view
	$scope.status = ''; // Used for data loading status message

	// Iterate through seasons from start and end constraints and store season winners
	for (let season = $rootScope.f1Champions.seasonStart; season <= $rootScope.f1Champions.seasonEnd; season++) {

		// Show loading element if loader true
		$scope.loading = true;

		$scope.status = SeasonsService.saveSeason(season).then(function (response) {

			$scope.status = response;

			// Hide loading element on last item if loader true
			if (season == $rootScope.f1Champions.seasonEnd) {

				$scope.loading = false;

				$scope.status = $scope.status == 'error' ? 'error' : 'success';

				console.log($scope.status);

			}

		}).catch(function (error) {

			console.log(error);

			$scope.status = 'error';

			$scope.loading = false;

		});

	}

	// Set path based on season query parameter
	$scope.viewSeason = function (season) {

		$location.path(`/season/${season}`);

	}

});