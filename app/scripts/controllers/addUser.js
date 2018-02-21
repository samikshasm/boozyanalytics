'use strict';

angular.module('angularAppApp.addUser', ['ngRoute', 'firebase'])



.controller('AddUserCtrl', ['$scope', '$firebaseAuth', '$firebase', function($scope, $firebaseAuth, $firebase){

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

  $scope.addAdmin = function() {
    var username = $scope.user.email;
    var password = $scope.user.password;

    if(username && password) {
      var auth = $firebaseAuth();
      auth.$createUserWithEmailAndPassword(username,password).then(function(){
        console.log("Admin Successfully Created");
      }).catch(function(error){
        $scope.errMsg = true;
        $scope.errorMessage = error.message;
      })
    }

    var ref = firebase.database().ref(); //get a reference to the firbase database
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        ref('Admins/').set({
            username: username
        });
      }

  }
}])
