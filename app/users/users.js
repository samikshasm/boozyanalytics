'use strict';

angular.module('boozyanalytics.users', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider){
  $routeProvider.when('/users',{
    templateUrl:'users/users.html',
    controller: 'UserCtrl'
  });
}])

.controller('UserCtrl', ['$scope', 'CommonProp', '$firebaseArray', '$firebaseObject', function($scope, CommonProp, $firebaseArray, $firebaseObject){
  var admin = require('firebase-admin');

  var serviceAccount = require('/slu-capstone-f622b-firebase-adminsdk-xt82h-47a67b3abd.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://slu-capstone-f622b.firebaseio.com'
  });


}])
