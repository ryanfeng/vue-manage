/*
 * 编辑厂商页面
 * */
define(['Tool', 'component', 'text!/tpl/pre-sales/edit-manufacturer.html'], function (Tool, component, editManufacturer) {
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
            //获取厂商详情
            init.getDetail();
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
                text: "编辑厂商"
            }]);
            //获取省份信息
            Tool.area("", function (resp) {
                Params.province = Params.province.concat(resp);
            });
        },
        //获取工厂详情  
        getDetail: function () {
            //添加正在加载中...
            Tool.createLoadding();
            $.ajax({
                url: API.factoryDetail,
                type: "post",
                data: {
                    factoryId: urlParma.factoryId
                },
                success: function (resp) {
                    if (resp.code == 0) {
                        //获取具体地址区域信息
                        resp.data.addressInfo = [{
                            salesProvince: resp.data.province || {},
                            salesCity: resp.data.city || {},
                            salesDistrict: resp.data.district || {}
                        }];
                        resp.data.detailAreaInfo = [];
                        init.getAddressInfo(resp.data, "detailAreaInfo", 0, function () {
                            //信息整理
                            init.infoNeaten(resp.data);
                        });
                    } else {
                        //提示框-错误
                        Tool.alertboxError(resp.msg);
                    }
                }
            })
        },
        //信息整理
        infoNeaten: function (resp) {
            var data = {
                //地址
                address: resp.detailAreaInfo[0],
                //列表
                list: [{
                    title: "生厂产商",
                    placeholder: "请输入",
                    class: "",
                    hint: "",
                    value: resp.factoryName,
                    warning: false,
                    success: true,
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
                    value: resp.factoryCode,
                    warning: false,
                    success: true,
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
                    value: resp.factoryMobile,
                    warning: false,
                    success: true,
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
                    value: resp.factoryContact,
                    warning: false,
                    success: true,
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
            };
            //表格渲染
            init.formInput(data);
        },
        //获取区域信息
        getAddressInfo: function (info, param, num, callback) {
            var areaInfo = info.addressInfo[num];
            //添上默认参数，防报错
            areaInfo.salesProvince = areaInfo.salesProvince || {};
            areaInfo.salesCity = areaInfo.salesCity || {};
            areaInfo.salesDistrict = areaInfo.salesDistrict || {};
            //信息赋值
            info[param].push({
                province: [{
                    areaName: "请选择省份",
                    class: "selected"
                }],
                //选中的省份
                provinceActive: {
                    areaName: areaInfo.salesProvince.areaName || "请选择省份",
                    active: areaInfo.salesProvince.id ? {id: areaInfo.salesProvince.id} : {}
                },
                city: [{
                    areaName: "请选择城市",
                    class: "selected"
                }],
                //选中的城市
                cityActive: {
                    areaName: areaInfo.salesCity.areaName || "请选择城市",
                    active: areaInfo.salesCity.id ? {id: areaInfo.salesCity.id} : {}
                },
                area: [{
                    areaName: "请选择区县",
                    class: "selected"
                }],
                //选中的城市
                areaActive: {
                    areaName: areaInfo.salesDistrict.areaName || "请选择区县",
                    active: areaInfo.salesDistrict.id ? {id: areaInfo.salesDistrict.id} : {}
                }

            });
            //信息赋值区分
            init[param](info[param][num], info, num);
            var infoNeaten = info[param][num];
            //获取省份信息
            Tool.area("", function (resp) {
                infoNeaten.province = infoNeaten.province.concat(resp);
                //选中已选省份
                for (var i = 0; i < infoNeaten.province.length; i++) {
                    infoNeaten.province[i].class = "";
                    //选中省份
                    if (infoNeaten.province[i].id == areaInfo.salesProvince.id) {
                        infoNeaten.province[i].class = "selected";
                        break;
                    }
                    if (i + 1 == infoNeaten.province.length) {
                        infoNeaten.province[0].class = "selected";
                    }
                }
                //获取城市信息
                Tool.area({areaId: areaInfo.salesProvince.id}, function (resp) {
                    infoNeaten.city = infoNeaten.city.concat(resp);
                    //选中已选城市
                    if (areaInfo.salesCity.id) {
                        for (var i = 0; i < infoNeaten.city.length; i++) {
                            infoNeaten.city[i].class = "";
                            //选中城市
                            if (infoNeaten.city[i].id == areaInfo.salesCity.id) {
                                infoNeaten.city[i].class = "selected";
                                break;
                            }
                            if (i + 1 == infoNeaten.city.length) {
                                infoNeaten.city[0].class = "selected";
                            }
                        }
                        //获取区县信息
                        Tool.area({areaId: areaInfo.salesCity.id}, function (resp) {
                            infoNeaten.area = infoNeaten.area.concat(resp);
                            //选中已选区县
                            console.log(areaInfo.salesDistrict.id);
                            if (areaInfo.salesDistrict.id) {
                                for (var i = 0; i < infoNeaten.area.length; i++) {
                                    infoNeaten.area[i].class = "";
                                    //选中区县
                                    if (infoNeaten.area[i].id == areaInfo.salesDistrict.id) {
                                        infoNeaten.area[i].class = "selected";
                                        break;
                                    }
                                    if (i + 1 == infoNeaten.area.length) {
                                        infoNeaten.area[0].class = "selected";
                                    }
                                }
                                //判断是否继续遍历
                                num++;
                                if (num < info.addressInfo.length) {
                                    init.getAddressInfo(info, param, num, callback);
                                } else {
                                    callback();
                                }
                            } else {
                                //判断是否继续遍历
                                num++;
                                if (num < info.addressInfo.length) {
                                    init.getAddressInfo(info, param, num, callback);
                                } else {
                                    callback();
                                }
                            }
                        });
                    } else {
                        //判断是否继续遍历
                        num++;
                        if (num < info.addressInfo.length) {
                            init.getAddressInfo(info, param, num, callback);
                        } else {
                            callback();
                        }
                    }
                });
            });
        },
        //具体区域初始化值
        detailAreaInfo: function (data, info, num) {
            $.extend(data, {
                title: "具体地址",
                placeholder: "请填写具体地址",
                value: info.factoryAddr,
                hint: "",
                class: "",
                warning: false,
                success: true,
                //失去焦点事件 
                blur: function (val) {
                    //验证是否有值
                    Check.haveValue(val, "厂商地址不能为空");
                }
            });
        },
        //表单信息
        formInput: function (data) {
            $(".info-table-box").html(editManufacturer);
            new Vue({
                el: ".input-form",
                //数据
                data: data,
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
                            factoryId: urlParma.factoryId,
                            factoryName: this.list[0].value,
                            factoryCode: this.list[1].value,
                            factoryMobile: this.list[2].value,
                            factoryContact: this.list[3].value,
                            factoryAddr: this.address.value,
                            province: this.address.provinceActive.active,
                            city: this.address.cityActive.active,
                            district: this.address.areaActive.active
                        };
                        //btn提交等待中
                        Tool.btnStautsBusy("编辑厂商");
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
                                    Tool.btnStautsSuccess("编辑厂商成功", "保存", function () {
                                        location.href = "./manufacturer.html";
                                    });
                                    //提示框-成功 
                                    Tool.alertboxSuccess("编辑厂商成功");
                                } else {
                                    //btn提交失败
                                    Tool.btnStautsError("编辑厂商失败", "保存");
                                    //提示框-错误
                                    Tool.alertboxError(resp.msg);
                                    self.dislabedSubmit = false;
                                }
                            },
                            error: function (resp) {
                                //btn提交失败
                                Tool.btnStautsError("编辑厂商失败", "保存");
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