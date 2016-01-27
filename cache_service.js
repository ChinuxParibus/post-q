angular.module('promises_q')

.service('cacheSrvc', ['localStorageService',	function (localStorageService) {
	var self = this;

	self.isCacheActive = function (key) {
		return localStorageService.get(key) ? true : false;
	};

	self.setCacheTo = function (key, data) {
		localStorageService.set(key, data);
	};

	self.getCacheFrom = function (key) {
		return localStorageService.get(key);
	};

	self.dropCache = function (key) {
		localStorageService.remove(key);
	};

}]);