'use strict';
var userModule = angular.module('angularAppApp.admins', ['ngRoute','firebase'])


.controller('AdminsCtrl', ['$scope', '$firebaseAuth', '$firebase','CommonProp', '$firebaseArray', '$firebaseObject' , function($scope, $firebaseAuth, $firebase, CommonProp,  $firebaseArray, $firebaseObject){

  var ref = firebase.database().ref();
  var dataRef = $firebaseArray(ref);
  var adminUsernames = [];
  var adminNames =[];
  var userChecker = "";

  var config = {
    apiKey: "AIzaSyB0QGhWIaE6wjxO9Y_AJCLXm8h3hJjj34Y",
    authDomain: "slu-capstone-f622b.firebaseapp.com",
    databaseURL: "https://slu-capstone-f622b.firebaseio.com",
    projectId: "slu-capstone-f622b",
    storageBucket: "slu-capstone-f622b.appspot.com",
    messagingSenderId: "931206697482"
  };

  dataRef.$loaded()
    .then(function(){
      $scope.articles = [];

        angular.forEach(dataRef, function(value, id) {
          if(value.$id == "Admins"){
            angular.forEach(value, function(value, id){
              if(id == "$id" || id == "$priority"){
                //console.log(id);

              }else{
                adminNames.push(id);
                angular.forEach(value,function(value,id){
                  //var substr = id.substr(0,8);
                 if(id == "username"){
                   console.log(value);
                   adminUsernames.push(value);
                  }
                })
              }

            })
          }


        })

        for (var i=0; i<adminUsernames.length;i++) {
              $scope.articles.push({"email":adminUsernames[i],"name":adminNames[i]});

        }
        console.log($scope.articles)

      });

    $scope.addAdmin = function(result){
      var userName = $("#addAdminFormUsername").val();
      var name = $("#addAdminFormName").val();
      var password = $("#addAdminFormPassword").val();

      $scope.adminSignUp(userName,name,password,result);

    }

    $scope.adminSignUp = function(userName,Name,password,result){
      var adminApp = firebase.initializeApp(config,"Add Admin");
      $scope.adminChecker = "";
      var username = userName;
      var password = password;
      var name = Name;
      console.log(username);
      console.log(password);
      console.log(name);


        for (var i=0; i< adminUsernames.length;i++){
          console.log(adminUsernames[i]);
          if( adminUsernames[i]==username){
            userChecker = "matches";
          }else {
            userChecker = "not matches";
          }
        }

        if(userChecker == "not matches"){
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
        adminApp.delete();
      }

    }

    var user = "";
    $scope.deleteUser = function(){
      var deleteApp = firebase.initializeApp(config,"Delete current User");
      var username = $("#form3").text();
      var usernameEmail = username+"@gmail.com";
      var password = "hello123";

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


    $scope.getUser = function(key){
      console.log(key);
      $('#form3').html( key );
  }





}])
