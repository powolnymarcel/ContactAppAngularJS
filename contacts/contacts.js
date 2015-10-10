'use strict';

angular.module('contactsApp.contacts', ['ngRoute','firebase'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/contacts', {
    templateUrl: 'contacts/contacts.html',
    controller: 'contactsCtrl'
  });
}])

.controller('contactsCtrl', ['$scope','$firebaseArray','$timeout',function($scope,$firebaseArray,$timeout) {
      var ref = new Firebase("https://contactappangularjs.firebaseio.com/");

      //Aller chercher les contacts
      $scope.contacts = $firebaseArray(ref);



      //Montrer le formulaire
      $scope.showAddForm = function(){
        $scope.addFormShow= true;
        $scope.editFormShow= false;
        clearFields();
      }

      //Montrer le formulaire EDIT

      $scope.showEditForm = function(contact){
        console.log(contact);
        $scope.addFormShow= false;
        $scope.editFormShow= true;
        $scope.contactShow= false;

        clearFields();
        $scope.id                        = contact.$id;
        $scope.firstname                 = contact.firstname;
        $scope.lastname                  = contact.lastname;
        $scope.company                   = contact.company;
        $scope.email                     = contact.email;
        $scope.tel                       = contact.phones[0].tel;
        $scope.telperso                  = contact.phones[0].telperso;

      }

     // Cacher le formulaire
      $scope.hide= function(){
        $scope.addFormShow= false;
        $scope.contactShow= false;
        $scope.editFormShow= false;
      }

      //Envoyer le contact
      $scope.addFormSubmit=function(){
        console.log('Contact sauvegardé');
        if($scope.firstname){ var firstname   =$scope.firstname;}else{var firstname ="Non communiqué !";};
        if($scope.lastname){  var lastname    =$scope.lastname;}else{var lastname ="Non communiqué !";};
        if($scope.company) {  var company     =$scope.company;}else{var company ="Non communiqué !";};
        if($scope.tel)     {  var tel         =$scope.tel;}else{var tel ="Non communiqué !";};
        if($scope.telperso){  var telperso    =$scope.telperso;}else{var telperso ="Non communiqué !";};
        if($scope.email)   {  var email       =$scope.email;}else{var email ="Non communiqué !";};

        //Construire l'obet'
        $scope.contacts.$add({
          firstname:firstname,
          lastname:lastname,
          company:company,
          phones:[
            {
              tel: tel,
              telperso:telperso
            }
          ],
          email:email
        }).then(function(ref){
          var id= ref.key();
          console.log('contact ajouté avec id ' + id)


          //Effacer le formu
          clearFields();

          //  Cacher le formu
          $scope.addFormShow=false;
          $scope.msg="contact Added";
          $timeout(function(){
            $scope.startFade = true;
          }, 1400);
          $timeout(function(){
            $scope.startFade = false;
            $scope.msg = false;
          }, 2400);
        });
      }

      $scope.editFormSubmit=function(){
        console.log('contact edité');
        var id = $scope.id;
        // Get recorde from id
        var record = $scope.contacts.$getRecord(id);
        //Assigner les valeurs
        record.firstname          = $scope.firstname;
        record.lastname           = $scope.lastname;
        record.company            = $scope.company;
        record.phones[0].tel      = $scope.tel;
        record.phones[0].telperso = $scope.telperso;
        record.email              = $scope.email;

        //Sauvegarder le contact
        $scope.contacts.$save(record).then(function(ref){
          console.log(ref.key);
          clearFields();

          //cacher le formulaire edit
          $scope.editFormShow=false;
          $scope.msg="Contact updated !";
          $timeout(function(){
            $scope.startFade = true;
          }, 1400);
          $timeout(function(){
            $scope.startFade = false;
            $scope.msg = false;
          }, 2400);
        })
      }



      $scope.showContact=function(contact){
        console.log('show info');
        $scope.firstname = contact.firstname;
        $scope.lastname = contact.lastname;
        $scope.company = contact.company;
        $scope.tel = contact.phones[0].tel;
        $scope.telperso = contact.phones[0].telperso;
        $scope.email = contact.email;

        $scope.contactShow=true;
        $scope.editFormShow=false;

      }


      $scope.deleteContact= function(contact){

        if(confirm('Etes-vous certain de vouloir supprimer :' +contact.firstname+' ?')){
          console.log('contact deleted');
          $scope.contactShow= false;
          $scope.editFormShow= false;

          $scope.contacts.$remove(contact);
          $scope.msg="Contact deleted !";
          $timeout(function(){
            $scope.startFade = true;
          }, 1400);
          $timeout(function(){
            $scope.startFade = false;
            $scope.msg = false;
          }, 2400);
        }

      }


     // Effacer les input
      function clearFields(){
        $scope.firstname='';
        $scope.lastname='';
        $scope.company='';
        $scope.telperso='';
        $scope.tel='';
        $scope.email='';
      }
    }]);