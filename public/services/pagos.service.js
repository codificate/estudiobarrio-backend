(function () {
    'use strict';

    angular
        .module('app')
        .factory('PagosService', Service);

    function Service($http, $localStorage) {
        var service = {};

        service.domain = 'http://localhost:8000/';
        //service.domain = 'http://estudiobarrio.plexarg.com/';

        service.Bancos = Bancos;
        service.Movimientos = Movimientos;
        service.EstadoPagos = EstadoPagos;
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

        function Bancos( callback ){

            var req = {
                method: 'GET',
                url: service.domain + 'api/bancos',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': $localStorage.currentUser.token
                }
            };

            $http(req)
                .then(
                    function successCallback(response){
                        $localStorage.bancos = response.data;
                        callback(response);
                    },
                    function errorCallback(response){
                        callback(response);
                    });
        }

        function EstadoPagos( callback ){

            var req = {
                method: 'GET',
                url: service.domain + 'api/estadopagos',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': $localStorage.currentUser.token
                }
            };

            $http(req)
                .then(
                    function successCallback(response){
                        $localStorage.movimientos = response.data;
                        callback(response);
                    },
                    function errorCallback(response){
                        callback(response);
                    });
        }

        function Movimientos( callback ){

            var req = {
                method: 'GET',
                url: service.domain + 'api/tipomovimientos',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': $localStorage.currentUser.token
                }
            };

            $http(req)
                .then(
                    function successCallback(response){
                        $localStorage.movimientos = response.data;
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
