/*
 * 新增班级
 * */

define(['Tool', 'component', 'ajaxAPI'], function (Tool, component, API) {
    var urlParam = Tool.getUrlParam();
    var init = {
        default: function () {
            init.base();
            init.getDetail();
        },
        base: function () {
            //位置信息
            Tool.location([{
                class: "",
                href: "javascript:void(0)",
                text: "售后设备"
            }, {
                class: "hover",
                href: "./school-device.html",
                text: "校园新风"
            }, {
                class: "hover",
                href: "./school-manage.html",
                text: "设备管理"
            }, {
                class: "",
                href: "javascript:void(0)",
                text: "修改班级"
            }]);
        },
        //获取班级详情
        getDetail: function () {
            $.ajax({
                url: API.schoolClassDetail,
                type: "POST",
                data: {classId: urlParam.classId},
                success: function (resp) {
                    if (resp.code == 0) {
                        init.formInput(resp.data);
                    } else {
                        Tool.alertboxError(resp.msg);
                    }
                },
                error: function (resp) {
                    Tool.btnStautsError(resp);
                }
            });
        },
        //表单信息
        formInput: function (detailData) {
            var gradeArray = [{
                text: "小班",
                class: "selected",
                grade: "100001"
            }, {
                text: "中班",
                grade: "100002"
            }, {
                text: "大班",
                grade: "100003"
            }, {
                text: "一年级",
                grade: "200001"
            }, {
                text: "二年级",
                grade: "200002"
            }, {
                text: "三年级",
                grade: "200003"
            }, {
                text: "四年级",
                grade: "200004"
            }, {
                text: "五年级",
                grade: "200005"
            }, {
                text: "六年级",
                grade: "200006"
            }, {
                text: "初一",
                grade: "300001"
            }, {
                text: "初二",
                grade: "300002"
            }, {
                text: "初三",
                grade: "300003"
            }, {
                text: "高一",
                grade: "400001"
            }, {
                text: "高二",
                grade: "400002"
            }, {
                text: "高三",
                grade: "400003"
            }];

            var dataActive = {
                text: "小班",
                grade: "100001"
            };
            $.each(gradeArray, function (index, obj) {
                if (obj.text == detailData.grade) {
                    dataActive.text = obj.text;
                    dataActive.grade = obj.grade;
                    return;
                }
            });

            new Vue({
                el: ".input-form",
                //数据
                data: {
                    //班级
                    class: {
                        title: "年级",
                        active: dataActive,
                        list: gradeArray
                    },
                    list: [{
                        title: "班级名称",
                        placeholder: "请输入",
                        warning: false,
                        success : true,
                        hint: "",
                        listClass: "line",
                        blur: function (val) {
                            Check.haveValue(val, "班级名称不能为空");
                        },
                        value: detailData.className || ''
                    }],
                    submitClass: "btn-success btn-submit",
                    submitValue: "保存",
                    cancelClass: "btn-default",
                    cancelValue: "取消",
                    schoolId: urlParam.schoolId
                },
                methods: {
                    //班级分类选择
                    select: function (option, val) {
                        val.active = option;
                    },
                    //提交
                    submit: function () {
                        if (this.dislabedSubmit) {
                            return;
                        }
                        //验证列表不正确
                        if (Check.list(this.list, this.channel)) {
                            return;
                        }
                        //btn提交等待中
                        Tool.btnStautsBusy("保存班级");
                        this.dislabedSubmit = true;
                        //保存
                        this.save();
                    },
                    //保存班级
                    save: function () {
                        var self = this;
                        $.ajax({
                            url: API.schoolClassSave,
                            type: "POST",
                            dataType: "json",
                            contentType: "application/json",
                            data: JSON.stringify({
                                classId: urlParam.classId,
                                grade: this.class.active.grade,
                                className: this.list[0].value.trim(),
                                school: {
                                    schoolId: urlParam.schoolId
                                }
                            }),
                            success: function (resp) {
                                if (resp.code == 0) {
                                    //btn提交成功
                                    Tool.btnStautsSuccess("保存班级成功", "保存", function () {
                                        location.href = "./class-list.html?schoolId=" + urlParam.schoolId;
                                    });
                                    //提示框-成功 
                                    Tool.alertboxSuccess("保存班级成功");
                                } else {
                                    //btn提交失败
                                    Tool.btnStautsError("保存班级失败", "保存");
                                    //提示框-错误
                                    Tool.alertboxError(resp.msg);
                                    self.dislabedSubmit = false;
                                }
                            },
                            error: function (resp) {
                                //btn提交失败
                                Tool.btnStautsError("保存班级失败", "保存");
                                self.dislabedSubmit = false;
                            }
                        });
                    }
                }
            });
        }
    };
    init.default();
});