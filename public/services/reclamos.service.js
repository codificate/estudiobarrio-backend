(function () {
    'use strict';

    angular
        .module('app')
        .factory('ReclamosService', Service);

    function Service($http, $localStorage) {
        var service = {};

        service.domain = 'http://localhost:8000/';
        //service.domain = 'http://estudiobaarrio.plexarg.com/';

        service.Consorcios = Consorcios;
        service.LastCreated = LastCreated;
        service.ByConsorcio = ByConsorcio;
        service.TiposReclamo = TiposReclamo;
        service.EstadosReclamo = EstadosReclamo;
        service.ByCopropietario = ByCopropietario;
        service.CopropietariosByConsorcio = CopropietariosByConsorcio;

        return service;

        function ByConsorcio(consorcioid, callback) {

            var req = {
                method: 'GET',
                url: service.domain + 'api/reclamo/byconsorcio/' + consorcioid,
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

        function ByCopropietario(copropietarioid, callback) {

            var req = {
                method: 'GET',
                url: service.domain + 'api/reclamo/bycopropietario/' + copropietarioid,
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

            $http(req).then(

                function successCallback(response){
                    callback(response);
                },

                function errorCallback(response){
                    callback(response);
                }
            );
        }

        function Consorcios( callback ){

            var req = {
                method: 'GET',
                url: service.domain + 'api/consorcios',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': $localStorage.currentUser.token
                }
            };

            $http(req).then(

                function successCallback(response){
                    $localStorage.consorcios = response.data;
                    callback(response);
                },
                function errorCallback(response){
                    callback(response);
                }
            );
        }

        function TiposReclamo( callback ){

            var req = {
                method: 'GET',
                url: service.domain + 'api/tiporeclamos',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': $localStorage.currentUser.token
                }
            };

            $http(req).then(

                function successCallback(response){
                    $localStorage.tiposreclamo = response.data;
                    callback(response);
                },
                function errorCallback(response){


                    console.log(response);
                    callback(response);
                }
            );

        }

        function EstadosReclamo(callback) {

            var req = {
                method: 'GET',
                url: service.domain + 'api/estadoreclamos',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': $localStorage.currentUser.token
                }
            };

            $http(req).then(

                function successCallback(response){
                    $localStorage.estadosreclamo = response.data;
                    callback(response);
                },
                function errorCallback(response){


                    console.log(response);
                    callback(response);
                }
            );

        }

        function LastCreated(callback){

            var req = {
                method: 'GET',
                url: service.domain + 'api/reclamos/recientes',
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
