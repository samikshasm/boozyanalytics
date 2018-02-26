'use strict';
var userModule = angular.module('angularAppApp.users', ['ngRoute','firebase'])


.controller('UserCtrl', ['$scope', '$firebaseAuth', '$firebase','CommonProp', '$firebaseArray', '$firebaseObject', function($scope, $firebaseAuth, $firebase, CommonProp,  $firebaseArray, $firebaseObject){

  var ref = firebase.database().ref();
  var dataRef = $firebaseArray(ref);
  $scope.articles = [];
  $scope.names = [];
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


  dataRef.$loaded()
    .then(function(){
        angular.forEach(dataRef, function(value) {
          angular.forEach(value, function(value, id){
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
                nightCount = id.substr(13,idStr.length);
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
            })
            //console.log(id+":"+value);
          })
        /*  $scope.articles.push({
            "key": uid,
            "value": nightCount,
            "date": date*/
            //"time": time
          //})
          console.log(uidList.length);
          for(var i = 1; i < uidList.length; i++){
            if (uidList[i] != uidList[i-1]){
              nightCount = 1;
            }else{
              nightCount++;
            }
            nightList.push(nightCount);
            console.log("night Count"+nightCount);
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
          for(var i = 0; i < usernameList.length; i++){
            $scope.articles.push({"key":usernameList[i], "value":nightList[i], "date":startDateList[i], "last":lastUsedList[i]})
          }
    });

    $scope.deleteUser = function(key){
      /*
      $scope.user.email = key+"@gmail.com";
      var username = $scope.user.email;
      $scope.user.password = "hello123";
      var password = $scope.user.password;
      var txt;
      console.log($scope.user.email);
      console.log($scope.user.password);
      if (confirm("Are you sure you want to delete "+key+"?")) {
          txt = "You pressed OK!";
          /*if(username && password){
            var auth = $firebaseAuth();
            var user = firebase.auth().currentUser;

            user.delete().then(function() {
              console.log("User Successfully Deleted");
            }).catch(function(error) {
              $scope.errMsg = true;
              $scope.errorMessage = error.message;
            });
          }
      } else {
          txt = "You pressed Cancel!";
      }*/

  }





}])
