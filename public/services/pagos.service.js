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
        service.ChangeEstadoPago = ChangeEstadoPago;
        service.PagosByConsorcio = PagosByConsorcio;
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
                        console.log( response );
                        callback(response);
                    },

                    function errorCallback(response){
                        console.log( response );
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
                        console.log( response );
                        callback(response);
                    },
                    function errorCallback(response){
                        console.log( response );
                        callback(response);
                });
        }

        function PagosByConsorcio( consorcioid, callback ){

            var req = {
                method: 'GET',
                url: service.domain + 'api/pago/byconsorcio/' + consorcioid,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': $localStorage.currentUser.token
                }
            };

            $http(req)
                .then(
                    function successCallback(response){
                        console.log( response );
                        callback(response);
                    },
                    function errorCallback(response){
                        console.log( response );
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
                        console.log( response );
                        $localStorage.bancos = response.data;
                        callback(response);
                    },
                    function errorCallback(response){
                        console.log( response );
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
                        console.log( response );
                        $localStorage.estadopagos = response.data;
                        callback(response);
                    },
                    function errorCallback(response){
                        console.log( response );
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
                        console.log( response );
                        $localStorage.movimientos = response.data;
                        callback(response);
                    },
                    function errorCallback(response){
                        console.log( response );
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
                    console.log( response );
                    callback(response);
                },
                function errorCallback(response){
                    console.log( response );
                    callback(response);
                }
            );
        }

        function ChangeEstadoPago( pagoid, estadoid, callback ){

            var req = {
                method: 'PUT',
                url: service.domain + 'api/pago/changeEstado/' + pagoid + '/' + estadoid,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': $localStorage.currentUser.token
                }
            };

            $http(req).then(

                function successCallback(response){
                    callback(response.data);
                },

                function errorCallback(response){
                    console.log(response);
                    callback(response);
                }
            );
        }

    }

})();
