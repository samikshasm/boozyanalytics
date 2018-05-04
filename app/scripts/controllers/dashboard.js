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


  queryDatabase();
  function queryDatabase(){
    $scope.controlList = [];
    $scope.experimentalList = [];
    $scope.lattitudeList = [];
    $scope.longitudeList = [];
    $scope.dates = [];
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
                                        $scope.costList.push(value);
                                        averageCostList.push(date.getDay());
                                        averageCostList.push(value);
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

              console.log($scope.controlEpisodes)
              console.log($scope.expEpisodes)

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
                          backgroundColor: ["#62CAE2", "#FCB857", "#EC6E91"],
                          hoverBackgroundColor: ["#93dbeb", "#fdd49b", "#f3a5bb"]
                      }
                  ]
              },
              options: {
                  responsive: true,
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
                        backgroundColor: ["#62CAE2", "#FCB857", "#EC6E91"],
                        hoverBackgroundColor: ["#93dbeb", "#fdd49b", "#f3a5bb"]
                    }
                ]
            },
            options: {
                responsive: true,
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
                      var y = chart.canvas.height/3;
                      var test = window.innerHeight;
                    //  console.log(test);
                      for (var i = 0; i < array.length; i++) {
                        if(i == 0){
                          chart.ctx.font = 'bold 4vw Arial'
                        }else{
                          chart.ctx.font = 'bold 1vw Arial'
                        }
                         chart.ctx.fillText(array[i], chart.canvas.width/2.7, y);
                         y += chart.canvas.height/7;
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
                      var y = chart.canvas.height/3
                      for (var i = 0; i < array.length; i++) {
                        if(i == 0){
                          chart.ctx.font = 'bold 4vw Arial'
                        }else{
                          chart.ctx.font = 'bold 1vw Arial'
                        }
                         chart.ctx.fillText(array[i], chart.canvas.width/2.7, y);
                         y += chart.canvas.height/7;
                      }
                      //chart.ctxD.fillText($scope.whereControlPercentage+'%'+"text", chart.canvas.width / 2.6, chart.canvas.height / 2.5)
                    }
                  }]
              });
              /*
              var x = 50;
              var y = chart.ctxD.height/2;
              var fontSize = 20;
              var string = "Hello Canvas";
              var array = string.split(" ");
              for (var i = 0; i < array.length; i++) {
                 chart.ctxD.fillText(array[i], x, y);
                 y += fontSize;
              }
              */




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
                      var y = chart.canvas.height/3
                      for (var i = 0; i < array.length; i++) {
                        if(i == 0){
                          chart.ctx.font = 'bold 4vw Arial'
                        }else{
                          chart.ctx.font = 'bold 1vw Arial'
                        }
                         chart.ctx.fillText(array[i], chart.canvas.width/2.7, y);
                         y += chart.canvas.height/7;
                      }
                      //chart.ctxD.fillText($scope.whereControlPercentage+'%'+"text", chart.canvas.width / 2.6, chart.canvas.height / 2.5)
                    }
                  }]
              });

              var ctxD = document.getElementById("whoExpDonut").getContext('2d');
              var canvas = document.getElementById("whoExpDonut");
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
                      fontSize = 50;                     // default size for font

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
                //  console.log(name);
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


              var ctxL = document.getElementById("lineChart").getContext('2d');
              var myLineChart = new Chart(ctxL, {
                  type: 'line',
                  data: {
                      labels: sortedControlList,
                      datasets: [
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
                  options: {
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
