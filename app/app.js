'use strict';

// Declare app level module which depends on views, and components
angular.module('new_test_project', [
  'ngRoute',
  'new_test_project.home'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {

  $routeProvider.otherwise({redirectTo: '/home'});
}]);
