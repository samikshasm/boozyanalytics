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

      var userRef = firebase.database().ref();
      userRef.on('value', function(snapshot) {
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

    })

    }

    $scope.getAdmin = function(email){
      console.log(email);
      $('#deleteAdmin').html( email );
  }

    var user = "";
    $scope.deleteAdmin = function(){
      var deleteApp = firebase.initializeApp(config,"Delete current User");
      var usernameEmail = $("#deleteAdmin").text();
      var usernameList = usernameEmail.split("@");
      var username = usernameList[0];
      console.log(username);
      var password = "hello123";

      var userRef = firebase.database().ref();
      userRef.on('value', function(snapshot) {
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

        dataRef.$loaded()
    	    .then(function(){
            var ref = firebase.database().ref("Admins/"+username);
            ref.remove();
    				});

      }
    })

}])
