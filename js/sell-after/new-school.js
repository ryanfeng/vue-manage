/*
* 添加学校页面
* */
define(['Tool','component'],function(Tool,component){
    var urlParma = Tool.getUrlParam();
    var Params = {
        province : [{
            areaName : "请选择省份",
            class : "selected"
        }], 
        city : [{
            areaName : "请选择城市",
            class : "selected"
        }],
        area : [{
            areaName : "请选择区县",
            class : "selected"
        }]
    };
    
    var init = {
        default : function(){
            init.base();
        },
        base : function(){
            //位置信息
            Tool.location([{
                class : "",
                href : "javascript:void(0)",
                text : "售后设备"
            },{
                class : "hover",
                href : "./school-device.html",
                text : "校园新风"
            },{
                class : "hover",
                href : "./school-manage.html",
                text : "设备管理"
            },{
                class : "",
                href : "javascript:void(0)",
                text : "添加学校"
            }]);
            //获取省份信息
            Tool.area("",function(resp) {
                Params.province = Params.province.concat(resp);
                //表单信息
                init.formInput();                
            });
        },
        //表单信息
        formInput : function(info){ 
            new Vue({
                el: ".input-form",
                //数据
                data: {
                    //地址
                    address : {
                        //省份
                        province : Params.province,
                        provinceActive : {
                            areaName : Params.province[0].areaName,
                            active : {}
                        },
                        //城市
                        city : Params.city,
                        cityActive : {
                            areaName : Params.city[0].areaName,
                            active : {}
                        },
                        //区县
                        area : Params.area,
                        areaActive : {
                            areaName : Params.area[0].areaName,
                            active : {}
                        },
                        title : "具体地址",
                        placeholder : "请填写具体地址",
                        value : ""
                    },
                    //列表
                    list : [{
                        title : "学校名称",
                        placeholder : "请输入",
                        hint : "", 
                        value : "",
                        success : false,
                        //失去焦点事件
                        blur : function(val){
                            //验证是否有值
                            Check.haveValue(val,"公司名称不能为空");
                        }
                    },{
                        title : "联系人",
                        placeholder : "请输入",
                        hint : "", 
                        value : "",
                        success : false,
                        //失去焦点事件
                        blur : function(val){
                            //验证是否有值
                            Check.haveValue(val,"联系人不能为空");
                        }
                    },{
                        title : "联系电话",
                        placeholder : "请输入",
                        hint : "", 
                        value : "",
                        success : false,
                        //失去焦点事件
                        blur : function(val){
                            //验证联系电话
                            Check.ifPhone(val);
                        }
                    }],
                    specialTitle : "所属经销商",
                    //经销商列表
                    specialList : [{
                        title : "手机号码",
                        placeholder : "请输入",
                        class : "",
                        hint : "", 
                        value : "",
                        success : false,
                        //联系人
                        user : {
                            id : "",
                            value : ""
                        },
                        //失去焦点事件
                        blur : function(val){
                            val.API = API.photoByDealer;
                            val.paramPhone = "phone";
                            //验证联系电话是否正确 在获取信息
                            Check.ifPhoneGetInfoId(val,function(status,resp){
                                if(status=="success"){//成功
                                    val.user.id = resp.data.dealerId;
                                    val.user.value = resp.data.contactName;
                                }else{//失败
                                    val.user.id = "";
                                    val.user.value = "";
                                }
                            });
                        }
                    }],
                    tool : {
                        submitClass : "btn-success btn-submit",
                        submitValue : "保存",
                        cancelClass : "btn-default",
                        cancelValue : "取消"
                    }
                },
                methods : {
                    //省份选择
                    provinceSelect : function(option,val,index){
                        val.provinceActive.areaName = option.areaName;
                        //设置选中ID
                        this.setParam(val.provinceActive.active,"id",option.id);
                        //删除提示
                        if(option.id){
                            val.hint = "";
                        }
                        //获取城市
                        Tool.area({areaId:option.id},function(resp) {
                            if(!option.id){
                                resp = [];
                            }
                            //城市默认值
                            val.city = Params.city;
                            val.city = val.city.concat(resp);
                            val.cityActive.areaName = Params.city[0].areaName;
                            val.cityActive.areaId = "";
//                            $(".saleArea").eq(index-1).find(".city").find("li").eq(0).addClass("selected");
                            //区域默认值
                            val.area =  Params.area;
                            val.areaActive.areaName = Params.area[0].areaName;
                            val.areaActive.areaId = "";
//                            $(".saleArea").eq(index-1).find(".area").find("li").eq(0).addClass("selected");
                        });
                    },
                    //城市选择
                    citySelect : function(option,val,index){
                        val.cityActive.areaName = option.areaName;
                        //设置选中ID
                        this.setParam(val.cityActive.active,"id",option.id);
                        //获取区域
                        Tool.area({areaId:option.id},function(resp) {
                            if(!option.id){
                                resp = [];
                            }
                            //区域默认值
                            val.area =  Params.area;
                            val.area = val.area.concat(resp);
                            val.areaActive.areaName = Params.area[0].areaName;
                            val.areaActive.areaId = "";
//                            $(".saleArea").eq(index-1).find(".area").find("li").eq(0).addClass("selected");
                        });
                    },
                    //区域选择
                    areaSelect : function(option,val){
                        val.areaActive.areaName = option.areaName;
                        //设置选中ID
                        this.setParam(val.areaActive.active,"id",option.id);
                    },
                    //设置参数
                    setParam : function(data,param,id){
                        if(id){
                            data[param] = id;
                        }else{
                            data = {};
                        }
                    },
                    //保存
                    submit : function(){
                        if(this.dislabedSubmit){
                            return;
                        }
                        //验证列表不正确
                        if(Check.list(this.list,this.channel)){
                            return;
                        }
                        //验证列表不正确
                        if(Check.list(this.specialList,this.channel)){
                            return;
                        }
                        var city = $('.city>.sod_label').text()
                        $('.city,.area').removeClass('redBorder')
                        if(city=="请选择城市"){
                            $('.city').addClass('redBorder')
                        }
                        var area = $('.area>.sod_label').text()
                        if(area=="请选择区县"){
                            $('.area').addClass('redBorder')
                            return;
                        }
                        //btn提交等待中
                        Tool.btnStautsBusy("保存学校");
                        this.dislabedSubmit = true;
                        //保存
                        this.save();
                    },
                    //保存学校
                    save : function(){
                        var self = this;
                        $.ajax({
                            url : API.schoolSave,
                            type : "post",
                            dataType:"json",
	                        contentType: "application/json",
                            data : JSON.stringify({
                                schoolName : this.list[0].value,
                                contactName : this.list[1].value,
                                telphone : this.list[2].value,
                                address : this.address.value,
                                province : this.address.provinceActive.active,
                                city : this.address.cityActive.active,
                                district : this.address.areaActive.active,
                                dealer : {
                                    dealerId  : this.specialList[0].user.id
                                }
                            }),
                            success : function(resp){
                                if(resp.code==0){
                                    //btn提交成功
                                    Tool.btnStautsSuccess("保存学校成功","保存",function(){
                                        location.href = "./school-manage.html";
                                    });
                                    //提示框-成功
                                    Tool.alertboxSuccess("保存学校成功");
                                }else{
                                    //btn提交失败
                                    Tool.btnStautsError("保存学校失败","保存");
                                    //提示框-错误
                                    Tool.alertboxError(resp.msg);
                                    self.dislabedSubmit = false;
                                }
                            },
                            error : function(resp){
                                //btn提交失败
                                Tool.btnStautsError("保存学校失败","保存");
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