var app = angular.module('crudApp', ['ngRoute', 'ui.bootstrap', 'ngAnimate', 'colorpicker.module']);

//This configures the routes and associates each route with a view and a controller
app.config(function ($routeProvider) {
    $routeProvider
        .when('/',
            {
                controller: 'CrudController',
                templateUrl: 'app/partials/main.html'
            })
        /*.when('/edit/:id',
            {
                controller: 'CrudController',
                templateUrl: 'app/partials/edit.html'
            })*/
        .otherwise({ redirectTo: '/' });
});