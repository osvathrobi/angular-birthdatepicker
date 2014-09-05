'use strict';

angular.module('demoApp', [
    'angular-birthdatepicker'
])
.controller('main', function($scope) {
    $scope.birthday = '20.08.1984';

    $scope.$watch('birthday', function(val) {
        console.log('Birthday was set to: ', val);
    })
});