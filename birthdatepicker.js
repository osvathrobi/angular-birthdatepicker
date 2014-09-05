'use strict';

angular.module('angular-birthdatepicker', [])


.factory('utils', function() {


    // validate if entered values are a real date
    function validateDate(date) {

        // store as a UTC date as we do not want changes with timezones        
        var d = new Date(Date.UTC(date.year, (parseInt(date.month, 10) - 1), date.day));
        console.log('checkinggg', date, d);
        return d && ((d.getMonth() + 1) === date.month && d.getDate() === Number(date.day));
    }

    // reduce the day count if not a valid date (e.g. 30 february)
    function changeDate(date) {
        var d = new Date(Date.UTC(date.year, parseInt(date.month, 10) - 1, date.day));

        console.log('Changind date to', d);

        date.year = d.getFullYear();
        date.month = d.getMonth() + 1;
        date.day = d.getDate();

        return date;
    }

    var self = this;
    this.days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
    this.months = [{
        value: 1,
        name: 'January'
    }, {
        value: 2,
        name: 'February'
    }, {
        value: 3,
        name: 'March'
    }, {
        value: 4,
        name: 'April'
    }, {
        value: 5,
        name: 'May'
    }, {
        value: 6,
        name: 'June'
    }, {
        value: 7,
        name: 'July'
    }, {
        value: 8,
        name: 'August'
    }, {
        value: 9,
        name: 'September'
    }, {
        value: 10,
        name: 'October'
    }, {
        value: 11,
        name: 'November'
    }, {
        value: 12,
        name: 'December'
    }];

    return {
        checkDate: function(date) {
            console.log('checkDate()', date);

            if (!date.day || !date.month || !date.year) {
                return false;
            }

            console.log('validateDate()', validateDate(date));

            if (validateDate(date)) {
                // update the model when the date is correct
                return date;
            } else {
                // change the date on the scope and try again if invalid
                return this.checkDate(changeDate(date));
            }
        },
        get: function(name) {
            return self[name];
        }
    };
})

.directive('birthdatepicker', ['utils', '$timeout',
    function(utils, $timeout) {
        return {
            restrict: 'A',
            replace: true,
            require: 'ngModel',
            scope: {
                model: '=ngModel'
            },
            controller: ['$scope', 'utils',
                function($scope, utils) {
                    // set up arrays of values
                    $scope.days = utils.get('days');
                    $scope.months = utils.get('months');

                    // split the current date into sections
                    $scope.dateFields = {};

                    // get UTC version of the date - use case is a birthday as datepickers do not work well for birthdays
                    // if timezones are important raise a pull request and include the use case.             

                    var daysInMonth = function(year, month) {
                        return new Date(year, month, 0).getDate();
                    }

                    $scope.$watch('model', function(newDate, oldDate) {
                        console.log('model changed', newDate, oldDate);

                        if (!newDate) {
                            var td = new Date();
                            newDate = td.getDay() + "." + td.getMonth() + '.' + td.getFullYear();
                            $scope.model = angular.copy(newDate);
                        }

                        var d = newDate.split(".");
                        console.log(d);

                        $scope.dateFields.day = parseInt(d[0], 10);
                        $scope.dateFields.month = parseInt(d[1], 10);
                        $scope.dateFields.year = parseInt(d[2], 10);

                        // recalculate days
                        var n = daysInMonth(d[2], d[1]);
                        $scope.days = [];
                        for (var i = 0; i < n; i++) {
                            $scope.days.push(i + 1);
                        }
                        console.log(n, $scope.days);
                    });

                    // validate that the date selected is accurate
                    $scope.checkDate = function() {
                        console.log('Scope checking date');

                        // update the date or return false if not all date fields entered.
                        var date = angular.copy(utils.checkDate($scope.dateFields));

                        console.log('date is', date);
                        if (date) {
                            $scope.dateFields = date;
                            $scope.model = ((date.day >= 10) ? date.day : ("0" + date.day)) + "." + ((date.month >= 10) ? date.month : ("0" + date.month)) + "." + date.year;
                        }
                    };

                }
            ],
            template: '<div class="form-inline">' +
                '  <div class="form-group xcol-xs-3">' +
                '    <select name="dateFields.day" data-ng-model="dateFields.day" placeholder="Day" class="form-control" ng-options="day for day in days" ng-change="checkDate()" ng-disabled="disableFields"></select>' +
                '  </div>' +
                '  <div class="form-group xcol-xs-5">' +
                '    <select name="dateFields.month" data-ng-model="dateFields.month" placeholder="Month" class="form-control" ng-options="month.value as month.name for month in months" value="{{dateField.month}}" ng-change="checkDate()" ng-disabled="disableFields"></select>' +
                '  </div>' +
                '  <div class="form-group xcol-xs-4">' +
                '    <select ng-if="!yearText" name="dateFields.year" data-ng-model="dateFields.year" placeholder="Year" class="form-control" ng-options="year for year in years" ng-change="checkDate()" ng-disabled="disableFields"></select>' +
                '    <input ng-if="yearText" type="text" name="dateFields.year" data-ng-model="dateFields.year" placeholder="Year" class="form-control" ng-disabled="disableFields">' +
                '  </div>' +
                '</div>',
            link: function(scope, element, attrs, ctrl) {
                if (attrs.yearText) {
                    scope.yearText = true;
                }


                // set the years drop down from attributes or defaults
                var currentYear = parseInt(attrs.startingYear, 10) || new Date().getFullYear();
                var numYears = parseInt(attrs.numYears, 10) || 100;
                var oldestYear = currentYear - numYears;

                scope.years = [];
                for (var i = currentYear; i >= oldestYear; i--) {
                    scope.years.push(i);
                }

                // pass down the ng-disabled property
                scope.$parent.$watch(attrs.ngDisabled, function(newVal) {
                    scope.disableFields = newVal;
                });

                // ensure that fields are entered
                if (attrs.required && attrs.required.length) {
                    var required = attrs.required.split(' ');
                    ctrl.$parsers.push(function(value) {
                        angular.forEach(required, function(elem) {
                            if (!angular.isNumber(elem)) {
                                ctrl.$setValidity('required', false);
                            }
                        });
                        ctrl.$setValidity('required', true);
                    });
                }

            }
        };
    }
]);