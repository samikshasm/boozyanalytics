'use strict';
var userModule = angular.module('angularAppApp.admins', ['ngRoute','firebase'])


.controller('AdminsCtrl', ['$scope', '$firebaseAuth', '$firebase','CommonProp', '$firebaseArray', '$firebaseObject' , function($scope, $firebaseAuth, $firebase, CommonProp,  $firebaseArray, $firebaseObject){


  $scope.batches = []
  $scope.batchNumber = 0;
  $scope.lastBool = false;
  $scope.firstBool = true;

  var ref = firebase.database().ref();
  var dataRef = $firebaseArray(ref);
  var adminUsernames = [];
  var adminNames =[];

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
      $scope.datas = [];

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
              $scope.datas.push({"email":adminUsernames[i],"name":adminNames[i]});


        }

        var i,j,temparray,chunk = 10;
        for (i=0,j=$scope.articles.length; i<j; i+=chunk) {
            temparray = $scope.articles.slice(i,i+chunk);
            $scope.batches.push(temparray);
            // do whatever
        }
        $scope.articles = $scope.batches[0];
        if($scope.batches.length == 1){
          $scope.firstBool=true;
          $scope.lastBool=true;
        }
        console.log($scope.articles)

      });


      $scope.onFolderNumberKeyPress = function(event){
  			var table1 = document.getElementById('adminTable');
  			var table2 = document.getElementById('adminTableTwo');
  			var pagBtn = document.getElementById('paginationBtnsAdmins');
  			var searchString = $("#btnSearchAdmins").val();
  			if(searchString == ""){
  				table2.style.display = 'none';
  				table1.style.display = "";
  				pagBtn.style.display = "";
  			}else{
  				table1.style.display = 'none';
  				table2.style.display = "";
  				pagBtn.style.display = 'none';

  			}
  		}


  		$scope.switchNumber = function(number){
  			var length = $scope.batches.length-1;
  			var lengthStr = ""+length;
  			if(number == "0"){
  				console.log("testing");
  				$scope.firstBool = true;
  				$scope.lastBool = false;
  			}
  			else if(number == lengthStr){
  				$scope.lastBool = true;
  				$scope.firstBool = false;
  			}else{
  				$scope.lastBool = false;
  				$scope.firstBool = false;
  			}
  			$scope.articles = $scope.batches[number];
  			$scope.batchNumber = number;
  		}


  		$scope.switchBatch = function(number){

  			if(number == "-1"){
  				console.log("previous");
  				if($scope.batchNumber == 1){
  					console.log("first element");
  					$scope.batchNumber = $scope.batchNumber -1;
  					$scope.articles = $scope.batches[$scope.batchNumber];
  					$scope.firstBool = true;
  					$scope.lastBool = false;


  				}else{
  					$scope.batchNumber = $scope.batchNumber-1;
  					console.log($scope.batchNumber);
  					$scope.articles = $scope.batches[$scope.batchNumber];
  					$scope.firstBool = false;
  					$scope.lastBool = false;
  				}

  			}if(number == "-2"){
  				if($scope.batchNumber+1 == $scope.batches.length-1){
  					console.log("last element");
  					$scope.articles = $scope.batches[$scope.batchNumber+1];
  					$scope.batchNumber = $scope.batches.length-1;
  					$scope.lastBool = true;
  					$scope.firstBool = false;
  				}else{
  					$scope.batchNumber = $scope.batchNumber+1;
  					$scope.articles = $scope.batches[$scope.batchNumber];
  					$scope.firstBool = false;
  					$scope.lastBool = false;
  				}
  			}

  		}

    $scope.addUser = function(result){
      var userName = $("#form2").val();
      console.log(userName);
      console.log(result);
      $scope.signUp(userName,result);

    }

    $scope.signUp = function(userName,result){
      var addApp = firebase.initializeApp(config,"Add User");
      var username = userName;
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

      if (result == "control") {
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
