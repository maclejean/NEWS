/**
 * Created by Administrator on 2016/11/18 0018.
 */
angular.module('health.service', [])
    .factory('dataService', ['$http', '$rootScope', function ($http, $rootScope) {
        var factory = {};
        factory.getCate = function () {
            return $http.jsonp('http://www.phonegap100.com/appapi.php?a=getPortalCate&callback=JSON_CALLBACK');
        };
        factory.getCateList = function (id, pg) {
            return $http.jsonp('http://www.phonegap100.com/appapi.php?a=getPortalList&catid=' + id + '&page=' + pg + '&callback=JSON_CALLBACK');
        };
        factory.getDetail = function (aid) {
            return $http.jsonp('http://www.phonegap100.com/appapi.php?a=getPortalArticle&aid=' + aid + '&callback=JSON_CALLBACK');
        };
        return factory;
    }])
    .filter('catname', function () {
        return function (input, data) {
            var out = '';
            var pattern = /\w+/gi;
            out = input.replace(pattern, '');
            return out;
        }
    })
    .filter('src', function () {
        return function (input, data) {
            var out = '';
            out = 'http://www.phonegap100.com/data/attachment/' + input + '.thumb.jpg';
            return out;
        }
    })
    .factory('likeList', function likeListProvider() {
        var factory = {};
        factory.getList = function () {
            factory.list = localStorage.getItem('likeList') ? angular.fromJson(localStorage.getItem('likeList')) : [];
        };
        factory.addItem = function (aid) {
            factory.getList();
            factory.list.push(aid);
            localStorage.setItem('likeList', angular.toJson(factory.list))
        };
        factory.removeItem = function (aid) {
            factory.getList();
            var index = factory.list.indexOf(aid);
            factory.list.splice(index, 1);
            localStorage.setItem('likeList', angular.toJson(factory.list))
        };
        factory.clear = function () {
            factory.getList();
            factory.list = [];
            localStorage.setItem('likeList', angular.toJson(factory.list))
        };
        return factory;
    })
    .service('fontSizeService', [function () {
        return {
            data: {
                font: localStorage.getItem('fontSize') ? localStorage.getItem('fontSize') : 1.5
            },
            fontList: [
                {value: 2.5, text: '特大字号'},
                {value: 2, text: '大字号'},
                {value: 1.5, text: '中字号'},
                {value: 1, text: '小字号'}
            ]
        }
    }])
    .factory('loginService', ['$rootScope', function ($rootScope) {
        var list = [];
        return {
            getList: function () {
                list = angular.fromJson(localStorage.getItem('users')) || [];
            },
            checkPhone: function (phone) {
                var regEx = /^1[35789]\d{9}$/g;
                if (phone.trim().length == 0 || phone.length == 0) {
                    alert('手机号不能为空');
                    return;
                }
                if (regEx.test(phone)) {
                    this.getList();
                    var has = 'notHas';
                    list.map(function (data) {
                        if (data.phone == phone) {
                            has = 'has';
                        }
                    });
                    return has;
                } else {
                    return 'error phone';
                }
            },
            checkPassword: function (password) {
                var regEx = /^\w{4,16}$/g;
                return regEx.test(password);
            },
            login: function (phone, psd) {
                if (this.checkPhone(phone) == 'has') {
                    if (this.checkPassword(psd)) {
                        var pass = false;
                        list.map(function (data) {
                            if (data.phone == phone && data.password == psd) {
                                pass = true;
                            }
                        });
                        return pass;
                    } else {
                        alert('密码与注册手机号不匹配');
                        return false;
                    }
                }
                if (this.checkPhone(phone) == 'error phone') {
                    alert('手机号错误');
                    return false;
                }
                if (this.checkPhone(phone) == 'notHas') {
                    alert('手机号未注册');
                    return false;
                }

            },
            register: function (phone, psd) {
                if (this.checkPhone(phone) == 'has') {
                    alert('已经注册过，请直接登录');
                    return false;
                }
                if (this.checkPhone(phone) == 'notHas') {
                    if (this.checkPassword(psd)) {
                        var obj = {
                            phone: phone,
                            password: psd
                        };
                        list.push(obj);
                        localStorage.setItem('users', angular.toJson(list));
                        return true;
                    } else {
                        alert('请输入4-16位的非字符');
                        return false;
                    }
                }
            },
            randomCode: function () {
                $rootScope.regCode = Math.random().toString().substring(2, 6);
            }
        }
    }]);