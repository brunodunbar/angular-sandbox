(function() {
    'use strict';

    angular.module('app')
            .config(StateConfig);

    StateConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
    function StateConfig($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/welcome');

        $stateProvider
                .state('welcome', {
                    url: '/welcome',
                    templateUrl: 'welcome/welcome.html'
                });

    }
})();
