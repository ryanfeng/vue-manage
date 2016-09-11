/*
* 添加零售经销商页面
* */
define(['Tool','component','text!/tpl/system-dealer/new-retail.html'],function(Tool,component,newRetail){
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
                text : "经销商管理" 
            },{
                class : "hover",
                href : "./retail.html",
                text : "零售经销商" 
            },{
                class : "",
                href : "javascript:void(0)",
                text : "新增经销商" 
            }]);
            //添加正在加载中... 
            Tool.createLoadding();
            //获取省份信息
            Tool.area("",function(resp) {
                Params.province = Params.province.concat(resp);
                //表单信息
                init.formInput();
            });
        },
        //表单信息
        formInput : function(){
            $(".info-table-box").html(newRetail);
            new Vue({
                el: ".input-form",
                //数据
                data: {
                    //等级
                    rank : {
                        title : "等级",
                        active : 1,
                        checkboxs : [
                            {
                                name : "总代",
                                id : 1,
                                checked : true
                            },
                            {
                                name : "经销商",
                                id : 2,
                                checked : false
                            }
                        ]
                    },
                    //销售区域
                    saleArea : {
                        title : "销售区域",
                        row : 1,
                        max : 5,
                        list : [{ 
                            first : true,
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
                            btnClass : "btn-success",
                            btnValue : "添加区域+"
                        }],
                    },
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
                    list : [
                        {
                            title : "手机号码",
                            placeholder : "请输入",
                            class : "",
                            hint : "", 
                            value : "",
                            warning : false,
                            success : false,  
                            //联系人
                            user : {
                                id : "",
                                value : ""
                            },
                            //失去焦点事件
                            blur : function(val){
                                //验证联系电话是否正确 在获取信息
                                Check.ifPhoneGetInfo(val);
                            }
                        },
                    ],
                    tool : {
                        submitClass : "btn-success btn-submit",
                        submitValue : "保存",
                        cancelClass : "btn-default",
                        cancelValue : "取消"
                    }
                },
                methods : {
                    focus : function(val){
                        val.warning = false;
                        val.hint = "";
                    },
                    //等级选择
                    selectRank : function(option,rank){
                        if(!option.checked){
                            for(var i=0;i<rank.checkboxs.length;i++){
                                rank.checkboxs[i].checked = false;
                            }
                            option.checked = true;
                            rank.active = option.id;
                        }
                    },
                    //省份选择
                    provinceSelect : function(option,val,index){
                        val.provinceActive.areaName = option.areaName;
                        //设置选中ID
                        this.setParam(val.provinceActive.active,"id",option.id,function(){
                            val.provinceActive.active = {};
                            val.cityActive.active = {};
                            val.areaActive.active = {};
                        });
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
                            //区域默认值
                            val.area =  Params.area;
                            val.areaActive.areaName = Params.area[0].areaName;
                            val.areaActive.areaId = "";
                        });
                    },
                    //城市选择
                    citySelect : function(option,val,index){
                        val.cityActive.areaName = option.areaName;
                        //设置选中ID
                        this.setParam(val.cityActive.active,"id",option.id,function(){
                            val.cityActive.active = {};
                            val.areaActive.active = {};
                        });
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
                        });
                    },
                    //区域选择
                    areaSelect : function(option,val){
                        val.areaActive.areaName = option.areaName;
                        //设置选中ID
                        this.setParam(val.areaActive.active,"id",option.id,function(){
                            val.areaActive.active = {};
                        });
                    },
                    //添加销售区域
                    newSaleArea : function(){
                        this.saleArea.list.push({
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
                            btnClass : "btn-default",
                            btnValue : "取消添加 "
                        });
                        this.saleArea.row = this.saleArea.list.length;
                    },
                    //取消添加销售区域
                    cancelSaleArea : function(val){
                        this.saleArea.list.splice(val,1);
                        this.saleArea.row = this.saleArea.list.length;
                    },
                    //获取销售区域 
                    getSaleArea : function(){
                        var saleArea = [],
                            list = this.saleArea.list;
                        for(var i=0;i<list.length;i++){
                            if(list[i].provinceActive.active.id){
                                saleArea.push({
                                    province : list[i].provinceActive.active,
                                    city : list[i].cityActive.active,
                                    district : list[i].areaActive.active
                                });
                            }
                        }
                        return saleArea;
                    },
                    //设置参数
                    setParam : function(data,param,id,callback){
                        if(id){ 
                            data[param] = id; 
                        }else{
                            callback();
                        }
                    },
                    //保存
                    submit : function(){
                        if(this.dislabedSubmit){ 
                            return;
                        }
                        var saleArea = this.getSaleArea();
                        //没有选择销售省份
                        if(!saleArea.length){  
                            //提示框-警告
                            Tool.alertboxWarning("至少选择一个销售省份");
                            return;
                        }
                        //验证列表不正确
                        if(Check.list(this.list)){
                            return;
                        }
                        var data = {
                            company : "",
                            dealerType : 1,
                            level : this.rank.active,
                            saleAreas : saleArea,
                            contactName : this.list[0].user.value, 
                            contactPhone : this.list[0].value,
                            addrProvince : this.address.provinceActive.active,
                            addrCity : this.address.cityActive.active,
                            addrDistrict : this.address.areaActive.active,
                            address : this.address.value,
                            user : { id : this.list[0].user.id}
                        };
                         //按扭状态改变
                        this.dislabedSubmit = true;
                        //btn提交等待中
                        Tool.btnStautsBusy("新增零售经销商");
                        //保存
                        this.save(data);
                    },
                    //保存
                    save : function(data){
                        var self = this;
                        $.ajax({
                            url : API.dealerSave,
                            type : "post",
                            dataType:"json",
	                        contentType: "application/json",
                            data : JSON.stringify(data),
                            success : function(resp){
                                if(resp.code==0){ 
                                    //btn提交成功
                                    Tool.btnStautsSuccess("新增零售经销商成功","保存",function(){
                                        location.href = "/html/system-dealer/retail.html";
                                    });
                                    //提示框-成功 
                                    Tool.alertboxSuccess("新增零售经销商成功");
                                }else{
                                    //btn提交失败
                                    Tool.btnStautsError("新增零售经销商失败","保存");
                                    //提示框-错误
                                    Tool.alertboxError(resp.msg);
                                    self.dislabedSubmit = false;
                                }
                            },
                            error : function(resp){
                                self.dislabedSubmit = false;
                                //btn提交失败
                                Tool.btnStautsError("新增零售经销商失败","保存");
                            }
                        });
                    }
                }
            });
        }
    };
    init.default();
});