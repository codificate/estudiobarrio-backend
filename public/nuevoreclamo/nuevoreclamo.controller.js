(function () {
    'use strict';

    angular
        .module('app')
        .controller('Nuevoreclamo.IndexController', NuevoreclamoController);

    function NuevoreclamoController($location, $localStorage, ReclamosService ) {
        var vm = this;

        console.log(vm);

        vm.loading = false;
        vm.reclamos = null;
        vm.consorcios = null;
        vm.tiposelected = null;
        vm.tiposreclamo = null;
        vm.estadoselected = null;
        vm.copropietarios = null;
        vm.consorcioselected = null;
        vm.copropietarioselected = null;

        vm.getCopropietariosByConsorcio = getCopropietariosByConsorcio;
        vm.getEstadosReclamo = getEstadosReclamo;
        vm.goToNuevoReclamo = goToNuevoReclamo;
        vm.getConsorcios = getConsorcios;
        vm.goToReclamos = goToReclamos;
        vm.goToPagos = goToPagos;
        vm.logout = logout;

        getConsorcios();

        getTiposReclamo();

        getEstadosReclamo();

        function getCopropietariosByConsorcio( consorcioid ) {

            ReclamosService.CopropietariosByConsorcio( consorcioid, function (result) {

                vm.copropietarios = result.data;

            });
        }

        /**
         * +54 9 11 2653-5442 Maggie
         * +54 9 11 3626 7522 Candy
         * @param nombre
         */

        function getConsorcios(){

            if ( $localStorage.consorcios ){

                vm.consorcios = $localStorage.consorcios;

            } else {

                ReclamosService.Consorcios( function (result) {

                    vm.consorcios = result.data;

                });

            }

        }

        function getTiposReclamo() {

            if ( $localStorage.tiposreclamo ){

                vm.tiposreclamo = $localStorage.tiposreclamo;

            } else {

                ReclamosService.TiposReclamo( function (result) {

                    vm.tiposreclamo = result.data;

                } );

            }

        }

        function getEstadosReclamo() {

            if ( $localStorage.estadosreclamo ){

                vm.estadosreclamo = $localStorage.estadosreclamo;

            } else {

                ReclamosService.EstadosReclamo( function (result) {

                    vm.estadosreclamo = result.data;

                } );

            }

        }

        function goToReclamos(){

            $location.path('/');

        }

        function goToNuevoReclamo(){

            $location.path('/reclamos/nuevo');

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