/*
 验证包
 */
define([], function () {
    window.Check = {};
    //验证是否有值
    Check.haveValue = function (val, hint) {
        if (val.value) {
            val.warning = false;
            val.hint = "";
            val.success = true;
        } else {
            val.warning = true;
            val.hint = hint;
            val.success = false;
        }
    };
    //验证联系电话
    Check.ifPhone = function (val, hint) {
        hint = hint || [];
        val.warning = true;
        val.success = false;
        if (!val.value) {
            val.hint = hint[0] || "联系电话不能为空";
        } else if (!RegEx.regExpPhone(val.value)) {
            val.hint = hint[1] || "联系电话不正确";
        } else {
            val.warning = false;
            val.hint = "";
            val.success = true;
        }
    };
    //验证密码
    Check.ifPassword = function (val, hint) {
        hint = hint || [];
        val.warning = true;
        val.success = false;
        if (!val.value) {
            val.hint = hint[0] || "当前密码不能为空";
        } else if (!RegEx.RegExpPassword(val.value)) {
            val.hint = hint[1] || "请输入6-16位不含特殊符号的密码";
        } else {
            val.warning = false;
            val.hint = "";
            val.success = true;
        }
    };
    //确认验证新密码
    Check.reIfPassword = function (val, list) {
        val.warning = true;
        val.success = false;
        if (!val.value) {
            val.hint = "确认密码不能为空";
        } else if (!RegEx.RegExpPassword(val.value)) {
            val.hint = "请输入6-16位不含特殊符号的密码";
        } else if (val.value != list[1].value) {
            val.hint = "两次密码输入不一致";
        } else if (RegEx.RegExpPassword(val.value)) {
            val.warning = false;
            val.success = true;
            val.hint = "";
        }
    };
    //验证列表不正确
    Check.list = function (list, params) {
        for (var i = 0; i < list.length; i++) {
            if (!list[i].success) {
                list[i].blur(list[i], list, params);
                return true;
            }
        }
    };
    //验证联系电话是否正确 在获取信息
    Check.ifPhoneGetInfo = function (val, callback) {
        //添加失败参数
        if (!val.value || !RegEx.regExpPhone(val.value)) {
            val.user.value = "";
            val.warning = true;
            val.class = "warning";
            val.success = false;
        }
        //判断逻辑
        if (!val.value) {
            val.hint = "联系电话不能为空";
        } else if (!RegEx.regExpPhone(val.value)) {
            val.hint = "联系电话不正确";
        } else {
            var data = {};
            val.paramPhone = val.paramPhone || "loginName";
            data[val.paramPhone] = val.value;
            $.ajax({
                url: val.API || API.photoByName,
                type: "post",
                data: data,
                success: function (resp) {
                    if (resp.code == 0) {
                        val.hint = "";
                        val.class = "";
                        val.warning = false;
                        val.success = true;
                        val.user.id = resp.data.id;
                        val.user.value = resp.data.userName;
                        if (callback) {
                            callback("success", resp);
                        }
                    } else {
                        val.hint = resp.msg;
                        if (callback) {
                            callback("error", resp);
                        }
                    }
                },
                error: function (resp) {
                    val.hint = "失败";
                    val.class = "warning";
                    val.warning = true;
                    val.success = false;
                    val.user.value = "";
                    if (callback) {
                        callback("error", resp);
                    }
                }
            });
        }
    };
    Check.ifPhoneGetInfoId = function (val, callback) {
        //添加失败参数
        if (!val.value || !RegEx.regExpPhone(val.value)) {
            val.user.value = "";
            val.warning = true;
            val.class = "warning";
            val.success = false;
        }
        //判断逻辑
        if (!val.value) {
            val.hint = "联系电话不能为空";
        } else if (!RegEx.regExpPhone(val.value)) {
            val.hint = "联系电话不正确";
        } else {
            var data = {};
            val.paramPhone = val.paramPhone || "phone";
            data[val.paramPhone] = val.value;
            $.ajax({
                url: val.API || API.photoByDealer,
                type: "post",
                data: data,
                async: false,
                success: function (resp) {
                    if (resp.code == 0) {
                        val.hint = "";
                        val.class = "";
                        val.warning = false;
                        val.success = true;
                        val.user.id = resp.data.id;
                        val.user.value = resp.data.userName;
                        if (callback) {
                            callback("success", resp);
                        }
                    } else {
                        val.hint = resp.msg;
                        if (callback) {
                            callback("error", resp);
                        }
                    }
                },
                error: function (resp) {
                    val.hint = "失败";
                    val.class = "warning";
                    val.warning = true;
                    val.success = false;
                    val.user.value = "";
                    if (callback) {
                        callback("error", resp);
                    }
                }
            });
        }
    };
    //验证正数金额
    Check.ifPositive = function (val, hint) {
        hint = hint || [];
        val.warning = true;
        val.success = false;
        if (!val.value) {
            val.hint = hint[0] || "金额不能为空";
        } else if (!RegEx.RegExpPositive(val.value)) {
            val.hint = hint[1] || "请填写正确的金额数";
        } else {
            val.warning = false;
            val.hint = "";
            val.success = true;
        }
    };
    //验证正整数
    Check.ifPositiveInteger = function (val, hint) {
        hint = hint || [];
        val.warning = true;
        val.success = false;
        if (!val.value) {
            val.hint = hint[0] || "数量不能为空";
        } else if (!RegEx.RegExpInteger(val.value)) {
            val.hint = hint[1] || "请填写正确的正整数";
        } else {
            val.warning = false;
            val.hint = "";
            val.success = true;
        }
    };
    //验证日期
    Check.ifDate = function (val, hint) {
        hint = hint || [];
        val.warning = true;
        val.success = false;
        if (!val.value) {
            val.hint = hint[0] || "日期不能为空";
        } else if (!RegEx.RegExpDate(val.value)) {
            val.hint = hint[1] || "日期格式错误 例：1995-10-08";
        } else {
            val.warning = false;
            val.hint = "";
            val.success = true;
        }
    }
    return Check;
});