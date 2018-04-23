'use strict';
var userModule = angular.module('angularAppApp.dashboard',['ngRoute','firebase'])

.controller('DashboardCtrl', ['$scope', '$firebaseAuth', '$firebase','CommonProp', 'SetCurrentUser', '$firebaseArray', '$firebaseObject' , function($scope, $firebaseAuth, $firebase, CommonProp, SetCurrentUser, $firebaseArray, $firebaseObject){

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
  $scope.costList = [];
  var averageCostList = [];

  $scope.numDrinksControl = [];
  $scope.numDrinksExp = [];

  $scope.friendsCounter = 0;
  $scope.partnerCounter = 0;
  $scope.nobodyCounter = 0;
  $scope.whoOtherCounter = 0;
  $scope.workCounter = 0;
  $scope.homeCounter = 0;
  $scope.barCounter = 0;
  $scope.whereOtherCounter = 0;
  $scope.sortedDateList = []

  queryDatabase();
  //controlExperimental();

  function controlExperimental(){
    var userRef = firebase.database().ref('Users/');
    userRef.on('value', function(snapshot){
      dataRef.$loaded()
      .then(function(){
        angular.forEach(dataRef, function(value,id){
          angular.forEach(dataRef, function(value, id){
            if(id != "Control Group" || id != "Experimental Group"){
              var substr = id.substr(0,3);
              if (substr == "UID"){
                participantName = id.substr(5,id.length);
                angular.forEach(value, function(value, id){

                })
              }
            }
          })
        })
      })
    })
  }

  function queryDatabase(){
    $scope.lattitudeList = [];
    $scope.longitudeList = [];
    $scope.dates = [];
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
                        angular.forEach(value, function(value, id){
                          var idStr = ""+id;
                          var substr = idStr.substr(0,11);
                          if(substr == "Night Count"){
                            nightCounter++;
                          }
                          if ($scope.controlList.includes(participantName)) {
                            group = "control";
                          }
                          else if ($scope.experimentalList.includes(participantName)){
                            group = "experimental";
                          }
                        })
                        angular.forEach(value, function(value, id){
                          numDrinksControl = 0;
                          numDrinksExp = 0;
                          angular.forEach(value, function(value, id){

                            if(id == "Answers"){
                              angular.forEach(value, function(value,id){

                                var date_val = id.substr(6,id.length);
                                var date_values = date_val.split("-");
                                var date = new Date(date_values[0], date_values[1], date_values[2]);
                                $scope.dates.push(date.getDay());

                                //console.log("number of drinks initial: "+ numDrinksExp)
                                angular.forEach(value, function(value,id){

                                  if(id == "Size"){
                                    angular.forEach(value,function(value,id){
                                      $scope.sizeList.push(value);
                                      $scope.totalDrinks++;
                                      if (group == "control"){
                                      //  numDrinksControl++;
                                      //  console.log("number of control drinks if statement "+ numDrinksControl)
                                      }
                                      else if (group == "experimental"){
                                      //  numDrinksExp++;
                                      //  console.log("number of experimental drinks if statement " + participantName+ numDrinksExp);

                                      }
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
                                  if(id=="Cost"){
                                    angular.forEach(value,function(value,id){
                                      $scope.costList.push(value);
                                      averageCostList.push(date.getDay());
                                      averageCostList.push(value);
                                    })
                                  }
                                })


                              })
                            //  $scope.numDrinksExp.push(numDrinksExp);
                            //  $scope.numDrinksControl.push(numDrinksControl);
                            //  console.log("number of drinks list: "+$scope.numDrinksExp);

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

                          })

                        })



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
              var totalCostList = [];
              var sunCounter =0 ;
              var monCounter=0;
              var tuesCounter=0;
              var wedCounter=0;
              var thursCounter=0;
              var friCoutner=0;
              var satCounter=0;
              var averageCost =0;

              for (var i=0;i<averageCostList.length;i+=2){
                if (averageCostList[i] == 0){
                    if (averageCostList[i+1] == "$0.00"){
                      averageCost = 0;
                    }
                    else if (averageCostList[i+1] == "$1.00-$5.00"){
                      averageCost = 4;
                    }
                    else if(averageCostList[i+1] == "$6.00-$10.00"){
                      averageCost = 8;
                    }
                    else if(averageCostList[i+1] == "$11.00-$15.00"){
                      averageCost = 13;
                    }
                    else if(averageCostList[i+1] == "$16.00+"){
                      averageCost = 20;
                    }
                    sunCounter += averageCost;
                }
                if (averageCostList[i] == 1){
                  if (averageCostList[i+1] == "$0.00"){
                    averageCost = 0;
                  }
                  else if (averageCostList[i+1] == "$1.00-$5.00"){
                    averageCost = 4;
                  }
                  else if(averageCostList[i+1] == "$6.00-$10.00"){
                    averageCost = 8;
                  }
                  else if(averageCostList[i+1] == "$11.00-$15.00"){
                    averageCost = 13;
                  }
                  else if(averageCostList[i+1] == "$16.00+"){
                    averageCost = 20;
                  }
                    monCounter += averageCost;
                }
                if (averageCostList[i] == 2){
                  if (averageCostList[i+1] == "$0.00"){
                    averageCost = 0;
                  }
                  else if (averageCostList[i+1] == "$1.00-$5.00"){
                    averageCost = 4;
                  }
                  else if(averageCostList[i+1] == "$6.00-$10.00"){
                    averageCost = 8;
                  }
                  else if(averageCostList[i+1] == "$11.00-$15.00"){
                    averageCost = 13;
                  }
                  else if(averageCostList[i+1] == "$16.00+"){
                    averageCost = 20;
                  }
                    tuesCounter += averageCost;
                }
                if (averageCostList[i] == 3){
                  if (averageCostList[i+1] == "$0.00"){
                    averageCost = 0;
                  }
                  else if (averageCostList[i+1] == "$1.00-$5.00"){
                    averageCost = 4;
                  }
                  else if(averageCostList[i+1] == "$6.00-$10.00"){
                    averageCost = 8;
                  }
                  else if(averageCostList[i+1] == "$11.00-$15.00"){
                    averageCost = 13;
                  }
                  else if(averageCostList[i+1] == "$16.00+"){
                    averageCost = 20;
                  }
                    wedCounter += averageCost;
                }
                if (averageCostList[i] == 4){
                  if (averageCostList[i+1] == "$0.00"){
                    averageCost = 0;
                  }
                  else if (averageCostList[i+1] == "$1.00-$5.00"){
                    averageCost = 4;
                  }
                  else if(averageCostList[i+1] == "$6.00-$10.00"){
                    averageCost = 8;
                  }
                  else if(averageCostList[i+1] == "$11.00-$15.00"){
                    averageCost = 13;
                  }
                  else if(averageCostList[i+1] == "$16.00+"){
                    averageCost = 20;
                  }
                    thursCounter += averageCost;
                }
                if (averageCostList[i] == 5){
                  if (averageCostList[i+1] == "$0.00"){
                    averageCost = 0;
                  }
                  else if (averageCostList[i+1] == "$1.00-$5.00"){
                    averageCost = 4;
                  }
                  else if(averageCostList[i+1] == "$6.00-$10.00"){
                    averageCost = 8;
                  }
                  else if(averageCostList[i+1] == "$11.00-$15.00"){
                    averageCost = 13;
                  }
                  else if(averageCostList[i+1] == "$16.00+"){
                    averageCost = 20;
                  }
                    friCoutner+= averageCost;
                }
                if (averageCostList[i] == 6){
                  if (averageCostList[i+1] == "$0.00"){
                    averageCost = 0;
                  }
                  else if (averageCostList[i+1] == "$1.00-$5.00"){
                    averageCost = 4;
                  }
                  else if(averageCostList[i+1] == "$6.00-$10.00"){
                    averageCost = 8;
                  }
                  else if(averageCostList[i+1] == "$11.00-$15.00"){
                    averageCost = 13;
                  }
                  else if(averageCostList[i+1] == "$16.00+"){
                    averageCost = 20;
                  }
                    satCounter += averageCost;
                }
              }
              totalCostList.push(sunCounter);
              totalCostList.push(monCounter);
              totalCostList.push(tuesCounter);
              totalCostList.push(wedCounter);
              totalCostList.push(thursCounter);
              totalCostList.push(friCoutner);
              totalCostList.push(satCounter);

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

              var labelsList = []
              for (var i = 0;i<$scope.numDrinksExp;i++){
                labelsList.push(i);
              }

              /*var ctxL = document.getElementById("lineChart").getContext('2d');
              var myLineChart = new Chart(ctxL, {
                  type: 'line',
                  data: {
                      labels: [labelsList],
                      datasets: [
                          {
                              label: "My First dataset",
                              fillColor: "rgba(220,220,220,0.2)",
                              strokeColor: "rgba(220,220,220,1)",
                              pointColor: "rgba(220,220,220,1)",
                              pointStrokeColor: "#fff",
                              pointHighlightFill: "#fff",
                              pointHighlightStroke: "rgba(220,220,220,1)",
                              data: $scope.numDrinksControl
                          },
                          {
                              label: "My Second dataset",
                              fillColor: "rgba(151,187,205,0.2)",
                              strokeColor: "rgba(151,187,205,1)",
                              pointColor: "rgba(151,187,205,1)",
                              pointStrokeColor: "#fff",
                              pointHighlightFill: "#fff",
                              pointHighlightStroke: "rgba(151,187,205,1)",
                              data: $
                          }
                      ]
                  },
                  options: {
                      responsive: true
                  }
              });*/

              var days = [];
              var mon = 0;
              var tues = 0;
              var wed = 0;
              var thurs = 0;
              var fri = 0;
              var sat = 0;
              var sun =0;
              for (var i = 0; i<$scope.dates.length; i++){
                if ($scope.dates[i] == 0){
                  sun++
                }
                if ($scope.dates[i] == 1){
                  mon++
                }
                if ($scope.dates[i] == 2){
                  tues++
                }
                if ($scope.dates[i] == 3){
                  wed++
                }
                if ($scope.dates[i] == 4){
                  thurs++
                }
                if ($scope.dates[i] == 5){
                  fri++
                }
                if ($scope.dates[i] == 6){
                  sat++
                }
              }
              days.push(sun);
              days.push(mon);
              days.push(tues);
              days.push(wed);
              days.push(thurs);
              days.push(fri);
              days.push(sat);

              var totalWhoCounter = 0
              var totalWhereCounter = 0
              for (var i = 0; i<whoList.length; i++){
                if (whoList[i] == ("Friends")){
                  $scope.friendsCounter++
                }
                if (whoList[i] == ("Partner")){
                  $scope.partnerCounter++
                }
                if (whoList[i] == ("Nobody")){
                  $scope.nobodyCounter++
                }
                if (whoList[i] == ("Other")){
                  $scope.whoOtherCounter++
                }
                if (whereList[i] == ("Work")){
                  $scope.workCounter++
                }
                if (whereList[i] == ("Home")){
                  $scope.homeCounter++
                }
                if (whereList[i] == ("Bar")){
                  $scope.barCounter++
                }
                if (whereList[i] == ("Other")){
                  $scope.whereOtherCounter++
                }
              }

              var ctxD = document.getElementById("doughnutChartWho").getContext('2d');
              ctxD.textAlign = "center";
              var myLineChart = new Chart(ctxD, {
                  type: 'doughnut',
                  data: {
                      labels: ["Friends", "Partner", "Nobody", "Other"],
                      datasets: [
                          {
                              data: [$scope.friendsCounter, $scope.partnerCounter, $scope.nobodyCounter, $scope.whoOtherCounter],
                              backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"],
                              hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870", "#A8B3C5", "#616774"]
                          }
                      ]
                  },
                  options: {
                      responsive: true
                  }
              });

              var ctxD = document.getElementById("doughnutChartWhere").getContext('2d');
              var myLineChart = new Chart(ctxD, {
                  type: 'doughnut',
                  data: {
                      labels: ["Work", "Home", "Bar", "Other"],
                      datasets: [
                          {
                              data: [$scope.workCounter, $scope.homeCounter, $scope.barCounter, $scope.whereOtherCounter],
                              backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"],
                              hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870", "#A8B3C5", "#616774"]
                          }
                      ]
                  },
                  options: {
                      responsive: true,
                      elements: {
                        center: {
                              text: 'Desktop',
                              color: '#36A2EB', //Default black
                              fontStyle: 'Helvetica', //Default Arial
                              sidePadding: 15 //Default 20 (as a percentage)
                            }                      }
                  }
              });

              totalWhoCounter = $scope.friendsCounter + $scope.partnerCounter + $scope.nobodyCounter + $scope.whoOtherCounter;
              $scope.friendsCounter = ($scope.friendsCounter / totalWhoCounter)*100;
              $scope.partnerCounter = ($scope.partnerCounter / totalWhoCounter)*100;
              $scope.nobodyCounter = ($scope.nobodyCounter / totalWhoCounter)*100;
              $scope.whoOtherCounter = ($scope.whoOtherCounter / totalWhoCounter)*100;

              totalWhereCounter = $scope.workCounter + $scope.homeCounter + $scope.barCounter + $scope.whereOtherCounter;
              $scope.workCounter = ($scope.workCounter / totalWhereCounter)*100;
              $scope.homeCounter = ($scope.homeCounter / totalWhereCounter)*100;
              $scope.barCounter = ($scope.barCounter / totalWhereCounter)*100;
              $scope.whereOtherCounter = ($scope.whereOtherCounter / totalWhereCounter)*100;

              var context = document.getElementById("barChart").getContext('2d');
              var barChart = new Chart(context, {
                  type: 'bar',
                  data: {
                      labels: ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday","Saturday"],
                      datasets: [
                        {
                          label: 'Drinking Episodes per Day of Week',
                          data: days,
                          backgroundColor: [
                              'rgba(255, 99, 132, 0.2)',
                              'rgba(54, 162, 235, 0.2)',
                              'rgba(255, 206, 86, 0.2)',
                              'rgba(75, 192, 192, 0.2)',
                              'rgba(153, 102, 255, 0.2)',
                              'rgba(255, 159, 64, 0.2)',
                              'rgba(236, 110, 145, 0.2)'
                          ],
                          borderColor: [
                              'rgba(255,99,132,1)',
                              'rgba(54, 162, 235, 1)',
                              'rgba(255, 206, 86, 1)',
                              'rgba(75, 192, 192, 1)',
                              'rgba(153, 102, 255, 1)',
                              'rgba(255, 159, 64, 1)',
                              'rgba(236, 110, 145, 1)'
                          ],
                          borderWidth: 1
                      },
                      {
                        label: 'Total Money Spent',
                        data: totalCostList,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(236, 110, 145, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(236, 110, 145, 1)'
                        ],
                        borderWidth: 1
                      }
                    ]
                  },
                  options: {
                      scales: {
                          yAxes: [{
                              ticks: {
                                  beginAtZero:true
                              }
                          }]
                      }
                  }
              });

            var locations = [];

            for(var i =0;i<$scope.lattitudeList.length;i++){
              locations.push([parseFloat($scope.lattitudeList[i]), parseFloat($scope.longitudeList[i])]);
            }

            var map = new google.maps.Map(document.getElementById("map-container-5"), {
              zoom: 14,
              //center: new google.maps.LatLng(38.6364953, -90.2350996),
              mapTypeId: google.maps.MapTypeId.ROADMAP
            });

            var marker, i;
            var markers = [];

            for (i = 0; i < locations.length; i++) {
              marker = new google.maps.Marker({
                position: new google.maps.LatLng(locations[i][0], locations[i][1]),
                map: map
              });

              markers.push(marker);
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
