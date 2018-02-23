'use strict';

angular.module('angularAppApp.addUser', ['ngRoute', 'firebase'])



.controller('AddUserCtrl', ['$scope', 'CommonProp', '$firebaseAuth', '$firebase', function($scope, CommonProp, $firebaseAuth, $firebase){

  $scope.username = CommonProp.getUser();
  $scope.nameOfUser = CommonProp.getDisplayName();
  console.log($scope.username);
  if(!$scope.username) {
    $location.path('/home');
  }

  $scope.signUp = function(){
    var username = $scope.user.email;
    var usernameEmail = username+"@gmail.com";
    var password = "hello123";

    if(username && password) {
      var auth = $firebaseAuth();
      auth.$createUserWithEmailAndPassword(usernameEmail,password).then(function(){
        console.log("User Successfully Created");
        firebase.auth().onAuthStateChanged(function(user) {
          auth.$signOut();
        })
      }).catch(function(error){
        $scope.errMsg = true;
        $scope.errorMessage = error.message;
      })
    }
    console.log(CommonProp.getUser());
    /*firebase.auth().onAuthStateChanged(function(user) {
      var auth = $firebaseAuth();

      //auth.$signOut();

      console.log("Logged Out Succesfully");

      auth.$signInWithEmailAndPassword($scope.username, "hello123").then(function(){ //change so that password= admin password
        CommonProp.setUser($scope.username);
      }).catch(function(error){
        $scope.errMsg = true;
        $scope.errorMessage = error.message;
      });*/



    if ($scope.kindOfUser == "control") {
      console.log("control user!");
      var reference = firebase.database(); //get a reference to the firbase database
      firebase.auth().onAuthStateChanged(function(user) {
        console.log("username"+username);
        if (user) {
          reference.ref('Users/Control Group/' + username).set({
            username: username
          });
        }
      })
    }else{
      console.log("experimentalUser!");
      var reference = firebase.database(); //get a reference to the firbase database
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          reference.ref('Users/Experimental Group/' + username).set({
            username: username
          });
        }
      })
    }
  }

  $scope.submitResult = function(result){
    $scope.kindOfUser = result;
    //console.log($scope.kindOfUser);
    $scope.signUp();
  }

  $scope.deleteUser = function(){
    var username = $scope.user.email;
    var password = "hello123";

    if(username && password){
      var auth = $firebaseAuth();
      var user = firebase.auth().currentUser;

      user.delete().then(function() {
        console.log(user);
        console.log("User Successfully Deleted");
      }).catch(function(error) {
        $scope.errMsg = true;
        $scope.errorMessage = error.message;
      });
    }
  }


  $scope.addAdmin = function() {
    var username = $scope.user.email;
    var password = $scope.user.password;
    var name = $scope.user.name;

    if(username && password) {
      var auth = $firebaseAuth();
      auth.$createUserWithEmailAndPassword(username,password).then(function(){
      }).catch(function(error){
        $scope.errMsg = true;
        $scope.errorMessage = error.message;
      })
    }

    var reference = firebase.database();
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        reference.ref('Admins/' + name).set({
            username: username,
            password: password
        });
        console.log(username);
      }

  })
  }
}])
