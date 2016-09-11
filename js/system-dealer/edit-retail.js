/*
* 编辑零售经销商页面
* */
define(['Tool','component','text!/tpl/system-dealer/edit-retail.html'],function(Tool,component,editRetail){
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
                href : "./retail.html",
                text : "零售经销商" 
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
                url : API.retailDetail,
                type : "post",
                data : {
                    dealerId : urlParma.dealerId
                },
                success : function(resp){
                    if(resp.code==0){ 
                        //获取销售区域信息
                        resp.data.addressInfo = resp.data.salesAreaViews;
                        resp.data.salesAreaInfo = [];
                        init.getAddressInfo(resp.data,"salesAreaInfo",0,function(){
                            //获取具体地址区域信息
                            resp.data.addressInfo = [{
                                salesProvince : resp.data.addrProvince,
                                salesCity : resp.data.addrCity, 
                                salesDistrict : resp.data.addrDistrict
                            }];
                            resp.data.detailAreaInfo = [];
                            init.getAddressInfo(resp.data,"detailAreaInfo",0,function(){
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
            var data = {
                //等级
                rank : {
                    title : "等级",
                    active : 1,
                    checkboxs : [
                        {
                            name : "总代",
                            id : 1,
                            checked : (resp.level==1)&&true
                        },
                        {
                            name : "经销商",
                            id : 2,
                            checked : (resp.level==2)&&true
                        }
                    ]
                },
                //销售区域
                saleArea : {
                    title : "销售区域",
                    row : resp.salesAreaViews.length,
                    max : 5,
                    list : resp.salesAreaInfo,
                },
                //地址
                address : resp.detailAreaInfo[0],
                //列表
                list : [{
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
        //销售区域初始化值
        salesAreaInfo : function(data,info,num){
            $.extend(data,{
                first : (num==0)&&true,
                btnClass : num==0?"btn-success":"btn-default",
                btnValue : num==0?"添加区域+":"取消添加 "
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
        //表单信息
        formInput : function(data){
            $(".info-table-box").html(editRetail);
            new Vue({
                el: ".input-form",
                //数据
                data: data,
                created : function(){
                    //初始化获取userId
                    this.list[0].blur(this.list[0]);
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
//                            $(".saleArea").eq(index-1).find(".area").find("li").eq(0).addClass("selected");
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
                            dealerId : urlParma.dealerId,
                            company : "0001",
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
                        Tool.btnStautsBusy("编辑零售经销商");
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
                                    Tool.btnStautsSuccess("编辑零售经销商成功","保存",function(){
                                        location.href = "/html/system-dealer/retail.html";
                                    });
                                    //提示框-成功 
                                    Tool.alertboxSuccess("编辑零售经销商成功");
                                }else{
                                    //btn提交失败
                                    Tool.btnStautsError("编辑零售经销商失败","保存");
                                    //提示框-错误
                                    Tool.alertboxError(resp.msg);
                                    self.dislabedSubmit = false;
                                }
                            },
                            error : function(resp){
                                self.dislabedSubmit = false;
                                //btn提交失败
                                Tool.btnStautsError("编辑零售经销商失败","保存");
                            }
                        });
                    }
                }
            });
        }
    };
    init.default();
});