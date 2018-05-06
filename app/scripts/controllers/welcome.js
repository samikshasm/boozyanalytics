'use strict';

angular.module('angularAppApp.welcome', ['ngRoute'])


.controller('WelcomeCtrl', ['$scope', 'CommonProp', '$firebaseArray', '$firebaseObject', function($scope, CommonProp, $firebaseArray, $firebaseObject){







	$scope.batches = []
	$scope.batchNumber = 0;
	$scope.lastBool = false;
	$scope.firstBool = true;


	//disable back button on browser
	history.pushState(null, null, location.href);
			window.onpopstate = function () {
					history.go(1);
			};

	$scope.username = CommonProp.getUser();
  $scope.ids = "";
  $scope.names ='';
  if(!$scope.username) {
    $location.path('/home');
  }

  $scope.logout = function(){
    CommonProp.logoutUser();
  }

	var config = {
    apiKey: "AIzaSyB0QGhWIaE6wjxO9Y_AJCLXm8h3hJjj34Y",
    authDomain: "slu-capstone-f622b.firebaseapp.com",
    databaseURL: "https://slu-capstone-f622b.firebaseio.com",
    projectId: "slu-capstone-f622b",
    storageBucket: "slu-capstone-f622b.appspot.com",
    messagingSenderId: "931206697482"
  };

  var ref = firebase.database().ref();
  var dataRef = $firebaseArray(ref);
  $scope.articles = [];
	$scope.datas = [];
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
	var mqCounter = 0;
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
								//console.log("control!");
								group = "control"
							}else if(expGroup.includes(uid)){
								group = "experimental";
								//console.log("experimental!");
							}else{
								//console.log("unassigned!")
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
														$scope.datas.push({"key":uid,"group":group,"value":nightCount,"date":date,"time":time, "size":size})

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
														var type = value;
														$scope.articles[typeCounter].type = type;
														$scope.datas[typeCounter].type = type;

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
														$scope.datas[whereCounter].where = where;

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
														$scope.datas[whoCounter].who = who;

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
										$scope.datas.push({"key":uid,"group":group,"value":nightCount,"date":dateStr,"time":timeStr,"latitude":latti, "longitude":longi})


									})
								}
								else if(idStr == "MorningAnswers"){
									angular.forEach(value,function(value,id){
										mqCounter++;
										var idStr = ""+id;
										var timeStr = idStr.substr(11,idStr.length);
										var dateStr = idStr.substr(0,10);
										var anal = "";
										var vaginal = "";
										var oral = "";
										var analCondom = "";
										var vaginalCondom = "";
										var friendPartner = "";
										var monoPartner = "";
										var naPartner = "";
										var newPartner = "";
										var numPartners = 0;
										var cost_total = "";
										var financial = "";
										var health = "";
										var interpersonal = "";
										var stress_event = "";
										var stress_other = "";
										var stress_value = "";
										var trauma = "";
										var work = "";
										mqCounter = mqCounter+whoCounter+locationCounter;
										angular.forEach(value, function(value,id){
											if (id == "vaginal"){
												vaginal = value;
											}
											if(id == "anal"){
												anal = value;
											}
											if(id == "oral"){
												oral = value;
											}
											if(id == "analCondom"){
												analCondom = value;
											}
											if (id == "vaginalCondom"){
												vaginalCondom = value;
											}
											if (id == "FriendPartner"){
												friendPartner = value;
											}
											if (id == "MonogamousPartner"){
												monoPartner = value;
											}
											if (id == "NewPartner"){
												newPartner = value;
											}
											if (id == "NAPartner"){
												naPartner = value;
											}
											if (id == "numPartners"){
												numPartners = value;
											//	console.log(value);
											}
											if(id == 'Cost_Total'){
												cost_total = value;
											}
											if(id == 'Financial'){
												financial = value;
											}
											if(id == "Health"){
												health = value;
											}
											if(id == "Interpersonal"){
												interpersonal = value;
											}
											if(id == 'StressEvent'){
												stress_event = value;
											}
											if(id == "StressOther"){
												stress_other = value;
											}
											if(id == "StressValue"){
												stress_value = value;
											}
											if(id == "Trauma"){
												trauma = value;
											}
											if(id == "Work"){
												work = value;
											}

										})
										typeCounter++;
										whoCounter++;
										whereCounter++;
										$scope.articles.push({"key":uid,"group":group,"value":nightCount,"date":dateStr,"time":timeStr,"oral":oral,"anal":anal,"analCondom":analCondom,"vaginal":vaginal,"vaginalCondom":vaginalCondom, "FriendPartner":friendPartner, "MonogamousPartner":monoPartner,
										"NewPartner":newPartner,"NAPartner":naPartner,"NumPartners":numPartners,"cost_total":cost_total,"financial":financial,
										"health":health, "interpersonal":interpersonal,"stress_event":stress_event, "stress_other":stress_other, "stress_value":stress_value,"trauma":trauma,
										"work":work});
										$scope.datas.push({"key":uid,"group":group,"value":nightCount,"date":dateStr,"time":timeStr,"oral":oral,"anal":anal,"analCondom":analCondom,"vaginal":vaginal,"vaginalCondom":vaginalCondom, "FriendPartner":friendPartner, "MonogamousPartner":monoPartner,
										"NewPartner":newPartner,"NAPartner":naPartner,"NumPartners":numPartners,"cost_total":cost_total,"financial":financial,
										"health":health, "interpersonal":interpersonal,"stress_event":stress_event, "stress_other":stress_other, "stress_value":stress_value,"trauma":trauma,
										"work":work});
									})
								}

                })

              })
            })
            //console.log(id+":"+value);
          })
					var i,j,temparray,chunk = 10;
					for (i=0,j=$scope.articles.length; i<j; i+=chunk) {
					    temparray = $scope.articles.slice(i,i+chunk);
							$scope.batches.push(temparray);
					    // do whatever
					}
					$scope.articles = $scope.batches[0];
					if($scope.batches.length == 1){
						$scope.firstBool=true;
						$scope.lastBool=true;
					}
        /*  $scope.articles.push({
            "key": uid,
            "value": nightCount,
            "date": date*/
            //"time": time
          //})
					$scope.batchNumbers = [];
					var numbers = [];
					for(var i = 0; i < $scope.batches.length; i++){
						if(i == 0){

						}else{
							if(i % 5 == 0){
								numbers.push(i);
								$scope.batchNumbers.push(numbers);
								numbers = [];
							}else{
								numbers.push(i);
							}
						}

					}

    });




		$scope.onFolderNumberKeyPress = function(event){
			var table1 = document.getElementById('exportTable');
			var table2 = document.getElementById('exportTableTwo');
			var pagBtn = document.getElementById('paginationBtns');
			var searchString = $("#btnSearch").val();
			if(searchString == ""){
				table2.style.display = 'none';
				table1.style.display = "";
				pagBtn.style.display = "";
			}else{
				table1.style.display = 'none';
				table2.style.display = "";
				pagBtn.style.display = 'none';

			}
		}


		$scope.switchNumber = function(number){

			var length = $scope.batches.length-1;
			var lengthStr = ""+length;
			if(number == "0"){
				$scope.firstBool = true;
				$scope.lastBool = false;
			}
			else if(number == lengthStr){
				$scope.lastBool = true;
				$scope.firstBool = false;
			}else{
				$scope.lastBool = false;
				$scope.firstBool = false;
			}
			$scope.articles = $scope.batches[number];
			$scope.batchNumber = number;
		}

		$scope.checkBatch = function(index){
			var backwardRange = $scope.batchNumber % 10;
			var forwardRange = 10 - backwardRange;
			//console.log($scope.batchNumber);
			//console.log("backward: " + backwardRange + " forwardRange: "+ forwardRange);

			if(index >= $scope.batchNumber-backwardRange && index <= $scope.batchNumber+forwardRange){
				return true;
			}
			else{
				return false;
			}

			/*
				if(index < $scope.batchNumber+5){
					return true;
				}else{
					return false;
				}
				*/

			/*
			console.log("index of item in list: " + index);
			if(index < 6){
				return true;
			}else{
				return false;
			}
			*/
		}

		$scope.getClass = function(batchNum){
			$scope.activeBatchNumber = batchNum;
			//console.log(batchNum+1);
		}

		$scope.switchBatch = function(number){

			if(number == "-1"){
				if($scope.batchNumber == 1){
					$scope.batchNumber = $scope.batchNumber -1;
					$scope.articles = $scope.batches[$scope.batchNumber];
					$scope.firstBool = true;
					$scope.lastBool = false;


				}else{
					$scope.batchNumber = $scope.batchNumber-1;
					$scope.articles = $scope.batches[$scope.batchNumber];
					$scope.firstBool = false;
					$scope.lastBool = false;
				}

			}if(number == "-2"){
				if($scope.batchNumber+1 == $scope.batches.length-1){
					$scope.articles = $scope.batches[$scope.batchNumber+1];
					$scope.batchNumber = $scope.batches.length-1;
					$scope.lastBool = true;
					$scope.firstBool = false;
				}else{
					$scope.batchNumber = $scope.batchNumber+1;
					$scope.articles = $scope.batches[$scope.batchNumber];
					$scope.firstBool = false;
					$scope.lastBool = false;
				}
			}

		}

		/*$scope.filterFn = function(batch){
		    // Do some tests
		    if(car.carDetails.doors > 2)
		    {
		        return true; // this will be listed in the results
		    }

		    return false; // otherwise it won't be within the results
		};*/

		$('#fileNameModal').on('hidden.bs.modal', function (e) {
			$(this)
				.find("input,textarea,select")
					 .val('')
					 .end()
				.find("input[type=checkbox], input[type=radio]")
					 .prop("checked", "")
					 .end()
				.find('form')[0].reset();

		})

		$scope.getFilename = function(){
			var filename = $('#fileNameText').val();
			//console.log(filename);
			var validFilename = !/[^a-z0-9_.@()-]/i.test(filename);
			if(validFilename == true){
				$scope.exportTable(filename);
			}else{
				$scope.errorMessage = "Filename is badly formatted";
				$('#errorMsg').html($scope.errorMessage);
				$(document).ready(function(){
						$("#errorModalUser").modal();
				});
				console.log("error");
			}

		}

		$scope.exportTable = function(filename){
			var fileName = filename;
			if(fileName){
				$('#fileNameModal').modal('hide');
				var dataSource = shield.DataSource.create({
						data: "#exportTableTwo",
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
										longitude: {type: String},
										oral: {type:String},
										anal: {type:String},
										analCondom: {type:String},
										vaginal: {type:String},
										vaginalCondom: {type:String},
										friendPartner: {type:String},
										monogamousPartner: {type:String},
										newPartner: {type:String},
										naPartner: {type:String},
										numPartners: {type:String},
										cost_total: {type: String},
										financial: {type: String},
										health: {type: String},
										interpersonal: {type: String},
										stress_event: {type: String},
										stress_other: {type: String},
										stress_value: {type: String},
										trauma: {type: String},
										work: {type: String}
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
																		},
																		{
																			style: {
																				bold: true
																			},
																			type: String,
																			value: "oral"
																		},
																		{
																			style: {
																				bold: true
																			},
																			type: String,
																			value: "anal"
																		},
																		{
																			style: {
																				bold: true
																			},
																			type: String,
																			value: "analCondom"
																		},
																		{
																			style: {
																				bold: true
																			},
																			type: String,
																			value: "vaginal"
																		},
																		{
																			style: {
																				bold: true
																			},
																			type: String,
																			value: "vaginalCondom"
																		},
																		{
																			style: {
																				bold: true
																			},
																			type: String,
																			value: "friendPartner"
																		},
																		{
																			style: {
																				bold: true
																			},
																			type: String,
																			value: "monogamousPartner"
																		},
																		{
																			style: {
																				bold: true
																			},
																			type: String,
																			value: "newPartner"
																		},
																		{
																			style: {
																				bold: true
																			},
																			type: String,
																			value: "naPartner"
																		},
																		{
																			style: {
																				bold: true
																			},
																			type: String,
																			value: "numPartners"
																		},
																		{
																			style: {
																				bold: true
																			},
																			type: String,
																			value: "cost_total"
																		},
																		{
																			style: {
																				bold: true
																			},
																			type: String,
																			value: "financial"
																		},
																		{
																			style: {
																				bold: true
																			},
																			type: String,
																			value: "health"
																		},
																		{
																			style: {
																				bold: true
																			},
																			type: String,
																			value: "interpersonal"
																		},
																		{
																			style: {
																				bold: true
																			},
																			type: String,
																			value: "stress_event"
																		},
																		{
																			style: {
																				bold: true
																			},
																			type: String,
																			value: "stress_other"
																		},
																		{
																			style: {
																				bold: true
																			},
																			type: String,
																			value: "stress_value"
																		},
																		{
																			style: {
																				bold: true
																			},
																			type: String,
																			value: "trauma"
																		},
																		{
																			style: {
																				bold: true
																			},
																			type: String,
																			value: "work"
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
																		{type:String, value: item.longitude},
																		{type:String, value: item.oral},
																		{type:String, value: item.anal},
																		{type:String, value: item.analCondom},
																		{type:String, value: item.vaginal},
																		{type:String, value: item.vaginalCondom},
																		{type:String, value: item.friendPartner},
																		{type:String, value: item.monogamousPartner},
																		{type:String, value: item.newPartner},
																		{type:String, value: item.naPartner},
																		{type:String, value: item.numPartners},
																		{type:String, value: item.cost_total},
																		{type:String, value: item.financial},
																		{type:String, value: item.health},
																		{type:String, value: item.interpersonal},
																		{type:String, value: item.stress_event},
																		{type:String, value: item.stress_other},
																		{type:String, value: item.stress_value},
																		{type:String, value: item.trauma},
																		{type:String, value: item.work}
																]
														};
												}))
										}
								]
						}).saveAs({
								fileName: fileName
						});
				});
			}else{
				$scope.errorMessage = "Please enter a filename";
				$('#errorMsg').html($scope.errorMessage);
				$(document).ready(function(){
						$("#errorModalUser").modal();
				});
				console.log("error");
			}
			//var fileName = "BoozyAnalytics";
		}
}])
