var controllers = angular.module('controllers');

controllers.controller('ServiceCtrl', ['$scope', '$routeParams', '$location', 'ServicesList', 'Search', function ($scope, $routeParams, $location, ServicesList, Search) {

    // when a user clicks on "Show Details" from a map popup, we don't want all the icons on the map to suddenly be hidden
    // like they do when they come from a list view so we check the hideOthers param
    if ($location.search().hideOthers !== "false") {
        // only called when coming from a list view
        Search.selectId($routeParams.serviceId);
    }
    ServicesList.findById($routeParams.serviceId).then(function(service) {
        $scope.service = {};
        $scope.service.id = service.id;
        $scope.service.region = service.region;
        $scope.service.organization = {
            name: service.organization.name
        };
        $scope.service.comments = service.properties.comments;
        $scope.service.category = {
            name: service.category.name,
            subCategory: {
                name: service.category.subCategory.name
            }
        };
        $scope.service.startDate = service.properties.startDate;
        $scope.service.endDate = service.properties.endDate;

        // TODO: reuse functionality in results controller to parse this info
        var partnerName = service.organization.name.toLowerCase().replace(' ', '');
        $scope.service.partnerLogoUrl = './src/images/partner/' + partnerName + '.jpg';

        $.each(service.properties.indicators, function (index, value) {
            if (value) {
                $scope.service.activityDetails = index;
            }
        });
        var propList = [];
        $scope.hours = [];
        $.each(service.properties, function (index) {
            var tempArray = index.split(".");
            if (index != 'comments' && tempArray.length > 1) {
                if ($.isNumeric(tempArray[0])) {
                    //TODO: Let's see if we can print it from index rather than creating new object for it again.
                    var obj = {};
                    var level = parseInt(tempArray[0], 10);
                    if (level != 8) {
                        obj.key = $.trim(tempArray[1]);
                        $.each(service.properties[index], function (index, value) {
                            if (value) {
                                obj.value = index;
                            }
                        });
                        propList[level] = obj;
                    } else {
                        $.each(service.properties[index], function (index, value) {
                            if (value) {
                                $scope.hours.push(index);
                            }
                        });
                    }
                }
            }
        });
        propList = $.grep(propList, function (n) {
            return (n)
        });
        $scope.service.properties = propList;

        $scope.goBackFromService = function() {
            var parameters = $location.search();
            if (_.has(parameters, 'category') || _.has(parameters, 'region')){
                $location.path('results').search(parameters);
            } else {
                $location.path('').search(parameters);
            }
        }
    });
}]);
