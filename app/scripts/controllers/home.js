'use strict';

angular.module('angularAppApp.home', ['ngRoute', 'firebase'])

.controller('HomeCtrl', ['$scope', '$firebaseAuth', '$firebaseArray','$location', 'CommonProp', function($scope, $firebaseAuth, $firebaseArray, $location, CommonProp){

	$scope.username = CommonProp.getUser();
  $scope.adminChecker = "";

	$scope.signIn = function(){
		var username = $scope.user.email;
		var password = $scope.user.password;
		var auth = $firebaseAuth();
    var displayName = "";
    var ref = firebase.database().ref();
		var dataRef = $firebaseArray(ref);
		var adminUsernames = [];

		dataRef.$loaded()
	    .then(function(){
	        angular.forEach(dataRef, function(value) {
	          angular.forEach(value, function(value, id){
							angular.forEach(value,function(value,id){

								//var substr = id.substr(0,8);
		           if(id == "username"){
								 adminUsernames.push(value);
		            }
							})
						})
					})
				});

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        displayName = user.displayName;
        if (displayName == null){
          displayName = window.prompt("Please enter your display name: ");
          user.updateProfile({
            displayName: displayName
          });
        }

				for (var i=0; i<adminUsernames.length;i++) {
					console.log($scope.adminChecker);
					if (adminUsernames[i] == username) {
	          $scope.adminChecker = "matches";
	        }
				}

      }
    });

      auth.$signInWithEmailAndPassword(username, password).then(function(){
        if ($scope.adminChecker == "matches") {
          console.log("User Login Successful");
    			CommonProp.setUser($scope.user.email);
          CommonProp.setDisplayName(displayName); //set the displayname to the current user's display name
          console.log(CommonProp.getDisplayName()); //testing this to see if the console logs it correctly;
    			$location.path('/welcome');
        }
        else {
					window.alert("User is not an admin. Please enter a valid email address.");
					CommonProp.logoutUser();
        }
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