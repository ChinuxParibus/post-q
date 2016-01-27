angular.module('promises_q')

.service('ubicacionSrvc', ['$http', '$q', 'baseUrl', 'cacheSrvc', 'JEXIA_AuthSrvc',
	function ($http, $q, baseUrl, cacheSrvc, JEXIA_AuthSrvc) {

		var self = this;

		function _clave_estado (id_estado) {
			var claves = cacheSrvc.getCacheFrom('estados');
			return claves.filter(function(clave) {
				return clave.id_estado === id_estado;
			})[0].nombre_estado.replace(' ', '_');
		}

		// cacheSrvc.dropCache('estados');
		// angular.forEach(cacheSrvc.getCacheFrom('estados'), function (estado) {
		// 	var clave = _clave_estado(estado.id_estado);
		// 	if (cacheSrvc.isCacheActive(clave)) {
		// 		cacheSrvc.dropCache(clave);
		// 	}
		// });

		self.getEstados = function () {
			if (!cacheSrvc.isCacheActive('estados')) { //si no está cacheada, se cachea
				JEXIA_AuthSrvc.authenticate().then(function (token) {
					JEXIA_AuthSrvc.setHeaders(token);

					$http.get(baseUrl + '/estados?sort=id_estado').then(function (estados) {
						var estados = estados.data.map(function (estado) {
							return {'id_estado': estado.id_estado, 'nombre_estado': estado.nombre_estado };
						});
						cacheSrvc.setCacheTo('estados', estados);
					});
				});
			}
			return cacheSrvc.getCacheFrom('estados');
		}

		self.getMunicipios = function (id_estado) {
			var clave_estado = _clave_estado(id_estado);
			if (!cacheSrvc.isCacheActive(clave_estado)) {
				JEXIA_AuthSrvc.authenticate().then(function (token) {
					JEXIA_AuthSrvc.setHeaders(token);

					$http.get(baseUrl + '/municipios?estado_id=' + id_estado + '&sort=id_municipio')
					.then(function (municipios) {
						var municipios = municipios.data.map(function (municipio) {
							return {'id_municipio': municipio.id_municipio, 'nombre_municipio': municipio.nombre_municipio, parroquias: []};
						});
						cacheSrvc.setCacheTo(clave_estado, municipios);
					});
				});
			}
			return cacheSrvc.getCacheFrom(clave_estado);
		}

		self.getParroquias = function (id_estado, id_municipio) {
			var clave_estado = _clave_estado(id_estado),
					datos = cacheSrvc.getCacheFrom(clave_estado),
					parroquia_vacia = datos.filter(function(municipio) { return municipio.id_municipio === id_municipio; })[0].parroquias.length === 0 ? true : false;

			if (parroquia_vacia) {
				JEXIA_AuthSrvc.authenticate().then(function (token) {
					JEXIA_AuthSrvc.setHeaders(token);

					$http.get(baseUrl + '/parroquias?municipio_id=' + id_municipio + '&sort=id_parroquia').then(function (parroquias) {
						var parroquias = parroquias.data.map(function (parroquia) {
							return {'id_parroquia': parroquia.id_parroquia, 'nombre_parroquia': parroquia.nombre_parroquia};
						});

						datos.map(function (municipio) {
							if (municipio.id_municipio === id_municipio) {
								municipio.parroquias = parroquias;
							}
							return municipio;
						});

						cacheSrvc.setCacheTo(clave_estado, datos); //Actualizar clave
					});

				});
			}
			return cacheSrvc.getCacheFrom(clave_estado).filter(function (municipio) { return municipio.id_municipio === id_municipio; })[0].parroquias;
		}

	}
]);
