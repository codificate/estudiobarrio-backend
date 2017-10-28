(function () {
    'use strict';

    angular
        .module('app')
        .controller('Pagos.IndexController', Controller);

    function Controller($location, $localStorage, PagosService, PagerService  ) {
        var vm = this;

        vm.pager = {};

        vm.pagos = null;
        vm.consorcios = null;
        vm.copropietarios = null;
        vm.copropietarioselected = null;
        
        vm.copropietariowasselected = false;
        vm.loading = false;

        vm.getCopropietariosByConsorcio = getCopropietariosByConsorcio;
        vm.getPagosByCopropietario = getPagosByCopropietario;
        vm.setPage = setPage;
        vm.logout = logout;

        getRecentlyCreated();

        getConsorcios();

        initController();

        function initController() {
            // initialize to page 1
            vm.setPage(1);
        }

        function setPage(page) {
            if (page < 1 || page > vm.pager.totalPages) {
                return;
            }

            // get pager object from service
            vm.pager = PagerService.GetPager(vm.pagos.length, page);

            // get current page of items
            vm.pagos = vm.pagos.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
        }

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

        function getRecentlyCreated(){

            vm.loading = true;

            PagosService.LastCreated(function (result) {

                vm.pagos = result.data;
                vm.loading = false;

            });

        }

        function logout(){
            // remove user from local storage and clear http auth header
            delete $localStorage.currentUser;
            $location.path('/login');
        }

    }

})();
