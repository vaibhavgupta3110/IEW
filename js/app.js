/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var ApolloApp = angular.module("ApolloApp", [
    "ui.router", 
    "ui.bootstrap", 
    "oc.lazyLoad",  
    "ngSanitize",
    "LocalStorageModule",
    "firebase"
]); 

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
ApolloApp.config(['$ocLazyLoadProvider','localStorageServiceProvider', function($ocLazyLoadProvider, localStorageServiceProvider) {
    
    $ocLazyLoadProvider.config({
        // global configs go here
    });
    localStorageServiceProvider.setPrefix('ApolloApp');
}]);

/* Setup global settings */
ApolloApp.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        layoutImgPath: Metronic.getAssetsPath() + 'admin/layout/img/',
        layoutCssPath: Metronic.getAssetsPath() + 'admin/layout/css/'
    };

    $rootScope.settings = settings;

    return settings;
}]);


 


/* Setup App Main Controller */
ApolloApp.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {
        Metronic.initComponents(); // init core components
        // Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
ApolloApp.controller('HeaderController', ['$scope', 'Auth', '$state', '$interval', function($scope, Auth, $state, $interval) {
    $scope.$on('$includeContentLoaded', function() {
        // Layout.initHeader(); // init header
    });

    $scope.logOut = function(){
        Auth.removeUser();
        Metronic.goHome();
    }

    $interval(function(){ str = (new Date()).toUTCString(); $scope.timenow = str.substr(0, str.length - 4); }, 1000);
}]);

/* Setup Layout Part - Sidebar */
ApolloApp.controller('SidebarController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar(); // init sidebar
    });
}]);


/* Setup Layout Part - Footer */
ApolloApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);

/* Setup Rounting For All Pages */
ApolloApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/functions");  
    
    $stateProvider

        // Login
        .state('Login', {
            url: "/Login",
            templateUrl: "views/Login.html",            
            data: {pageTitle: 'New Users by Day'},
            controller: "LoginController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'ApolloApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '/library/css/login.css',
                            
                            '/library/scripts/index3.js',
                            '/library/scripts/tasks.js',

                             'js/controllers/LoginController.js'
                        ] 
                    });
                }]
            }
        })

        .state('Functions', {
            url: "/functions",
            templateUrl: "views/Functions.html",            
            data: {pageTitle: 'Functions'},
            controller: "FunctionsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'ApolloApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [

                            '/library/scripts/index3.js',
                            '/library/scripts/tasks.js',

                             'js/controllers/FunctionsController.js'
                        ] 
                    });
                }]
            }
        })
        .state('News', {
            url: "/news",
            templateUrl: "views/News.html",            
            data: {pageTitle: 'News'},
            controller: "NewsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'ApolloApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [

                            '/library/scripts/index3.js',
                            '/library/scripts/tasks.js',
                            'js/controllers/NewsController.js'
                        ] 
                    });
                }]
            }
        })
        .state('Pay', {
            url: "/pp",
            templateUrl: "views/Pay.html",            
            data: {pageTitle: 'Pay for play'},
            controller: "PayController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'ApolloApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [

                            '/library/scripts/index3.js',
                            '/library/scripts/tasks.js',
                            'js/controllers/PayController.js'
                        ] 
                    });
                }]
            }
        })
        .state('Settings', {
            url: "/settings",
            templateUrl: "views/Settings.html",            
            data: {pageTitle: 'Settings'},
            controller: "SettingsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'ApolloApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [

                            '/library/scripts/index3.js',
                            '/library/scripts/tasks.js',
                            'js/controllers/SettingsController.js'
                        ] 
                    });
                }]
            }
        })
}]);

/* Init global settings and run the app */
ApolloApp.run(["$rootScope", "settings", "$state", '$location', 'Auth', function($rootScope, settings, $state, $location, Auth) {
    $rootScope.$state = $state; // state to be accessed from view
    
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        $rootScope.loggedIn = Auth.isLoggedIn();
        if (!Auth.isLoggedIn() && toState.name != "Login") {
            event.preventDefault();
            $state.go('Login');
        }
        if (Auth.isLoggedIn() && toState.name == "Login") {
            event.preventDefault();
            $state.go('Newusers');
        }
    });
}]);