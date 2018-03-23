'use strict';
var userModule = angular.module('angularAppApp.participantInfo',['ngRoute','firebase'])

.controller('ParticipantInfoCtrl', ['$scope', '$firebaseAuth', '$firebase','CommonProp', 'SetCurrentUser', '$firebaseArray', '$firebaseObject' , function($scope, $firebaseAuth, $firebase, CommonProp, SetCurrentUser, $firebaseArray, $firebaseObject){

  $scope.currentParticpant = SetCurrentUser.getCurrentUser()
  $scope.controlList = SetCurrentUser.getControlList();
  $scope.experimentalList = SetCurrentUser.getExperimentalList();

  var ref = firebase.database().ref();
  var dataRef = $firebaseArray(ref);
  var group = "";
  var participantName = "";
  var nightCounter = 0;

  for(var i=0;i<$scope.controlList.length;i++){
    if($scope.currentParticpant == $scope.controlList[i]){
      group = "control";
    }
  }

  for(var i=0;i<$scope.experimentalList.length;i++){
    if($scope.currentParticpant == $scope.experimentalList[i]){
      group = "experimental";
    }
  }

  queryDatabase();

  function queryDatabase(){
    var userRef = firebase.database().ref('Users/');
    userRef.on('value', function(snapshot){
      var sizeList = [];
      dataRef.$loaded()
        .then(function(){
            angular.forEach(dataRef, function(value, id) {

                angular.forEach(value, function(value, id){
                  if(id != "Control Group" || id != "Experimental Group"){

                    var substr = id.substr(0,3);
                    if(substr == "UID"){
                      participantName = id.substr(5,id.length);
                      if(participantName == $scope.currentParticpant) {
                        console.log("yes");
                        angular.forEach(value, function(value, id){
                          var idStr = ""+id;
                          var substr = idStr.substr(0,11);
                          if(substr == "Night Count"){
                            nightCounter++;
                            console.log(nightCounter);
                          }
                        })

                        angular.forEach(value, function(value, id){
                          angular.forEach(value, function(value, id){
                            if(id == "Answers"){
                              angular.forEach(value, function(value,id){
                                angular.forEach(value, function(value,id){

                                })
                              })
                            }
                            if(id == "Location"){

                            }
                            if(id == "MorningAnswers"){

                            }
                          })
                        })
                      }

                    }
                  /*  angular.forEach(value, function(value, id){
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

                      })*/
                    }
                  })
              })

        });
    })
  }
}])
