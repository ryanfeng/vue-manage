define([], function (header) {
    //全局公用参数
    window.publicParams = {};
    var init = {
        default: function () {
            init.base();
            init.getUserInfo();
        },
        base: function () {
            //容器最小高度获取
            if ($(".container").length) {
                $(window).bind("resize", function () {
                    var $container = $(".container"),
                        $top = $container.offset().top,
                        $H = $(window).height(),
                        $main = parseInt($("#main").css("margin-bottom"));
                    $container.css({
                        minHeight: $H - $top - 15
                    });
                }).trigger("resize");
            }
        },
        //获取用户信息
        getUserInfo: function () {
            $.ajax({
                url: API.userCurrent,
                type: "post",
                success: function (resp) {
                    if (resp.code == 0) {
                        publicParams.userInfo = resp.data;
                        localStorage.name = resp.data.userName;
                        $(".name").find(">span").text(resp.data.userName);
                        //获取用户信息回调
                        if (publicParams.getUserInfoBack) {
                            publicParams.getUserInfoBack(resp.data);
                        }

                        if ($("#login").length) {
                            location.href = "/html/map/device-map.html";
                        }
                    } else {
                        init.notLogin();
                    }
                },
                error: function () {
                    Tool.alertboxError("服务器连接失败,请联系后台管理人员.");
                    if (!$("#login").length) {
                        setTimeout(function () {
                            location.href = "/html/login/login.html";
                        }, 3000);
                    }
                }
            });
        },
        //未登陆处理
        notLogin: function () {
            if (!$("#login").length) {
                location.href = "/html/login/login.html";
            }
        }
    };
    init.default();
});