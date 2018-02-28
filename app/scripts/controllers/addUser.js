'use strict';

angular.module('angularAppApp.addUser', ['ngRoute', 'firebase'])



.controller('AddUserCtrl', ['$scope', 'CommonProp', '$firebaseAuth', '$firebase', '$firebaseArray', function($scope, CommonProp, $firebaseAuth, $firebase, $firebaseArray){
  //disable back button on browser
  	history.pushState(null, null, location.href);
  			window.onpopstate = function () {
  					history.go(1);
  			};

  $scope.username = CommonProp.getUser();
  $scope.nameOfUser = CommonProp.getDisplayName();
  $scope.typeOfGroup = "";
  console.log($scope.username);
  if(!$scope.username) {
    $location.path('/home');
  }

  var config = {
    apiKey: "AIzaSyB0QGhWIaE6wjxO9Y_AJCLXm8h3hJjj34Y",
    authDomain: "slu-capstone-f622b.firebaseapp.com",
    databaseURL: "https://slu-capstone-f622b.firebaseio.com",
    projectId: "slu-capstone-f622b",
    storageBucket: "slu-capstone-f622b.appspot.com",
    messagingSenderId: "931206697482"
  };

  $scope.signUp = function(){
    var addApp = firebase.initializeApp(config,"Add User");
    var username = $scope.user.email;
    var usernameEmail = username+"@gmail.com";
    var password = "hello123";



    if(username && password) {
      addApp.auth().createUserWithEmailAndPassword(usernameEmail,password).then(function(){
        console.log("User Successfully Created");

        addApp.auth().onAuthStateChanged(function(user){
          addApp.auth().signOut();
          var user = addApp.auth().currentUser;
          if (!user) {
            addApp.delete();
          }
        })
      });
    }

    if ($scope.kindOfUser == "control") {
      console.log("control user!");
      var reference = firebase.database(); //get a reference to the firbase database
      reference.ref('Users/Control Group/' + username).set({
        username: username
      });
    }else{
      console.log("experimentalUser!");
      var reference = firebase.database(); //get a reference to the firbase database
      reference.ref('Users/Experimental Group/' + username).set({
        username: username
      });
    }
  }

  $scope.submitResult = function(result){
    $scope.kindOfUser = result;
    //console.log($scope.kindOfUser);
    $scope.signUp();
  }


  $scope.deleteUser = function(){
    console.log("delete user function");
    var deleteApp = firebase.initializeApp(config,"Delete current User");
    var username = $scope.user.email;
    var usernameEmail = username+"@gmail.com";
    var password = "hello123";

    console.log(usernameEmail);
    console.log(username);

    if(usernameEmail && password) {
      deleteApp.auth().signInWithEmailAndPassword(usernameEmail, password).then(function(){
        var user = deleteApp.auth().currentUser;
        user.delete().then(function() {
          console.log("User Successfully Deleted");
          var user = deleteApp.auth().currentUser;
          if(!user){
            deleteApp.delete();
          }
        }).catch(function(error) {
          $scope.errMsg = true;
          $scope.errorMessage = error.message;
        });
  		}).catch(function(error){
  			$scope.errMsg = true;
  			$scope.errorMessage = error.message;
  		});
    }

    var ref = firebase.database().ref();
    var dataRef = $firebaseArray(ref);
    var controlGroupNames = [];
    var experimentalGroupNames = [];

    dataRef.$loaded()
	    .then(function(){
	        angular.forEach(dataRef, function(value) {
	          angular.forEach(value, function(value, id){
		           if(id == "Control Group"){
                 angular.forEach(value, function(value, id){
                   controlGroupNames.push(id);
                 })
               }else{
                 angular.forEach(value, function(value, id){
                   experimentalGroupNames.push(id);
                 })
               }
							})
						})

            for (var i=0; i<controlGroupNames.length;i++) {
              if (controlGroupNames[i] == username) {
                $scope.typeOfGroup = "control";
              }
            }
            for (var i=0; i<experimentalGroupNames.length;i++) {
              if (experimentalGroupNames[i] == username) {
                $scope.typeOfGroup = "experimental";
              }
            }

            if ($scope.typeOfGroup == "control") {
              var ref = firebase.database().ref("Users/Control Group/"+username);
              ref.remove();
            }else{
              var ref = firebase.database().ref("Users/Experimental Group/"+username);
              ref.remove();
            }
				});
  }


  $scope.addAdmin = function() {
    var adminApp = firebase.initializeApp(config,"Add Admin");
    $scope.adminChecker = "";
    var adminUsernames = [];
    var username = $scope.user.email;
    var password = $scope.user.password;
    var name = $scope.user.name;
    var ref = firebase.database().ref();
    var dataRef = $firebaseArray(ref);

    dataRef.$loaded()
      .then(function(){
          angular.forEach(dataRef, function(value) {
            angular.forEach(value, function(value, id){
              angular.forEach(value,function(value,id){

                //var substr = id.substr(0,8);
               if(id == "username"){
                 adminUsernames.push(value);
                }
              })
            })
          })

          for (var i=0; i<adminUsernames.length;i++) {
            console.log($scope.adminChecker);
            if (adminUsernames[i] == username) {
              $scope.adminChecker = "matches";
            }
            else{
              $scope.adminChecker = "not matches";
            }
          }

        });
    if($scope.adminChecker== "not matches"){
      if(username && password) {
        adminApp.auth().createUserWithEmailAndPassword(username,password).then(function(){
          console.log("User Successfully Created");
          adminApp.auth().onAuthStateChanged(function(user){
            adminApp.auth().signOut();
            var user = adminApp.auth().currentUser;
            if (!user) {
              adminApp.delete();
            }
          })
        });

      var user = firebase.auth().currentUser;
      console.log(user);
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
  }else{
    console.log('else statement');
    window.alert("Admin already exists.");
  }
}
}])
