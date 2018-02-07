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
    var displayName = "";

    firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      displayName = user.displayName;
      if (displayName == null){
        displayName = window.prompt("Please enter your display name: ");
        user.updateProfile({
          displayName: displayName
        });
      }
    }
    });

		auth.$signInWithEmailAndPassword(username, password).then(function(){

			console.log("User Login Successful");
			CommonProp.setUser($scope.user.email);
      CommonProp.setDisplayName(displayName); //set the displayname to the current user's display name
      console.log(CommonProp.getDisplayName()); //testing this to see if the console logs it correctly;
			$location.path('/welcome');
		}).catch(function(error){
			$scope.errMsg = true;
			$scope.errorMessage = error.message;
		});
  }
}])

.service('CommonProp', ['$location', '$firebaseAuth', function($location, $firebaseAuth){
	var user = "";
  var nameOfUser = "";
	var auth = $firebaseAuth();

	return {
		getUser: function(){
			if(user == ""){
				user = localStorage.getItem("userEmail");
			}
			return user;
		},
		setUser: function(value){
			localStorage.setItem("userEmail", value);
			user = value;
		},
		logoutUser: function(){
			auth.$signOut();
			console.log("Logged Out Succesfully");
			user = "";
			localStorage.removeItem('userEmail');
			$location.path('/home');
		},
    getDisplayName: function(){
      if(user) {
        nameOfUser = localStorage.getItem("displayName");
      }
      return nameOfUser;
    },
    setDisplayName: function(value){
      if(user) {
        nameOfUser = value;
        localStorage.setItem("displayName", value);
      }
    }
	};
}]);
