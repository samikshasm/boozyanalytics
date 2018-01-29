'use strict';

angular.module('boozyanalytics.home', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider){
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'HomeCtrl'
  });
}])
.controller('HomeCtrl', ['$scope', '$firebaseAuth', '$location', 'CommonProp', function($scope, $firebaseAuth, $location, CommonProp){

	$scope.username = CommonProp.getUser();

	$scope.signIn = function(){
		var username = $scope.user.email;
		var password = $scope.user.password;
		var auth = $firebaseAuth();

		auth.$signInWithEmailAndPassword(username, password).then(function(){
			console.log("User Login Successful");
			CommonProp.setUser($scope.user.email);
			$location.path('/welcome');
		}).catch(function(error){
			$scope.errMsg = true;
			$scope.errorMessage = error.message;
		});
	}

}])

.service('CommonProp', ['$location', function($location){
  var user = "";

  return {
    getUser: function(){
      return user;
    },
    setUser: function(value) {
      user = value;
    }
  };
}]);
