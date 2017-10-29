(function () {
    'use strict';

    angular
        .module('app')
        .factory('PagosService', Service);

    function Service($http, $localStorage) {
        var service = {};

        service.domain = 'http://localhost:8000/';
        //service.domain = 'http://estudiobaarrio.plexarg.com/';

        service.LastCreated = LastCreated;
        service.PagosByCopropietario = PagosByCopropietario;
        service.CopropietariosByConsorcio = CopropietariosByConsorcio;

        return service;

        function CopropietariosByConsorcio(consorcioid, callback) {

            var req = {
                method: 'GET',
                url: service.domain + 'api/copropietarios/byconsorcio/' + consorcioid,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': $localStorage.currentUser.token
                }
            };

            $http(req)
                .then(

                    function successCallback(response){
                        callback(response);
                    },

                    function errorCallback(response){
                        callback(response);
                    });
        }

        function PagosByCopropietario( copropietarioid, callback ){

            var req = {
                method: 'GET',
                url: service.domain + 'api/pago/bycopropietario/' + copropietarioid,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': $localStorage.currentUser.token
                }
            };

            $http(req)
                .then(
                    function successCallback(response){
                        callback(response);
                    },
                    function errorCallback(response){
                        callback(response);
                });
        }

        function LastCreated(callback){

            var req = {
                method: 'GET',
                url: service.domain + 'api/pago/recientes',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': $localStorage.currentUser.token
                }
            };

            $http(req).then(

                function successCallback(response){
                    callback(response);
                },
                function errorCallback(response){
                    callback(response);
                }
            );
        }

    }

})();
