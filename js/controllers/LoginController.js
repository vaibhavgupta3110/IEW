'use strict';

ApolloApp.controller('LoginController', ['$rootScope', '$scope', '$http', '$timeout','QueryService', '$state', 'Auth', function($rootScope, $scope, $http, $timeout, QueryService, $state, Auth) {
    $scope.name = "";
    $scope.password = "";
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        Metronic.initAjax();
        Metronic.stopPageLoading();
    });
    $scope.login = function () {
        // Ask to the server, do your job and THEN set the user
        //sessionStorage.user = true;
        firebase.auth().signInWithEmailAndPassword($scope.name, $scope.password).then(function(res) {
            Auth.setUser({
                email: $scope.name,
                user: res
            })
            Metronic.goHome();
        }).catch(function(error) {
            alert(error.message)
        });
    };
}]);
