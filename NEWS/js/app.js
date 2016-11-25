angular.module('health', ['ionic', 'health.controller', 'health.service', 'ionicLazyLoad'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('tab', {
                url: '/tab',
                templateUrl: 'templates/tabs.html',
                abstract: true
            })
            .state('tab.home', {
                url: '/home',
                views: {
                    'home': {
                        templateUrl: 'templates/home.html',
                        controller: 'homeController'
                    }
                }
            })
            .state('tab.analyze', {
                url: '/analyze',
                views: {
                    'analyze': {
                        templateUrl: 'templates/analyze.html',
                        controller: 'analyzeController'
                    }
                }
            })
            .state('tab.habit', {
                url: '/habit',
                views: {
                    'habit': {
                        templateUrl: 'templates/habit/index.html',
                        controller: 'habitController'
                    }
                }
            })
            .state('tab.detail', {
                url: '/habit/:aid',
                views: {
                    'habit': {
                        templateUrl: 'templates/habit/detail.html',
                        controller: 'detailController'
                    }
                }
            })
            .state('tab.agentCenter', {
                url: '/agentCenter',
                views: {
                    'agent-center': {
                        templateUrl: 'templates/agentCenter/index.html',
                        controller: 'agentCenterController'
                    }
                }
            })
            .state('login', {
                url: '/login',
                templateUrl: 'templates/agentCenter/login.html',
                controller: 'loginController'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'templates/agentCenter/register.html',
                controller: 'registerController'
            })
            .state('tab.registerLogin', {
                url: '/registerLogin',
                views: {
                    'agent-center': {
                        templateUrl: 'templates/agentCenter/register.html',
                        controller: 'registerController'
                    }
                }

            })
            .state('tab.suggest', {
                url: '/suggest',
                views: {
                    'agent-center': {
                        templateUrl: 'templates/agentCenter/suggest.html',
                        controller: 'suggestController'
                    }
                }
            })
            .state('tab.like', {
                // 收藏列表页面
                url: '/like',
                views: {
                    'agent-center': {
                        templateUrl: 'templates/agentCenter/like.html',
                        controller: 'likeController'
                    }
                }

            })
            .state('tab.read', {
                //收藏阅读页面
                url: '/like/:aid',
                views: {
                    'agent-center': {
                        templateUrl: 'templates/habit/detail.html',
                        controller: 'readController'
                    }
                }
            })
            .state('tab.homeDetail', {
                //主页的新闻详情页
                url: '/homeDetail/:aid',
                views: {
                    'home': {
                        templateUrl: 'templates/habit/detail.html',
                        controller: 'detailController'
                    }
                }
            });
        $urlRouterProvider.otherwise('/tab/home')
    })
    .config(function ($ionicConfigProvider) {
        $ionicConfigProvider.tabs.position('bottom')
    });
