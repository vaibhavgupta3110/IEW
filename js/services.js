ApolloApp.factory('QueryService', [
      '$http', '$q', QueryService
    ]);

  //////////////// factory

var baseURL = "apollo-stats-backend.herokuapp.com";

  function QueryService($http, $q) {

    var service = {
      query: query,
      post: post
    };

    return service;


    //////////////// definition


    function query(method, url, params, data) {

      var deferred = $q.defer();

      $http({
        method: method,
        url: "http://" + baseURL + url,
        params: params,
        data: data
      }).then(function(data) {
        if (!data.config) {
          console.log('Server error occured.');
        }
        deferred.resolve(data);
      }, function(error) {
        deferred.reject(error);
      });

      return deferred.promise;
    }

    function post(url, data) {
      var deferred = $q.defer();
      Metronic.startPageLoading({animate:true});
      $http({
        method: 'POST',
        url: "http://" + baseURL + url,
        data: data
      }).then(function(data) {
        Metronic.stopPageLoading();
        if (!data.config) {
          console.log('Server error occured.');
        }
        deferred.resolve(data);
      }, function(error) {
        deferred.reject(error);
      });

      return deferred.promise;
    }

  }

