'use strict';

ApolloApp.controller('FunctionsController', ['$rootScope', '$scope', '$http', '$timeout','QueryService', '$firebaseObject', function($rootScope, $scope, $http, $timeout, QueryService, $firebaseObject) {
    var userRef = firebase.database().ref('/users');
    var userObj = $firebaseObject(userRef);

    var activeRef = firebase.database().ref('/active');
    var activeObj = $firebaseObject(activeRef);

    var stageRef = firebase.database().ref('/stages');
    var stageObj = $firebaseObject(stageRef);

    var timeRef = firebase.database().ref('/timestart');
    var timeObj = $firebaseObject(timeRef);

    var startTime = 0;

    var texts = [['Screaming Noise', 'Flickering Lights', 'Banging Door', 'Scratching Walls'], ['Thunder and Lightning', 'Blackout', 'Closet Monster', 'Ghost Scare'], ['Writing on the Wall', 'Trap Door Opening', 'Mysterious Voices', 'Spiders']];
    var bigImages = [['scream-big', 'light-big', 'door-big', 'wall-big'], ['thunder-big', 'blackout-big', 'closet-big', 'ghost-big']];
    var smallImages = [['thunder', 'blackout', 'closet', 'ghost'], ['writing', 'trap', 'mysterious', 'spiders']];


    $scope.leftMin = 2;
    $scope.leftSec = '00';

    $scope.texts = texts;
    $scope.bigImages = bigImages;
    $scope.smallImages = smallImages;
    $scope.backColor = "#6f8183";
    
    userObj.$watch(function() {
        $scope.totalUser = userObj.total;
    });

    activeObj.$watch(function() {
        $scope.activeStage = activeObj.$value;
    });

    stageObj.$watch(function() {
        var stageInd = 'stage-' + $scope.activeStage;
        $scope.stage = stageObj[stageInd];
    });

    timeObj.$watch(function() {
        startTime = timeObj.$value;
    })

    $scope.unlockStage = function (ind) {
        if(ind < 3) {
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
            timer = setInterval(intervalFunc, 1000);
        }
    }

    var intervalFunc = function() {
        var now = Date.now();
        
        if ( stageObj['stage-'+$scope.activeStage]) {
            
            if(stageObj['stage-'+$scope.activeStage]['status'] != 'start' && stageObj['stage-'+$scope.activeStage]['status'].indexOf('finished') == -1) {
                $scope.leftMin = 2;
                $scope.leftSec = '00';
                $scope.backColor = "#6f8183";
            } else {
                if(startTime > 0 && (now - startTime) < 121 * 1000){
                    var timeLeft = 120 - parseInt(now / 1000 - startTime / 1000);
                    $scope.backColor = "#ff0000";
                    
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
                        }, 5 * 1000);
                    }
                }
                if(startTime > 0 && (now - startTime) >= 125 * 1000 && (now - startTime) <= 246 * 1000){
                    var timeLeft = 245 - parseInt(now / 1000 - startTime / 1000);
                    $scope.backColor = "#ffff00";
                    $scope.leftMin = parseInt(timeLeft / 60);
                    $scope.leftSec = (timeLeft % 60) > 9 ? (timeLeft % 60) : '0' + (timeLeft % 60);
                    $scope.$apply();
                }
                if (startTime > 0 && (now - startTime) > 250 * 1000 && stageObj['stage-'+$scope.activeStage] && stageObj['stage-'+$scope.activeStage]['status'].indexOf('finished') >= 0) {
                    $scope.backColor = "#6f8183";
                    clearInterval(timer)
                }
            }
        }
    }

    var timer = setInterval(intervalFunc, 1000);

    $scope.resetStage = function() {
        activeObj.$value = 1;
        
        stageObj['stage-1'] = {
            func1: 0,
            func2: 0,
            func3: 0,
            func4: 0,
            func1user:"",
            func2user:"",
            func3user:"",
            func4user:"",
            status: 'ready'
        }
        timeObj.$value = 1;
        activeObj.$save();
        stageObj.$save();
        timeObj.$save();
        $scope.leftMin = 2;
        $scope.leftSec = '00';
        clearInterval(timer);
    }
}]);
