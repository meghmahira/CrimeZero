'use strict'
console.log("Connected Controller");
let mainApp = angular.module('mainApp', ['ngMaterial']);
mainApp.controller("mainCtrl", mainController);

function mainController($scope, $http) {
    $scope.data = {
        "crimeZeroCode": "",
        "loading": false,
        "error": false,
        "success": false,
        "message": null
    };
    $scope.newText = function () {
        $scope.data.crimeZeroCode = "";
        $scope.data.success = false;
        $scope.data.error = false;
        $scope.data.message = null;
    };
    $scope.clearText = function () {
        $scope.data.crimeZeroCode = $scope.data.crimeZeroCode.slice(0, -1);
    };
    $scope.appendCode = function (character) {
        $scope.data.crimeZeroCode += character;
    };
    $scope.sendSos = function () {
        $scope.data.message = null;
        $scope.data.loading = true;
        $http({
            "url": "/sos",
            "method": "GET",
            "headers": {
                "Content-Type": "application/json"
            },
            "params": {"code": encodeURIComponent($scope.data.crimeZeroCode)}
        }).success(function (data) {
            $scope.data.loading = false;
            $scope.data.success = true;
            $scope.data.crimeZeroCode = "";
            $scope.data.message = data.message;
        }).error(function (data) {
            $scope.data.loading = false;
            $scope.data.error = true;
            $scope.data.crimeZeroCode = "";
            $scope.data.message = data.message;
        });
    }
}