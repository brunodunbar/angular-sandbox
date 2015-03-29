(function() {
    'use strict';

    angular.module('app')
            .filter('upperCase', UpperCaseFilter);

    function UpperCaseFilter() {
        return function(input) {
            return input.toUpperCase();
        };
    }

})();