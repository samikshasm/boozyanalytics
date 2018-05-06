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
    'angularAppApp.users',
    'angularAppApp.admins',
    'angularAppApp.participantInfo',
    'angularAppApp.dashboard',
    'angularAppApp.main'
  ])
  .config(function ($routeProvider, $locationProvider) {
    //$locationProvider.hashPrefix('!');
    //$locationProvider.html5Mode(true);
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
      .when('/participantInfo', {
        templateUrl:'views/participantInfo.html',
        controller:'ParticipantInfoCtrl',
        controllerAs:'participantInfo'
      })
      .when('/dashboard', {
        templateUrl:'views/dashboard.html',
        controller:'DashboardCtrl',
        controllerAs:'dashboard'
      })
      .when('/main',{
        controller:'MainCtrl',
        controllerAs:'main'
      })
      .otherwise({
        redirectTo: '/home'
      });
  })
  .run(function($rootScope) {
    $rootScope.$on("$locationChangeStart", function(event, next, current) {
      if(next != current){
        location.reload();
      }
      
    });
});
