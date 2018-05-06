'use strict';
var userModule = angular.module('angularAppApp.participantInfo',['ngRoute','firebase'])

.controller('ParticipantInfoCtrl', ['$scope', '$firebaseAuth', '$firebase','CommonProp', 'SetCurrentUser', '$firebaseArray', '$firebaseObject' , function($scope, $firebaseAuth, $firebase, CommonProp, SetCurrentUser, $firebaseArray, $firebaseObject){

  $scope.currentParticpant = SetCurrentUser.getCurrentUser()
  $scope.controlList = SetCurrentUser.getControlList();
  $scope.experimentalList = SetCurrentUser.getExperimentalList();
  $scope.totalCalConsumed = 0;
  $scope.totalLitersConsumed = 0;
  $scope.averageDrinksConsumed = 0;
  $scope.groupOfParticipant = "";

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
  $scope.locationCount = [];
  $scope.percentWine = 0.0;
  $scope.percentLiquor = 0.0;
  $scope.percentBeer = 0.0;
  $scope.dates = [];
  $scope.totalCost1 = 0;
  $scope.totalCost = 0;
  var wineCounter = 0;
  var beerCounter = 0;
  var liquorCounter = 0;
  $scope.costList = [];
  var averageCostList = [];
  $scope.numDrinksControl = [];
  $scope.numDrinksExp = [];
  $scope.numDrinksParticipant = [];
  $scope.numDrinksDatesLabels = [];
  $scope.testDates = [];
  $scope.testNum = [];
  $scope.startDate = "";
  var numDrinksParticipant;
  queryDatabase();



  function queryDatabase(){
    $scope.locationCounter = 0;
    $scope.lattitudeList = []
    $scope.longitudeList = []
    $scope.locationCount = [];
    $scope.dates = [];
    var tempControl = []
    var tempExp = []
    var episodeCounter = 0;
    var userRef = firebase.database().ref('Users/');
    userRef.on('value', function(snapshot){
      dataRef.$loaded()
        .then(function(){
            angular.forEach(dataRef, function(value, id) {

                angular.forEach(value, function(value, id){
                  if (id == "Control Group"){
                    angular.forEach(value, function(value,id){
                      angular.forEach(value, function(value,id){
                        tempControl.push(value)
                      })
                    })
                  }if (id == "Experimental Group"){
                      angular.forEach(value, function(value,id){
                        angular.forEach(value, function(value,id){
                          tempExp.push(value)
                        })
                      })
                  }
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
                          numDrinksParticipant=0;
                          episodeCounter++;
                          angular.forEach(value, function(value, id){
                            if(id == "Answers"){
                              angular.forEach(value, function(value,id){
                                var date_val = id.substr(6,id.length);
                                var date_values = date_val.split("-");
                                //console.log(date_values[1]-1);
                                var date = new Date(date_values[0], date_values[1]-1, date_values[2]);
                                var date1 = (date.getMonth()+1)   + "-" + date.getDate() + "-" + date.getFullYear();

                                $scope.numDrinksDatesLabels.push(date1+"");
                                $scope.dates.push(date.getDay());
                                angular.forEach(value, function(value,id){

                                  if(id == "Size"){
                                    angular.forEach(value,function(value,id){
                                      $scope.sizeList.push(value);
                                      $scope.totalDrinks++;
                                      numDrinksParticipant++;
                                      $scope.testDates.push(date1);
                                      $scope.testNum.push(value);
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
                            }

                            if(id == "Location"){
                              //console.log("night counter: "+episodeCounter);
                              var testIndex = 0;
                              angular.forEach(value,function(value,id){
                                //console.log("testIndex: "+testIndex);
                                //console.log(value);
                                var splitList = []
                                splitList = value.split("&");
                                if (testIndex==0) {
                                  $scope.lattitudeList.push(parseFloat(splitList[0]));
                                  $scope.longitudeList.push(parseFloat(splitList[1]));
                                  $scope.locationCount[episodeCounter-1] = 1;
                               }
                                else{
                                  //console.log(testIndex);
                                  var fromLatPrevious = $scope.lattitudeList[$scope.locationCounter-1];
                                  var fromLongPrevious = $scope.longitudeList[$scope.locationCounter-1];
                                  var fromLatCurrent = parseFloat(splitList[0]);
                                  var fromLongCurrent = parseFloat(splitList[1]);

                                  var distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(fromLatPrevious, fromLongPrevious), new google.maps.LatLng(fromLatCurrent, fromLongCurrent));

                                  if (distance > 200){
                                    $scope.lattitudeList.push(parseFloat(splitList[0]));
                                    $scope.longitudeList.push(parseFloat(splitList[1]));
                                    $scope.locationCount[$scope.locationCount.length]=1;
                                    $scope.locationCounter++;
                                    $scope.locationCount[episodeCounter-1]=$scope.locationCount[episodeCounter-1]+1;
                                  }else{

                                  }
                                }
                                testIndex++;
                              })

                            }
                          })
                        })
                      }
                    }
                  }
                })
              })

              //Reinitialize control and experimental list of users
              //set group of participant for HTML
              $scope.controlList = [];
              $scope.experimentalList =[];
              for(var i =0;i<tempControl.length;i++){
                $scope.controlList[i] = tempControl[i]
              }
              for(var i =0;i<tempExp.length;i++){
                $scope.experimentalList[i] = tempExp[i]
              }


              for(var i=0;i<$scope.controlList.length;i++){
                if($scope.controlList.includes($scope.currentParticpant)){
                  group = "control";
                }
              }

              for(var i=0;i<$scope.experimentalList.length;i++){
                if($scope.experimentalList.includes($scope.currentParticpant)){
                  group = "experimental";
                }
              }
              $scope.groupOfParticipant = group;

              //Parse and create donut charts for where and who participant is drinking with
              var workCounter = 0;
              var homeCounter = 0;
              var barCounter = 0;
              var otherCounter = 0;
              var whereListChart = [];
              var whereLabelsList = ["Work", "Home", "Bar", "Other"]

              var friendsCounter = 0;
              var partnerCounter = 0;
              var nobodyCounter = 0;
              var whoOtherCounter = 0;
              var whoListChart = [];
              var whoLabelsList = ["Friends", "Partner", "Alone", "Other"]

              for (var i =0; i<whereList.length;i++) {
                  if (whereList[i] == ("Work")){
                    workCounter++
                  }
                  if (whereList[i] == ("Home")){
                    homeCounter++
                  }
                  if (whereList[i] == ("Bar/Restaurant")){
                    barCounter++
                  }
                  if (whereList[i] == ("Other")){
                    otherCounter++
                  }
              }

              for (var i =0;i<whoList.length;i++) {
                if (whoList[i] == ("Friends")){
                  friendsCounter++
                }
                if (whoList[i] == ("Partner")){
                  partnerCounter++
                }
                if (whoList[i] == ("Nobody")){
                  nobodyCounter++
                }
                if (whoList[i] == ("Other")){
                  whoOtherCounter++
                }
              }

              whereListChart.push(workCounter)
              whereListChart.push(homeCounter)
              whereListChart.push(barCounter)
              whereListChart.push(otherCounter)
              whoListChart.push(friendsCounter)
              whoListChart.push(partnerCounter)
              whoListChart.push(nobodyCounter)
              whoListChart.push(whoOtherCounter)

              function add(a, b) {
                return a + b;
              }

              var whereSum = whereListChart.slice().reduce(add,0)
              var whoSum = whoListChart.slice().reduce(add,0)
              var whereMax = Math.max.apply(Math, whereListChart)
              var whoMax = Math.max.apply(Math, whoListChart)
              var iWhere = whereListChart.indexOf(whereMax)
              var iWho = whoListChart.indexOf(whoMax)
              var whereLabel = whereLabelsList[iWhere]
              var whoLabel = whoLabelsList[iWho]
              var wherePercent = Math.round((whereMax/whereSum)*100)
              var whoPercent = Math.round((whoMax/whoSum)*100)

              //doughnut
              var ctxD = document.getElementById("whereDonut").getContext('2d');
              var myLineChart = new Chart(ctxD, {
                  type: 'doughnut',
                  data: {
                      labels: [whereLabel, "Other"],
                      datasets: [
                          {
                              data: [wherePercent, 100-wherePercent],
                              backgroundColor: ["#FCB857", "#F5F5F5"],
                          }
                      ]
                  },
                  options: {
                      responsive: true,
                      cutoutPercentage: 70,
                      legend:{
                        display:false
                      },
                      tooltips: {
                        enabled: true,
                        mode: 'single',
                        callbacks: {
                            label: function(tooltipItem, data) {
                              //return data.datasets[tooltipItem.index]
                              //return data.datasets[tooltipItem.datasetIndex] + ' - ' + tooltipItem.yLabel
                              return data.labels[tooltipItem.index] + ": "+Math.round(data.datasets[0].data[tooltipItem.index])+"%";
                            }
                          }
                        }
                  },
                  plugins: [{
                    id: 'my-plugin',
                    afterDraw: function (chart, option) {
                      chart.ctx.fillStyle = '#FCB857'
                      chart.ctx.textBaseline = 'middle'
                      chart.ctx.textAlign = 'center'
                      //chart.ctx.font = 'bold 3vw Arial'
                      var string = wherePercent+"%"+" "+whereLabel;
                      var array = string.split(" ");
                      var y = chart.canvas.offsetHeight/2;

                      var fontBase = chart.canvas.offsetWidth,
                      fontSize = 40;                     // default size for font

                      var ratio = fontSize / fontBase;   // calc ratio
                      var size = chart.canvas.offsetWidth * ratio;   // get font size based on current width


                      for (var i = 0; i < array.length; i++) {
                        if(i == 0){
                          chart.ctx.font = 'bold '+size+'px Arial'
                        }else{
                          chart.ctx.font = 'bold '+size/4+'px Arial'
                        }
                         chart.ctx.fillText(array[i], chart.canvas.offsetWidth/2, y);
                         var lineHeight = chart.ctx.measureText('M').width;
                         y += lineHeight;
                      }
                      //chart.ctxD.fillText($scope.whereControlPercentage+'%'+"text", chart.canvas.width / 2.6, chart.canvas.height / 2.5)
                    }
                  }]
              });

              var ctxD = document.getElementById("whoDonut").getContext('2d');
              var myLineChart = new Chart(ctxD, {
                  type: 'doughnut',
                  data: {
                      labels: [whoLabel, "Other"],
                      datasets: [
                          {
                              data: [whoPercent, 100-whoPercent],
                              backgroundColor: ["#62CAE2", "#F5F5F5"],
                          }
                      ]
                  },
                  options: {
                      responsive: true,
                      cutoutPercentage: 70,
                      legend:{
                        display:false
                      },
                      tooltips: {
                        enabled: true,
                        mode: 'single',
                        callbacks: {
                            label: function(tooltipItem, data) {
                              //return data.datasets[tooltipItem.index]
                              //return data.datasets[tooltipItem.datasetIndex] + ' - ' + tooltipItem.yLabel
                              return data.labels[tooltipItem.index] + ": "+Math.round(data.datasets[0].data[tooltipItem.index])+"%";
                            }
                          }
                        }
                  },
                  plugins: [{
                    id: 'my-plugin',
                    afterDraw: function (chart, option) {
                      chart.ctx.fillStyle = '#62CAE2'
                      chart.ctx.textBaseline = 'middle'
                      chart.ctx.textAlign = 'center'
                      //chart.ctx.font = 'bold 3vw Arial'
                      var string = whoPercent+"%"+" "+whoLabel;
                      var array = string.split(" ");
                      var y = chart.canvas.offsetHeight/2;

                      var fontBase = chart.canvas.offsetWidth,
                      fontSize = 40;                     // default size for font

                      var ratio = fontSize / fontBase;   // calc ratio
                      var size = chart.canvas.offsetWidth * ratio;   // get font size based on current width


                      for (var i = 0; i < array.length; i++) {
                        if(i == 0){
                          chart.ctx.font = 'bold '+size+'px Arial'
                        }else{
                          chart.ctx.font = 'bold '+size/4+'px Arial'
                        }
                         chart.ctx.fillText(array[i], chart.canvas.offsetWidth/2, y);
                         var lineHeight = chart.ctx.measureText('M').width;
                         y += lineHeight;
                      }
                      //chart.ctxD.fillText($scope.whereControlPercentage+'%'+"text", chart.canvas.width / 2.6, chart.canvas.height / 2.5)
                    }
                  }]
              });

              //start date of participant's Episode 1
              $scope.startDate = $scope.numDrinksDatesLabels[0];

              //create types of drinks pie chart and calculate total calories consumed
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

              var averageCost;
              for (var i=0; i<$scope.costList.length;i++) {
                if ($scope.costList[i] == "$0.00"){
                  averageCost = 0;
                }
                else if ($scope.costList[i] == "$1.00-$5.00"){
                  averageCost = 4;
                }
                else if($scope.costList[i] == "$6.00-$10.00"){
                  averageCost = 8;
                }
                else if($scope.costList[i] == "$11.00-$15.00"){
                  averageCost = 13;
                }
                else if($scope.costList[i] == "$16.00+"){
                  averageCost = 20;
                }
                $scope.totalCost1 += averageCost;

              }

              var totalCostList = [];
              var sunCounter =0 ;
              var monCounter=0;
              var tuesCounter=0;
              var wedCounter=0;
              var thursCounter=0;
              var friCoutner=0;
              var satCounter=0;


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

              var friendsCounter = 0;
              var partnerCounter = 0;
              var nobodyCounter = 0;
              var otherCounter = 0;
              for (var i = 0; i<whoList.length; i++){
                if (whoList[i] == ("Friends")){
                  friendsCounter++
                }
                if (whoList[i] == ("Partner")){
                  partnerCounter++
                }
                if (whoList[i] == ("Nobody")){
                  nobodyCounter++
                }
                if (whoList[i] == ("Other")){
                  otherCounter++
                }
              }

              var test = []
              for(var i =0; i<$scope.testDates.length;i++){
                var numDrinks = 1;
                //console.log($scope.testDates);
                //console.log($scope.testNum);
                for (var j =1; j<$scope.testDates.length;j++){
                  if ($scope.testDates[i] == $scope.testDates[j]){
                    if(i!=j){
                      numDrinks++;
                      $scope.testDates.splice(j,1);
                      $scope.testNum.splice(j,1);
                      j=j-1;
                    }
                  }
                }
                test.push(numDrinks);
              }

              //console.log(test);

              var ctxL = document.getElementById("lineChart").getContext('2d');
              var myLineChart = new Chart(ctxL, {
                  type: 'line',
                  data: {
                      labels: $scope.testDates,
                      datasets: [
                          {
                              label: "Number of Drinks Consumed",
                              borderWidth : 2,
                              borderColor : '#e6e6e6',
                              pointBackgroundColor : '#e6e6e6',
                              pointBorderColor : '#e6e6e6',
                              pointBorderWidth : 1,
                              pointRadius : 2,
                              pointHoverBackgroundColor : '#e6e6e6',
                              pointHoverBorderColor : '#e6e6e6',
                              data: test
                          }
                      ]
                  },
                  options: {
                      responsive: true
                  }
              });

              var ctxL = document.getElementById("dayOfWeekLine").getContext('2d');
              var myLineChart = new Chart(ctxL, {
                  type: 'line',
                  data: {
                      labels: ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday","Saturday"],
                      datasets: [
                          {
                              label: "Drinking Episodes per Day of Week",
                              borderWidth : 2,
                              borderColor : '#e6e6e6',
                              pointBackgroundColor : '#e6e6e6',
                              pointBorderColor : '#e6e6e6',
                              pointBorderWidth : 1,
                              pointRadius : 2,
                              pointHoverBackgroundColor : '#e6e6e6',
                              pointHoverBorderColor : '#e6e6e6',
                              data: days
                          }
                      ]
                  },
                  options: {
                      responsive: true
                  }
              });

              var ctxP = document.getElementById("myChart").getContext('2d');
              var myPieChart = new Chart(ctxP, {
              type: 'pie',
              data: {
                  labels: ["Wine", "Beer", "Liquor"],
                  datasets: [
                      {
                          data: [$scope.percentWine,$scope.percentBeer,$scope.percentLiquor],
                          backgroundColor: ["#62CAE2", "#FCB857", "#EC6E91"],
                          hoverBackgroundColor: ["#93dbeb", "#fdd49b", "#f3a5bb"]
                      }
                  ]
              },
              options: {
                  responsive: true,
                  legend:{
                    display:false
                  },
                  tooltips: {
                    enabled: true,
                    mode: 'single',
                    callbacks: {
                        label: function(tooltipItem, data) {
                          //return data.datasets[tooltipItem.index]
                          //return data.datasets[tooltipItem.datasetIndex] + ' - ' + tooltipItem.yLabel
                          return data.labels[tooltipItem.index] + ": "+Math.round(data.datasets[0].data[tooltipItem.index])+"%";
                        }
                      }
                    },

              }
              });


              /*var context = document.getElementById("barChart").getContext('2d');
              var barChart = new Chart(context, {
                  type: 'bar',
                  data: {
                      labels: ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday","Saturday"],
                      datasets: [
                        {
                          label: 'Drinking Episodes per Day of Week',
                          data: days,
                          backgroundColor: [
                              '#4EBA75',
                              '#4EBA75',
                              '#4EBA75',
                              '#4EBA75',
                              '#4EBA75',
                              '#4EBA75',
                              '#4EBA75'
                          ],
                          borderColor: [
                              '#ffffff',
                              '#ffffff',
                              '#ffffff',
                              '#ffffff',
                              '#ffffff',
                              '#ffffff',
                              '#ffffff'
                          ],
                          borderWidth: 1
                      }
                    ]
                  },
                  options: {
                      scales: {
                        xAxes:[{
                          labels: {
                            fontColor: '#ffffff'
                          },
                          gridLines:{
                            color:"#777777",
                            zeroLineColor:"#777777"
                          },
                        }],
                        yAxes: [{
                            gridLines:{
                              color:"#777777",
                              zeroLineColor:"#777777"
                            },
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                      },
                      legend: {
                        labels: {
                            // This more specific font property overrides the global property
                            fontColor: '#ffffff'
                        }
                      }
                  }
              });*/

              var locations = [];
              var tempLocations = [];

              $scope.averageDrinksConsumed = Math.round($scope.totalDrinks/nightCounter)
              $scope.drinkingEpisodes = nightCounter;
              $scope.averageCaloriesConsumed = Math.round($scope.totalCalConsumed/nightCounter)
              $scope.averageMoneySpent = Math.round($scope.totalCost1/nightCounter)


    var locations = [];
    var tempLocations = [];
    var newLocations = [];

    for(var i = 0; i < $scope.locationCount.length; i++){
      //console.log($scope.locationCount[i]);
      if($scope.locationCount[i] === undefined){
        $scope.locationCount.splice(i,1);
        i--;
      }
    }

    for(var i = 0; i<$scope.lattitudeList.length; i++){

      /*
      if (i==0) {
        tempLocations.push([parseFloat($scope.lattitudeList[i]), parseFloat($scope.longitudeList[i])]);
        newLocations[0] = 1;
      }

      else{
      */
      //console.log($scope.lattitudeList);
      //console.log($scope.longitudeList)
        for(var j = 1; j<=$scope.lattitudeList.length; j++){


            var fromLatPrevious = $scope.lattitudeList[i];
            var fromLongPrevious = $scope.longitudeList[i];
            var fromLatCurrent = $scope.lattitudeList[j];
            var fromLongCurrent = $scope.longitudeList[j];

            var distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(fromLatPrevious, fromLongPrevious), new google.maps.LatLng(fromLatCurrent, fromLongCurrent));
            //console.log(distance);
            if(i != j){
              if(distance < 200){
                //console.log("less than 200");
                if(j == 1){
                  //tempLocations.push([parseFloat($scope.lattitudeList[i]), parseFloat($scope.longitudeList[i])]);
                  $scope.lattitudeList.splice(j,1);
                  $scope.longitudeList.splice(j,1);
                  var counter = parseInt($scope.locationCount.splice(j,1));
                  $scope.locationCount[i] = parseInt($scope.locationCount[i])+counter;
                  j--;
                }else{
                  $scope.lattitudeList.splice(j,1);
                  $scope.longitudeList.splice(j,1);
                  var counter = parseInt($scope.locationCount.splice(j,1));
                  $scope.locationCount[i] = parseInt($scope.locationCount[i])+counter;
                  j--;
                }
                //console.log($scope.lattitudeList[i]+","+$scope.lattitudeList[j]);
                //newLocations[i] = newLocations[i]+1;
                /*$scope.lattitudeList.splice(j,1);
                $scope.longitudeList.splice(j,1);
                var tempCount = $scope.locationCount[j];
                $scope.locationCount.splice(i,1);
                $scope.locationCount[i-1] = $scope.locationCount[i-1]+tempCount;*/
              }else if(distance > 200){
                //console.log("more than 200")
                //tempLocations.push([parseFloat($scope.lattitudeList[i]), parseFloat($scope.longitudeList[i])]);
              }else{
              }
            }



        }

      //}
    }

    //console.log($scope.lattitudeList);
    //console.log($scope.locationCount);

      for(var i =0;i<$scope.lattitudeList.length;i++){
        //console.log(i);
        tempLocations.push([parseFloat($scope.lattitudeList[i]), parseFloat($scope.longitudeList[i])]);

      }

      //console.log(tempLocations);

                      var map = new google.maps.Map(document.getElementById("map-container-5"), {
                        zoom: 14,
                        //center: new google.maps.LatLng(38.6364953, -90.2350996),
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                      });

                      var marker, i;
                      var markers = [];

                      for (i = 0; i < locations.length; i++) {
                        marker = new google.maps.Marker({
                          position: new google.maps.LatLng(tempLocations[i][0], tempLocations[i][1]),
                          label: $scope.locationCount[i]+"",
                          map: map
                        });
                        markers.push(marker);
                      }


            for (i = 0; i < tempLocations.length; i++) {
              marker = new google.maps.Marker({
                position: new google.maps.LatLng(tempLocations[i][0], tempLocations[i][1]),
                label: $scope.locationCount[i]+"",
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
