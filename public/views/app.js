'use strict'
console.log("Connected Controller");
let mainApp = angular.module('mainApp', ['ngMaterial']);
mainApp.controller("mainCtrl", mainController);

function mainController($scope, $http) {
    $scope.data = {
        "crimeZeroCode": "",
        "message": ""
    };
    $scope.clearText = function () {
        $scope.data.crimeZeroCode = $scope.data.crimeZeroCode.slice(0, -1);
    };
    $scope.appendCode = function (character) {
        $scope.data.crimeZeroCode += character;
    };
    $scope.sendSos = function () {
        $scope.data.message = "";
        $http({
            "url": "/sos",
            "method": "GET",
            "headers": {
                "Content-Type": "application/json"
            },
            "params": {"code": encodeURIComponent($scope.data.crimeZeroCode)}
        }).success(function (data) {
            $scope.data.crimeZeroCode = "";
            $scope.data.message = data.message;
            console.log(data.message);
        }).error(function (data) {
            $scope.data.crimeZeroCode = "";
            $scope.data.message = data.message;
            console.log(data.message);
        });
    }
}