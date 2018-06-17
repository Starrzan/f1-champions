'use strict';

angular.module('f1Champions')
	.factory('AppService', function($http, $window) {

	return {

		// Generic API Get with json repsonse
		getData: function (apiQuery) {

			var req = {
				method: 'GET',
				url: apiQuery,
				cache: true,
				headers: {
					'Content-Type': 'application/json'
				},
				timeout: 18000
			};

			return $http(req);

		},

		// Extract main image from Wikipedia article field
		getWikiArticleImageData: function (url) {

			// Get only the last part of the Wiki address, which is the article name
			let wikiArticleName = url.match(/[^/]+(?=\/$|$)/u);

			return `https://en.wikipedia.org/w/api.php?action=query&titles=${wikiArticleName}&prop=pageimages&format=json&origin=*&pithumbsize=50`;

		},

		// Access Wikipedia object and get image source and
		getWikiArticleImageSrc: function (obj) {

			for (let page in obj.data.query.pages) {
				return page > -1 ? obj.data.query.pages[page].thumbnail.source : '';
			}

		},

		// Get Rest Countries API call based on country name
		getRestCountriesURL: function (countryName) {

			// Get round country
			let country = countryName;

			// Country name format fixes as used by restcountries.eu
			if (country == 'Korea') {
				country = 'Korea (Republic of)';
			} else if (country == 'Russia') {
				country = 'Russian Federation';
			}

			return `https://restcountries.eu/rest/v2/name/${country}?fullText=true`;

		},

		/*// Get object in localStorage (future feature)
		getStoredObject: function (name) {

			return JSON.parse($window.localStorage.getItem(name));

		},*/

		/*// Store object in localStorage (future feature)
		storeObject: function (name, obj) {

			$window.localStorage.setItem(name, JSON.stringify(obj));

		},*/

		/*// Check if object property and value is set (future feature)
		checkStoredObject: function (obj, property) {

			for (let key in Object.keys(obj)) {
				return key == property;
			}

		},*/

		/*// Remove object in localStorage (future feature)
		removeStoredObject: function (name) {

			$window.localStorage.removeItem(name);

		},*/

	}

});