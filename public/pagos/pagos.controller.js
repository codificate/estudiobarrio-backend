(function () {
    'use strict';

    angular
        .module('app')
        .controller('Pagos.IndexController', Controller);

    function Controller(SweetAlert, NgTableParams, ngDialog, $location, $localStorage, PagosService  ) {
        var vm = this;

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
        vm.getRecentlyCreated = getRecentlyCreated;
        vm.changeEstadoPago = changeEstadoPago;
        vm.getPagosByEstado = getPagosByEstado;
        vm.goToNuevoReclamo = goToNuevoReclamo;
        vm.filterByCriteria = filterByCriteria;
        vm.modalDetallePago = modalDetallePago;
        vm.getPagosByBanco = getPagosByBanco;
        vm.getEstadosPago = getEstadosPago;
        vm.removeCriteria = removeCriteria;
        vm.getMovimientos = getMovimientos;
        vm.goToReclamos = goToReclamos;
        vm.goToPagos = goToPagos;
        vm.getBancos = getBancos;
        vm.logout = logout;

        getRecentlyCreated();

        getEstadosPago();

        getMovimientos();

        getConsorcios();

        getBancos();

        function getPagosByConsorcio( consorcioid, consorcioname ) {

            vm.warning = "Esta consulta puede demorar un poco.";

            vm.loading = true;
            vm.consorciowasselected = true;
            vm.consorcioselected = consorcioname;
            vm.criteriasselected.consorcio = consorcioname;

            PagosService.PagosByConsorcio(consorcioid, function (response) {

                vm.pagos = response.data;
                vm.pagostmp = response.data;
                if ( vm.pagostmp instanceof Array || !isEmpty(vm.pagostmp) ){
                  vm.tableParams = new NgTableParams({ count: 10, sorting: { fecha: "desc" } }, { dataset: vm.pagostmp });
                } else {
                vm.tableParams = new NgTableParams({ count: 10, sorting: { fecha: "desc" } }, { dataset: [] });
                }
                vm.getCopropietariosByConsorcio( consorcioid );

            });

        }

        function getCopropietariosByConsorcio( consorcioid ){

          PagosService.CopropietariosByConsorcio( consorcioid, function (result) {

            vm.copropietarios = result.data;
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

        function changeEstadoPago( codigopago, pagoid, estadoid ){

          var response;
          var iterador = 0;
          var posicion = 0;

          SweetAlert.swal({
            title: "¿Estás seguro?",
            text: "Cambiarás el estado del pago, código: " + codigopago,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Si, por favor!",
            cancelButtonText: "No, cancelar!",
            closeOnConfirm: false,
            closeOnCancel: false },
            function(isConfirm){

              if (isConfirm) {

                PagosService.ChangeEstadoPago( pagoid, estadoid, function( result ){

                  if ( !isEmpty( result ) ) {

                      response = result;
                      vm.pagostmp.forEach(function ( tmp ) {

                          if ( !isEmpty(tmp) ) {

                            if (  tmp.uuid == result.uuid  ) {

                              posicion = iterador;

                            }

                            iterador++;

                          }

                      });

                      vm.pagostmp[ posicion ] = response;
                      vm.tableParams = new NgTableParams({ count: 10, sorting: { fecha: "desc" } }, { dataset: vm.pagostmp });
                      SweetAlert.swal("Listo!", "Haz cambiado la informacion, sin tropiezos.", "success");

                  }

                });

              } else {
                SweetAlert.swal("Cancelado", "Por suerte no ha pasado nada :)", "error");
              }

          });

        }

        function removeCriteria( criteria ){

            if ( vm.criteriasselected.banco == criteria ){
                vm.criteriasselected.banco = null;
                vm.bancoselected = null;
                vm.bancowasselected = false;
            }

            if ( vm.criteriasselected.movimiento == criteria ){
                vm.criteriasselected.movimiento = null;
                vm.movimientoselected = null;
                vm.movimientowasselected = false;
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

        }

        function getPagosByMovimiento( nombre ){

            vm.movimientoselected = nombre;
            vm.movimientowasselected = true;
            vm.criteriasselected.movimiento = nombre;

            vm.filterByCriteria();
        }

        function getPagosByEstado( nombre ){

            vm.estadoselected = nombre;
            vm.estadowasselected = true;
            vm.criteriasselected.estado = nombre;

            vm.filterByCriteria();

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

                vm.tableParams = new NgTableParams({ count: 10, sorting: { fecha: "desc" } }, { dataset: vm.pagostmp });

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
            vm.tableParams = new NgTableParams({ count: 10, sorting: { fecha: "desc" } }, { dataset: vm.pagos });

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

            if ( vm.pagostmp instanceof Array || !isEmpty(vm.pagostmp) ){

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

            if ( vm.pagostmp instanceof Array || !isEmpty(vm.pagostmp) ){

                vm.pagostmp.forEach(function (tmp) {

                    if ( tmp.banco == vm.criteriasselected.banco && tmp.movimiento == vm.criteriasselected.movimiento && tmp.estado == vm.criteriasselected.estado)
                        pagosByCriteria.push( tmp );
                });

            }

            return pagosByCriteria;

        }

        function findBancoEstadoCopropietario() {

            var pagosByCriteria = [];

            if ( vm.pagostmp instanceof Array || !isEmpty(vm.pagostmp) ){

                vm.pagostmp.forEach(function (tmp) {

                    if ( tmp.banco == vm.criteriasselected.banco && tmp.estado == vm.criteriasselected.estado && tmp.nombre == vm.criteriasselected.copropietario)
                        pagosByCriteria.push( tmp );
                });

            }

            return pagosByCriteria;

        }

        function findBancoMovimientoCopropietario() {

            var pagosByCriteria = [];

            if ( vm.pagostmp instanceof Array || !isEmpty(vm.pagostmp) ){

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

            if ( vm.pagostmp instanceof Array || !isEmpty(vm.pagostmp) ){

                vm.pagostmp.forEach(function (tmp) {

                    if ( tmp.banco == vm.criteriasselected.banco && tmp.movimiento == vm.criteriasselected.movimiento )
                        pagosByCriteria.push( tmp );
                });

            }

            return pagosByCriteria;

        }

        function findByBancoEstado() {

            var pagosByCriteria = [];

            if ( vm.pagostmp instanceof Array || !isEmpty(vm.pagostmp) ){

                vm.pagostmp.forEach(function (tmp) {

                    if ( tmp.banco == vm.criteriasselected.banco && tmp.estado == vm.criteriasselected.estado )
                        pagosByCriteria.push( tmp );
                });

            }

            return pagosByCriteria;
        }

        function findByBanco() {

            var pagosByCriteria = [];

            if ( vm.pagostmp instanceof Array || !isEmpty(vm.pagostmp) ){

                vm.pagostmp.forEach(function (tmp) {

                    if ( tmp.banco == vm.criteriasselected.banco )
                        pagosByCriteria.push( tmp );
                });

            }

            return pagosByCriteria;
        }

        function findByMovimiento() {

            var pagosByCriteria = [];

            if ( vm.pagostmp instanceof Array || !isEmpty(vm.pagostmp) ){

                vm.pagostmp.forEach(function (tmp) {

                    if ( tmp.movimiento == vm.criteriasselected.movimiento )
                        pagosByCriteria.push( tmp );
                });

            }

            return pagosByCriteria;
        }

        function findByEstado() {

            var pagosByCriteria = [];

            if ( vm.pagostmp instanceof Array || !isEmpty(vm.pagostmp) ){

                vm.pagostmp.forEach(function (tmp) {

                    if ( tmp.estado == vm.criteriasselected.estado )
                        pagosByCriteria.push( tmp );
                });

            }

            return pagosByCriteria;
        }

        function isEmpty(obj) {
          for(var key in obj) {
            if(obj.hasOwnProperty(key))
              return false;
            }
          return true;
        }

        function findByCopropietario() {

            var pagosByCriteria = [];

            if ( vm.pagostmp instanceof Array || !isEmpty(vm.pagostmp) ){

                vm.pagostmp.forEach(function (tmp) {

                    if ( tmp.nombre == vm.criteriasselected.copropietario )
                        pagosByCriteria.push( tmp );
                });

            }

            return pagosByCriteria;
        }

        function findByEstadoCopropietario(){

            var pagosByCriteria = [];

            if ( vm.pagostmp instanceof Array || !isEmpty(vm.pagostmp) ){

                vm.pagostmp.forEach(function (tmp) {

                    if ( tmp.estado == vm.criteriasselected.estado && tmp.nombre == vm.criteriasselected.copropietario )
                        pagosByCriteria.push( tmp );
                });

            }

            return pagosByCriteria;

        }

        function findByEstadoMovimiento(){

            var pagosByCriteria = [];

            if ( vm.pagostmp instanceof Array || !isEmpty(vm.pagostmp) ){

                vm.pagostmp.forEach(function (tmp) {

                    if ( tmp.movimiento == vm.criteriasselected.movimiento && tmp.estado == vm.criteriasselected.estado )
                        pagosByCriteria.push( tmp );
                });

            }

            return pagosByCriteria;

        }

        function findByEstadoMovimientoCopropietario(){

            var pagosByCriteria = [];

            if ( vm.pagostmp instanceof Array || !isEmpty(vm.pagostmp) ){

                vm.pagostmp.forEach(function (tmp) {

                    if ( tmp.movimiento == vm.criteriasselected.movimiento && tmp.estado == vm.criteriasselected.estado && tmp.nombre == vm.criteriasselected.copropietario )
                        pagosByCriteria.push( tmp );
                });

            }

            return pagosByCriteria;

        }

        function findByMovimientoCopropietario(){

            var pagosByCriteria = [];

            if ( vm.pagostmp instanceof Array || !isEmpty(vm.pagostmp) ){

                vm.pagostmp.forEach(function (tmp) {

                    if ( tmp.movimiento == vm.criteriasselected.movimiento && tmp.nombre == vm.criteriasselected.copropietario )
                        pagosByCriteria.push( tmp );
                });

            }

            return pagosByCriteria;

        }

        function findByBancoCopropietario() {

            var pagosByCriteria = [];

            if ( vm.pagostmp instanceof Array || !isEmpty(vm.pagostmp) ){

                vm.pagostmp.forEach(function (tmp) {

                    if ( tmp.banco == vm.criteriasselected.banco && tmp.nombre == vm.criteriasselected.copropietario )
                        pagosByCriteria.push( tmp );
                });

            }

            return pagosByCriteria;
        }

        function modalDetallePago(pago) {

            ngDialog.open({
                template: 'detallePago.html',
                className: 'ngdialog-theme-default ngdialog-theme-custom',
                resolve:{
                    pago: function(){
                        return pago;
                    }
                },
                controller: function($scope,pago){
                    $scope.pago = pago;
                }

            });

        }

        vm.tableParams = new NgTableParams({ count: 10, sorting: { fecha: "desc" } }, { dataset: vm.pagostmp });

    }

})();

(function () {
    'use strict';

    angular
        .module('app')
        .controller('ModalInstanceCtrl', ModalInstanceCtrl);

    function ModalInstanceCtrl(detallepago) {

        var $ctrl = this;
        $ctrl.pago = detallepago;
        console.log( detallepago );

    }

})();
