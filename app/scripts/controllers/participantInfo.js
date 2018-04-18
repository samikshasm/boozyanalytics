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
  $scope.locationCount = [];
  $scope.percentWine = 0.0;
  $scope.percentLiquor = 0.0;
  $scope.percentBeer = 0.0;
  $scope.dates = [];
  var wineCounter = 0;
  var beerCounter = 0;
  var liquorCounter = 0;
  $scope.costList = [];


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
    $scope.locationCounter = 0;
    $scope.lattitudeList = []
    $scope.longitudeList = []
    $scope.locationCount = [];
    $scope.dates = [];
    var episodeCounter = 0;
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
                          episodeCounter++;
                          angular.forEach(value, function(value, id){
                            if(id == "Answers"){
                              angular.forEach(value, function(value,id){
                                var date_val = id.substr(6,id.length);
                                var date_values = date_val.split("-");
                                //console.log(date_values[1]-1);
                                var date = new Date(date_values[0], date_values[1]-1, date_values[2]);
                                //console.log(date.getDay());
                                $scope.dates.push(date.getDay());
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
                                  if(id=="Cost"){
                                    angular.forEach(value,function(value,id){
                                      $scope.costList.push(value);

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
                                var splitList = []
                                splitList = value.split("&");
                                if (testIndex==0) {
                                  $scope.lattitudeList.push(parseFloat(splitList[0]));
                                  $scope.longitudeList.push(parseFloat(splitList[1]));
                                  $scope.locationCount[episodeCounter-1] = 1;
                               }
                                else{
                                  var fromLatPrevious = $scope.lattitudeList[$scope.locationCounter-1];
                                  var fromLongPrevious = $scope.longitudeList[$scope.locationCounter-1];
                                  var fromLatCurrent = parseFloat(splitList[0]);
                                  var fromLongCurrent = parseFloat(splitList[1]);
                                  //console.log(fromLatPrevious+","+fromLongPrevious);
                                  //console.log(fromLatCurrent+","+fromLongCurrent);

                                  var distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(fromLatPrevious, fromLongPrevious), new google.maps.LatLng(fromLatCurrent, fromLongCurrent));

                                  //console.log(distance);

                                  if (distance > 200){
                                    $scope.lattitudeList.push(parseFloat(splitList[0]));
                                    $scope.longitudeList.push(parseFloat(splitList[1]));
                                    $scope.locationCount[$scope.locationCount.length]=1;
                                    $scope.locationCounter++;
                                    $scope.locationCount[episodeCounter-1]=$scope.locationCount[episodeCounter-1]+1;
                                  }else{
                                    //console.log($scope.locationCount[$scope.locationCounter]);
                                    //sconsole.log($scope.locationCount);
                                  }

                                }
                                testIndex++;
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

              //days = [1,1,2,3,4,5,6];

              var context = document.getElementById("barChart").getContext('2d');
              var barChart = new Chart(context, {
                  type: 'bar',
                  data: {
                      labels: ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday","Saturday"],
                      datasets: [{
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
                      }]
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
    var tempLocations = [];
    var newLocations = [];


    for(var i = 0; i < $scope.locationCount.length; i++){
      //console.log($scope.locationCount[i]);
      if($scope.locationCount[i] === undefined){
        $scope.locationCount.splice(i,1);
        i--;
      }
    }
    console.log($scope.locationCount);


    for(var i = 0; i<$scope.lattitudeList.length; i++){

      /*
      if (i==0) {
        tempLocations.push([parseFloat($scope.lattitudeList[i]), parseFloat($scope.longitudeList[i])]);
        newLocations[0] = 1;
      }

      else{
      */
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
