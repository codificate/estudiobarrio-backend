(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller(ngDialog, $location, $localStorage, ReclamosService ) {
        var vm = this;

        vm.pager = {};

        vm.criteriasselected = { tipo: null, estado: null, copropietario: null, consorcio: null };

        vm.reclamos = null;
        vm.reclamostmp = [];
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
        vm.loading = false;

        vm.getReclamosByCopropietario = getReclamosByCopropietario;
        vm.getReclamosByEstadoReclamo = getReclamosByEstadoReclamo;
        vm.getReclamosByTipoReclamo = getReclamosByTipoReclamo;
        vm.modalDetalleReclamo = modalDetalleReclamo;
        vm.getRecentlyCreated = getRecentlyCreated;
        vm.getEstadosReclamo = getEstadosReclamo;
        vm.goToNuevoReclamo = goToNuevoReclamo;
        vm.filterByCriteria = filterByCriteria;
        vm.getByConsorcio = getByConsorcio;
        vm.removeCriteria = removeCriteria;
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
            
            if ( page < 1 ) {
                return;
            }

            // get pager object from service
            vm.pager = vm.getPager(vm.reclamos.length, page);

            // get current page of items
            vm.reclamos = vm.reclamos.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
        }

        /**
         * name: getByConsorcio
         *
         * Obtiene los reclamos según el consorcio (Edificio) seleccionado
         *
         * @param consorcioid
         * @param consorcioname
         */

        function getByConsorcio( consorcioid, consorcioname ){

            vm.loading = true;
            vm.consorciowasselected = true;
            vm.consorcioselected = consorcioname;

            vm.criteriasselected.consorcio = consorcioname;

            ReclamosService.ByConsorcio( consorcioid, function (result) {
                vm.reclamos = result.data;
                vm.reclamostmp = result.data;

                vm.filterByCriteria();

                getCopropietariosByConsorcio( consorcioid );

                vm.setPage(1);
            });
        }

        /**
         *
         * name: getCopropietariosByConsorcio
         *
         * Obtiene el listado de copropietarios (Inquilinos) a partir del consorcio seleccionado
         *
         * @param consorcioid
         */

        function getCopropietariosByConsorcio( consorcioid ) {

            ReclamosService.CopropietariosByConsorcio( consorcioid, function (result) {

                vm.copropietarios = result.data;
                vm.loading = false;

            });
        }

        /**
         * name: getReclamosByCopropietario
         *
         * Filtra los reclamos de acuerdo al nombre del copropietario seleccionado
         *
         * @param copropietarioname
         */

        function getReclamosByCopropietario( copropietarioname ){
            
            vm.copropietariowasselected = true;
            vm.copropietarioselected = copropietarioname;
            
            vm.showcolumns = false;

            vm.criteriasselected.copropietario = copropietarioname;

            vm.filterByCriteria();

            vm.setPage(1);
            
        }

        /**
         * name: getReclamosByTipoReclamo
         *
         * Filtra los reclamos de acuerdo al nombre del tipo de reclamo seleccionado
         *
         * @param nombre
         */

        function getReclamosByTipoReclamo( nombre ) {

            vm.tiposelected = nombre;
            vm.tipowasselected = true;

            vm.criteriasselected.tipo = nombre;

            vm.filterByCriteria();

            vm.setPage(1);

        }

        /**
         * +54 9 11 2653-5442 Maggie
         * +54 9 11 3626 7522 Candy
         * @param nombre
         */

        /**
         * name: getReclamosByEstadoReclamo
         *
         * Filtra los reclamos de acuerdo al nombre del estado de reclamo seleccionado
         *
         * @param nombre
         */

        function getReclamosByEstadoReclamo( nombre ){

            vm.estadoselected = nombre;
            vm.estadowasselected = true;

            vm.criteriasselected.estado = nombre;

            vm.filterByCriteria();

            vm.setPage(1);

        }

        /**
         * name: getReclamosByEstadoReclamo
         *
         * Obtiene el listado de consorcios
         *
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

        /**
         * name: getTiposReclamo
         *
         * Obtiene el listado de tipos de reclamo
         *
         */

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

        function getRecentlyCreated( forceFilter ){

            vm.loading = true;

            ReclamosService.LastCreated( function (result) {

                vm.reclamos = result.data;
                vm.reclamostmp = result.data;
                vm.loading = false;

                if ( forceFilter !== null && forceFilter )
                    vm.filterByCriteria();

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

        function modalDetalleReclamo(reclamo) {

            ngDialog.open({
                template: 'detalleReclamo.html',
                className: 'ngdialog-theme-default ngdialog-theme-custom',
                resolve:{
                    reclamo: function(){
                        return reclamo;
                    }
                },
                controller: function($scope,reclamo){
                    $scope.reclamo = reclamo;
                }

            });

        }

        function removeCriteria( criteria ){

            if ( vm.criteriasselected.tipo == criteria ){
                vm.criteriasselected.tipo = null;
                vm.tiposelected = null;
                vm.tipowasselected = false;
            }

            if ( vm.criteriasselected.estado == criteria ){
                vm.criteriasselected.estado = null;
                vm.estadoselected = null;
                vm.estadowasselected = false;
            }

            if ( vm.criteriasselected.copropietario == criteria ){
                vm.criteriasselected.copropietario = null;
                vm.copropietarioselected = null;
                vm.copropietariowasselected = false;
            }

            if ( vm.criteriasselected.consorcio == criteria ){
                vm.criteriasselected.consorcio = null;
                vm.consorcioselected = null;
                vm.consorciowasselected = false;

                vm.getRecentlyCreated( true );
                return;
            }

            vm.filterByCriteria();

        }

        function filterByCriteria() {

            var filtrados = [];

            if ( vm.criteriasselected.tipo == null && vm.criteriasselected.estado == null && vm.criteriasselected.copropietario == null ){

                /**
                 * Busqueda sin filtros
                 */

                if ( vm.reclamostmp !== null ){

                    vm.reclamostmp.forEach(function ( tmp ) {

                        filtrados.push( tmp );
                    });

                }

            } else if ( vm.criteriasselected.tipo !== null && vm.criteriasselected.estado !== null && vm.criteriasselected.copropietario !== null ) {

                /**
                 * Busqueda por: Tipo, Estado & Copropietario
                 */

                if ( vm.reclamostmp !== null ){

                    vm.reclamostmp.forEach(function (tmp) {

                        if ( tmp.tipo == vm.criteriasselected.tipo &&
                                tmp.estado == vm.criteriasselected.estado &&
                                    tmp.nombre == vm.criteriasselected.copropietario ){

                            filtrados.push( tmp );
                        }

                    });

                }

            } else if ( vm.criteriasselected.tipo !== null && vm.criteriasselected.estado !== null && vm.criteriasselected.copropietario == null ) {

                /**
                 * Busqueda por: Tipo & Estado
                 */

                if ( vm.reclamostmp !== null ){

                    vm.reclamostmp.forEach(function (tmp) {

                        if ( tmp.tipo == vm.criteriasselected.tipo && tmp.estado == vm.criteriasselected.estado)
                            filtrados.push( tmp );
                    });

                }

            } else if ( vm.criteriasselected.tipo !== null && vm.criteriasselected.estado == null && vm.criteriasselected.copropietario == null ) {

                /**
                 * Busqueda por: Tipo
                 */

                if ( vm.reclamostmp !== null ){

                    vm.reclamostmp.forEach(function (tmp) {

                        if ( tmp.tipo == vm.criteriasselected.tipo )
                            filtrados.push( tmp );
                    });

                }

            } else if ( vm.criteriasselected.tipo == null && vm.criteriasselected.estado !== null && vm.criteriasselected.copropietario == null ) {

                /**
                 * Busqueda por: Estado
                 */

                if ( vm.reclamostmp !== null ){

                    vm.reclamostmp.forEach(function (tmp) {

                        if ( tmp.estado == vm.criteriasselected.estado )
                            filtrados.push( tmp );
                    });

                }

            } else if ( vm.criteriasselected.tipo == null && vm.criteriasselected.estado == null && vm.criteriasselected.copropietario !== null ) {

                /**
                 * Busqueda por: Copropietario
                 */

                if ( vm.reclamostmp !== null ){

                    vm.reclamostmp.forEach(function (tmp) {

                        if ( tmp.nombre == vm.criteriasselected.copropietario )
                            filtrados.push( tmp );
                    });

                }

            } else if ( vm.criteriasselected.tipo == null && vm.criteriasselected.estado !== null && vm.criteriasselected.copropietario !== null ) {

                /**
                 * Busqueda por: Estado & Copropietario
                 */

                if ( vm.reclamostmp !== null ){

                    vm.reclamostmp.forEach(function (tmp) {

                        if ( tmp.estado == vm.criteriasselected.estado && tmp.nombre == vm.criteriasselected.copropietario )
                            filtrados.push( tmp );
                    });

                }
            } else if ( vm.criteriasselected.tipo !== null && vm.criteriasselected.estado == null && vm.criteriasselected.copropietario !== null ) {

                /**
                 * Busqueda por: Tipo & Copropietario
                 */

                if ( vm.reclamostmp !== null ){

                    vm.reclamostmp.forEach(function (tmp) {

                        if ( tmp.tipo == vm.criteriasselected.tipo && tmp.nombre == vm.criteriasselected.copropietario )
                            filtrados.push( tmp );
                    });

                }
            }

            vm.reclamos = filtrados;

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