define(['Tool', 'text!../tpl/public/header.html', 'text!../tpl/public/nav.html'], function (Tool, header, nav) {
    if ($("#login").length) {
        return;
    }
    var init = {
        default: function () {
            init.base();
            init.nav();
            init.header();
            init.event();
        },
        base: function () {
            //导入html
            $("body").prepend(nav);
            $("body").prepend(header);

            //nav菜单高度
            $(window).bind("resize", function () {
                var H = $(window).height(),
                    $header = $("#header").height();
                $("#nav>ul").css({height: H - $header});
            }).trigger("resize");

            //admin用户
            if (localStorage.username == "admin") {
                $(".name").find(">span").text("admin");
            }
        },
        nav: function () {
            //菜单信息
            new Vue({
                el: '#nav',
                //数据
                data: {
                    navData: [
                        {
                            icon: '&#xe62b;',
                            title: "设备地图",
                            show: localStorage.permissions.indexOf(",device:map,") > -1 ? true : false,
                            active: $("#map").length && "active",
                            subVal: [
                                {
                                    href: "/html/map/device-map.html",
                                    title: "设备地图",
                                    show: localStorage.permissions.indexOf(",device:map,") > -1 ? true : false,
                                    active: $(".map-index").length && "active"
                                }
                            ]
                        },
                        {
                            icon: '&#xe616;',
                            title: "系统管理",
                            active: $("#system-manage").length && "active",
                            show: localStorage.permissions.indexOf(",sys,") > -1 ? true : false,
                            subVal: [
                                {
                                    href: "/html/system-manage/role.html",
                                    title: "角色管理",
                                    show: localStorage.permissions.indexOf(",sys:role,") > -1 ? true : false,
                                    class: "system-manage-role",
                                    active: $(".system-manage-role").length && "active"
                                },
                                {
                                    href: "/html/system-manage/user.html",
                                    title: "用户管理",
                                    show: localStorage.permissions.indexOf(",sys:user,") > -1 ? true : false,
                                    class: "system-manage-user",
                                    active: $(".system-manage-user").length && "active"
                                }
                            ]
                        },
                        {
                            icon: '&#xe608;',
                            title: "经销商管理",
                            show: localStorage.permissions.indexOf(",dealer,") > -1 ? true : false,
                            active: $("#system-dealer").length && "active",
                            subVal: [
                                {
                                    href: "/html/system-dealer/retail.html",
                                    title: "零售经销商",
                                    show: localStorage.permissions.indexOf(",dealer:retail,") > -1 ? true : false,
                                    class: "system-dealer-retail",
                                    active: $(".system-dealer-retail").length && "active"
                                },
                                {
                                    href: "/html/system-dealer/trade.html",
                                    title: "行业经销商",
                                    show: localStorage.permissions.indexOf(",dealer:industry,") > -1 ? true : false,
                                    class: "system-dealer-trade",
                                    active: $(".system-dealer-trade").length && "active"
                                }
                            ]
                        },
                        {
                            icon: '&#xe615;',
                            title: "售前设备",
                            show: localStorage.permissions.indexOf(",device:pre,") > -1 ? true : false,
                            active: $("#pre-sales").length && "active",
                            subVal: [
                                {
                                    href: "/html/pre-sales/device.html",
                                    title: "设备分类",
                                    show: localStorage.permissions.indexOf(",device:category,") > -1 ? true : false,
                                    active: $(".pre-sales-device").length && "active"
                                },
                                {
                                    href: "/html/pre-sales/manufacturer.html",
                                    title: "生产厂商",
                                    show: localStorage.permissions.indexOf(",device:factory,") > -1 ? true : false,
                                    active: $(".pre-sales-manufacturer").length && "active"
                                },
                                {
                                    href: "/html/pre-sales/batch-list.html",
                                    title: "批次管理",
                                    show: localStorage.permissions.indexOf(",device:batch,") > -1 ? true : false,
                                    active: $(".pre-sales-batch-list").length && "active"
                                }

                            ]
                        },
                        {
                            icon: '&#xe615;',
                            title: "售后设备",
                            show: localStorage.permissions.indexOf(",device:after,") > -1 ? true : false,
                            active: $("#sell-after").length && "active",
                            subVal: [
                                {
                                    href: "/html/sell-after/order.html",
                                    title: "订单管理",
                                    show: localStorage.permissions.indexOf(",device:order,") > -1 ? true : false,
                                    active: $(".sell-after-order").length && "active"
                                },
                                {
                                    href: "/html/sell-after/device.html",
                                    title: "设备管理",
                                    show: localStorage.permissions.indexOf(",device:mgr,") > -1 ? true : false,
                                    active: $(".sell-after-device").length && "active"
                                },
                                {
                                    href: "/html/sell-after/school-device.html",
                                    title: "校园新风",
                                    show: localStorage.permissions.indexOf(",device:school,") > -1 ? true : false,
                                    active: $(".sell-after-school-device").length && "active"
                                }
                            ]
                        },
                        {
                            icon: '&#xe60b;',
                            title: "设备用户",
                            show: localStorage.permissions.indexOf(",device:user,") > -1 ? true : false,
                            active: $("#user").length && "active",
                            subVal: [
                                {
                                    href: "/html/user/device-user.html",
                                    title: "设备用户",
                                    show: localStorage.permissions.indexOf(",device:user,") > -1 ? true : false,
                                    active: $(".user-device-user").length && "active"
                                }
                            ]
                        },
                        {
                            icon: '&#xe61d;',
                            title: "数据统计",
                            show: (localStorage.permissions.indexOf(",statistics:general,") > -1 || localStorage.permissions.indexOf(",statistics:dealer:general,") > -1 || localStorage.permissions.indexOf(",statistics:school,") > -1) ? true : false,
                            active: $("#data-count").length && "active",
                            subVal: [
                                {
                                    href: "/html/data-count/index.html",
                                    title: "数据统计",
                                    show: localStorage.permissions.indexOf(",statistics:general,") > -1 ? true : false,
                                    active: $(".data-count-index").length && "active"
                                },
                                {
                                    href: "/html/data-count/data-system-dealer.html",
                                    title: "数据统计",
                                    show: localStorage.permissions.indexOf(",statistics:dealer:general,") > -1 ? true : false,
                                    active: $(".data-count-system-dealer").length && "active"
                                },
                                {
                                    href: "/html/data-count/school.html",
                                    title: "校园新风",
                                    show: localStorage.permissions.indexOf(",statistics:school,") > -1 ? true : false,
                                    active: $(".data-count-school").length && "active"
                                }
                            ]
                        },
                        {
                            icon: '&#xe60c;',
                            title: "生产批次",
                            show: localStorage.permissions.indexOf(",batch,") > -1 ? true : false,
                            active: $("#yield-batch").length && "active",
                            subVal: [
                                {
                                    href: "/html/yield-batch/list.html",
                                    title: "生产批次",
                                    show: localStorage.permissions.indexOf(",batch,") > -1 ? true : false,
                                    active: $(".yield-batch-list").length && "active"
                                }
                            ]
                        }
                    ]
                },
                created: function () {

                },
                //方法
                methods: {
                    login: function () {
                        location.href = "/html/map/device-map.html";
                    },
                    clickList: function (event) {
                        //var height = event.target.nextElementSibling.scrollHeight;
                        //var count = event.target.nextElementSibling.childElementCount;
                    }
                }
            });
        },
        header: function () {
            //头部信息
            new Vue({
                el: '#header',
                //数据
                data: {
                    name: localStorage.name || "",
                    username: localStorage.username,
                    tools: {
                        editPassword: {
                            href: "/html/user/editPassword.html",
                            icon: "&#xe61f;",
                            text: "修改密码"
                        },
                        logout: {
                            href: "javascript:void(0)",
                            icon: "&#xe61e;",
                            text: "退出"
                        }
                    }
                },
                methods: {
                    //退出登录
                    userLogout: function () {
                        $.ajax({
                            url: API.logout,
                            type: "POST",
                            success: function () {
                                location.href = "/html/login/login.html";
                            },
                            error: function (resp) {
                                console.log(resp, '失败')
                            }
                        });
                    }
                }
            });
        },
        event: function () {
            //展开菜单
            $("body").on("click", "#nav>ul>li:not(.active)", function () {
                var $li = $(this).find("li"),
                    $len = $li.length,
                    $height = $li.height();
                $(this).addClass("active").find(".sub-nav").stop(true).slideDown();
                $(this).siblings("li").removeClass("active").find(".sub-nav").stop(true).slideUp();
            });
            //收缩菜单
            $("body").on("click", "#nav>ul>li.active .caption", function () {
                var $li = $(this).closest("li");
                $li.removeClass("active").find(".sub-nav").stop(true).slideUp();
            });
        }
    };
    init.default();
});