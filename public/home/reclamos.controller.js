(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller($location, $localStorage, ReclamosService ) {
        var vm = this;

        vm.pager = {};

        vm.criteriasselected = [];

        vm.loading = false;
        vm.reclamos = null;
        vm.consorcios = null;
        vm.tiposelected = null;
        vm.tiposreclamo = null;
        vm.estadoselected = null;
        vm.copropietarios = null;
        vm.consorcioselected = null;
        vm.copropietarioselected = null;

        vm.copropietariowasselected = false;
        vm.consorciowasselected = false;
        vm.estadowasselected = false;
        vm.tipowasselected = false;
        vm.showcolumns = true;

        vm.getReclamosByCopropietario = getReclamosByCopropietario;
        vm.getReclamosByEstadoReclamo = getReclamosByEstadoReclamo;
        vm.getReclamosByTipoReclamo = getReclamosByTipoReclamo;
        vm.getEstadosReclamo = getEstadosReclamo;
        vm.goToNuevoReclamo = goToNuevoReclamo;
        vm.getByConsorcio = getByConsorcio;
        vm.isLastCriteria = isLastCriteria;
        vm.getConsorcios = getConsorcios;
        vm.goToReclamos = goToReclamos;
        vm.goToPagos = goToPagos;
        vm.getPager = getPager;
        vm.setPage = setPage;
        vm.logout = logout;

        getRecentlyCreated();

        getConsorcios();

        getTiposReclamo();

        getEstadosReclamo();

        //initController();

        /* function initController() {
            // initialize to page 1
            vm.setPage(1);
        } */

        function setPage(page) {
            if (page < 1 || page > vm.pager.totalPages) {
                return;
            }

            // get pager object from service
            vm.pager = vm.getPager(vm.reclamos.length, page);

            // get current page of items
            vm.reclamos = vm.reclamos.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
        }

        function getByConsorcio( consorcioid, consorcioname ){

            vm.loading = true;
            vm.consorciowasselected = true;
            vm.consorcioselected = consorcioname;

            ReclamosService.ByConsorcio( consorcioid, function (result) {
                vm.reclamos = result.data;
                vm.reclamostmp = result.data;
                vm.loading = false;

                var consorcioExistAsCriteria = false;

                vm.criteriasselected.forEach(function (entry) {

                    if ( entry.consorcio !== null ){

                        entry.consorcio = consorcioname;
                        consorcioExistAsCriteria = true;

                    }

                });

                if ( consorcioExistAsCriteria == false ){
                    vm.criteriasselected.push({
                        consorcio : consorcioname
                    })
                }

                getCopropietariosByConsorcio( consorcioid );

                vm.setPage(1);
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

                var copropietarioExistAsCriteria = false;

                vm.criteriasselected.forEach(function (entry) {

                    if ( entry.copropietario !== null ){

                        entry.copropietario = copropietarioname;
                        copropietarioExistAsCriteria = true;

                    }

                });

                if ( copropietarioExistAsCriteria == false ){
                    vm.criteriasselected.push({
                        copropietario : copropietarioname
                    })
                }

                vm.setPage(1);
            });
        }

        function getReclamosByTipoReclamo( nombre ) {

            vm.tiposelected = nombre;
            vm.tipowasselected = true;

            var reclamosFiltrados = [];

            vm.reclamostmp.forEach(function(entry) {

                if( entry.tipo == nombre ){
                    reclamosFiltrados.push( entry );
                }

            });

            var tipoExistAsCriteria = false;

            vm.criteriasselected.forEach(function (entry) {

                if ( entry.tipo !== null ){

                    entry.tipo = nombre;
                    tipoExistAsCriteria = true;

                }

            });

            if ( tipoExistAsCriteria == false ){
                vm.criteriasselected.push({
                    tipo : nombre
                })
            }

            vm.reclamos = reclamosFiltrados;

            vm.setPage(1);

        }

        /**
         * +54 9 11 2653-5442 Maggie
         * +54 9 11 3626 7522 Candy
         * @param nombre
         */

        function getReclamosByEstadoReclamo( nombre ){

            vm.estadoselected = nombre;
            vm.estadowasselected = true;

            var reclamosFiltrados = [];

            vm.reclamostmp.forEach(function(entry) {

                if ( vm.tipowasselected ){
                    if( entry.estado == nombre && entry.tipo == vm.tiposelected )
                        reclamosFiltrados.push( entry );
                } else {
                    if( entry.estado == nombre)
                        reclamosFiltrados.push( entry );
                }

            });

            vm.criteriasselected.push({
                estado : nombre
            });

            vm.reclamos = reclamosFiltrados;

            vm.setPage(1);

        }

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

        function getRecentlyCreated(){

            vm.loading = true;

            ReclamosService.LastCreated( function (result) {

                vm.reclamos = result.data;
                vm.reclamostmp = result.data;
                vm.loading = false;

                vm.setPage(1);

            });
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

        function isLastCriteria( criteria ){

            vm.criteriasselected.forEach(function (entry) {

                if ( entry.tipo == criteria ){
                    entry.tipo = null;
                    vm.tiposelected = null;
                    vm.tipowasselected = false;
                }

                if ( entry.estado == criteria ){
                    entry.estado = null;
                    vm.estadoselected = null;
                    vm.estadowasselected = false;
                }

            });

        }

        function logout(){
            delete $localStorage.currentUser;
            delete $localStorage.tiposreclamo;
            delete $localStorage.estadosreclamo;
            delete $localStorage.consorcios;

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