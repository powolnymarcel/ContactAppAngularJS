'use strict';

// Declare app level module which depends on views, and components
angular.module('contactsApp', [
  'ngRoute',
    'firebase',
    'contactsApp.contacts'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/contacts'});
}]);
