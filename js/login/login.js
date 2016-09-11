/*
 * 登录页面
 * */
require(['component', 'ajaxAPI'], function (component, API) {
    var init = {
        default: function () {
            //渲染登陆
            init.renderLogin();
        },
        //渲染登陆
        renderLogin: function () {
            //登录信息
            new Vue({
                el: 'body',
                //数据
                data: {
                    list: [
                        {
                            icon: '&#xe626;',
                            warning: false,
                            success: localStorage.username ? true : false,
                            value: localStorage.username || "",
                            hint: "123",
                            placeholder: "请输入手机号码",
                            type: "text",
                            blur: function (val) {
                                //验证用户账号
                                Check.haveValue(val, "请输入用户账号");
                            }
                        },
                        {
                            icon: '&#xe61f;',
                            warning: false,
                            success: localStorage.password ? true : false,
                            value: localStorage.password || "",
                            hint: "",
                            placeholder: "请输入密码",
                            type: "password",
                            blur: function (val) {
                                //验证密码
                                Check.ifPassword(val, ["密码不能为空"]);
                            }
                        }
                    ],
                    Copyright: "Copyright©2016   浙江地球村环保科技有限公司 All Rights Reserved 版权所有",
                    nextAutoLogin: localStorage.username,
                    nextAutoLoginText: "记住密码",
                    loginDisabled: false,
                    loginBtn: "登录"
                },
                //方法
                methods: {
                    focus: function (val) {
                        val.warning = false;
                        val.hint = "";
                    },
                    //提交登录
                    submitLogin: function () {
                        //验证列表不正确
                        if (Check.list(this.list)) {
                            return;
                        }
                        //用户登录
                        this.userLogin();
                    },
                    //用户登录
                    userLogin: function () {
                        var self = this;
                        this.loginDisabled = true;
                        this.loginBtn = "登录中...";
                        $.ajax({
                            url: API.login,
                            type: "POST",
                            data: {
                                username: this.list[0].value,
                                password: hex_md5("dqc" + this.list[1].value)//hex_md5($password)  "851b7c8b7652c5a6ce251fad9a1d5f7c"
                            },
                            success: function (resp) {
                                resp = JSON.parse(resp);
                                //登录成功
                                if (resp.code == 0) {
                                    //h5缓存记录 
                                    if ($("#next-auto-login").attr("checked")) {
                                        localStorage.password = self.list[1].value;
                                    } else {
                                        localStorage.username = "";
                                        localStorage.password = "";
                                    }
                                    localStorage.username = self.list[0].value;
                                    localStorage.permissions = "," + resp.data.permissions + ",";
                                    location.href = "/html/map/device-map.html";
                                } else {
                                    self.loginDisabled = false;
                                    self.loginBtn = "登录";
                                    if (resp.msg == "用户不存在") {
                                        self.list[0].warning = true;
                                        self.list[0].hint = resp.msg;
                                        return;
                                    }
                                    if (resp.msg == "密码不正确") {
                                        self.list[1].warning = true;
                                        self.list[1].hint = resp.msg;
                                        return;
                                    }
                                    self.list[0].warning = true;
                                    self.list[0].hint = resp.msg || "登录失败";
                                }
                            },
                            error: function (resp) {
                                self.loginDisabled = false;
                                self.loginBtn = "登录";
                                self.list[0].warning = true;
                                self.list[0].hint = "登录失败";
                            }
                        });
                    }
                }
            });
        }
    };

    init.default();
});