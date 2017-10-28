(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller($location, $localStorage, ReclamosService, PagerService ) {
        var vm = this;

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
        vm.getByConsorcio = getByConsorcio;
        vm.getConsorcios = getConsorcios;
        vm.goToPagos = goToPagos;
        vm.logout = logout;

        getRecentlyCreated();

        getConsorcios();

        getTiposReclamo();

        getEstadosReclamo();

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
            vm.pager = PagerService.GetPager(vm.reclamos.length, page);

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

            var reclamosFiltrados = [];

            vm.reclamostmp.forEach(function(entry) {

                if( entry.tipo == nombre ){
                    reclamosFiltrados.push( entry );
                }

            });

            vm.reclamos = reclamosFiltrados;

        }

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

        function getRecentlyCreated(){

            vm.loading = true;

            ReclamosService.LastCreated( function (result) {

                vm.reclamos = result.data;
                vm.reclamostmp = result.data;
                vm.loading = false;

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