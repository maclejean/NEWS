angular.module('health.controller', [])
    .controller('homeController', ['$scope', 'dataService', function ($scope, dataService) {
        dataService.getCateList(20, 1).success(function (res) {
            $scope.list = res.result;
        })
    }])
    .controller('analyzeController', ['$scope', function ($scope) {
    }])
    .controller('habitController', ['$scope', 'dataService', '$timeout', function ($scope, dataService, $timeout) {
        // 点那个列表就把那个显示，
        // 每个列表都有一个单独的list属性,
        // 刷新的时候只刷新他自己的列表内容，
        // 通过传参数来执行loadMore()
        //每个会记录自己的page：1;
        dataService.getCate().success(function (res) {
            $scope.cate = res.result;
            $scope.cate.map(function (data) {
                data.list = [];
                data.active = false;
                data.flag = true;
                data.page = 1;
            });
            $scope.changeTab(0);
            $scope.active = true;
        });
        $scope.loadMore = function (x) {
            //安卓手机可以实现上拉刷新，苹果调试无法实现
            if (x.flag) {
                x.start = true;
                x.flag = false;
                dataService.getCateList(x.catid, x.page).success(function (res) {
                    x.list = x.list.concat(res.result);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    x.page += 1;
                    if (res.result.length >= 19) {
                        x.flag = true;
                    }
                })
            } else {
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }
        };
        $scope.changeTab = function (index) {
            $scope.cate.map(function (data) {
                data.active = false;
            });
            $scope.cate[index].active = true;
            $timeout(function () {
                if ($scope.cate[index].list.length == 0 && !$scope.cate[index].start) {
                    $scope.loadMore($scope.cate[index])
                }
            }, 100)
        };
        // $scope.swipeLeft = function (index) {
        //     var next = index + 1;
        //     if (next >= $scope.cate.length) {
        //         next = $scope.cate.length - 1;
        //     }
        //     $scope.changeTab(next)
        // };
        // $scope.swipeRight = function (index) {
        //     var prev = index - 1;
        //     if (prev <= 0) {
        //         prev = 0;
        //     }
        //     $scope.changeTab(prev)
        // };
        $scope.refresh = function (x) {
            dataService.getCateList(x.catid, 1).success(function (res) {
                x.list = res.result;
                $scope.$broadcast('scroll.refreshComplete');
            })
        }
    }])
    .controller('agentCenterController', ['$scope', '$rootScope', function ($scope, $rootScope) {
        $scope.$on('$ionicView.beforeEnter', function () {
            $rootScope.isShow = '';
            $scope.hasLogin = sessionStorage.getItem('state') == 1;
        });
        $scope.quit = function () {
            sessionStorage.setItem('state', 0);
            $scope.hasLogin = sessionStorage.getItem('state') == 1;
        }
    }])
    .controller('detailController', ['$scope', 'dataService', '$stateParams', '$rootScope', '$ionicPopup', 'likeList', 'fontSizeService', function ($scope, dataService, $stateParams, $rootScope, $ionicPopup, likeList, fontSizeService) {
        $scope.data = fontSizeService.data;
        $scope.fontList = fontSizeService.fontList;
        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.isLike = false;
            $rootScope.isShow = 'tabs-item-hide';
            likeList.getList();
            var list = likeList.list;
            for (var i = 0; i < list.length; i++) {
                if (list[i].aid == $stateParams.aid) {
                    $scope.isLike = true;
                    break;
                }
            }
            $scope.detailStyle = {
                fontSize: $scope.data.font + 'rem'
            };
        });

        $scope.likeIt = function () {
            $scope.isLike = !$scope.isLike;
            if ($scope.isLike) {
                likeList.addItem($scope.detail)
            } else {
                likeList.removeItem($scope.detail)
            }
        };
        dataService.getDetail($stateParams.aid).success(function (res) {
            $scope.detail = res.result[0];
        });
        // 调用$ionicPopup弹出定制弹出框
        $scope.showPopup = function () {
            $scope.popup = $ionicPopup.show({
                template: '<ion-radio ng-model="data.font" ng-repeat="item in fontList" ng-value="item.value">{{item.text}}</ion-radio>',
                title: "正文字体",
                scope: $scope,
                buttons: [
                    {text: "取消"},
                    {
                        text: "<b>保存</b>",
                        type: "button-positive",
                        onTap: function (e) {
                            $scope.detailStyle = {
                                fontSize: $scope.data.font + 'rem'
                            };
                            localStorage.setItem('fontSize', $scope.data.font);
                        }
                    }
                ]
            });
        };
        $scope.$on('$destroy', function () {
            $rootScope.isShow = '';
            $scope.popup.close();
        });
        $scope.$on('$ionicView.beforeLeave', function () {
            $rootScope.isShow = '';
            $scope.popup.close();
        });
    }])
    .controller('loginController', ['$scope', '$rootScope', '$state', '$templateCache', 'loginService', function ($scope, $rootScope, $state, $templateCache, loginService) {
        $scope.user = {};
        $scope.login = function () {
            if (loginService.login($scope.user.phone, $scope.user.password)) {
                sessionStorage.setItem('state', 1);
                $state.go('tab.agentCenter');
            }
        }
    }])
    .controller('registerController', ['$scope', '$rootScope', '$ionicModal', '$interval', '$state', 'loginService', function ($scope, $rootScope, $ionicModal, $interval, $state, loginService) {
        $ionicModal.fromTemplateUrl('templates/agentCenter/code.html', {
            scope: $scope
        }).then(function (modal) {
            $scope.modal = modal;
        });
        $scope.user = {};
        $scope.$on('$ionicView.beforeEnter', function () {
            $rootScope.isShow = 'tabs-item-hide'
        });
        $scope.$on('$destroy', function () {
            $rootScope.isShow = '';
            $scope.modal.hide();
        });

        $scope.register = function () {
            if ($scope.user.confPsd != $scope.user.password) {
                return false;
            } else if (loginService.register($scope.user.phone, $scope.user.password)) {
                loginService.randomCode();
                $scope.modal.show();
                $scope.user.codeConf = $rootScope.regCode;
                $scope.one = 10;
                $scope.timer = $interval(function () {
                    $scope.one -= 1;
                    if ($scope.one == 0) {
                        $interval.cancel($scope.timer);
                        $scope.clickable = true;
                        $scope.klass = 'balanced';
                        $scope.oneMin = timeDoc;
                    }
                }, 1000)
            }
        };
        function timeDoc() {
            if ($scope.clickable == false) {
                return;
            }
            $scope.klass = '';
            $scope.clickable = false;
            loginService.randomCode();
            $scope.user.codeConf = $rootScope.regCode;
            $scope.one = 10;
            $scope.timer = $interval(function () {
                $scope.one -= 1;
                if ($scope.one == 0) {
                    $interval.cancel($scope.timer);
                    $scope.klass = 'balanced';
                    $scope.clickable = true;
                }
            }, 1000);
        }

        $scope.backForward = function () {
            $scope.modal.hide();
            $scope.one = 10;
            $interval.cancel($scope.timer);
        };

        $scope.goLogin = function () {
            if ($scope.user.codeConf == $rootScope.regCode) {
                $scope.modal.hide();
                $state.go('login');
            } else {
                alert('验证码错误');
            }
        };
    }])
    .controller('suggestController', ['$scope', '$rootScope', function ($scope, $rootScope) {
        $scope.$on('$ionicView.beforeEnter', function () {
            $rootScope.isShow = 'tabs-item-hide'
        });
        $scope.$on('$destroy', function () {
            $rootScope.isShow = ''
        })
    }])
    .controller('likeController', ['$scope', 'likeList', function ($scope, likeList) {
        $scope.$on('$ionicView.beforeEnter', function () {
            $scope.list = [];
            likeList.getList();
            var list = likeList.list;
            list.map(function (data) {
                $scope.list.push(data);
            });
        });
        $scope.removeItem = function (aid, index) {
            likeList.removeItem(aid);
            $scope.list.splice(index, 1);
        };
        $scope.clear = function () {
            likeList.clear();
            $scope.list = [];
        }
    }])
    .controller('readController', ['$scope', '$stateParams', 'fontSizeService', 'likeList', '$ionicPopup', '$rootScope', function ($scope, $stateParams, fontSizeService, likeList, $ionicPopup, $rootScope) {
        likeList.getList();
        var list = likeList.list;
        for (var i = 0; i < list.length; i++) {
            if (list[i].aid == $stateParams.aid) {
                $scope.detail = list[i];
                $scope.isLike = true;
                break;
            }
        }
        $scope.showPopup = function () {
            // 调用$ionicPopup弹出定制弹出框
            $ionicPopup.show({
                template: '<ion-radio ng-model="data.font" ng-repeat="item in fontList" ng-value="item.value">{{item.text}}</ion-radio>',
                title: "正文字体",
                scope: $scope,
                buttons: [
                    {text: "取消"},
                    {
                        text: "<b>保存</b>",
                        type: "button-positive",
                        onTap: function (e) {
                            $scope.detailStyle = {
                                fontSize: $scope.data.font + 'rem'
                            };
                            localStorage.setItem('fontSize', $scope.data.font);

                        }
                    }
                ]
            })
        };
        $scope.likeIt = function () {
            $scope.isLike = !$scope.isLike;
            if ($scope.isLike) {
                likeList.addItem($scope.detail)
            } else {
                likeList.removeItem($scope.detail)
            }
        };
        $scope.data = fontSizeService.data;
        $scope.fontList = fontSizeService.fontList;
        $scope.$on('$ionicView.beforeEnter', function () {
            $rootScope.isShow = 'tabs-item-hide';
            $scope.detailStyle = {
                fontSize: $scope.data.font + 'rem'
            };
        });
        $scope.$on('$destroy', function () {
            $rootScope.isShow = '';
        })
    }]);