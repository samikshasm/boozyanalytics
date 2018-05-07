'use strict';

/**
 * @ngdoc function
 * @name angularAppApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularAppApp
 */
var mainModule = angular.module('angularAppApp.main',['ngRoute','firebase'])
  .controller('MainCtrl', ['$scope', 'CommonProp', '$firebaseAuth', function ($scope, CommonProp, $firebaseAuth) {
    //$scope.nameOfUser = CommonProp.getUser();
    firebase.auth().onAuthStateChanged(function (user){
      if (user){
        console.log(user.displayName);
        $scope.nameOfUser = user.displayName;
      }
    })
    //var user = firebase.auth().currentUser;
    //console.log(user);
    CommonProp.setDisplayName($scope.nameOfUser);

    function my_func(){


      //reloadPage();
      //console.log("test");
      $(".button-collapse").sideNav();
      // SideNav Scrollbar Initialization
      var sideNavScrollbar = document.querySelector('.custom-scrollbar');
      Ps.initialize(sideNavScrollbar);
      /*
      this.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
      ];
      */
    }

    $(document).ready(my_func());
    //$(window).bind('page:change', my_func());
    //$(document).on("page:load ready", my_func());


        // SideNav Button Initialization

  }]);
