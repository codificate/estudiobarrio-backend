(function () {
    'use strict';

    angular
        .module('app')
        .controller('Pagos.IndexController', Controller);

    function Controller($uibModal, $location, $localStorage, PagosService  ) {
        var vm = this;

        vm.pager = {};

        vm.criteriasselected = { banco: null, movimiento: null, estado: null, copropietario: null, consorcio: null };

        vm.pagos = null;
        vm.bancos = null;
        vm.warning = null;
        vm.pagostmp = null;
        vm.consorcios = null;
        vm.estadopagos = null;
        vm.movimientos = null;
        vm.bancoselected = null;
        vm.estadoselected = null;
        vm.copropietarios = null;
        vm.consorcioselected = null;
        vm.movimientoselected = null;
        vm.copropietarioselected = null;

        vm.copropietariowasselected = false;
        vm.movimientowasselected = false;
        vm.consorciowasselected = false;
        vm.estadowasselected = false;
        vm.bancowasselected = false;
        vm.loading = false;

        vm.getCopropietariosByConsorcio = getCopropietariosByConsorcio;
        vm.getPagosByCopropietario = getPagosByCopropietario;
        vm.getPagosByMovimiento = getPagosByMovimiento;
        vm.getPagosByConsorcio = getPagosByConsorcio;
        vm.getPagosByEstado = getPagosByEstado;
        vm.goToNuevoReclamo = goToNuevoReclamo;
        vm.filterByCriteria = filterByCriteria;
        vm.getPagosByBanco = getPagosByBanco;
        vm.modalDetallePago = modalDetallePago;
        vm.getEstadosPago = getEstadosPago;
        vm.removeCriteria = removeCriteria;
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

        function setPage(page) {

            if ( page < 1 ) {
                return;
            }

            // get pager object from service
            vm.pager = vm.getPager(vm.pagos.length, page);

            // get current page of items
            vm.pagos = vm.pagos.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
        }

        function getPagosByConsorcio( consorcioid, consorcioname ) {

            vm.warning = "Esta consulta puede demorar un poco.";

            vm.loading = true;
            vm.consorciowasselected = true;
            vm.consorcioselected = consorcioname;
            vm.criteriasselected.consorcio = consorcioname;

            PagosService.PagosByConsorcio(consorcioid, function (result) {

                vm.pagos = result.data;
                vm.pagostmp = result.data;
                vm.getCopropietariosByConsorcio( consorcioid );

            });

        }

        function getCopropietariosByConsorcio( consorcioid ){

          PagosService.CopropietariosByConsorcio( consorcioid, function (result) {

            vm.copropietarios = result.data;
            vm.warning = null;
            vm.filterByCriteria();
            vm.loading = false;

          });

        }

        function getPagosByCopropietario( copropietarioid, copropietarioname ){

            vm.warning = "Esta consulta puede demorar un poco.";
            vm.loading = true;
            vm.copropietariowasselected = true;
            vm.copropietarioselected = copropietarioname;
            vm.criteriasselected.copropietario = copropietarioname;

            PagosService.PagosByCopropietario( copropietarioid, function (result) {

                vm.pagos = result.data;
                vm.pagostmp = result.data;
                vm.warning = null;
                vm.filterByCriteria();
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

        function removeCriteria( criteria ){

            if ( vm.criteriasselected.banco == criteria ){
                vm.criteriasselected.banco = null;
                vm.bancoselected = null;
                vm.bancowasselected = false;
            }

            if ( vm.criteriasselected.movimiento == criteria ){
                vm.criteriasselected.movimiento = null;
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


        function getPagosByBanco( nombre ){

            vm.bancoselected = nombre;
            vm.bancowasselected = true;
            vm.criteriasselected.banco = nombre;

            vm.filterByCriteria();

            vm.setPage(1);

        }

        function getPagosByMovimiento( nombre ){

            vm.movimientoselected = nombre;
            vm.movimientowasselected = true;
            vm.criteriasselected.movimiento = nombre;

            vm.filterByCriteria();

            vm.setPage(1);

        }

        function getPagosByEstado( nombre ){

            vm.estadoselected = nombre;
            vm.estadowasselected = true;
            vm.criteriasselected.estado = nombre;

            vm.filterByCriteria();

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

        function getRecentlyCreated( forceFilter ){

            vm.loading = true;

            PagosService.LastCreated(function (result) {

                vm.pagos = result.data;
                vm.pagostmp = result.data;
                vm.loading = false;

                if ( forceFilter !== null && forceFilter )
                    vm.filterByCriteria();

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

        function filterByCriteria() {

            var filtrados = [];

            if ( ifAllCriteriaIsNull() ){ getAllPagosTmp(); return; }
            else if ( ifAllCriteriaIsNotNull() ) { filtrados = findPagosByAllCriteria(); }
            else if ( ifBancoMovimientoEstadoNotNull() ) { filtrados = findByBancoMovimientoEstado(); }
            else if ( ifBancoMovimientoCopropietarioNotNull() ) { filtrados = findBancoMovimientoCopropietario(); }
            else if ( ifBancoEstadoCopropietario() ) { filtrados = findBancoEstadoCopropietario(); }
            else if ( ifBancoCopropietarioNotNull() ) { filtrados = findByBancoCopropietario(); }
            else if ( ifBancoMovimientoNotNull() ) { filtrados = findByBancoMovimiento(); }
            else if ( ifBancoEstadoNotNull() ) { filtrados = findByBancoEstado(); }
            else if ( ifBancoNotNull() ) { filtrados = findByBanco(); }
            else if ( ifMovimientoNotNull() ) { filtrados = findByMovimiento(); }
            else if ( ifEstadoNotNull() ) { filtrados = findByEstado(); }
            else if ( ifCopropietarioNotNull() ) { filtrados = findByCopropietario(); }
            else if ( ifEstadoMovimientoNotNull() ) { filtrados = findByEstadoMovimiento(); }
            else if ( ifEstadoCopropietarioNotNull() ) { filtrados = findByEstadoCopropietario(); }
            else if ( ifMovimientoCopropietarioNotNull() ) { filtrados = findByMovimientoCopropietario(); }
            else if ( ifEstadoMovimientoCopropietarioNotNull() ) { filtrados = findByEstadoMovimientoCopropietario() }

            vm.pagos = filtrados;

        }

        function ifAllCriteriaIsNull(){
          return ( vm.criteriasselected.banco == null && vm.criteriasselected.movimiento == null && vm.criteriasselected.estado == null && vm.criteriasselected.copropietario == null );
        }

        function ifAllCriteriaIsNotNull(){
          return ( vm.criteriasselected.banco !== null && vm.criteriasselected.movimiento !== null && vm.criteriasselected.estado !== null && vm.criteriasselected.copropietario !== null );
        }

        function ifBancoMovimientoEstadoNotNull() {
          return ( vm.criteriasselected.banco !== null && vm.criteriasselected.movimiento !== null && vm.criteriasselected.estado !== null && vm.criteriasselected.copropietario == null );
        }

        function ifBancoMovimientoCopropietarioNotNull() {
          return ( vm.criteriasselected.banco !== null && vm.criteriasselected.movimiento !== null && vm.criteriasselected.estado == null && vm.criteriasselected.copropietario !== null );
        }

        function ifBancoEstadoCopropietario() {
          return ( vm.criteriasselected.banco !== null && vm.criteriasselected.movimiento == null && vm.criteriasselected.estado !== null && vm.criteriasselected.copropietario !== null );
        }

        function ifBancoCopropietarioNotNull(){
          return ( vm.criteriasselected.banco !== null && vm.criteriasselected.movimiento == null && vm.criteriasselected.estado == null && vm.criteriasselected.copropietario !== null );
        }

        function ifBancoMovimientoNotNull() {
          return ( vm.criteriasselected.banco !== null && vm.criteriasselected.movimiento !== null && vm.criteriasselected.estado == null && vm.criteriasselected.copropietario == null );
        }

        function ifBancoEstadoNotNull() {
          return ( vm.criteriasselected.banco !== null && vm.criteriasselected.movimiento == null && vm.criteriasselected.estado !== null && vm.criteriasselected.copropietario == null );
        }

        function ifBancoNotNull(){
          return ( vm.criteriasselected.banco !== null && vm.criteriasselected.movimiento == null && vm.criteriasselected.estado == null && vm.criteriasselected.copropietario == null );
        }

        function ifMovimientoNotNull(){
            return ( vm.criteriasselected.banco == null && vm.criteriasselected.movimiento !== null && vm.criteriasselected.estado == null && vm.criteriasselected.copropietario == null );
        }

        function ifEstadoNotNull() {
            return ( vm.criteriasselected.banco == null && vm.criteriasselected.movimiento == null && vm.criteriasselected.estado !== null && vm.criteriasselected.copropietario == null );
        }

        function ifCopropietarioNotNull(){
            return ( vm.criteriasselected.banco == null && vm.criteriasselected.movimiento == null && vm.criteriasselected.estado == null && vm.criteriasselected.copropietario !== null );
        }

        function ifEstadoCopropietarioNotNull() {
            return ( vm.criteriasselected.banco == null && vm.criteriasselected.movimiento == null && vm.criteriasselected.estado !== null && vm.criteriasselected.copropietario !== null );
        }

        function ifEstadoMovimientoNotNull() {
            return ( vm.criteriasselected.banco == null && vm.criteriasselected.movimiento !== null && vm.criteriasselected.estado !== null && vm.criteriasselected.copropietario == null );
        }

        function ifEstadoMovimientoCopropietarioNotNull() {
            return ( vm.criteriasselected.banco == null && vm.criteriasselected.movimiento !== null && vm.criteriasselected.estado !== null && vm.criteriasselected.copropietario !== null );
        }

        function ifMovimientoCopropietarioNotNull(){
            return ( vm.criteriasselected.banco == null && vm.criteriasselected.movimiento !== null && vm.criteriasselected.estado == null && vm.criteriasselected.copropietario !== null );
        }

        /**
         * name: getAllPagosTmp
         * @returns {Array}
         */
        function getAllPagosTmp(){

            vm.getRecentlyCreated();

        }

        /**
         * name: getPagosByAllCriteria
         *
         * Busqueda por: Banco, Movimiento, Estado & Copropietario
         *
         * @returns {Array}
         *
         */
        function findPagosByAllCriteria() {

            var pagosByCriteria = [];

            if ( vm.pagostmp !== null ){

                vm.pagostmp.forEach(function (tmp) {

                    if (
                        tmp.banco == vm.criteriasselected.banco &&
                        tmp.estado == vm.criteriasselected.estado &&
                        tmp.movimiento == vm.criteriasselected.movimiento &&
                        tmp.nombre == vm.criteriasselected.copropietario ){

                        pagosByCriteria.push( tmp );
                    }

                });

            }

            return pagosByCriteria;
        }

        /**
         * name: findByBancoMovimientoEstado
         *
         * Busqueda por: Banco, Movimiento, & Estado
         *
         * @returns {Array}
         */
        function findByBancoMovimientoEstado(){

            var pagosByCriteria = [];

            if ( vm.pagostmp !== null ){

                vm.pagostmp.forEach(function (tmp) {

                    if ( tmp.banco == vm.criteriasselected.banco && tmp.movimiento == vm.criteriasselected.movimiento && tmp.estado == vm.criteriasselected.estado)
                        pagosByCriteria.push( tmp );
                });

            }

            return pagosByCriteria;

        }

        function findBancoEstadoCopropietario() {

            var pagosByCriteria = [];

            if ( vm.pagostmp !== null ){

                vm.pagostmp.forEach(function (tmp) {

                    if ( tmp.banco == vm.criteriasselected.banco && tmp.estado == vm.criteriasselected.estado && tmp.nombre == vm.criteriasselected.copropietario)
                        pagosByCriteria.push( tmp );
                });

            }

            return pagosByCriteria;

        }

        function findBancoMovimientoCopropietario() {

            var pagosByCriteria = [];

            if ( vm.pagostmp !== null ){

                vm.pagostmp.forEach(function (tmp) {

                    if ( tmp.banco == vm.criteriasselected.banco && tmp.movimiento == vm.criteriasselected.movimiento && tmp.nombre == vm.criteriasselected.copropietario)
                        pagosByCriteria.push( tmp );
                });

            }

            return pagosByCriteria;

        }

        /**
         * name: findByBancoMovimiento
         *
         * Busqueda por: Banco & Movimiento
         *
         * @returns {Array}
         */
        function findByBancoMovimiento(){

            var pagosByCriteria = [];

            if ( vm.pagostmp !== null ){

                vm.pagostmp.forEach(function (tmp) {

                    if ( tmp.banco == vm.criteriasselected.banco && tmp.movimiento == vm.criteriasselected.movimiento )
                        pagosByCriteria.push( tmp );
                });

            }

            return pagosByCriteria;

        }

        function findByBancoEstado() {

            var pagosByCriteria = [];

            if ( vm.pagostmp !== null ){

                vm.pagostmp.forEach(function (tmp) {

                    if ( tmp.banco == vm.criteriasselected.banco && tmp.estado == vm.criteriasselected.estado )
                        pagosByCriteria.push( tmp );
                });

            }

            return pagosByCriteria;
        }

        function findByBanco() {

            var pagosByCriteria = [];

            console.log( vm.criteriasselected );
            console.log( vm.pagostmp );

            if ( vm.pagostmp !== null ){

                vm.pagostmp.forEach(function (tmp) {

                    if ( tmp.banco == vm.criteriasselected.banco )
                        pagosByCriteria.push( tmp );
                });

            }

            return pagosByCriteria;
        }

        function findByMovimiento() {

            var pagosByCriteria = [];

            if ( vm.pagostmp !== null ){

                vm.pagostmp.forEach(function (tmp) {

                    if ( tmp.movimiento == vm.criteriasselected.movimiento )
                        pagosByCriteria.push( tmp );
                });

            }

            return pagosByCriteria;
        }

        function findByEstado() {

            var pagosByCriteria = [];

            if ( vm.pagostmp !== null ){

                vm.pagostmp.forEach(function (tmp) {

                    if ( tmp.estado == vm.criteriasselected.estado )
                        pagosByCriteria.push( tmp );
                });

            }

            return pagosByCriteria;
        }

        function findByCopropietario() {

            var pagosByCriteria = [];

            if ( vm.pagostmp !== null ){

                vm.pagostmp.forEach(function (tmp) {

                    if ( tmp.nombre == vm.criteriasselected.copropietario )
                        pagosByCriteria.push( tmp );
                });

            }

            return pagosByCriteria;
        }

        function findByEstadoCopropietario(){

            var pagosByCriteria = [];

            if ( vm.pagostmp !== null ){

                vm.pagostmp.forEach(function (tmp) {

                    if ( tmp.estado == vm.criteriasselected.estado && tmp.nombre == vm.criteriasselected.copropietario )
                        pagosByCriteria.push( tmp );
                });

            }

            return pagosByCriteria;

        }

        function findByEstadoMovimiento(){

            var pagosByCriteria = [];

            if ( vm.pagostmp !== null ){

                vm.pagostmp.forEach(function (tmp) {

                    if ( tmp.movimiento == vm.criteriasselected.movimiento && tmp.estado == vm.criteriasselected.estado )
                        pagosByCriteria.push( tmp );
                });

            }

            return pagosByCriteria;

        }

        function findByEstadoMovimientoCopropietario(){

            var pagosByCriteria = [];

            if ( vm.pagostmp !== null ){

                vm.pagostmp.forEach(function (tmp) {

                    if ( tmp.movimiento == vm.criteriasselected.movimiento && tmp.estado == vm.criteriasselected.estado && tmp.nombre == vm.criteriasselected.copropietario )
                        pagosByCriteria.push( tmp );
                });

            }

            return pagosByCriteria;

        }

        function findByMovimientoCopropietario(){

            var pagosByCriteria = [];

            if ( vm.pagostmp !== null ){

                vm.pagostmp.forEach(function (tmp) {

                    if ( tmp.movimiento == vm.criteriasselected.movimiento && tmp.nombre == vm.criteriasselected.copropietario )
                        pagosByCriteria.push( tmp );
                });

            }

            return pagosByCriteria;

        }

        function findByBancoCopropietario() {

            var pagosByCriteria = [];

            if ( vm.pagostmp !== null ){

                vm.pagostmp.forEach(function (tmp) {

                    if ( tmp.banco == vm.criteriasselected.banco && tmp.nombre == vm.criteriasselected.copropietario )
                        pagosByCriteria.push( tmp );
                });

            }

            return pagosByCriteria;
        }

        function modalDetallePago(pago) {

          var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            controllerAs: '$ctrl',
            resolve: {
              detallepago: function () {
                return pago;
              }
            }
          });

        }

        /**
         *
         * @param totalItems
         * @param currentPage
         * @param pageSize
         * @returns {{totalItems: *, currentPage: (*|number), pageSize: (*|number), totalPages: number, startPage: *, endPage: *, startIndex: number, endIndex: number, pages: *}}
         */

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

(function () {
    'use strict';

    angular
        .module('app')
        .controller('ModalInstanceCtrl', ModalInstanceCtrl);

    function ModalInstanceCtrl($uibModalInstance, detallepago) {

      console.log( "Llego al modal" );
      var $ctrl = this;
      $ctrl.pago = detallepago;

      $ctrl.ok = function () {
        $uibModalInstance.close();
      };

    }

})();
