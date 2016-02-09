// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'restangular', 'ngCordova','base64'])

  .config(function (RestangularProvider) {
    RestangularProvider.addResponseInterceptor(function (data, operation) {
      var extractedData;
      if (operation === "getList") {
        if (angular.isDefined(data._embedded['rh:doc'])) {
          extractedData = data._embedded['rh:doc'];
        } else if (angular.isDefined(data._embedded['rh:file'])) {
          extractedData = data._embedded['rh:file'];
        } else {
          extractedData = [];
        }

        if (angular.isDefined(data._embedded['rh:warnings'])) {
          extractedData._warnings = data._embedded['rh:warnings'];
        }

        extractedData._returned = data._returned;
        extractedData._size = data._size;
        extractedData._total_pages = data._total_pages;
        extractedData._links = data._links;
      } else {
        extractedData = data;
      }

      return extractedData;
    });
    //set the base url for api calls on our RESTful services
    RestangularProvider.setBaseUrl('http://192.168.99.100:8080/ari');

  })


  .controller('MainController', ['$scope', 'Restangular', '$cordovaGeolocation','$base64',
    function ($scope, Restangular, $cordovaGeolocation, $base64) {

      //configure restangular authorization
      var username = 'admin';
      var password = 'changeit';
      var encoded = $base64.encode(username + ":" + password);
      Restangular.setDefaultHeaders({ Authorization: 'Basic ' + encoded });

      //get geolocation position
      var lat, long;
      $scope.showSpinner = true;
      var posOptions = {timeout: 15000, enableHighAccuracy: false};
      $cordovaGeolocation
        .getCurrentPosition(posOptions)
        .then(function (position) {
          lat = position.coords.latitude;
          long = position.coords.longitude;
          $scope.lat = lat;
          $scope.long = long;
          $scope.showSpinner = false;
        }, function (err) {
          // default coordinate if error occurred: Milan coordinate
          lat = "45.463194";
          long = "9.187000";
          $scope.showSpinner = false;
        })
        .then(function () {
          //create the map
          var map = L.map('map').setView([lat, long], 5);
          L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          }).addTo(map);
          //get the mongodb data from restheart
          Restangular.all('poi').getList().then(function (result) {
            _.each(result, function (x) {
              //add markers into the map
              L.marker([x.lat, x.lng]).addTo(map)
                .bindPopup(x._id);
            })
          }, function (err) {
            console.log("Error while trying to get the markers data");
          });
        }, function (err) {
          // error
        });

    }])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })
