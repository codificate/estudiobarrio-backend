(function () {
    'use strict';

    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller(SweetAlert, NgTableParams, ngDialog, $location, $localStorage, ReclamosService ) {
        var vm = this;

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
        vm.changeEstadoReclamo = changeEstadoReclamo;
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
        vm.logout = logout;

        getRecentlyCreated();

        getConsorcios();

        getTiposReclamo();

        getEstadosReclamo();

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

            ReclamosService.ByConsorcio( consorcioid, function (response) {
                vm.reclamos = response.data;
                vm.reclamostmp = response.data;

                if ( !vm.reclamostmp instanceof Array || isEmpty(vm.reclamostmp) ){
                  vm.reclamos = [];
                  vm.reclamostmp = [];
                } else {
                  vm.filterByCriteria();
                }

                getCopropietariosByConsorcio( consorcioid );

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

        }

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

        }

        function changeEstadoReclamo( codigoreclamo, reclamoid, estadoid ){

          var response;
          var iterador = 0;
          var posicion = 0;

          SweetAlert.swal({
            title: "¿Estás seguro?",
            text: "Cambiarás el estado del reclamo, código: " + codigoreclamo,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Si, por favor!",
            cancelButtonText: "No, cancelar!",
            closeOnConfirm: false,
            closeOnCancel: false },
            function(isConfirm){

              if (isConfirm) {

                ReclamosService.ChangeEstadoReclamo( reclamoid, estadoid, function( result ){

                  if ( !isEmpty( result ) ) {

                      response = result;
                      vm.reclamostmp.forEach(function ( tmp ) {

                          if ( !isEmpty(tmp) ) {

                            if (  tmp.uuid == result.uuid  ) {

                              posicion = iterador;

                            }

                            iterador++;

                          }

                      });

                      vm.reclamostmp[ posicion ] = response;
                      vm.tableParams = new NgTableParams({ count: 10, sorting: { fecha: "desc" } }, { dataset: vm.reclamostmp });
                      SweetAlert.swal("Listo!", "Haz cambiado la informacion, sin tropiezos.", "success");

                  }

                });

              } else {
                SweetAlert.swal("Cancelado", "Por suerte no ha pasado nada :)", "error");
              }

          });

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

                vm.tableParams = new NgTableParams({ count: 10, sorting: { fecha: "desc" } }, { dataset: vm.reclamostmp });

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
                    $scope.dataArray = [];
                    $scope.reclamo = reclamo;
                    if ( $scope.reclamo.fotos !== null ) {

                      $scope.reclamo.fotos.forEach(function ( foto ) {
                          $scope.dataArray.push( { src: "http://estudiobarrio.plexarg.com/public/" + reclamo.uuid + "/" + foto } );
                      });

                    }
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

        function isEmpty(obj) {
          for(var key in obj) {
            if(obj.hasOwnProperty(key))
              return false;
            }
          return true;
        }

        function filterByCriteria() {

            var filtrados = [];

            if ( vm.criteriasselected.tipo == null && vm.criteriasselected.estado == null && vm.criteriasselected.copropietario == null ){

                /**
                 * Busqueda sin filtros
                 */

                if ( vm.reclamostmp instanceof Array || !isEmpty(vm.reclamostmp) ){

                    vm.reclamostmp.forEach(function ( tmp ) {

                        filtrados.push( tmp );
                    });

                }

            } else if ( vm.criteriasselected.tipo !== null && vm.criteriasselected.estado !== null && vm.criteriasselected.copropietario !== null ) {

                /**
                 * Busqueda por: Tipo, Estado & Copropietario
                 */

                if ( vm.reclamostmp instanceof Array || !isEmpty(vm.reclamostmp) ){

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

                if ( vm.reclamostmp instanceof Array || !isEmpty(vm.reclamostmp) ){

                    vm.reclamostmp.forEach(function (tmp) {

                        if ( tmp.tipo == vm.criteriasselected.tipo && tmp.estado == vm.criteriasselected.estado)
                            filtrados.push( tmp );
                    });

                }

            } else if ( vm.criteriasselected.tipo !== null && vm.criteriasselected.estado == null && vm.criteriasselected.copropietario == null ) {

                /**
                 * Busqueda por: Tipo
                 */

                if ( vm.reclamostmp instanceof Array || !isEmpty(vm.reclamostmp) ){

                    vm.reclamostmp.forEach(function (tmp) {

                        if ( tmp.tipo == vm.criteriasselected.tipo )
                            filtrados.push( tmp );
                    });

                }

            } else if ( vm.criteriasselected.tipo == null && vm.criteriasselected.estado !== null && vm.criteriasselected.copropietario == null ) {

                /**
                 * Busqueda por: Estado
                 */

                if ( vm.reclamostmp instanceof Array || !isEmpty(vm.reclamostmp) ){

                    vm.reclamostmp.forEach(function (tmp) {

                        if ( tmp.estado == vm.criteriasselected.estado )
                            filtrados.push( tmp );
                    });

                }

            } else if ( vm.criteriasselected.tipo == null && vm.criteriasselected.estado == null && vm.criteriasselected.copropietario !== null ) {

                /**
                 * Busqueda por: Copropietario
                 */

                if ( vm.reclamostmp instanceof Array || !isEmpty(vm.reclamostmp) ){

                    vm.reclamostmp.forEach(function (tmp) {

                        if ( tmp.nombre == vm.criteriasselected.copropietario )
                            filtrados.push( tmp );
                    });

                }

            } else if ( vm.criteriasselected.tipo == null && vm.criteriasselected.estado !== null && vm.criteriasselected.copropietario !== null ) {

                /**
                 * Busqueda por: Estado & Copropietario
                 */

                if ( vm.reclamostmp instanceof Array || !isEmpty(vm.reclamostmp) ){

                    vm.reclamostmp.forEach(function (tmp) {

                        if ( tmp.estado == vm.criteriasselected.estado && tmp.nombre == vm.criteriasselected.copropietario )
                            filtrados.push( tmp );
                    });

                }
            } else if ( vm.criteriasselected.tipo !== null && vm.criteriasselected.estado == null && vm.criteriasselected.copropietario !== null ) {

                /**
                 * Busqueda por: Tipo & Copropietario
                 */

                if ( vm.reclamostmp instanceof Array || !isEmpty(vm.reclamostmp) ){

                    vm.reclamostmp.forEach(function (tmp) {

                        if ( tmp.tipo == vm.criteriasselected.tipo && tmp.nombre == vm.criteriasselected.copropietario )
                            filtrados.push( tmp );
                    });

                }
            }

            vm.reclamos = filtrados;

            vm.tableParams = new NgTableParams({ count: 10, sorting: { fecha: "desc" } }, { dataset: vm.reclamos });

        }

        function logout(){
            delete $localStorage.currentUser;
            delete $localStorage.tiposreclamo;
            delete $localStorage.estadosreclamo;
            delete $localStorage.consorcios;

            $location.path('/login');
        }

        vm.tableParams = new NgTableParams({ count: 10, sorting: { fecha: "desc" } }, { dataset: vm.reclamostmp });

    }

})();
