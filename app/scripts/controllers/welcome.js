'use strict';

angular.module('angularAppApp.welcome', ['ngRoute','angularUtils.directives.dirPagination'])


.controller('WelcomeCtrl', ['$scope', 'CommonProp', '$firebaseArray', '$firebaseObject', function($scope, CommonProp, $firebaseArray, $firebaseObject){



	//disable back button on browser
	history.pushState(null, null, location.href);
			window.onpopstate = function () {
					history.go(1);
			};

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
  var size = "";
  var type = "";
  var where = "";
  var who = "";
  var typeCounter = 0;
  var whoCounter = 0;
  var whereCounter = 0;
	var locationCounter = 0;
	var controlGroup = [];
	var expGroup = [];

	var locations = [];
	var group = "";

	$scope.activeTab = 'dogs'

  $scope.setActiveTab = function (val) {
  	$scope.activeTab = val
  }

  dataRef.$loaded()
    .then(function(){
        angular.forEach(dataRef, function(value) {
          angular.forEach(value, function(value, id){
						var idStr = ""+id;
						if (idStr == "Control Group"){
							angular.forEach(value, function(value, id){
								controlGroup.push(id+"");
							})
						}if(idStr == "Experimental Group"){
							angular.forEach(value, function(value, id){
								expGroup.push(id);
							})
						}
            var substr = id.substr(0,3);
            if(substr == "UID"){
              uid = id.substr(5,id.length);
							if(controlGroup.includes(uid)){
								console.log("control!");
								group = "control"
							}else if(expGroup.includes(uid)){
								group = "experimental";
								console.log("experimental!");
							}else{
								console.log("unassigned!")
								group = "unassigned";
							}
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
								var idStr = ""+id;
								if(idStr == "Answers"){
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
													if(subStr == "Time"){
														time = idStr.substr(5,idStr.length);
														size = value;
														$scope.articles.push({"key":uid,"group":group,"value":nightCount,"date":date,"time":time, "size":size})
													}
												})
											}
											if(idStr == "Type"){
												var counter = 0;
												angular.forEach(value,function(value,id){
													var idStr = ""+id;
													var subStr = idStr.substr(0,4);
													if(subStr == "Time"){
														time = idStr.substr(5,idStr.length);
														type = value;
														$scope.articles[typeCounter].type = type;
														typeCounter++;
													}
												})
											}
											if(idStr == "Where"){
												var counter = 0;
												angular.forEach(value,function(value,id){
													var idStr = ""+id;
													var subStr = idStr.substr(0,4);
													if(subStr == "Time"){
														time = idStr.substr(5,idStr.length);
														where = value;
														$scope.articles[whereCounter].where = where;
														whereCounter++;
													}
												})
											}
											if(idStr == "Who"){
												var counter = 0;
												angular.forEach(value,function(value,id){
													var idStr = ""+id;
													var subStr = idStr.substr(0,4);
													if(subStr == "Time"){
														time = idStr.substr(5,idStr.length);
														who = value;
														$scope.articles[whoCounter].who = who;
														whoCounter++;
													}
												})
											}
										})
									})
								}else if(idStr == "Location"){
									angular.forEach(value,function(value,id){
										locationCounter++;
										var idStr = ""+id;
										var timeStr = idStr.substr(16,idStr.length);
										var dateStr = idStr.substr(5,11);
										locationCounter = locationCounter+whoCounter;
										var locationStr = value+"";
										var pos = locationStr.indexOf("&");
										var latti = locationStr.substr(0, pos);
										var longi = locationStr.substr(pos+1, locationStr.length);
										typeCounter++;
										whoCounter++;
										whereCounter++;
										$scope.articles.push({"key":uid,"group":group,"value":nightCount,"date":dateStr,"time":timeStr,"latitude":latti, "longitude":longi})
									})
								}

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
						var fileName = "BoozyAnalytics";

            var dataSource = shield.DataSource.create({
                data: "#exportTable",
                schema: {
                    type: "table",
                    fields: {
                        uid: { type: String },
												group: { type: String},
                        nightCount: { type: String },
                        date: { type: String},
                        time: { type: String},
                        size: { type: String},
                        type: { type: String},
                        where: { type: String},
                        who: { type: String},
												latitude: {type: String},
												longitude: {type: String}
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
																					style:{
																						bold:true
																					},
																					type: String,
																					value: "group"
																				},
                                        {
                                            style: {
                                                bold: true
                                            },
                                            type: String,
                                            value: "nightCount"
                                        },
                                        {
                                            style: {
                                                bold: true
                                            },
                                            type: String,
                                            value: "date"
                                        },
                                        {
                                            style: {
                                                bold: true
                                            },
                                            type: String,
                                            value: "time"
                                        },
                                        {
                                            style: {
                                                bold: true
                                            },
                                            type: String,
                                            value: "size"
                                        },
                                        {
                                            style: {
                                                bold: true
                                            },
                                            type: String,
                                            value: "type"
                                        },
                                        {
                                            style: {
                                                bold: true
                                            },
                                            type: String,
                                            value: "where"
                                        },
                                        {
                                            style: {
                                                bold: true
                                            },
                                            type: String,
                                            value: "who"
                                        },
																				{
																					style: {
																						bold: true
																					},
																					type: String,
																					value: "latitude"
																				},
																				{
																					style: {
																						bold: true
																					},
																					type: String,
																					value: "longitude"
																				}
                                    ]
                                }
                            ].concat($.map(data, function(item) {
                                return {
                                    cells: [
                                        { type: String, value: item.uid },
																				{ type: String, value: item.group},
                                        { type: String, value: item.nightCount },
                                        { type: String, value: item.date},
                                        {type: String, value: item.time},
                                        {type:String, value: item.size},
                                        {type:String, value: item.type},
                                        {type:String, value: item.where},
                                        {type:String, value: item.who},
																				{type:String, value: item.latitude},
																				{type:String, value: item.longitude}
                                    ]
                                };
                            }))
                        }
                    ]
                }).saveAs({
                    fileName: fileName
                });
            });
        });
    });


}])
