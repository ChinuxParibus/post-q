angular.module('promises_q')

.controller('PromiseCtrl', ['$scope', '$timeout', 'ubicacionSrvc',
	function ($scope, $timeout, ubicacionSrvc) {

		$scope.estados = [];
		$scope.municipios = [];
		$scope.parroquias = [];

		$scope.estados = ubicacionSrvc.getEstados();

		$scope.llenarMunicipios = function (id_estado) {
			if (!id_estado) {
				$scope.municipios = [];
				$scope.parroquias = [];
			} else {
				$timeout(function () { // Aplicación asíncrona del método $apply()
					$scope.municipios = ubicacionSrvc.getMunicipios(id_estado);
				}, 0);
			}
		}

		$scope.llenarParroquias = function (id_estado, id_municipio) {
			if (!id_municipio || !id_estado) {
				$scope.parroquias = [];
			} else {
				$timeout(function () {
					$scope.parroquias = ubicacionSrvc.getParroquias(id_estado, id_municipio)
				}, 0);
			}
		}
	}
]);