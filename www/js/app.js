// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
}).config(function($stateProvider,$urlRouterProvider){
  //creating routes through state methods of $stateProvider
  $stateProvider
  .state('login',{
    url:'/login',
    templateUrl:'templates/login.html',
    controller:'LoginCtrl'
  })
  .state('app',{
      url:'/app',
      templateUrl:'templates/app.html',
      controller:'AppCtrl'
    })
    .state('register',{
        url:'/register',
        templateUrl:'templates/register.html',
        controller:'RegisterCtrl'
      })
      //.state()
      //.state()

  $urlRouterProvider.otherwise('/login');

}).factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    var ref = new Firebase("https://seekemployee.firebaseio.com/");
    return $firebaseAuth(ref);
  }
]).controller('LoginCtrl',function($scope,$state,$firebaseObject,$firebaseAuth){

  //creating a ref to our database
  var ref = new Firebase("https://seekemployee.firebaseio.com/");

  //download the data into a local object
    var $syncObject = $firebaseObject(ref);

  //sync the object with a three-way data-binding
  $syncObject.$bindTo($scope,"data");

//do some validation here using simple firebase API(without $firebaseAuth)
  $scope.validate=function(){

      ref.authWithPassword({
        email: $scope.email,
        password:$scope.password
         }, function(error, authData) {
           if (error) {
             console.log("Login Failed!", error);
           } else {
   console.log("Authenticated successfully with payload:", authData);
   //allow to go to app state
       $state.go('app');
   }
     });

  }

//do some validation here using Angularfire API(with $firebaseAuth)
// let's create a re-usable factory that generates the $firebaseAuth instance(see adding factory to module)
/*
  $scope.validate=function(){


  }
  */
}).controller('AppCtrl',function($scope){
  //creating a rating Arr property to our scope object consisting of 5 objects with two properties:value and icon each
  $scope.ratingArr= [{
    value:1,
    icon:'ion-ios-star-outline'
  },{
    value:2,
    icon:'ion-ios-star-outline'
  },{
    value:3,
    icon:'ion-ios-star-outline'
  },{
    value:4,
    icon:'ion-ios-star-outline'
  },{
    value:5,
    icon:'ion-ios-star-outline'
  }];

  //creating a method for our scope object called setRating
  $scope.setRating = function(val){
    var rtgs = $scope.ratingArr;
    for(var i=0;i<rtgs.length;i++){
      if(i<val){
        rtgs[i].icon='ion-ios-star';
      }
      else{
        rtgs[i].icon='ion-ios-star-outline';
      }
    }
  };
}).controller('RegisterCtrl', ["$scope","Auth","$firebaseArray",
function($scope,Auth,$firebaseArray){
   $scope.createUser = function(){
     $scope.message = null;
     $scope.error= null;
    // Auth.$createUser().then().catch();
    Auth.$createUser({
        email: $scope.email,
        password: $scope.password
      }).then(function(userData) {
        $scope.message = "User created with uid: " + userData.uid;
         //console.log($scope.email)
        //creating a ref to our database
        var ref = new Firebase("https://amanchat.firebaseio.com/");

        var usersRef = ref.child("users");
        $scope.users = $firebaseArray(usersRef);

        $scope.users.$add({
             email:$scope.email,
             full_name:"",
             phone_number:""
        });
        /*
  usersRef.set({
      amansingh: {
      email: $scope.email,
      full_name: "Alan Turing"
    },
    alex: {
      date_of_birth: "December 9, 1906",
      full_name: "Grace Hopper"
    }
  });
  */


      //  $state.go('login');//go to login state if successfully created
      }).catch(function(error) {
        $scope.error = error;
      });
   };


   //you can remove user as well ..see documentation
}])
