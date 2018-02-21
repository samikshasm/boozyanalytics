'use strict';

angular.module('angularAppApp.users', ['ngRoute','firebase'])


.controller('UserCtrl', ['$scope', 'CommonProp', '$firebaseArray', '$firebaseObject', function($scope, CommonProp, $firebaseArray, $firebaseObject){

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
                    $scope.articles.push({"key":uid,"value":dateCounter,"date":date})
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

    });



}])
