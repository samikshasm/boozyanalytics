'use strict';
var userModule = angular.module('angularAppApp.users', ['ngRoute','firebase'])


.controller('UserCtrl', ['$scope', '$firebaseAuth', '$firebase','CommonProp', '$firebaseArray', '$firebaseObject' , function($scope, $firebaseAuth, $firebase, CommonProp,  $firebaseArray, $firebaseObject){


  $scope.batches = []
	$scope.batchNumber = 0;
	$scope.lastBool = false;
	$scope.firstBool = true;

  var ref = firebase.database().ref();
  var dataRef = $firebaseArray(ref);
  $scope.names = [];
  var controlList = [];
  var experimentalList = [];

  updateTable();


  var config = {
    apiKey: "AIzaSyB0QGhWIaE6wjxO9Y_AJCLXm8h3hJjj34Y",
    authDomain: "slu-capstone-f622b.firebaseapp.com",
    databaseURL: "https://slu-capstone-f622b.firebaseio.com",
    projectId: "slu-capstone-f622b",
    storageBucket: "slu-capstone-f622b.appspot.com",
    messagingSenderId: "931206697482"
  };

function updateTable(){
  var userRef = firebase.database().ref('Users/');
  userRef.on('value', function(snapshot) {
    console.log("updating Table");
    //console.log("getting Data");
    var uid ="";
    var nightCount = "";
    var date = "";
    var time = "";
    var size = "";
    var type = "";
    var where = "";
    var who = "";
    var dateCounter = 0;
    var whoCounter = 0;
    var whereCounter = 0;
    var uidList = [];
    var usernameList = [];
    var dateList = [];
    var startDateList = [];
    var lastUsedList = [];
    var nightList = [];
    var userCount = 0;
    var nightCount = 1;
    var groupList = [];
    var controlList = [];
    var experimentalList = [];
    $scope.articles = [];
    $scope.datas = [];
    $scope.batches = []
    $scope.batchNumber = 0;
    $scope.lastBool = false;
    $scope.firstBool = true;
    dataRef.$loaded()
      .then(function(){
          angular.forEach(dataRef, function(value, id) {

              angular.forEach(value, function(value, id){
                if (id == "Control Group"){
                  angular.forEach(value, function(value,id){
                    angular.forEach(value, function(value,id){
                      controlList.push(value);
                    })
                  })
                }if (id == "Experimental Group"){
                    angular.forEach(value, function(value,id){
                      angular.forEach(value, function(value,id){
                        experimentalList.push(value);
                      })
                    })
                }
                if(id != "Control Group" || id != "Experimental Group"){

                  var substr = id.substr(0,3);
                  if(substr == "UID"){
                    uid = id.substr(5,id.length);
                    //$scope.articles.push({"key":uid})

                  }
                  angular.forEach(value, function(value, id){
                    var idStr = ""+id;
                    var substr = idStr.substr(0,11);
                    if(substr == "Night Count"){
                      dateCounter++;
                      //nightCount = id.substr(13,idStr.length);
                      //$scope.articles.push({"value":nightCount})

                    }
                    angular.forEach(value, function(value, id){
                      angular.forEach(value, function(value,id){
                        var idStr = ""+id;
                        var substr = idStr.substr(0,4);
                        if(substr == "Date"){
                          date = idStr.substr(5,idStr.length);
                          //$scope.articles.push({"date":date})
                          uidList.push(uid);
                          //$scope.articles.push({"key":uid,"value":dateCounter,"date":date});
                          dateList.push(date);
                          dateCounter=0;
                        }
                      })
                      })

                    })
                  }
                })
                          })
            nightCount = 1;
            if(uidList.length > 1){
              for(var i = 1; i <= uidList.length; i++){
                if (uidList[i] != uidList[i-1]){
                  nightList.push(nightCount);
                  nightCount = 1;
                }else if(i == nightList.length){
                  nightList.push(nightCount);
                }else{
                  nightCount++;
                }
                //nightList.push(nightCount);
                //console.log("night Count"+nightCount);
              }
            }else if(uidList.length == 1){
              nightCount = 1;
              nightList.push(nightCount);
            }

            for(var i = 0; i < uidList.length; i++){
              if(usernameList.includes(uidList[i])){
                //do nothing
              }else{
                usernameList.push(uidList[i]);
                startDateList.push(dateList[i]);
              }
            }

            var total = 0;
            for(var i = 0; i < nightList.length; i++){
              total = total+nightList[i];
              lastUsedList.push(dateList[total-1]);
            }

            /*var bothGroup = controlList.concat(experimentalList);
            for(var i = 0; i< usernameList.length; i++){
              if(bothGroup.includes(usernameList[i]) == false){
                groupList.push("unassigned");
              }
            }*/
            var numControls = 0;
            var numExps = 0;
            console.log(controlList);
            for(var i = 0; i < experimentalList.length; i++){
              if(usernameList.includes(experimentalList[i])){
                groupList.push("experimental");
                numExps++;
              }
            }
            for(var i = 0; i < controlList.length; i++){
              if(usernameList.includes(controlList[i])){
                groupList.push("control");
                numControls++;
              }
            }

            for(var i = 0; i < (controlList.length-numControls); i++){
              usernameList.push(controlList[numControls+i]);
              nightList.push(0);
              groupList.push("control");
              startDateList.push("not started");
              lastUsedList.push("na")
            }
            for(var i = 0; i< (experimentalList.length-numExps); i++){
              usernameList.push(experimentalList[numExps+i]);
              nightList.push(0);
              groupList.push("experimental");
              startDateList.push("not started");
              lastUsedList.push("na")
            }
            /*
            else{

                usernameList.push(controlList[i]);
                nightList.push(0);
                groupList.push("control");
                startDateList.push("not started");
                lastUsedList.push("na")
              }
            }
            for(var i = 0; i < experimentalList.length; i++){
              if(usernameList.includes(experimentalList[i])){
                groupList.push("experimental");
              }else{
                usernameList.push(experimentalList[i]);
                nightList.push(0);
                groupList.push("experimental");
                startDateList.push("not started");
                lastUsedList.push("na")
              }
            }
            */
            for(var i = 0; i < usernameList.length; i++){
              $scope.articles.push({"key":usernameList[i], "value":nightList[i], "group":groupList[i], "date":startDateList[i], "last":lastUsedList[i]})
              $scope.datas.push({"key":usernameList[i], "value":nightList[i], "group":groupList[i], "date":startDateList[i], "last":lastUsedList[i]})

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
      });
  });
}


  $scope.onFolderNumberKeyPress = function(event){
    var table1 = document.getElementById('userTable');
    var table2 = document.getElementById('userTableTwo');
    var pagBtn = document.getElementById('paginationBtnsUsers');
    var searchString = $("#btnSearchUsers").val();
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



  $('#addUserModal').on('hidden.bs.modal', function (e) {
    $(this)
      .find("input,textarea,select")
         .val('')
         .end()
      .find("input[type=checkbox], input[type=radio]")
         .prop("checked", "")
         .end()
      .find('form')[0].reset();

  })

    $scope.addUser = function(result){
      var userName = $("#addUserForm").val();
      console.log(userName);
      console.log(result);
      $scope.signUp(userName,result);

    }

    $scope.signUp = function(userName,result){
      var addApp = firebase.initializeApp(config,"Add User");
      var username = userName;
      var usernameEmail = username+"@gmail.com";
      var password = "hello123";
      var userChecker = "";
      var controlUsers = [];
      var experimentalUsers = [];

      for (var i =0; i< controlList.length;i++){
        if( controlList[i]==username){
           userChecker = "matches";
        }
      }

      for (var i=0; i< experimentalUsers.length;i++){
        if( experimentalUsers[i]==username){
          userChecker = "matches";
        }
      }

    if(userChecker == "matches"){
      console.log('else statement');
      window.alert("User already exists.");
      addApp.delete();
    }else{

      if(username && password) {
        addApp.auth().createUserWithEmailAndPassword(usernameEmail,password).then(function(){
          console.log("User Successfully Created");
          updateTable();


          addApp.auth().onAuthStateChanged(function(user){
            console.log("auth changing");
            addApp.auth().signOut();
            var user = addApp.auth().currentUser;
            if (!user) {
              console.log("null User");
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


    }

    $scope.getUser = function(key){
      console.log(key);
      $('#deleteUser').html( key );
  }

    var user = "";
    $scope.deleteUser = function(){
      var deleteApp = firebase.initializeApp(config,"Delete current User");
      var username = $("#deleteUser").text();
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
              updateTable();
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








}])
