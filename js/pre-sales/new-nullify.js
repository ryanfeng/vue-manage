/*
 * 新增sn作废
 * */

define(['Tool', 'component', 'ajaxAPI'], function (Tool, component, api) {
    var urlParam = Tool.getUrlParam();
    var Params = {};
    var init = {
        default: function () {
            init.base();
            //表单信息
            init.formInput();
        },
        base: function () {
            //位置信息
            Tool.location([{
                class: "",
                href: "javascript:void(0)",
                text: "售前设备"
            }, {
                class: "hover",
                href: "./batch-list.html",
                text: "生产批次"
            }, {
                class: "hover",
                href: "./batch-detail.html?batchId=" + urlParam.batchId + "&categoryCode=" + urlParam.categoryCode + "&func=" + urlParam.func,
                text: "批次详情"
            }, {
                class: "",
                href: "javascript:void(0)",
                text: "sn作废"
            }]);
        },
        //表单信息
        formInput: function (roleList) {
            new Vue({
                el: ".input-form",
                //数据
                data: {
                    listInfo: {
                        row: 1,
                        max: 5,
                        newBtn: "btn-success",
                        newBtnValue: "添加作废sn",
                        cancelBtn: "btn-default",
                        cancelBtnValue: "取消添加作废",
                    },
                    list: [{
                        first: "true",
                        title: "sn编码",
                        placeholder: "请输入",
                        warning: false,
                        hint: "",
                        success: false,
                        blur: function (val) {
                            //验证是否有值
                            Check.haveValue(val, "sn编码不能为空");
                        },
                        value: ""
                    }],
                    submitClass: "btn-success btn-submit",
                    submitValue: "作废以上sn编码",
                    cancelClass: "btn-default",
                    cancelLink: "./batch-detail.html?batchId=" + urlParam.batchId + "&categoryCode=" + urlParam.categoryCode + "&func=" + urlParam.func,
                    cancelValue: "取消"
                },
                methods: {
                    focus: function (val) {
                        val.warning = "";
                        val.hint = "";
                    },
                    //添加销售区域
                    newList: function () {
                        this.list.push({
                            title: "sn编码",
                            placeholder: "请输入",
                            warning: false,
                            hint: "",
                            success: false,
                            blur: function (val) {
                                //验证是否有值
                                Check.haveValue(val, "sn编码不能为空");
                            },
                            value: ""
                        });
                        this.listInfo.row = this.list.length;
                    },
                    //取消添加销售区域
                    cancelList: function (val) {
                        this.list.splice(val, 1);
                        this.listInfo.row = this.list.length;
                    },
                    //提交
                    submit: function () {
                        if (this.dislabedSubmit) {
                            return;
                        }
                        //验证列表不正确
                        if (Check.list(this.list)) {
                            return;
                        }
                        //判断input表单是否填写正确
                        var snList = [];
                        for (var i = 0; i < this.list.length; i++) {
                            snList.push(this.list[i].value);
                        }
                        //btn提交等待中
                        Tool.btnStautsBusy("作废编码中");
                        this.dislabedSubmit = true;
                        //保存作废sn编码
                        this.save(snList);
                    },
                    //保存作废sn编码
                    save: function (snList) {
                        var self = this;
                        $.ajax({
                            url: API.batchDiscardSn,
                            type: "POST",
                            dataType: "json",
                            contentType: "application/json",
                            data: JSON.stringify({
                                categoryCode: urlParam.categoryCode,
                                sns: snList
                            }),
                            success: function (resp) {
                                if (resp.code == 0) {
                                    //btn提交成功
                                    Tool.btnStautsSuccess("作废编码成功", "作废以上sn编码", function () {
                                        location.href = self.cancelLink;
                                    });
                                    //提示框-成功
                                    Tool.alertboxSuccess("作废编码成功");
                                } else {
                                    //btn提交失败
                                    Tool.btnStautsError("作废编码失败", "作废以上sn编码");
                                    //提示框-错误
                                    Tool.alertboxError(resp.msg);
                                    self.dislabedSubmit = false;
                                }
                            },
                            error: function (resp) {
                                //btn提交失败
                                Tool.btnStautsError("作废编码失败", "作废以上sn编码");
                                self.dislabedSubmit = false;
                                console.log(resp, "失败");
                            }
                        });
                    }
                }
            });
        }
    };
    init.default();

});