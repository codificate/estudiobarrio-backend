(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller($location, $localStorage, ReclamosService ) {
        var vm = this;

        vm.consorcios = null;
        vm.copropietarios = null;
        vm.reclamos = null;
        vm.loading = false;
        vm.consorcioselected = null;
        vm.consorciowasselected = false;

        vm.copropietarioselected = null;
        vm.copropietariowasselected = false;

        vm.getReclamosByCopropietario = getReclamosByCopropietario;
        vm.getByConsorcio = getByConsorcio;
        vm.getConsorcios = getConsorcios;
        vm.goToPagos = goToPagos;
        vm.showcolumns = true;
        vm.logout = logout;

        getConsorcios();

        function getByConsorcio( consorcioid, consorcioname ){

          vm.loading = true;
          vm.consorciowasselected = true;
          vm.consorcioselected = consorcioname;

          ReclamosService.ByConsorcio( consorcioid, function (result) {

            vm.reclamos = result.data;
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
            vm.loading = false;
            vm.showcolumns = false;

          });

        }

        function getConsorcios(){

          ReclamosService.Consorcios( function (result) {

            vm.consorcios = result.data;

          });

        }

        function goToPagos(){

          $location.path('/pagos');

        }

        function logout(){
            // remove user from local storage and clear http auth header
            delete $localStorage.currentUser;
            $location.path('/login');
        }

    }

})();
