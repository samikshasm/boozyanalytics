'use strict';

// Declare app level module which depends on views, and components
angular.module('boozyanalytics', [
  'ngRoute',
  'boozyanalytics.home',
  'boozyanalytics.welcome',
  'boozyanalytics.addUser',
  'boozyanalytics.users'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {

  $routeProvider.otherwise({redirectTo: '/home'});
}]);
