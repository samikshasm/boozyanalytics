'use strict';

angular.module('boozyanalytics.welcome', ['ngRoute'])

.config(['$routeProvider', function($routeProvider){
  $routeProvider.when('/welcome',{
    templateUrl:'welcome/welcome.html',
    controller: 'WelcomeCtrl'
  });
}])

.controller('WelcomeCtrl', ['$scope', 'CommonProp', '$firebaseArray', '$firebaseObject', function($scope, CommonProp, $firebaseArray, $firebaseObject){
	$scope.username = CommonProp.getUser();
  $scope.nameOfUser = CommonProp.getDisplayName();
  $scope.ids = "";
  $scope.names ='';
  if(!$scope.username) {
    $location.path('/home');
  }

  $scope.logout = function(){
    CommonProp.logoutUser();
  }

  var ref = firebase.database().ref();
  var dataRef = $firebaseArray(ref);
  $scope.articles = [];
  $scope.names = [];
  var firstName ="";
  var lastName = "";

  dataRef.$loaded()
    .then(function(){
        angular.forEach(dataRef, function(value) {
          angular.forEach(value, function(value, id){
            if(id == "$value"){
              console.log(value);
              firstName = value;
            }else if(id == "$id"){
              lastName = value;
              console.log(value);
            }
            //console.log(id+":"+value);
          })
          $scope.articles.push({
            "key": firstName,
            "value": lastName
          })

        })
    });


    /*var temp = [];
    for(var i in values){
      console.log(values[i]);
      temp.push({
        "key":values[i],
        "value":ids[i]
      });
    }

    $scope.articles = temp;*/



  /*dataRef.$loaded().then(function() {
    angular.forEach(dataRef, function(value, key){
      console.log(key + ': ' + value);
    })
    console.log("loaded record:", dataRef.$id, dataRef.$value);

    // To iterate the key/value pairs of the object, use angular.forEach()
    angular.forEach(dataRef, function(value, id) {
      $scope.ids = id;
      $scope.names=value;
      console.log(id, value);
    });
  });*/

/*
  ref.once("value")
    .then(function(snapshot) {
      var name = snapshot.child().val(); // {first:"Ada",last:"Lovelace"}
      console.log(name);
      var firstName = snapshot.child("name/first").val(); // "Ada"
      var lastName = snapshot.child("name").child("last").val(); // "Lovelace"
      var age = snapshot.child("age").val(); // null
    });*/


}])
