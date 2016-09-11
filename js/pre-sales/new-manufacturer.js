/*
 * 添加厂商页面
 * */
define(['Tool', 'component', 'text!/tpl/pre-sales/new-manufacturer.html'], function (Tool, component, newManufacturer) {
    var urlParma = Tool.getUrlParam();
    var Params = {
        province: [{
            areaName: "请选择省份",
            class: "selected"
        }],
        city: [{
            areaName: "请选择城市",
            class: "selected"
        }],
        area: [{
            areaName: "请选择区县",
            class: "selected"
        }]
    };

    var init = {
        default: function () {
            init.base();
        },
        base: function () {
            //位置信息
            Tool.location([{
                class: "",
                href: "javascript:void(0)",
                text: "售前设备"
            }, {
                class: "hover",
                href: "./manufacturer.html",
                text: "生产厂商"
            }, {
                class: "",
                href: "javascript:void(0)",
                text: "新增厂商"
            }]);
            //添加正在加载中...
            Tool.createLoadding();
            //获取省份信息
            Tool.area("", function (resp) {
                Params.province = Params.province.concat(resp);
                //表单信息
                init.formInput();
            });
        },
        //表单信息
        formInput: function () {
            $(".info-table-box").html(newManufacturer);
            new Vue({
                el: ".input-form",
                //数据
                data: {
                    //地址
                    address: {
                        //省份
                        province: Params.province,
                        provinceActive: {
                            areaName: Params.province[0].areaName,
                            active: {}
                        },
                        //城市
                        city: Params.city,
                        cityActive: {
                            areaName: Params.city[0].areaName,
                            active: {}
                        },
                        //区县
                        area: Params.area,
                        areaActive: {
                            areaName: Params.area[0].areaName,
                            active: {}
                        },
                        title: "厂商地址",
                        placeholder: "请填写厂商地址",
                        value: "",
                        class: "",
                        hint: "",
                        warning: false,
                        success: false,
                        //失去焦点事件
                        blur: function (val) {
                            //验证是否有值
                            Check.haveValue(val, "厂商地址不能为空");
                        }
                    },
                    //列表
                    list: [{
                        title: "生厂产商",
                        placeholder: "请输入",
                        class: "",
                        hint: "",
                        value: "",
                        warning: false,
                        success: false,
                        //失去焦点事件
                        blur: function (val) {
                            //验证是否有值
                            Check.haveValue(val, "生厂产商不能为空");
                        }
                    }, {
                        title: "工厂编码",
                        placeholder: "请输入",
                        class: "",
                        hint: "",
                        value: "",
                        warning: false,
                        success: false,
                        //失去焦点事件
                        blur: function (val) {
                            //验证是否有值
                            Check.haveValue(val, "工厂编码不能为空");
                        }
                    }, {
                        title: "联系电话",
                        placeholder: "请输入",
                        class: "",
                        hint: "",
                        value: "",
                        warning: false,
                        success: false,
                        //失去焦点事件
                        blur: function (val) {
                            //验证联系电话
                            Check.ifPhone(val);
                        }
                    }, {
                        title: "联系人",
                        placeholder: "请输入",
                        class: "",
                        hint: "",
                        value: "",
                        warning: false,
                        success: false,
                        //失去焦点事件
                        blur: function (val) {
                            //验证是否有值
                            Check.haveValue(val, "联系人不能为空");
                        }
                    }],
                    tool: {
                        submitClass: "btn-success btn-submit",
                        submitValue: "保存",
                        cancelClass: "btn-default",
                        cancelValue: "取消"
                    }
                },
                methods: {
                    focus: function (val) {
                        val.warning = false;
                        val.hint = "";
                    },
                    //等级选择
                    selectRank: function (option, rank) {
                        if (!option.checked) {
                            for (var i = 0; i < rank.checkboxs.length; i++) {
                                rank.checkboxs[i].checked = false;
                            }
                            option.checked = true;
                            rank.active = option.id;
                        }
                    },
                    //省份选择
                    provinceSelect: function (option, val, index) {
                        val.provinceActive.areaName = option.areaName;
                        //设置选中ID
                        this.setParam(val.provinceActive.active, "id", option.id);
                        //删除提示
                        if (option.id) {
                            val.hint = "";
                        }
                        //获取城市
                        Tool.area({areaId: option.id}, function (resp) {
                            if (!option.id) {
                                resp = [];
                            }
                            //城市默认值
                            val.city = Params.city;
                            val.city = val.city.concat(resp);
                            val.cityActive.areaName = Params.city[0].areaName;
                            val.cityActive.areaId = "";
                            //区域默认值
                            val.area = Params.area;
                            val.areaActive.areaName = Params.area[0].areaName;
                            val.areaActive.areaId = "";
                        });
                    },
                    //城市选择
                    citySelect: function (option, val, index) {
                        val.cityActive.areaName = option.areaName;
                        //设置选中ID
                        this.setParam(val.cityActive.active, "id", option.id);
                        //获取区域
                        Tool.area({areaId: option.id}, function (resp) {
                            if (!option.id) {
                                resp = [];
                            }
                            //区域默认值
                            val.area = Params.area;
                            val.area = val.area.concat(resp);
                            val.areaActive.areaName = Params.area[0].areaName;
                            val.areaActive.areaId = "";
                        });
                    },
                    //区域选择
                    areaSelect: function (option, val) {
                        val.areaActive.areaName = option.areaName;
                        //设置选中ID
                        this.setParam(val.areaActive.active, "id", option.id);
                    },
                    //设置参数
                    setParam: function (data, param, id) {
                        if (id) {
                            data[param] = id;
                        } else {
                            data = {};
                        }
                    },
                    //保存
                    submit: function () {
                        if (this.dislabedSubmit) {
                            return;
                        }
                        //验证列表不正确
                        if (Check.list(this.list)) {
                            return;
                        }
                        //是否填写了省份
                        if (!this.address.provinceActive.active.id) {
                            //提示框-警告
                            Tool.alertboxWarning("请选择厂商地址的省份");
                            return;
                        }
                        //厂商地址
                        if (!this.address.success) {
                            this.address.blur(this.address);
                            return;
                        }
                        var data = {
                            factoryName: this.list[0].value,
                            factoryCode: this.list[1].value,
                            factoryMobile : this.list[2].value,
                            factoryContact: this.list[3].value,
                            factoryAddr: this.address.value,
                            province: this.address.provinceActive.active,
                            city: this.address.cityActive.active,
                            district: this.address.areaActive.active
                        };
                        //btn提交等待中
                        Tool.btnStautsBusy("新增厂商");
                        this.dislabedSubmit = true;
                        //保存
                        this.save(data);
                    },
                    //保存
                    save: function (data) {
                        var self = this;
                        $.ajax({
                            url: API.factorySave,
                            type: "post",
                            dataType: "json",
                            contentType: "application/json",
                            data: JSON.stringify(data),
                            success: function (resp) {
                                if (resp.code == 0) {
                                    //btn提交成功
                                    Tool.btnStautsSuccess("新增厂商成功", "保存", function () {
                                        location.href = "./manufacturer.html";
                                    });
                                    //提示框-成功 
                                    Tool.alertboxSuccess("新增厂商成功");
                                } else {
                                    //btn提交失败
                                    Tool.btnStautsError("新增厂商失败", "保存");
                                    //提示框-错误
                                    Tool.alertboxError(resp.msg);
                                    self.dislabedSubmit = false;
                                }
                            },
                            error: function (resp) {
                                //btn提交失败
                                Tool.btnStautsError("新增厂商失败", "保存");
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