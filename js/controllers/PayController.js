'use strict';

ApolloApp.controller('PayController', ['$rootScope', '$scope', '$http', '$timeout','QueryService', '$firebaseObject', function($rootScope, $scope, $http, $timeout, QueryService, $firebaseObject) {
    var userRef = firebase.database().ref('/users');
    var userObj = $firebaseObject(userRef);

    var activeRef = firebase.database().ref('/active');
    var activeObj = $firebaseObject(activeRef);

    var stageRef = firebase.database().ref('/stages');
    var stageObj = $firebaseObject(stageRef);

    var timeRef = firebase.database().ref('/timestart');
    var timeObj = $firebaseObject(timeRef);

    var startTime = 0;

    $scope.leftMin = 2;
    $scope.leftSec = '00';
    
    userObj.$watch(function() {
        $scope.totalUser = userObj.total;
    });

    activeObj.$watch(function() {
        $scope.activeStage = activeObj.$value;
    });

    stageObj.$watch(function() {
        var stageInd = 'stage-' + $scope.activeStage;
        $scope.stage = stageObj[stageInd];
        console.log($scope.stage);
        console.log(stageObj);
        
    });

    timeObj.$watch(function() {
        startTime = timeObj.$value;
    })

    $scope.unlockStage = function (ind) {
        activeObj.$value = ind;
        
        stageObj['stage-'+ind] = {
            func1: 0,
            func2: 0,
            func3: 0,
            func4: 0,
            func1user:"",
            func2user:"",
            func3user:"",
            func4user:"",
            status: 'start'
        }
        timeObj.$value = Date.now();
        activeObj.$save();
        stageObj.$save();
        timeObj.$save();
    }

    var intervalFunc = function() {
        var now = Date.now();
        if(startTime > 0 && (now - startTime) < 121 * 1000){
            var timeLeft = 120 - parseInt(now / 1000 - startTime / 1000);
            $scope.leftMin = parseInt(timeLeft / 60);
            $scope.leftSec = (timeLeft % 60) > 9 ? (timeLeft % 60) : '0' + (timeLeft % 60);
            $scope.$apply();
            if(timeLeft == 0) {
                setTimeout(function() {
                    var max = $scope.stage.func1;
                    var ind = 1;
                    if (max < $scope.stage.func2) {
                        max = $scope.stage.func2
                        ind = 2;
                    }
                    if (max < $scope.stage.func3) {
                        max = $scope.stage.func3
                        ind = 3;
                    }
                    if (max < $scope.stage.func4) {
                        max = $scope.stage.func4
                        ind = 4;
                    }
                    stageObj['stage-'+$scope.activeStage]['status'] = 'finished-' + ind;
                    stageObj.$save();
                }, 15 * 1000);
            }
        }
    }

    var timer = setInterval(intervalFunc, 1000);
}]);
