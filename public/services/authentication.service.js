(function () {
    'use strict';

    angular
        .module('app')
        .factory('AuthenticationService', Service);

    function Service($http, $localStorage) {
        var service = {};

        //service.domain = 'http://localhost:8000/';
        service.domain = 'http://estudiobarrio.plexarg.com/';

        service.Login = Login;
        service.Logout = Logout;
        service.RetrievePassword = RetrievePassword;

        return service;

        function RetrievePassword(datalogin, callback){

          console.log( datalogin );

          var req = {
              method: 'POST',
              url: service.domain + 'api/recuperarclave',
              headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
              data: datalogin
            };

            $http(req)
              .then(
                  function successCallback(response){
                      callback(response.data);
                  },

                  function errorCallback(response){
                      callback(response.data);
                      Logout();
                  });
        }

        function Login(correoUsuario, clave, callback) {

            var datalogin = { 'email': correoUsuario, 'password': clave };

            var req = {
                method: 'POST',
                url: service.domain + 'api/login',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                data: datalogin
            };

            $http(req)
                .then(
                    function successCallback(response){
                        if ( typeof( response.data.id ) !== "undefined" ) {
                            $localStorage.currentUser = response.data;
                        }
                    callback(true);
                    },

                    function errorCallback(response){
                        callback(false);
                        Logout();
                    });
        }

        function Logout() {
            // remove user from local storage and clear http auth header
            delete $localStorage.currentUser;
            $http.defaults.headers.common.Authorization = '';
            return true;
        }
    }
})();
