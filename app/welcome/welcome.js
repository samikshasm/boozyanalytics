'use strict';

angular.module('boozyanalytics.welcome', ['ngRoute'])

.config(['$routeProvider', function($routeProvider){
  $routeProvider.when('/welcome',{
    templateUrl:'welcome/welcome.html',
    controller: 'WelcomeCtrl'
  });
}])

.controller('WelcomeCtrl', ['$scope', 'CommonProp', function($scope, CommonProp){
	$scope.username = CommonProp.getUser();


}])
