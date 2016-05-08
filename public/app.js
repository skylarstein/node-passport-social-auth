angular.module('app', ['ngRoute'])

.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
    .when('/', {
      templateUrl: 'home.html',
      controller: 'homeCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
}])

.controller('homeCtrl', ['$scope', '$rootScope', '$window', 'profile',
  function($scope, $rootScope, $window, profile) {
    function init() {
      profile.get();
    }

    $scope.login = function(strategy) {
      $window.location.href = '/auth/' + strategy;
    };

    $scope.logout = function() {
      profile.logout();
    };

    init();
  }
])

.factory('profile', ['$http', '$rootScope', function($http, $rootScope) {
  return {
    get: function() {
      $http.get('/profile')
      .then(function(response) {
        $rootScope.currentUser = response.data;
      }, function(err) {
        $rootScope.currentUser = null;
      });
    },
    logout: function() {
      $http.get('/auth/logout').finally(function() {
        $rootScope.currentUser = null;
      });
    }
  }

}]);