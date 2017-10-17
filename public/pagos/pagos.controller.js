(function () {
    'use strict';

    angular
        .module('app')
        .controller('Pagos.IndexController', Controller);

    function Controller($location, $localStorage, PagosService ) {
        var vm = this;

        vm.pagos = null;
        vm.consorcios = null;
        vm.copropietarios = null;
        vm.loading = false;
        vm.copropietarioselected = null;
        vm.copropietariowasselected = false;

        vm.getCopropietariosByConsorcio = getCopropietariosByConsorcio;
        vm.getPagosByCopropietario = getPagosByCopropietario;
        vm.logout = logout;

        getConsorcios();

        function getCopropietariosByConsorcio( consorcioid ){

          vm.loading = true;

          PagosService.CopropietariosByConsorcio( consorcioid, function (result) {

            vm.copropietarios = result.data;
            vm.loading = false;

          });

        }

        function getPagosByCopropietario( copropietarioid, copropietarioname ){

          vm.loading = true;
          vm.copropietariowasselected = true;
          vm.copropietarioselected = copropietarioname;

          PagosService.PagosByCopropietario( copropietarioid, function (result) {

            vm.pagos = result.data;
            vm.loading = false;

          });

        }

        function getConsorcios(){

          vm.consorcios = $localStorage.consorcios;

        }

        function logout(){
            // remove user from local storage and clear http auth header
            delete $localStorage.currentUser;
            $location.path('/login');
        }

    }

})();
