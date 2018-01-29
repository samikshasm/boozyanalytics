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

  if(!$scope.username) {
    $location.path('/home');
  }

  $scope.logout = function(){
    CommonProp.logoutUser();
  }

  firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log(user.displayName);
    $scope.displayName = user.displayName;
    // User is signed in.
  } else {
    // No user is signed in.
  }

});


}])
