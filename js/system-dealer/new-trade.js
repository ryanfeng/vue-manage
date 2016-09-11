/*
* 添加行业经销商页面
* */
define(['Tool','component','text!/tpl/system-dealer/new-trade.html'],function(Tool,component,newTrade){
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
                href : "./trade.html",
                text : "行业经销商" 
            },{
                class : "",
                href : "javascript:void(0)",
                text : "新增经销商" 
            }]);
            //获取省份信息
            Tool.area("",function(resp) {
                Params.province = Params.province.concat(resp);
                //添加正在加载中...
                Tool.createLoadding();
                //获取行业列表
                init.getTradeNameList();
            });
        },
        //获取行业列表
        getTradeNameList : function(callback){
            $.ajax({
                url : API.industryNameList,
                type : "post",
                success : function(resp){ 
                    if(resp.code==0){
                        resp.data[0].class = "selected";
                        if(callback){//回调获取信息
                            callback({
                                tradeNameList : resp.data,
                                tradeActive : resp.data[0]
                            });
                        }else{
                            //表单信息
                            init.formInput({
                                tradeNameList : resp.data,
                                tradeActive : resp.data[0]
                            });
                        }
                    }else{
                        //提示框-失败
                        Tool.alertboxError(resp.msg);
                    }
                }
            });
        },
        //表单信息
        formInput : function(info){
            $(".info-table-box").html(newTrade);
            new Vue({
                el: ".input-form",
                //数据
                data: {
                    //行业渠道
                    tradeWay : {
                        title : "行业渠道",
                        row : 1,
                        max : 5,
                        list : [{
                            first : true,
                            //行业列表
                            tradeActive : info.tradeActive,
                            trades : info.tradeNameList,
                            btnClass : "btn-success",
                            btnValue : "添加行业+"
                        }]
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
                    list : [{ 
                        title : "公司名称",
                        placeholder : "请输入",
                        class : "",
                        hint : "", 
                        value : "",
                        warning : false,
                        success : false,
                        //失去焦点事件
                        blur : function(val){
                            //验证是否有值
                            Check.haveValue(val,"公司名称不能为空");
                        }
                    },{
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
                    }],
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
                        });
                    },
                    //区域选择
                    areaSelect : function(option,val){
                        val.areaActive.areaName = option.areaName;
                        //设置选中ID
                        this.setParam(val.areaActive.active,"id",option.id);
                    },
                    //行业选择
                    tradeSelect : function(option,val){
                        console.log(option);
                        val.tradeActive.industryName = option.industryName;
                        //设置选中ID
                        this.setParam(val.tradeActive,"industryId",option.industryId);
                    },
                    //添加行业
                    newTradeWay : function(){
                        var self = this;
                        //获取行业列表
                        init.getTradeNameList(function(info){
                            self.tradeWay.list.push({
                                tradeActive : info.tradeActive,
                                //行业列表
                                trades : info.tradeNameList,
                                btnClass : "btn-default",
                                btnValue : "取消添加 "
                            }); 
                            self.tradeWay.row = self.tradeWay.list.length;
                        });
                    },
                    //取消添加销售区域
                    cancelTradeWay : function(val){
                        this.tradeWay.list.splice(val,1);
                        this.tradeWay.row = this.tradeWay.list.length;
                    },
                    //获取行业信息 
                    getTradeWay : function(){
                        var tradeWay = [],
                            tradeWayArray = [],
                            list = this.tradeWay.list;
                        for(var i=0;i<list.length;i++){
                            if(list[i].tradeActive.industryId&&tradeWayArray.indexOf(list[i].tradeActive.industryId)==-1){
                                tradeWay.push({  
                                    industryId : list[i].tradeActive.industryId
                                });
                                tradeWayArray.push(list[i].tradeActive.industryId);
                            }
                        }
                        return tradeWay;
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
                        var tradeWay = this.getTradeWay();
                        //验证列表不正确
                        if(Check.list(this.list)){
                            return;
                        }
                        var data = {
                            dealerId : urlParma.dealerId,
                            company : this.list[0].value,
                            dealerType : 2,
                            contactName : this.list[1].user.value, 
                            contactPhone : this.list[1].value,
                            addrProvince : this.address.provinceActive.active,
                            addrCity : this.address.cityActive.active,
                            addrDistrict : this.address.areaActive.active,
                            address : this.address.value,
                            saleIndustrys : tradeWay,
                            user : { id : this.list[1].user.id}
                        };
                        //按扭状态改变
                        this.dislabedSubmit = true;
                        //btn提交等待中
                        Tool.btnStautsBusy("新增行业经销商");
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
                                    Tool.btnStautsSuccess("新增行业经销商成功","保存",function(){
                                        location.href = "/html/system-dealer/trade.html";
                                    });
                                    //提示框-成功 
                                    Tool.alertboxSuccess("新增行业经销商成功");
                                }else{
                                    //btn提交失败
                                    Tool.btnStautsError("新增行业经销商失败","保存");
                                    //提示框-错误
                                    Tool.alertboxError(resp.msg);
                                    self.dislabedSubmit = false;
                                }
                            },
                            error : function(resp){
                                //btn提交失败
                                Tool.btnStautsError("新增行业经销商失败","保存");
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