(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller($location, $localStorage, ReclamosService ) {
        var vm = this;

        vm.loading = false;
        vm.reclamos = null;
        vm.consorcios = null;
        vm.tiposreclamo = null;
        vm.copropietarios = null;
        vm.consorcioselected = null;
        vm.consorciowasselected = false;

        vm.copropietariowasselected = false;
        vm.copropietarioselected = null;
        vm.tipowasselected = false;
        vm.tiposelected = null;
        vm.showcolumns = true;

        vm.getReclamosByCopropietario = getReclamosByCopropietario;
        vm.getReclamosByTipoReclamo = getReclamosByTipoReclamo;
        vm.getEstadosReclamo = getEstadosReclamo;
        vm.getByConsorcio = getByConsorcio;
        vm.getConsorcios = getConsorcios;
        vm.goToPagos = goToPagos;
        vm.logout = logout;

        getConsorcios();

        getTiposReclamo();

        getEstadosReclamo();

        function getByConsorcio( consorcioid, consorcioname ){

          vm.loading = true;
          vm.consorciowasselected = true;
          vm.consorcioselected = consorcioname;

          ReclamosService.ByConsorcio( consorcioid, function (result) {
              vm.reclamos = result.data;
              vm.reclamostmp = result.data;
              vm.loading = false;
              getCopropietariosByConsorcio( consorcioid );

          });

        }

        function getCopropietariosByConsorcio( consorcioid ) {

          ReclamosService.CopropietariosByConsorcio( consorcioid, function (result) {

              vm.copropietarios = result.data;

          });

        }

        function getReclamosByCopropietario( copropietarioid, copropietarioname ){

          vm.loading = true;
          vm.copropietariowasselected = true;
          vm.copropietarioselected = copropietarioname;

          ReclamosService.ByCopropietario( copropietarioid, function (result) {

              vm.reclamos = null;
              vm.reclamos = result.data;
              vm.reclamostmp = result.data;
              vm.loading = false;
              vm.showcolumns = false;

          });

        }

        function getReclamosByTipoReclamo( nombre ) {

            vm.tiposelected = nombre;
            vm.tipowasselected = true;

            var cantidad = 0;

            var reclamosFiltrados = [];

            vm.reclamostmp.forEach(function(entry) {

                if( entry.tipo == nombre ){
                    reclamosFiltrados.push( entry );
                }

            });

            vm.reclamos = reclamosFiltrados;

        }

        function getConsorcios(){

          ReclamosService.Consorcios( function (result) {

            vm.consorcios = result.data;

          });

        }
        
        function getTiposReclamo() {

            ReclamosService.TiposReclamo( function (result) {

                vm.tiposreclamo = result.data;

            } );

        }

        function getEstadosReclamo() {

            ReclamosService.EstadosReclamo( function (result) {

                vm.estadosreclamo = result.data;

            } );

        }

        function goToPagos(){

          $location.path('/pagos');

        }

        function logout(){
            delete $localStorage.currentUser;
            delete $localStorage.tiposreclamo;
            $location.path('/login');
        }

    }


})();