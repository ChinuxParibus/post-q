angular.module('promises_q', ['LocalStorageModule'])

.constant('baseUrl',
	'http://f9315280-a20a-11e5-9220-c76468a2eab4.app.jexia.com'
)

.constant('root_key', {
	'key': '59bdc1086ba8f9c1b11ad54652ab9413',
	'secret': '38bda16cc69a8e6e50af89256e58e69dc725b63252a7c968'
})

.service('JEXIA_AuthSrvc', ['$q', '$http', 'baseUrl', 'root_key',
	function ($q, $http, baseUrl, root_key) {
		var self = this;
		var options = {	url: baseUrl,	method: 'POST',	data: root_key };

		self.authenticate = function() {
			var _q = $q.defer();
			$http(options).success(function (response) {
				_q.resolve(response.token);
			}).error(function (reason) {
				_q.reject(reason);
			});
			return _q.promise;
		}

		self.setHeaders = function(token) {
			$http.defaults.headers.common.Authorization = 'Bearer '+token;
		}
	}
]);