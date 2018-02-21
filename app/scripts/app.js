'use strict';

/**
 * @ngdoc overview
 * @name angularAppApp
 * @description
 * # angularAppApp
 *
 * Main module of the application.
 */
angular
  .module('angularAppApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'angularAppApp.home',
    'angularAppApp.welcome',
    'angularAppApp.addUser',
    'angularAppApp.users'
  ])
  .config(function ($routeProvider) {
    $routeProvider
    /*
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      */
      .when('/welcome',{
        templateUrl:'views/welcome.html',
        controller:'WelcomeCtrl',
        controllerAs: 'welcome'
      })
      .when('/home',{
        templateUrl: 'views/home.html',
        controller:'HomeCtrl',
        controllerAs: 'home'
      })
      .when('/addUser', {
        templateUrl: 'views/addUser.html',
        controller:'AddUserCtrl',
        controllerAs:'addUser'
      })
      .when('/users', {
        templateUrl:'views/users.html',
        controller:'UserCtrl',
        controllerAs:'user'
      })
      .otherwise({
        redirectTo: '/home'
      });
  });
