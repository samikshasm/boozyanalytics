'use strict';
var userModule = angular.module('angularAppApp.participantInfo',['ngRoute','firebase'])

.controller('ParticipantInfoCtrl', ['$scope', '$firebaseAuth', '$firebase','CommonProp', 'SetCurrentUser', '$firebaseArray', '$firebaseObject' , function($scope, $firebaseAuth, $firebase, CommonProp, SetCurrentUser, $firebaseArray, $firebaseObject){

  $scope.currentParticpant = SetCurrentUser.getCurrentUser()
  $scope.controlList = SetCurrentUser.getControlList();
  $scope.experimentalList = SetCurrentUser.getExperimentalList();
  $scope.totalCalConsumed = 0;
  $scope.totalLitersConsumed = 0;

  var ref = firebase.database().ref();
  var dataRef = $firebaseArray(ref);
  var group = "";
  var participantName = "";
  var nightCounter = 0;
  $scope.sizeList = [];
  $scope.typeList = [];
  $scope.totalDrinks = 0;
  var whereList = [];
  var whoList = [];
  $scope.locationCounter = 0;
  $scope.lattitudeList = [];
  $scope.longitudeList = [];
  $scope.percentWine = 0.0;
  $scope.percentLiquor = 0.0;
  $scope.percentBeer = 0.0;
  var wineCounter = 0;
  var beerCounter = 0;
  var liquorCounter = 0;



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
    $scope.lattitudeList = []
    $scope.longitudeList = []
    var userRef = firebase.database().ref('Users/');
    userRef.on('value', function(snapshot){
      dataRef.$loaded()
        .then(function(){
            angular.forEach(dataRef, function(value, id) {

                angular.forEach(value, function(value, id){
                  if(id != "Control Group" || id != "Experimental Group"){

                    var substr = id.substr(0,3);
                    if(substr == "UID"){
                      participantName = id.substr(5,id.length);
                      if(participantName == $scope.currentParticpant) {
                        angular.forEach(value, function(value, id){
                          var idStr = ""+id;
                          var substr = idStr.substr(0,11);
                          if(substr == "Night Count"){
                            nightCounter++;
                          }
                        })

                        angular.forEach(value, function(value, id){
                          angular.forEach(value, function(value, id){
                            if(id == "Answers"){
                              angular.forEach(value, function(value,id){
                                angular.forEach(value, function(value,id){
                                  if(id == "Size"){
                                    angular.forEach(value,function(value,id){
                                      $scope.sizeList.push(value);
                                      $scope.totalDrinks++;
                                    })
                                  }
                                  if(id == "Type"){
                                    angular.forEach(value,function(value,id){
                                      $scope.typeList.push(value);
                                    })
                                  }
                                  if(id == "Where"){
                                    angular.forEach(value,function(value,id){
                                      whereList.push(value);
                                    })
                                  }
                                  if(id == "Who"){
                                    angular.forEach(value,function(value,id){
                                      whoList.push(value);
                                    })
                                  }
                                })
                              })
                            }
                            if(id == "Location"){
                              angular.forEach(value,function(value,id){
                                var tempList = []
                                $scope.locationCounter++;
                                tempList = value.split("&");
                                $scope.lattitudeList.push(tempList[0]);
                                $scope.longitudeList.push(tempList[1]);
                              })
                            }
                            if(id == "MorningAnswers"){

                            }
                          })
                        })
                      }

                    }
                    }
                  })
              })
              var calorieWineShot = 100; //i made this up
              var calorieWineEight = 188;
              var calorieWineSixteen = 377;
              var calorieWineTwentyFour = 565;

              var calorieBeerShot = 58; //i don't actually know
              var calorieBeerEight = 98;
              var calorieBeerSixteen = 196;
              var calorieBeerTwentyFour = 294;

              var calorieLiquorShot = 100; //i made this up
              var calorieLiquorEight = 188;
              var calorieLiquorSixteen = 377;
              var calorieLiquorTwentyFour = 565;

              var totalOuncesConsumed = 0;
              var tempSize = 0;
              var tempType = 0;

              for(var i=0;i<$scope.sizeList.length;i++){
                tempType = $scope.typeList[i];
                tempSize = $scope.sizeList[i];

                if (!$scope.sizeList[i]=="Shot") {
                  var sizeOfDrink = Integer.parseInt($scope.sizeList[i]);
                  totalOuncesConsumed = totalOuncesConsumed + sizeOfDrink;
                }
                else {
                  totalOuncesConsumed = totalOuncesConsumed + 1;
                }

                if(tempType == "wine"){
                  wineCounter++;
                  if(tempSize == "Shot"){
                    $scope.totalCalConsumed = $scope.totalCalConsumed+calorieWineShot;
                  }
                  else if (tempSize == "8") {
                    $scope.totalCalConsumed = $scope.totalCalConsumed+calorieWineEight;
                  }
                  else if (tempSize == "16") {
                    $scope.totalCalConsumed = $scope.totalCalConsumed+calorieWineSixteen;
                  }
                  else if (tempSize == "24") {
                    $scope.totalCalConsumed = $scope.totalCalConsumed+calorieWineTwentyFour;
                  }
                }

                else if(tempType == "liquor"){
                  liquorCounter++;
                  if(tempSize == "Shot"){
                    $scope.totalCalConsumed = $scope.totalCalConsumed+calorieLiquorShot;
                  }
                  else if (tempSize == "8") {
                    $scope.totalCalConsumed = $scope.totalCalConsumed+calorieLiquorEight;
                  }
                  else if (tempSize == "16") {
                    $scope.totalCalConsumed = $scope.totalCalConsumed+calorieLiquorSixteen;
                  }
                  else if (tempSize == "24") {
                    $scope.totalCalConsumed = $scope.totalCalConsumed+calorieLiquorTwentyFour;
                  }
                }

                else if(tempType == "beer"){
                  beerCounter++;
                  if(tempSize == "Shot"){
                    $scope.totalCalConsumed = $scope.totalCalConsumed+calorieBeerShot;
                  }
                  else if (tempSize == "8") {
                    $scope.totalCalConsumed = $scope.totalCalConsumed+calorieBeerEight;
                  }
                  else if (tempSize == "16") {
                    $scope.totalCalConsumed = $scope.totalCalConsumed+calorieBeerSixteen;
                  }
                  else if (tempSize == "24") {
                    $scope.totalCalConsumed = $scope.totalCalConsumed+calorieBeerTwentyFour;
                  }
                }
              }

              $scope.totalLitersConsumed = (totalOuncesConsumed * 0.03);

              $scope.percentWine = (wineCounter/$scope.totalDrinks) * 100;
              $scope.percentBeer = (beerCounter/$scope.totalDrinks) *100;
              $scope.percentLiquor = (liquorCounter/$scope.totalDrinks) *100;


              var ctxP = document.getElementById("myChart").getContext('2d');
              var myPieChart = new Chart(ctxP, {
              type: 'pie',
              data: {
                  labels: ["Wine", "Beer", "Liquor"],
                  datasets: [
                      {
                          data: [$scope.percentWine,$scope.percentBeer,$scope.percentLiquor],
                          backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C"],
                          hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870"]
                      }
                  ]
              },
              options: {
                  responsive: true
              }
              });


    var locations = [];


      for(var i =0;i<$scope.lattitudeList.length;i++){
        locations.push([parseFloat($scope.lattitudeList[i]), parseFloat($scope.longitudeList[i])]);
        console.log(locations[i]);

      }
      console.log($scope.lattitudeList);



    var map = new google.maps.Map(document.getElementById("map-container-5"), {
      zoom: 14,
      //center: new google.maps.LatLng(38.6364953, -90.2350996),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });


    var infowindow = new google.maps.InfoWindow();

    var marker, i;
    var markers = [];

    console.log(locations[0][0]);

    for (i = 0; i < locations.length; i++) {
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][0], locations[i][1]),
        map: map
      });

      markers.push(marker);

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          //infowindow.setContent(locations[i][0]);
          infowindow.open(map, marker);
        }
      })(marker, i));
    }

    function autocenter(){
      var bounds = new google.maps.LatLngBounds();
      for(var i=0;i<markers.length;i++){
        bounds.extend(markers[i].position);
      }
      map.fitBounds(bounds);
    }

    autocenter();
        });
    })
  }
}])
