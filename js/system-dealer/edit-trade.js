/*
* 编辑行业经销商页面
* */
define(['Tool','component','text!/tpl/system-dealer/edit-trade.html'],function(Tool,component,editTrade){
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
            //获取经销商详情
            init.getDetail();
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
                text : "编辑经销商" 
            }]);
            //获取省份信息
            Tool.area("",function(resp) {
                Params.province = Params.province.concat(resp);
            });
        },
        //获取经销商详情
        getDetail : function(){
            //添加正在加载中...
            Tool.createLoadding();
            $.ajax({
                url : API.industryDetail,
                type : "post",
                data : {
                    dealerId : urlParma.dealerId
                },
                success : function(resp){
                    if(resp.code==0){
                        //获取具体地址区域信息
                        resp.data.addressInfo = [{
                            salesProvince : resp.data.addrProvince,
                            salesCity : resp.data.addrCity, 
                            salesDistrict : resp.data.addrDistrict
                        }];
                        resp.data.detailAreaInfo = [];
                        init.getAddressInfo(resp.data,"detailAreaInfo",0,function(){
                            //行业信息
                            resp.data.tradeWay = [];
                            init.getTradeWay(resp.data,0,function(){
                                //信息整理
                                init.infoNeaten(resp.data);
                            });
                            
                        });
                    }else{
                        //提示框-错误
                        Tool.alertboxError(resp.msg);
                    }
                }
            })
        },
        //信息整理
        infoNeaten : function(resp){
            console.log(resp.tradeWay);
            var data = {
                //行业渠道
                tradeWay : {
                    title : "行业渠道",
                    row : resp.salesIndustryViews.length,
                    max : 5,
                    list : resp.tradeWay
                },
                //地址
                address : resp.detailAreaInfo[0],
                //列表
                list : [{
                    title : "公司名称",
                    placeholder : "请输入",
                    class : "",
                    hint : "", 
                    value : resp.company,
                    warning : false,
                    success : true,
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
                    value : resp.contactPhone,
                    warning : false, 
                    success : true,
                    //联系人
                    user : {
                        id : "",
                        value : resp.contactName
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
            };
            //表格渲染
            init.formInput(data);
        },
        //获取行业信息
        getTradeWay : function(info,num,callback){
            var trade = info.salesIndustryViews[num];
            //获取行业列表
            init.getTradeNameList(trade,function(data){
                console.log(data);

                info.tradeWay.push({
                    first : (num==0)&&true,
                    hint : "",
                    //行业列表
                    tradeActive : data.tradeActive,
                    trades : data.tradeNameList,
                    btnClass : num==0?"btn-success":"btn-default",
                    btnValue : num==0?"添加行业+":"取消行业 "
                });
                //判断是否继续遍历
                num++;
                if(num<info.salesIndustryViews.length){
                    init.getTradeWay(info,num,callback);
                }else{
                    callback();
                }
            });
        },
        //获取销售区域信息
        getAddressInfo : function(info,param,num,callback){
            var areaInfo = info.addressInfo[num];
            //添上默认参数，防报错
            areaInfo.salesProvince = areaInfo.salesProvince||{};
            areaInfo.salesCity = areaInfo.salesCity||{};
            areaInfo.salesDistrict = areaInfo.salesDistrict||{};
            //信息赋值
            info[param].push({
                province : [{
                    areaName : "请选择省份",
                    class : "selected"
                }],
                //选中的省份
                provinceActive : {
                    areaName : areaInfo.salesProvince.areaName||"请选择省份",
                    active : areaInfo.salesProvince.id?{id:areaInfo.salesProvince.id}:{}
                },
                city : [{
                    areaName : "请选择城市",
                    class : "selected"
                }],
                //选中的城市
                cityActive : {
                    areaName : areaInfo.salesCity.areaName||"请选择城市",
                    active : areaInfo.salesCity.id?{id:areaInfo.salesCity.id}:{}
                },
                area : [{
                    areaName : "请选择区县",
                    class : "selected"
                }],
                //选中的城市
                areaActive : {
                    areaName : areaInfo.salesDistrict.areaName||"请选择区县",
                    active : areaInfo.salesDistrict.id?{id:areaInfo.salesDistrict.id}:{}
                }
            });
            //信息赋值区分
            init[param](info[param][num],info,num);
            var infoNeaten = info[param][num];
            //获取省份信息
            Tool.area("",function(resp) {
                infoNeaten.province = infoNeaten.province.concat(resp);
                //选中已选省份
                for(var i=0;i<infoNeaten.province.length;i++){
                    infoNeaten.province[i].class = "";
                    //选中省份
                    if(infoNeaten.province[i].id==areaInfo.salesProvince.id){
                        infoNeaten.province[i].class = "selected";
                        break;
                    }
                    if(i+1==infoNeaten.province.length){
                        infoNeaten.province[0].class = "selected";
                    }
                }
                //获取城市信息
                Tool.area({areaId:areaInfo.salesProvince.id},function(resp){
                    infoNeaten.city = infoNeaten.city.concat(resp);
                    //选中已选城市
                    if(areaInfo.salesCity.id){
                        for(var i=0;i<infoNeaten.city.length;i++){
                            infoNeaten.city[i].class = "";
                            //选中城市
                            if(infoNeaten.city[i].id==areaInfo.salesCity.id){
                                infoNeaten.city[i].class = "selected";
                                break;
                            }
                            if(i+1==infoNeaten.city.length){
                                infoNeaten.city[0].class = "selected";
                            }
                        }
                        //获取区县信息
                        Tool.area({areaId:areaInfo.salesCity.id},function(resp){
                            infoNeaten.area = infoNeaten.area.concat(resp);
                            //选中已选区县
                            if(areaInfo.salesDistrict.id){
                                for(var i=0;i<infoNeaten.area.length;i++){
                                    infoNeaten.area[i].class = "";
                                    //选中区县
                                    if(infoNeaten.area[i].id==areaInfo.salesDistrict.id){
                                        infoNeaten.area[i].class = "selected";
                                        break;
                                    }
                                    if(i+1==infoNeaten.area.length){
                                        infoNeaten.area[0].class = "selected";
                                    }
                                }
                                //判断是否继续遍历
                                num++;
                                if(num<info.addressInfo.length){
                                    init.getAddressInfo(info,param,num,callback);
                                }else{
                                    callback();
                                }
                            }else{
                                //判断是否继续遍历
                                num++;
                                if(num<info.addressInfo.length){
                                    init.getAddressInfo(info,param,num,callback);
                                }else{
                                    callback();
                                }
                            }
                        });
                    }else{
                        //判断是否继续遍历
                        num++;
                        if(num<info.addressInfo.length){
                            init.getAddressInfo(info,param,num,callback);
                        }else{
                            callback();
                        }
                    }
                });
            });
        },
        //具体区域初始化值
        detailAreaInfo : function(data,info,num){
            $.extend(data,{
                title : "具体地址",
                placeholder : "请填写具体地址",
                value : info.address
            });
        },
        //获取行业列表
        getTradeNameList : function(info,callback){
            $.ajax({
                url : API.industryNameList,
                type : "post",
                success : function(resp){ 
                    if(resp.code==0){
                        resp.data[0].class = "selected";
                        if(callback){//回调获取信息
                            if(info){
                                var active = resp.data[0];
                                resp.data[0].class = "";
                                for(var i=0;i<resp.data.length;i++){
                                    if(resp.data[i].industryId==info.industryId){
                                        resp.data[i].class = "selected";
                                        active = resp.data[i];
                                        console.log(resp.data,active);
                                        break; 
                                    }    
                                }
                            }else{
                                var active = resp.data[0]
                            }
                            callback({
                                tradeNameList : resp.data, 
                                tradeActive : active
                            });
                        }else{
                            //表单信息
                            init.formInput({
                                tradeNameList : resp.data,
                                tradeActive : resp.data[0]
                            });
                        }
                    }else{
                        //提示框-错误
                        Tool.alertboxError(resp.msg);
                    }
                }
            }); 
        },
        //表单信息
        formInput : function(data){

            $(".info-table-box").html(editTrade);
            new Vue({
                el: ".input-form",
                //数据
                data: data,
                created : function(){
                    //初始化获取userId
                    this.list[1].blur(this.list[1]);
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
                        init.getTradeNameList("",function(info){
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
                        Tool.btnStautsBusy("编辑行业经销商");
                        //保存
                        this.save(data);
                    },
                    //取消添加
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
                                    Tool.btnStautsSuccess("编辑行业经销商成功","保存",function(){
                                        location.href = "/html/system-dealer/trade.html";
                                    });
                                    //提示框-成功 
                                    Tool.alertboxSuccess("编辑行业经销商成功");
                                }else{
                                    //btn提交失败
                                    Tool.btnStautsError("编辑行业经销商失败","保存");
                                    //提示框-错误
                                    Tool.alertboxError(resp.msg);
                                    self.dislabedSubmit = false;
                                }
                            },
                            error : function(resp){
                                //btn提交失败
                                Tool.btnStautsError("编辑行业经销商失败","保存");
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