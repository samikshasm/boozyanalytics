'use strict';
var userModule = angular.module('angularAppApp.dashboard',['ngRoute','firebase'])

.controller('DashboardCtrl', ['$scope', '$firebaseAuth', '$firebase','CommonProp', 'SetCurrentUser', '$firebaseArray', '$firebaseObject' , function($scope, $firebaseAuth, $firebase, CommonProp, SetCurrentUser, $firebaseArray, $firebaseObject){

  $scope.currentParticpant = SetCurrentUser.getCurrentUser()
  $scope.totalCalControl = 0;
  $scope.totalCalExperimental =0;
  $scope.totalLitersConsumed = 0;
  var controlWineCounter = 0;
  var controlBeerCounter = 0;
  var controlLiquorCounter = 0;
  var expWineCounter = 0
  var expBeerCounter = 0
  var expLiquorCounter = 0

  $scope.locationCounter = 0;
  $scope.lattitudeList = [];
  $scope.longitudeList = [];
  $scope.locationCount = [];
  $scope.controlUserData = [];
  $scope.expUserData = [];
  $scope.locationData = [];

  var ref = firebase.database().ref();
  var dataRef = $firebaseArray(ref);
  $scope.group = "";
  var participantName = "";
  var nightCounter = 0;
  $scope.sizeList = [];
  $scope.typeList = [];
  $scope.totalDrinks = 0;
  var whereControlList = [];
  var whereList = [];
  var whoList = [];
  $scope.locationCounter = 0;
  $scope.lattitudeList = [];
  $scope.longitudeList = [];

  $scope.costList = [];
  var averageCostList = [];

  $scope.numDrinksControl = [];
  $scope.numDrinksExp = [];
  $scope.numDrinks = [];

  $scope.friendsCounter = 0;
  $scope.partnerCounter = 0;
  $scope.nobodyCounter = 0;
  $scope.whoOtherCounter = 0;
  $scope.whereControlPercentage = 0;
  $scope.whereExpPercentage = 0;
  $scope.whoControlPerecentage = 0;
  $scope.whoExpPercentage=0;
  $scope.sortedDateList = []
  $scope.test = [];
  var nightCountList = [];
  var counter1 = 0;
  var group = "";
  var controlNightCounter=0
  var expNightCounter=0
  var nightCounterList=[]
  var testDatesWrong = []



  queryDatabase();
  function queryDatabase(){
    $scope.controlList = [];
    $scope.experimentalList = [];
    $scope.locationCounter = 0;
    $scope.lattitudeList = [];
    $scope.longitudeList = [];
    $scope.locationCount = [];
    $scope.dates = [];
    $scope.controlUserData =[];
    $scope.expUserData = [];
    $scope.locationData = [];
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
                        $scope.controlList.push(value);
                      })
                    })
                  }if (id == "Experimental Group"){
                      angular.forEach(value, function(value,id){
                        angular.forEach(value, function(value,id){
                          $scope.experimentalList.push(value);
                        })
                      })
                  }
                  if(id != "Control Group" || id != "Experimental Group"){
                    var substr = id.substr(0,3);
                    if(substr == "UID"){
                        participantName = id.substr(5,id.length);
                        if($scope.controlList.includes(participantName)) {
                          group = "control";
                        }
                        else if($scope.experimentalList.includes(participantName)) {
                          group = "control";
                        }
                        angular.forEach(value, function(value, id){
                          var idStr = ""+id;
                          var substr = idStr.substr(0,11);
                          if(substr == "Night Count"){
                            nightCounter++;
                            nightCounterList.push(participantName + " " + id)
                          }
                        })
                        angular.forEach(value, function(value, id){
                          var numDrinksControl = 0;
                          var numDrinksExp = 0;
                          var nightCounter1 = 0;
                          var idStr = ""+id;
                          var substr = idStr.substr(0,11);
                          var substr1 = idStr.substr(13);
                          if(substr == "Night Count"){
                            episodeCounter++;
                            angular.forEach(value, function(value, id){
                              if(id == "Answers"){
                                angular.forEach(value, function(value,id){

                                  var date_val = id.substr(6,id.length);
                                  var date_values = date_val.split("-");
                                  var date = new Date(date_values[0], date_values[1]-1, date_values[2]);
                                  testDatesWrong.push(date)
                                  $scope.dates.push(date.getDay() + " " + participantName);

                                  angular.forEach(value, function(value,id){
                                    if(id == "Size"){
                                      angular.forEach(value,function(value,id){
                                        $scope.sizeList.push(value);
                                        $scope.totalDrinks++;
                                        $scope.numDrinks.push(substr1 + " " + participantName + " " + value);
                                      })

                                      counter1++;
                                    }

                                    if(id == "Type"){
                                      angular.forEach(value,function(value,id){
                                        $scope.typeList.push(substr1 + " " + participantName + " " + value);
                                      })
                                    }

                                    if(id == "Where"){
                                      angular.forEach(value,function(value,id){
                                        whereList.push(participantName + " " + value);
                                      })
                                    }

                                    if(id == "Who"){
                                      angular.forEach(value,function(value,id){
                                        whoList.push(participantName + " " + value);
                                      })
                                    }

                                    if(id=="Cost"){
                                      angular.forEach(value,function(value,id){
                                        $scope.costList.push(participantName+ " " +value);
                                      })
                                    }
                                  })
                                })
                              }

                              if(id == "Location"){
                                var testIndex = 0;
                                angular.forEach(value,function(value,id){
                                  var tempList = []
                                  $scope.locationCounter++;
                                  tempList = value.split("&");
                                  if(testIndex == 0){
                                    $scope.lattitudeList.push(tempList[0]);
                                    $scope.longitudeList.push(tempList[1]);
                                    $scope.locationCount[episodeCounter-1] = 1;
                                  }else{
                                    var fromLatPrevious = $scope.lattitudeList[$scope.locationCounter-1];
                                    var fromLongPrevious = $scope.longitudeList[$scope.locationCounter-1];
                                    var fromLatCurrent = parseFloat(tempList[0]);
                                    var fromLongCurrent = parseFloat(tempList[1]);

                                    var distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(fromLatPrevious, fromLongPrevious), new google.maps.LatLng(fromLatCurrent, fromLongCurrent));

                                    if (distance > 200){
                                      $scope.lattitudeList.push(parseFloat(tempList[0]));
                                      $scope.longitudeList.push(parseFloat(tempList[1]));
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
                          }
                        })
                      }
                    }
                  })
                })


              for(var i=0;i<nightCounterList.length;i++){
                var name = nightCounterList[i].split(" ")[0]
                if ($scope.controlList.includes(name)){
                  controlNightCounter++
                }
                else if ($scope.experimentalList.includes(name)){
                  expNightCounter++
                }
              }

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
              $scope.controlDrinks = 0
              $scope.expDrinks = 0

              for (var i=0;i<$scope.numDrinks.length;i++){
                var name = $scope.numDrinks[i].split(" ")[1]
                var size = $scope.numDrinks[i].split(" ")[2]
                var type = $scope.typeList[i].split(" ")[2]
                if($scope.controlList.includes(name)){
                  $scope.controlDrinks++;
                  var tempType = type
                  var tempSize = size

                  if (!tempSize=="Shot") {
                    var sizeOfDrink = Integer.parseInt(size);
                    totalOuncesConsumed = totalOuncesConsumed + sizeOfDrink;
                  }
                  else {
                    totalOuncesConsumed = totalOuncesConsumed + 1;
                  }

                  if(tempType == "wine"){
                    controlWineCounter++;
                    if(tempSize == "Shot"){
                      $scope.totalCalControl = $scope.totalCalControl+calorieWineShot;
                    }
                    else if (tempSize == "8") {
                      $scope.totalCalControl = $scope.totalCalControl+calorieWineEight;
                    }
                    else if (tempSize == "16") {
                      $scope.totalCalControl = $scope.totalCalControl+calorieWineSixteen;
                    }
                    else if (tempSize == "24") {
                      $scope.totalCalControl = $scope.totalCalControl+calorieWineTwentyFour;
                    }
                  }

                  else if(tempType == "liquor"){
                    controlLiquorCounter++;
                    if(tempSize == "Shot"){
                      $scope.totalCalControl = $scope.totalCalControl+calorieLiquorShot;
                    }
                    else if (tempSize == "8") {
                      $scope.totalCalControl = $scope.totalCalControl+calorieLiquorEight;
                    }
                    else if (tempSize == "16") {
                      $scope.totalCalControl = $scope.totalCalControl+calorieLiquorSixteen;
                    }
                    else if (tempSize == "24") {
                      $scope.totalCalControl = $scope.totalCalControl+calorieLiquorTwentyFour;
                    }
                  }

                  else if(tempType == "beer"){
                    controlBeerCounter++;
                    if(tempSize == "Shot"){
                      $scope.totalCalControl = $scope.totalCalControl+calorieBeerShot;
                    }
                    else if (tempSize == "8") {
                      $scope.totalCalControl = $scope.totalCalControl+calorieBeerEight;
                    }
                    else if (tempSize == "16") {
                      $scope.totalCalControl = $scope.totalCalControl+calorieBeerSixteen;
                    }
                    else if (tempSize == "24") {
                      $scope.totalCalControl = $scope.totalCalControl+calorieBeerTwentyFour;
                    }
                  }
                }
                if($scope.experimentalList.includes(name)){
                  $scope.expDrinks++
                  var tempType = type
                  var tempSize = size

                  if (!tempSize=="Shot") {
                    var sizeOfDrink = Integer.parseInt(size);
                    totalOuncesConsumed = totalOuncesConsumed + sizeOfDrink;
                  }
                  else {
                    totalOuncesConsumed = totalOuncesConsumed + 1;
                  }

                  if(tempType == "wine"){
                    expWineCounter++;
                    if(tempSize == "Shot"){
                      $scope.totalCalExperimental = $scope.totalCalExperimental+calorieWineShot;
                    }
                    else if (tempSize == "8") {
                      $scope.totalCalExperimental = $scope.totalCalExperimental+calorieWineEight;
                    }
                    else if (tempSize == "16") {
                      $scope.totalCalExperimental = $scope.totalCalExperimental+calorieWineSixteen;
                    }
                    else if (tempSize == "24") {
                      $scope.totalCalExperimental = $scope.totalCalExperimental+calorieWineTwentyFour;
                    }
                  }

                  else if(tempType == "liquor"){
                    expLiquorCounter++;
                    if(tempSize == "Shot"){
                      $scope.totalCalExperimental = $scope.totalCalExperimental+calorieLiquorShot;
                    }
                    else if (tempSize == "8") {
                      $scope.totalCalExperimental = $scope.totalCalExperimental+calorieLiquorEight;
                    }
                    else if (tempSize == "16") {
                      $scope.totalCalExperimental = $scope.totalCalExperimental+calorieLiquorSixteen;
                    }
                    else if (tempSize == "24") {
                      $scope.totalCalExperimental = $scope.totalCalExperimental+calorieLiquorTwentyFour;
                    }
                  }

                  else if(tempType == "beer"){
                    expBeerCounter++;
                    if(tempSize == "Shot"){
                      $scope.totalCalExperimental = $scope.totalCalExperimental+calorieBeerShot;
                    }
                    else if (tempSize == "8") {
                      $scope.totalCalExperimental = $scope.totalCalExperimental+calorieBeerEight;
                    }
                    else if (tempSize == "16") {
                      $scope.totalCalExperimental = $scope.totalCalExperimental+calorieBeerSixteen;
                    }
                    else if (tempSize == "24") {
                      $scope.totalCalExperimental = $scope.totalCalExperimental+calorieBeerTwentyFour;
                    }
                  }
                }
              }

              $scope.averageCalControl = Math.round($scope.totalCalControl/controlNightCounter,1)
              $scope.averageCalExp = Math.round($scope.totalCalExperimental/expNightCounter,1)
              $scope.averageDrinksControl = Math.round($scope.controlDrinks/controlNightCounter, 1)
              $scope.averageDrinksExp = Math.round($scope.expDrinks/expNightCounter,1)
              $scope.controlEpisodes = controlNightCounter
              $scope.expEpisodes = expNightCounter

              //$scope.totalLitersConsumed = (totalOuncesConsumed * 0.03);

              var percentControlWine = Math.round((controlWineCounter/$scope.controlDrinks) * 100)
              var percentControlBeer = Math.round((controlBeerCounter/$scope.controlDrinks) *100)
              var percentControlLiquor = Math.round((controlLiquorCounter/$scope.controlDrinks) *100)

              var percentExpWine = Math.round((expWineCounter/$scope.expDrinks) * 100)
              var percentExpBeer = Math.round((expBeerCounter/$scope.expDrinks) *100)
              var percentExpLiquor = Math.round((expLiquorCounter/$scope.expDrinks) *100)


              var ctxP = document.getElementById("controlPieChart").getContext('2d');
              var myPieChart = new Chart(ctxP, {
              type: 'pie',
              data: {
                  labels: ["Wine", "Beer", "Liquor"],
                  datasets: [
                      {
                          data: [percentControlWine,percentControlBeer,percentControlLiquor],
                          backgroundColor: ["#e9686d", "#FCB857", "#EC6E91"],
                          hoverBackgroundColor: ["#e9686d", "#FCB857", "#EC6E91"]
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
                    }
              }
            });

            var ctxP = document.getElementById("expPieChart").getContext('2d');
            var myPieChart = new Chart(ctxP, {
            type: 'pie',
            data: {
                labels: ["Wine", "Beer", "Liquor"],
                datasets: [
                    {
                        data: [percentExpWine,percentExpBeer,percentExpLiquor],
                        backgroundColor: ["#62CAE2", "#4EBa75", "#818DC6"],
                        hoverBackgroundColor: ["#62CAE2", "#4EBa75", "#818DC6"]
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
                  }
            }
          });

              var workControlCounter = 0;
              var homeControlCounter = 0;
              var barControlCounter = 0;
              var whereControlOtherCounter = 0;
              var workExpCounter = 0;
              var homeExpCounter = 0;
              var barExpCounter = 0;
              var whereExpOtherCounter = 0;
              var controlWhereList = []
              var expWhereList = []

              var friendsControlCounter = 0;
              var partnerControlCounter = 0;
              var nobodyControlCounter = 0;
              var whoControlOtherCounter = 0;
              var friendsExpCounter = 0;
              var partnerExpCounter = 0;
              var nobodyExpCounter = 0;
              var whoExpOtherCounter = 0;
              var controlWhoList = []
              var expWhoList = []

              for (var i =0; i<whereList.length;i++) {
                var name = whereList[i].split(" ")[0];
                var where = whereList[i].split(" ")[1];
                if($scope.controlList.includes(name)){
                  if (where == ("Work")){
                    workControlCounter++
                  }
                  if (where == ("Home")){
                    homeControlCounter++
                  }
                  if (where == ("Bar/Restaurant")){
                    barControlCounter++
                  }
                  if (where == ("Other")){
                    whereControlOtherCounter++
                  }
                }
                if($scope.experimentalList.includes(name)){
                  if (where == ("Work")){
                    workExpCounter++
                  }
                  if (where == ("Home")){
                    homeExpCounter++
                  }
                  if (where == ("Bar/Restaurant")){
                    barExpCounter++
                  }
                  if (where == ("Other")){
                    whereExpOtherCounter++
                  }
                }
              }

              for (var i =0; i<whoList.length;i++) {
                var name = whoList[i].split(" ")[0];
                var who = whoList[i].split(" ")[1];
                if($scope.controlList.includes(name)){
                  if (who == ("Friends")){
                    friendsControlCounter++
                  }
                  if (who == ("Partner")){
                    partnerControlCounter++
                  }
                  if (who == ("Nobody")){
                    nobodyControlCounter++
                  }
                  if (who == ("Other")){
                    whoControlOtherCounter++
                  }
                }
                if($scope.experimentalList.includes(name)){
                  if (who == ("Friends")){
                    friendsExpCounter++
                  }
                  if (who == ("Partner")){
                    partnerExpCounter++
                  }
                  if (who == ("Nobody")){
                    nobodyExpCounter++
                  }
                  if (who == ("Other")){
                    whoExpOtherCounter++
                  }
                }
              }

              controlWhereList.push(workControlCounter)
              controlWhereList.push(homeControlCounter)
              controlWhereList.push(barControlCounter)
              controlWhereList.push(whereControlOtherCounter)

              expWhereList.push(workExpCounter)
              expWhereList.push(homeExpCounter)
              expWhereList.push(barExpCounter)
              expWhereList.push(whereExpOtherCounter)

              controlWhoList.push(friendsControlCounter)
              controlWhoList.push(partnerControlCounter)
              controlWhoList.push(nobodyControlCounter)
              controlWhoList.push(whoControlOtherCounter)

              expWhoList.push(friendsExpCounter)
              expWhoList.push(partnerExpCounter)
              expWhoList.push(nobodyExpCounter)
              expWhoList.push(whoExpOtherCounter)

              function add(a, b) {
                return a + b;
              }
              var whereLabelsList = ["Work", "Home", "Bar", "Other"]
              var whoLabelsList = ["Friends", "Partner", "Alone", "Other"]

              var whereControlSum = controlWhereList.slice().reduce(add,0)
              var whereExpSum = expWhereList.slice().reduce(add,0)
              var whoControlSum = controlWhoList.slice().reduce(add,0)
              var whoExpSum = expWhoList.slice().reduce(add,0)

              var whereControlMax = Math.max.apply(Math, controlWhereList);
              var whereExpMax = Math.max.apply(Math, expWhereList);
              var whoControlMax = Math.max.apply(Math, controlWhoList);
              var whoExpMax = Math.max.apply(Math, expWhoList);

              var iWhereControl = controlWhereList.indexOf(whereControlMax);
              var iWhereExp = expWhereList.indexOf(whereExpMax);
              var iWhoControl = controlWhoList.indexOf(whoControlMax);
              var iWhoExp = expWhoList.indexOf(whoExpMax);


              var whereControlLabel = whereLabelsList[iWhereControl]
              var whereExpLabel = whereLabelsList[iWhereExp]
              var whoControlLabel = whoLabelsList[iWhoControl]
              var whoExpLabel = whoLabelsList[iWhoExp]

              $scope.whereControlPercentage = Math.round((whereControlMax/whereControlSum)*100)
              $scope.whereExpPercentage = Math.round((whereExpMax/whereExpSum)*100)
              $scope.whoControlPerecentage = Math.round((whoControlMax/whoControlSum)*100)
              $scope.whoExpPercentage = Math.round((whoExpMax/whoExpSum)*100)

              //doughnut
              var ctxD = document.getElementById("whereControlDonut").getContext('2d');
              var myLineChart = new Chart(ctxD, {
                  type: 'doughnut',
                  data: {
                      labels: [whereControlLabel, "Other"],
                      datasets: [
                          {
                              data: [$scope.whereControlPercentage, 100-$scope.whereControlPercentage],
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
                      var string = $scope.whereControlPercentage+"%"+" "+whereControlLabel;
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

              var ctxD = document.getElementById("whoControlDonut").getContext('2d');
              var myLineChart = new Chart(ctxD, {
                  type: 'doughnut',
                  data: {
                      labels: [whoControlLabel, "Other"],
                      datasets: [
                          {
                              data: [$scope.whoControlPerecentage, 100-$scope.whoControlPerecentage],
                              backgroundColor: ["#EC6E91", "#F5F5F5"],
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
                      chart.ctx.fillStyle = '#EC6E91'
                      chart.ctx.textBaseline = 'middle'
                      chart.ctx.textAlign = 'center'
                      //chart.ctx.font = 'bold 3vw Arial'
                      var string = $scope.whoControlPerecentage+"%"+" "+whoControlLabel;
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





              var ctxD = document.getElementById("whereExpDonut").getContext('2d');
              var myLineChart = new Chart(ctxD, {
                  type: 'doughnut',
                  data: {
                      labels: [whereExpLabel, "Other"],
                      datasets: [
                          {
                              data: [$scope.whereExpPercentage, 100-$scope.whereExpPercentage],
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
                      var string = $scope.whereExpPercentage+"%"+" "+whereExpLabel;
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

              var ctxD = document.getElementById("whoExpDonut").getContext('2d');
              var myLineChart = new Chart(ctxD, {
                  type: 'doughnut',
                  data: {
                      labels: [whoExpLabel, "Other"],
                      datasets: [
                          {
                              data: [$scope.whoExpPercentage, 100-$scope.whoExpPercentage],
                              backgroundColor: ["#4EBA75", "#F5F5F5"],
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
                      chart.ctx.fillStyle = '#4EBA75'
                      chart.ctx.textBaseline = 'middle'
                      chart.ctx.textAlign = 'center'
                      //chart.ctx.font = 'bold 3vw Arial'
                      var string = $scope.whoExpPercentage+"%"+" "+whoExpLabel;
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


              var controlAverageCost=0;
              var experimentalAverageCost=0;
              $scope.controlTotalCost=0;
              $scope.experimentalTotalCost=0;
              $scope.controlAverageCost=0;
              $scope.expAverageCost=0;

              for(var i =0;i<$scope.costList.length;i++){
                var name = $scope.costList[i].split(" ")[0]
                var value = $scope.costList[i].split(" ")[1]
                if($scope.controlList.includes(name)){
                  if (value == "$0.00"){
                    controlAverageCost = 0;
                  }
                  else if (value == "$1.00-$5.00"){
                    controlAverageCost = 4;
                  }
                  else if(value == "$6.00-$10.00"){
                    controlAverageCost = 8;
                  }
                  else if(value == "$11.00-$15.00"){
                    controlAverageCost = 13;
                  }
                  else if(value == "$16.00+"){
                    controlAverageCost = 20;
                  }
                  $scope.controlTotalCost += controlAverageCost;

                }
                else if($scope.experimentalList.includes(name)){
                  if (value == "$0.00"){
                    experimentalAverageCost = 0;
                  }
                  else if (value == "$1.00-$5.00"){
                    experimentalAverageCost = 4;
                  }
                  else if(value== "$6.00-$10.00"){
                    experimentalAverageCost = 8;
                  }
                  else if(value== "$11.00-$15.00"){
                    experimentalAverageCost = 13;
                  }
                  else if(value == "$16.00+"){
                    experimentalAverageCost = 20;
                  }
                  $scope.experimentalTotalCost += experimentalAverageCost;
                }
              }

              $scope.controlAverageCost = $scope.controlTotalCost/controlNightCounter
              $scope.expAverageCost = $scope.experimentalTotalCost/expNightCounter

              var controlSun=0;
              var controlMon=0;
              var controlTue=0;
              var controlWed=0
              var controlThu=0
              var controlFri=0
              var controlSat=0
              var controlDaysList=[]

              var expSun=0
              var expMon=0
              var expTue=0
              var expWed=0
              var expThu=0
              var expFri=0
              var expSat=0
              var experimentalDaysList=[]


              for (var i=0;i<$scope.dates.length;i++){
                var date = $scope.dates[i].split(" ")[0]
                var name = $scope.dates[i].split(" ")[1]

                if ($scope.controlList.includes(name)){
                  if (date == 0){
                    controlSun++
                  }
                  if (date == 1){
                    controlMon++
                  }
                  if (date== 2){
                    controlTue++
                  }
                  if (date == 3){
                    controlWed++
                  }
                  if (date == 4){
                    controlThu++
                  }
                  if (date == 5){
                    controlFri++
                  }
                  if (date == 6){
                    controlSat++
                  }
                }
                else if ($scope.experimentalList.includes(name)){
                  if (date == 0){
                    expSun++
                  }
                  if (date == 1){
                    expMon++
                  }
                  if (date== 2){
                    expTue++
                  }
                  if (date == 3){
                    expWed++
                  }
                  if (date == 4){
                    expThu++
                  }
                  if (date == 5){
                    expFri++
                  }
                  if (date == 6){
                    expSat++
                  }
                }
              }

              controlDaysList.push(controlSun)
              controlDaysList.push(controlMon)
              controlDaysList.push(controlTue)
              controlDaysList.push(controlWed)
              controlDaysList.push(controlThu)
              controlDaysList.push(controlFri)
              controlDaysList.push(controlSat)

              experimentalDaysList.push(expSun)
              experimentalDaysList.push(expMon)
              experimentalDaysList.push(expTue)
              experimentalDaysList.push(expWed)
              experimentalDaysList.push(expThu)
              experimentalDaysList.push(expFri)
              experimentalDaysList.push(expSat)


              var context = document.getElementById("barChart").getContext('2d');
              var barChart = new Chart(context, {
                  type: 'bar',
                  data: {
                      labels: ["S","M", "T", "W", "R", "F","S"],
                      datasets: [
                        {
                          label: 'Control',
                          data: controlDaysList,
                          backgroundColor: [
                            'rgba(252, 184, 87, 0.2)',
                            'rgba(252, 184, 87, 0.2)',
                            'rgba(252, 184, 87, 0.2)',
                            'rgba(252, 184, 87, 0.2)',
                            'rgba(252, 184, 87, 0.2)',
                            'rgba(252, 184, 87, 0.2)',
                            'rgba(252, 184, 87, 0.2)'
                        ],
                          borderColor: [
                              '#fba937',
                              '#fba937',
                              '#fba937',
                              '#fba937',
                              '#fba937',
                              '#fba937',
                              '#fba937'
                          ],
                          borderWidth: 1
                      },
                      {
                        label: 'Experimental',
                        data: experimentalDaysList,
                        backgroundColor: [
                          'rgba(78, 186, 177, 0.2)',
                          'rgba(78, 186, 177, 0.2)',
                          'rgba(78, 186, 177, 0.2)',
                          'rgba(78, 186, 177, 0.2)',
                          'rgba(78, 186, 177, 0.2)',
                          'rgba(78, 186, 177, 0.2)',
                          'rgba(78, 186, 177, 0.2)'
                      ],
                        borderColor: [
                            '#40a565',
                            '#40a565',
                            '#40a565',
                            '#40a565',
                            '#40a565',
                            '#40a565',
                            '#40a565'
                        ],
                        borderWidth: 1
                      }
                    ]
                  },
                  options: {
                    scales: {
                        yAxes: [{
                          scaleLabel: {
                            display: true,
                            labelString: 'Number of Episodes',
                          },
                            ticks: {
                                beginAtZero:true,
                                userCallback: function(label, index, labels) {
                                    // when the floored value is the same as the value we have a whole number
                                    if (Math.floor(label) === label) {
                                        return label;
                                    }

                                },
                            }
                        }],
                        xAxes: [{
                          scaleLabel: {
                            display: true,
                            labelString: 'Day of the Week'
                          }
                        }]

                    }
                  }
              });

              var labelsList = []
              for (var i = 0;i<$scope.numDrinks;i++){
                labelsList.push(i);
              }

              var controlCounter = 1;
              var experimentalCounter = 1;
              var controlNightCountFinal = [];
              var controlDrinkTotalFinal = [];
              var expNightCountFinal = [];
              var expDrinkTotalFinal = [];
              var unsortedControlList = [];
              var unsortedExpList = [];
              var group = "";
              for (var i = 0; i<$scope.numDrinks.length;i++) {
                var nightCount = $scope.numDrinks[i].split(" ")[0];
                var name = $scope.numDrinks[i].split(" ")[1];
                var drink = $scope.numDrinks[i].split(" ")[2];
                for (var j=1;j<$scope.numDrinks.length;j++){
                  if ($scope.controlList.includes(name)) {
                    group = "control";
                    var nightCount1 = $scope.numDrinks[j].split(" ")[0];
                    var name1 = $scope.numDrinks[j].split(" ")[1];
                    if(i!=j){
                      if ($scope.controlList.includes(name1)){
                        if (nightCount == nightCount1) {
                          controlCounter++;
                          $scope.numDrinks.splice(j,1);
                          j=j-1
                        }
                      }
                    }
                  }
                  else if($scope.experimentalList.includes(name)){
                    group = "experimental";
                    var nightCount1 = $scope.numDrinks[j].split(" ")[0];
                    var name1 = $scope.numDrinks[j].split(" ")[1];
                    if (i!=j){
                      if($scope.experimentalList.includes(name1)){
                        if (nightCount == nightCount1) {
                          experimentalCounter++;
                          $scope.numDrinks.splice(j,1);
                          j=j-1;
                        }
                      }
                    }
                  }
                }
                if (group == "control") {
                  controlDrinkTotalFinal.push(controlCounter);
                  unsortedControlList.push(parseInt(nightCount));
                }
                else if (group=="experimental"){
                  expDrinkTotalFinal.push(experimentalCounter);
                  unsortedExpList.push(parseInt(nightCount));
                }
                controlCounter =1;
                experimentalCounter=1;
              }


              var sortedControlList = unsortedControlList.slice().sort(function(a, b) { return a > b ? 1 : -1});
              var realControlSortedList = [];
              for (var i =0;i<sortedControlList.length;i++){
                for (var j = 0;j<sortedControlList.length;j++){
                  if(sortedControlList[i]==unsortedControlList[j]) {
                    realControlSortedList.push(controlDrinkTotalFinal[j]);
                  }
                }
              }

              var sortedExpList = unsortedExpList.slice().sort(function(a, b) { return a > b ? 1 : -1});
              var realExpSortedList = [];
              for (var i =0;i<sortedExpList.length;i++){
                for (var j = 0;j<sortedExpList.length;j++){
                  if(sortedExpList[i]==unsortedExpList[j]) {
                    realExpSortedList.push(controlDrinkTotalFinal[j]);
                  }
                }
              }


              var labelsList = []
              if (sortedControlList.length > sortedExpList.length) {
                for (var i = 0; i < sortedControlList.length; i++) {
                  labelsList.push(i);
                }
              }
              else {
                for (var i = 0; i < sortedExpList.length; i++) {
                  labelsList.push(i);
                }
              }

              var ctxL = document.getElementById("lineChart").getContext('2d');
              var myLineChart = new Chart(ctxL, {
                  type: 'line',
                  data: {
                      labels: labelsList,
                      datasets: [
                          {
                              label: "Control Users",
                              backgroundColor: 'rgba(252, 184, 87,0.2)',
                              borderWidth : 3,
                              borderColor : '#FCB857',
                              pointBackgroundColor : '#FCB857',
                              pointBorderColor : '#FCB857',
                              pointBorderWidth : 1,
                              pointRadius : 4,
                              pointHoverBackgroundColor : '#FCB857',
                              pointHoverBorderColor : '#FCB857',
                              data: realControlSortedList
                          },
                          {
                              label: "Experimental Users",
                              backgroundColor: 'rgba(236, 110, 145,0.2)',
                              borderWidth : 3,
                              borderColor : '#EC6E91',
                              pointBackgroundColor : '#EC6E91',
                              pointBorderColor : '#EC6E91',
                              pointBorderWidth : 1,
                              pointRadius : 4,
                              pointHoverBackgroundColor : '#EC6E91',
                              pointHoverBorderColor : '#EC6E91',
                              data: realExpSortedList
                          }
                      ]
                  },
                  options: {
                      responsive: true,
                      legend: {
                        display: true,
                        labels: {
                        }
                    },
                      scales: {
                          yAxes: [{
                            scaleLabel: {
                              display: true,
                              labelString: 'Number of Drinks'

                            },
                              ticks: {
                                  beginAtZero:true,
                                  userCallback: function(label, index, labels) {
                                      // when the floored value is the same as the value we have a whole number
                                      if (Math.floor(label) === label) {
                                          return label;
                                      }

                                  },
                              }
                          }],
                          xAxes: [{
                            scaleLabel: {
                              display: true,
                              labelString: 'Night Count'
                            },
                            ticks: {
                            }
                          }]
                      }
                  }
              });

/*
              var iniData = {
                labels: sortedControlList,
                datasets:[
              {
                  label: "Control Users",
                  fill: false,
                  borderWidth : 5,
                  borderColor : '#FCB857',
                  pointBackgroundColor : '#FFFFFF',
                  pointBorderColor : '#FFFFFF',
                  pointBorderWidth : 1,
                  pointRadius : 3,
                  pointHoverBackgroundColor : '#FCB857',
                  pointHoverBorderColor : '#FCB857',
                  data: realControlSortedList
              },
              {
                  label: "Experimental Users",
                  fill: false,
                  borderWidth : 5,
                  borderColor : '#EC6E91',
                  pointBackgroundColor : '#FFFFFF',
                  pointBorderColor : '#FFFFFF',
                  pointBorderWidth : 1,
                  pointRadius : 3,
                  pointHoverBackgroundColor : '#EC6E91',
                  pointHoverBorderColor : '#EC6E91',
                  data: realExpSortedList

                }
              ]
            },
            options = {
              scaleFontColor: '#FFFFFF',
                responsive: true,
                legend: {
                  display: true,
                  labels: {
                    fontColor: "#FFFFFF"
                  }
              },
                scales: {
                    yAxes: [{
                      scaleLabel: {
                        display: true,
                        labelString: 'Number of Drinks',
                        fontColor: "#FFFFFF"

                      },
                        ticks: {
                            beginAtZero:true,
                            fontColor: "#FFFFFF"
                        }
                    }],
                    xAxes: [{
                      scaleLabel: {
                        display: true,
                        labelString: 'Night Count',
                        fontColor: "#FFFFFF"
                      },
                      ticks: {
                          fontColor: "#FFFFFF"
                      }
                    }],

                }
            }


              var ini = document.getElementById("lineChart").getContext('2d')

              rs = new RangeSliderChart({
                chartData: iniData,
                chartOpts: options,
                chartType: 'line',
                chartCTX: lineChart,
                class: 'my-chart-ranger',
                initial: [1,24]
              })



              // line chart data
              		var iniData = {
              			labels:[
              				"2000",
              				"2001",
              				"2002",
              				"2003",
              				"2004",
              				"2005",
              				"2006",
              				"2007",
              				"2008",
              				"2009",
              				"2011",
              				"2012",
              				"2013",
              				"2014",
              				"2015",
              				"2016",
              				"2017",
              				"2018",
              				"2019",
              				"2020"
              			],
              			datasets:[{
              				label: "Rangeslider Line 1",
              				fillColor:"rgba(172,194,132,0)",
              				strokeColor:"#C45662",
              				pointColor:"#C45662",
              				pointStrokeColor:"#fff",
              				pointHighlightFill: "#fff",
              				pointHighlightStroke: "#C45662",
              				data:[
              					480,
              					490,
                        500,
                        510,
                        520,
                        530,
                        540,
                        550,
                        560,
                        570,
                        580,
                        590,
                        600,
                        610,
                        620,
                        630,
                        640,
                        650,
                        660,
                        670
              				]
              			},
              			{
              				label: "Rangeslider Line 2",
              				fillColor:"rgba(172,194,132,0)",
              				strokeColor:"#C45662",
              				pointColor:"#C45662",
              				pointStrokeColor:"#fff",
              				pointHighlightFill: "#fff",
              				pointHighlightStroke: "#C45662",
              				data:[
                        480,
              					490,
                        500,
                        510,
                        520,
                        530,
                        540,
                        550,
                        560,
                        570,
                        580,
                        590,
                        600,
                        610,
                        620,
                        630,
                        640,
                        650,
                        660,
                        670
              				],
              			}]
              		},
              		// create the options
              		options = {
              			scaleBeginAtZero: true,
              			tooltipTemplate: "<%if (label){%><%=label%>: <%}%>$<%= value %>",
              			label: 'test'
              		},
              		// get line chart canvas
              		ini = document.getElementById('ini').getContext('2d')
              		rs = new RangeSliderChart({
              			chartData: iniData,
              			chartOpts: options,
              			chartType: 'line',
              			chartCTX: ini,
              			class: 'my-chart-ranger',
              			initial: [3, 10]
              		})
*/



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

            for(var i =0;i<$scope.lattitudeList.length;i++){
              tempLocations.push([parseFloat($scope.lattitudeList[i]), parseFloat($scope.longitudeList[i])]);
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

            $scope.controlUserData.push({"labels":"Episodes"})
            $scope.controlUserData.push({"labels":"Drinks"})
            $scope.controlUserData.push({"labels":"Calories"})
            $scope.controlUserData.push({"labels":"Cost"})

            $scope.controlUserData[0].episodes = "-";
            $scope.controlUserData[0].totalDrinks = $scope.controlEpisodes
            $scope.controlUserData[1].episodes = $scope.averageDrinksControl
            $scope.controlUserData[1].totalDrinks = $scope.controlDrinks;
            $scope.controlUserData[2].episodes = $scope.averageCalControl
            $scope.controlUserData[2].totalDrinks = $scope.totalCalControl
            $scope.controlUserData[3].episodes =  "$"+Math.round($scope.controlAverageCost*100)/100
            $scope.controlUserData[3].totalDrinks ="$"+Math.round($scope.controlTotalCost*100)/100




            $scope.expUserData.push({"labels":"Episodes"})
            $scope.expUserData.push({"labels":"Drinks"})
            $scope.expUserData.push({"labels":"Calories"})
            $scope.expUserData.push({"labels":"Cost"})

            $scope.expUserData[0].episodes = "-";
            $scope.expUserData[0].totalDrinks = $scope.expEpisodes
            $scope.expUserData[1].episodes = $scope.averageDrinksExp
            $scope.expUserData[1].totalDrinks = $scope.expDrinks;
            $scope.expUserData[2].episodes = $scope.averageCalExp
            $scope.expUserData[2].totalDrinks = $scope.totalCalExperimental
            $scope.expUserData[3].episodes = "$"+Math.round($scope.expAverageCost*100)/100
            $scope.expUserData[3].totalDrinks = "$"+Math.round($scope.experimentalTotalCost*100)/100

            var getLocationData = function(count){
              var largest = Math.max.apply( Math, $scope.locationCount);
              var largestIndex = $scope.locationCount.indexOf(largest);
              var largestLat = $scope.lattitudeList[largestIndex];
              var largestLong = $scope.longitudeList[largestIndex];
              $scope.locationData.push({"count":largest});
              $scope.locationData[count].lat = largestLat;
              $scope.locationData[count].long = largestLong;
              $scope.locationCount.splice(largestIndex,1);
              $scope.lattitudeList.splice(largestIndex,1);
              $scope.longitudeList.splice(largestIndex,1);
            }

            getLocationData(0);
            getLocationData(1);
            getLocationData(2);
            getLocationData(3);
            getLocationData(4);

        });
    })
  }

}])
