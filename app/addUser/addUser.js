'use strict';

angular.module('boozyanalytics.addUser', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider){
  $routeProvider.when('/addUser', {
    templateUrl: 'addUser/addUser.html',
    controller: 'AddUserCtrl'
  });
}])

.controller('AddUserCtrl', ['$scope', '$firebaseAuth', function($scope, $firebaseAuth){

  $scope.signUp = function(){
    var username = $scope.user.email;
    var password = "hello123";

    if(username && password) {
      var auth = $firebaseAuth();
      auth.$createUserWithEmailAndPassword(username,password).then(function(){
        console.log("User Successfully Created");
      }).catch(function(error){
        $scope.errMsg = true;
        $scope.errorMessage = error.message;
      })
    }
  }

  $scope.deleteUser = function(){
    var username = $scope.user.email;
    var password = "hello123";

    if(username && password){
      var auth = $firebaseAuth();
      var user = firebase.auth().currentUser;

      user.delete().then(function() {
        console.log("User Successfully Deleted");
      }).catch(function(error) {
        $scope.errMsg = true;
        $scope.errorMessage = error.message;
      });
    }
  }
}])
