'use strict';

angular.module('boozyanalytics.welcome', ['ngRoute'])

.config(['$routeProvider', function($routeProvider){
  $routeProvider.when('/welcome',{
    templateUrl:'welcome/welcome.html',
    controller: 'WelcomeCtrl'
  });
}])

.controller('WelcomeCtrl', ['$scope', 'CommonProp', '$firebaseArray', '$firebaseObject', function($scope, CommonProp, $firebaseArray, $firebaseObject){
	$scope.username = CommonProp.getUser();
  $scope.nameOfUser = CommonProp.getDisplayName();
  $scope.ids = "";
  $scope.names ='';
  if(!$scope.username) {
    $location.path('/home');
  }

  $scope.logout = function(){
    CommonProp.logoutUser();
  }

  var ref = firebase.database().ref();
  var dataRef = $firebaseArray(ref);
  $scope.articles = [];
  $scope.names = [];
  var uid ="";
  var nightCount = "";
  var date = "";
  var time = "";

  dataRef.$loaded()
    .then(function(){
        angular.forEach(dataRef, function(value) {
          angular.forEach(value, function(value, id){
            var substr = id.substr(0,3);
            if(substr == "UID"){
              uid = id.substr(5,id.length);
              //$scope.articles.push({"key":uid})

            }
            angular.forEach(value, function(value, id){
              var idStr = ""+id;
              var substr = idStr.substr(0,11);
              if(substr == "Night Count"){
                nightCount = id.substr(13,idStr.length);
                //$scope.articles.push({"value":nightCount})

              }
              angular.forEach(value, function(value, id){
                angular.forEach(value, function(value,id){
                  var idStr = ""+id;
                  var substr = idStr.substr(0,4);
                  if(substr == "Date"){
                    date = idStr.substr(5,idStr.length);
                    //$scope.articles.push({"date":date})
                  }
                  angular.forEach(value, function(value,id){
                    var idStr = ""+id;
                    if(idStr == "Size"){
                      angular.forEach(value,function(value,id){
                        var idStr = ""+id;
                        var subStr = idStr.substr(0,4);
                        console.log(subStr);
                        if(subStr == "Time"){
                          time = idStr.substr(5,idStr.length);
                          console.log(time);
                          $scope.articles.push({"key":uid,"value":nightCount,"date":date,"time":time})
                        }
                      })

                    }
                  })
                })
                })

              })
            })
            //console.log(id+":"+value);
          })
        /*  $scope.articles.push({
            "key": uid,
            "value": nightCount,
            "date": date*/
            //"time": time
          //})

    });


    /*var temp = [];
    for(var i in values){
      console.log(values[i]);
      temp.push({
        "key":values[i],
        "value":ids[i]
      });
    }

    $scope.articles = temp;*/



  /*dataRef.$loaded().then(function() {
    angular.forEach(dataRef, function(value, key){
      console.log(key + ': ' + value);
    })
    console.log("loaded record:", dataRef.$id, dataRef.$value);

    // To iterate the key/value pairs of the object, use angular.forEach()
    angular.forEach(dataRef, function(value, id) {
      $scope.ids = id;
      $scope.names=value;
      console.log(id, value);
    });
  });*/

/*
  ref.once("value")
    .then(function(snapshot) {
      var name = snapshot.child().val(); // {first:"Ada",last:"Lovelace"}
      console.log(name);
      var uid = snapshot.child("name/first").val(); // "Ada"
      var nightCount = snapshot.child("name").child("last").val(); // "Lovelace"
      var age = snapshot.child("age").val(); // null
    });*/

    jQuery(function ($) {
        $("#exportButton").click(function () {
            // parse the HTML table element having an id=exportTable
            var dataSource = shield.DataSource.create({
                data: "#exportTable",
                schema: {
                    type: "table",
                    fields: {
                        uid: { type: String },
                        nightCount: { type: String },
                    }
                }
            });

            // when parsing is done, export the data to Excel
            dataSource.read().then(function (data) {
                new shield.exp.OOXMLWorkbook({
                    author: "BoozyAnalytics",
                    worksheets: [
                        {
                            name: "BoozyAnalytics Table",
                            rows: [
                                {
                                    cells: [
                                        {
                                            style: {
                                                bold: true
                                            },
                                            type: String,
                                            value: "uid"
                                        },
                                        {
                                            style: {
                                                bold: true
                                            },
                                            type: String,
                                            value: "nightCount"
                                        },
                                    ]
                                }
                            ].concat($.map(data, function(item) {
                                return {
                                    cells: [
                                        { type: String, value: item.uid },
                                        { type: String, value: item.nightCount },
                                    ]
                                };
                            }))
                        }
                    ]
                }).saveAs({
                    fileName: "BoozyAnalytics"
                });
            });
        });
    });

}])
