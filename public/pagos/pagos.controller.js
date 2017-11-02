(function () {
    'use strict';

    angular
        .module('app')
        .controller('Pagos.IndexController', Controller);

    function Controller($location, $localStorage, PagosService  ) {
        var vm = this;

        vm.pager = {};

        vm.criteriasselected = [];

        vm.pagos = null;
        vm.bancos = null;
        vm.pasgostmp = null;
        vm.consorcios = null;
        vm.estadopagos = null;
        vm.movimientos = null;
        vm.copropietarios = null;
        vm.copropietarioselected = null;
        
        vm.copropietariowasselected = false;
        vm.loading = false;

        vm.getCopropietariosByConsorcio = getCopropietariosByConsorcio;
        vm.getPagosByCopropietario = getPagosByCopropietario;
        vm.goToNuevoReclamo = goToNuevoReclamo;
        vm.getPagosByBanco = getPagosByBanco;
        vm.getEstadosPago = getEstadosPago;
        vm.getMovimientos = getMovimientos;
        vm.goToReclamos = goToReclamos;
        vm.goToPagos = goToPagos;
        vm.getBancos = getBancos;
        vm.getPager = getPager;
        vm.setPage = setPage;
        vm.logout = logout;

        getRecentlyCreated();

        getEstadosPago();

        getMovimientos();

        getConsorcios();

        getBancos();

        /* initController();

        function initController() {
            // initialize to page 1
            vm.setPage(1);
        } */

        function setPage(page) {
            if (page < 1 || page > vm.pager.totalPages) {
                return;
            }

            // get pager object from service
            vm.pager = vm.getPager(vm.pagos.length, page);

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
                vm.pasgostmp = result.data;
                vm.loading = false;

            });

        }

        function getBancos(){

            if ( $localStorage.bancos ){

                vm.bancos = $localStorage.bancos;

            } else {

                PagosService.Bancos( function (result) {

                    vm.bancos = result.data;

                } );
            }
        }

        function getMovimientos(){

            if ( $localStorage.movimientos ){

                vm.movimientos = $localStorage.movimientos;

            } else {

                PagosService.Movimientos( function (result) {

                    vm.movimientos = result.data;

                } );
            }
        }

        function getEstadosPago(){

            if ( $localStorage.estadopagos ){

                vm.estadopagos = $localStorage.estadopagos;

            } else {

                PagosService.EstadoPagos( function (result) {

                    vm.estadopagos = result.data;

                } );
            }
        }

        function getConsorcios(){

            vm.consorcios = $localStorage.consorcios;

        }


        function getPagosByBanco( nombre ){

            vm.bancoselected = nombre;
            vm.bancowasselected = true;

            var pagosFiltrados = [];

            vm.pasgostmp.forEach(function(entry) {

                if( entry.tipo == nombre ){
                    pagosFiltrados.push( entry );
                }

            });

            var bancoExistAsCriteria = false;

            vm.criteriasselected.forEach(function (entry) {

                if ( entry.banco !== null ){

                    entry.tipo = nombre;
                    bancoExistAsCriteria = true;

                }

            });

            if ( bancoExistAsCriteria == false ){
                vm.criteriasselected.push({
                    tipo : nombre
                })
            }

            vm.pagos = pagosFiltrados;

            vm.setPage(1);

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

        function getRecentlyCreated(){

            vm.loading = true;

            PagosService.LastCreated(function (result) {

                vm.pagos = result.data;
                vm.pasgostmp = result.data;
                vm.loading = false;

                vm.setPage(1);

            });

        }

        function logout(){
            // remove user from local storage and clear http auth header
            delete $localStorage.currentUser;
            delete $localStorage.movimientos;
            delete $localStorage.estadopagos;
            delete $localStorage.bancos;

            $location.path('/login');
        }

        function getPager(totalItems, currentPage, pageSize) {
            // default to first page
            currentPage = currentPage || 1;

            // default page size is 10
            pageSize = pageSize || 10;

            // calculate total pages
            var totalPages = Math.ceil(totalItems / pageSize);

            var startPage, endPage;
            if (totalPages <= 10) {
                // less than 10 total pages so show all
                startPage = 1;
                endPage = totalPages;
            } else {
                // more than 10 total pages so calculate start and end pages
                if (currentPage <= 6) {
                    startPage = 1;
                    endPage = 10;
                } else if (currentPage + 4 >= totalPages) {
                    startPage = totalPages - 9;
                    endPage = totalPages;
                } else {
                    startPage = currentPage - 5;
                    endPage = currentPage + 4;
                }
            }

            // calculate start and end item indexes
            var startIndex = (currentPage - 1) * pageSize;
            var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

            // create an array of pages to ng-repeat in the pager control
            var pages = _.range(startPage, endPage + 1);

            // return object with all pager properties required by the view
            return {
                totalItems: totalItems,
                currentPage: currentPage,
                pageSize: pageSize,
                totalPages: totalPages,
                startPage: startPage,
                endPage: endPage,
                startIndex: startIndex,
                endIndex: endIndex,
                pages: pages
            };
        }

    }

})();
