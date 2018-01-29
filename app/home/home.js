'use strict';

angular.module('boozyanalytics.home', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider){
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'HomeCtrl'
  });
}])
.controller('HomeCtrl', ['$scope', '$firebaseAuth', function($scope, $firebaseAuth){
  $scope.signIn = function(){
    var username = $scope.user.email;
    var password = $scope.user.password;
    var auth = $firebaseAuth();

    auth.$signInWithEmailAndPassword(username, password).then(function(){
      console.log("User Login Successful");
      $scope.errMsg = false;
    }).catch(function(error){
      $scope.errorMessage = error.message;
      $scope.errMsg = true;
    });
  }

}])
