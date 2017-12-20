(function () {
    'use strict';

    angular
        .module('app')
        .controller('RecuperarClave.Controller', Controller);

    function Controller(SweetAlert, $location, AuthenticationService ) {
        var vm = this;

        vm.uuid = '';
        vm.clave = '';
        vm.confirmarclave = '';

        vm.loading = false;
        vm.claveIsEmpty = false;
        vm.changePasswordReady = false;
        vm.confirmarclaveerror = false;
        vm.confirmarclavemessage = '';

        vm.urlparam = new URLSearchParams(window.location.search);

        vm.uuid = vm.urlparam.get('u');

        vm.validar = validar;
        vm.iniciarsesion = iniciarsesion;

        function validar() {

            if ( vm.clave == '' ) {
                vm.claveIsEmpty = true;
                vm.confirmarclavemessage = 'El campo clave no puede estar vacio';
                return false;

            } else if( vm.confirmarclave == '' ){
                vm.confirmarclaveerror = true;
                vm.confirmarclavemessage = 'El campo confirmar clave no puede estar vacio';
                return false;

            } else if ( vm.confirmarclave !== vm.clave ) {
                vm.confirmarclaveerror = true
                vm.confirmarclavemessage = 'Las claves deben coincidir';
                return false;

            } else if ( vm.confirmarclave == vm.clave ) {
                vm.confirmarclavemessage = '';
                cambiarClave();
            }

        }

        function cambiarClave(){

          var request = {
              'usuario': vm.uuid,
              'clave': vm.clave,
              'claveconfirmada': vm.confirmarclave,
          };

          SweetAlert.swal({
            title: "¿Estás seguro?",
            text: "Recuerda colocar una clave que puedas memorizar!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Si, por favor!",
            cancelButtonText: "No, cancelar!",
            closeOnConfirm: false,
            closeOnCancel: false },
            function(isConfirm){

              if (isConfirm) {

                vm.loading = true;

                AuthenticationService.RetrievePassword( request, function( result ){

                  vm.loading = false;

                  if ( !isEmpty( result ) && result.ok ) {

                      vm.clave = '';
                      vm.confirmarclave = '';
                      vm.changePasswordReady = true;
                      SweetAlert.swal("Listo!", result.message, "success");

                  } else {

                      SweetAlert.swal("Hubo un error!", result.message, "error");

                  }

                });

              } else {
                SweetAlert.swal("Cancelado", "Por suerte no ha pasado nada :)", "error");
              }

          });

        }

        function isEmpty(obj) {
          for(var key in obj) {
            if(obj.hasOwnProperty(key))
              return false;
            }
          return true;
        }

        function iniciarsesion(){

            window.location.href = 'http://estudiobarrio.plexarg.com/';

        }

    }

})();
