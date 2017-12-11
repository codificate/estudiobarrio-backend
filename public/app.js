(function () {
    'use strict';

    angular
        .module('app', [
          'ngAnimate',
          'ngTouch',
          'ngSanitize',
          'ui.router',
          'ngDialog',
          'ngMessages',
          'ngStorage',
          'ngMaterial',
          'jkAngularCarousel',
          'ngTable',
          'oitozero.ngSweetAlert'])
        .config(config)
        .run(run);

    function config($stateProvider, $urlRouterProvider, $httpProvider) {

        // app routes
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home/index.view.html',
                controller: 'Home.IndexController',
                controllerAs: 'vm'
            })
            .state('pagos', {
                url: '/pagos',
                templateUrl: 'pagos/index.view.html',
                controller: 'Pagos.IndexController',
                controllerAs: 'vm'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'login/index.view.html',
                controller: 'Login.IndexController',
                controllerAs: 'vm'
            })
            .state('nuevoreclamo', {
                url: '/reclamos/nuevo',
                templateUrl: 'nuevoreclamo/index.view.html',
                controller: 'Nuevoreclamo.IndexController',
                controllerAs: 'vm'
            })
            .state('nuevopago', {
                url: '/pagos/nuevo',
                templateUrl: 'nuevopago/index.view.html',
                controller: 'NuevoPago.IndexController',
                controllerAs: 'vm'
            });
    }

    function run($rootScope, $http, $location, $localStorage) {

        // keep user logged in after page refresh
        if ($localStorage.currentUser) {
            $http.defaults.headers.common.Authorization = $localStorage.currentUser.token;
        }

        // redirect to login page if not logged in and trying to access a restricted page
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            var publicPages = ['/login'];
            var restrictedPage = publicPages.indexOf($location.path()) === -1;
            if (restrictedPage && !$localStorage.currentUser) {
                $location.path('/login');
            }
        });
    }

})();
