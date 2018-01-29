'use strict';

// Declare app level module which depends on views, and components
angular.module('boozyanalytics', [
  'ngRoute',
  'boozyanalytics.home'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {

  $routeProvider.otherwise({redirectTo: '/home'});
}]);
