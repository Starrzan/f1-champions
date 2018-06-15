'use strict';

angular.module('f1Champions')
	.factory('SeasonsService', function ($http, $q) {

	// Get data from API
	return {
		getData: function (apiQuery) {

			var req = {
				method: 'GET',
				url: apiQuery,
				headers: {
					'Content-Type': 'application/json'
				},
				timeout: 18000
			};

			return $http(req);

		}
	}

});