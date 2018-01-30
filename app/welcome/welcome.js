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
  $scope.nameOfUser = CommonProp.getDisplayName();
  
  if(!$scope.username) {
    $location.path('/home');
  }

  $scope.logout = function(){
    CommonProp.logoutUser();
  }



}])
