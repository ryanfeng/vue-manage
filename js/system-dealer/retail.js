/*
* 零售经销商列表页面
* */
define(['Tool','component','text!/tpl/system-dealer/retail.html'],function(Tool,component,retail){
    var urlParam = Tool.getUrlParam();
    //参数
    var Params = {
        limit : 10,
        page : urlParam.page||0,
        searchCategory : decodeURIComponent(urlParam.searchCategory||"联系人"),
        provinceId : urlParam.provinceId||"",
        cityId : urlParam.cityId||"",
        districtId : urlParam.districtId||"",
        search : decodeURIComponent(urlParam.search||""),
        isEnable : urlParam.isEnable||"",
        //地址信息
        province : [{
            areaName : "省份",
            class : "selected"
        }],
        city : [{
            areaName : "市区",
            class : "selected"
        }],
        area : [{
            areaName : "县/区",
            class : "selected"
        }]
    }
    var init = {
        default : function(){
            init.base();
            //添加
            init.add();
            //获取零售经销商列表
            init.getRetailList();
        },
        base : function(){
            //位置信息
            Tool.location([{
                class : "",
                href : "javascript:void(0)",
                text : "经销商管理" 
            },{
                class : "",
                href : "javascript:void(0)",
                text : "零售经销商" 
            }]);
            //搜索
            Tool.search({
                placeholder : "请输入联系人查询",
                val : Params.search,
                select : true, 
                option : [{
                    text : "联系人",
                    placeholder : "请输入联系人查询",
                    class : Params.searchCategory=="联系人"?"selected":""
                },{
                    text : "手机号码",
                    placeholder : "请输入手机号码查询",
                    class : Params.searchCategory=="手机号码"?"selected":""
                }],
                optionDefault : Params.searchCategory
            },{
                //提交搜索
                submitSearch : function(val,info){
                    Params.search=val;
                    Params.page=0;
                    Params.searchCategory=info.optionDefault;
                    //改变链接值
                    Tool.changeUrlVal([
                        {name:"search",val:val},
                        {name:"page",val:""},
                        {name:"searchCategory",val:info.optionDefault}
                    ]);
                    //获取零售经销商列表
                    init.getRetailList();
                }
            });
            //地区信息
            var provinceActive = {},
                cityActive = {},
                areaActive = {};
            //获取省份信息
            Tool.area("",function(resp) {
                Params.province = Params.province.concat(resp);
                //选中已选省份
                if(urlParam.provinceId){
                    for(var i=0;i<Params.province.length;i++){
                        Params.province[i].class = "";
                        //选中省份
                        if(Params.province[i].id==urlParam.provinceId){
                            Params.province[i].class = "selected";
                            provinceActive = Params.province[i];
                            break;
                        }
                    }
                    //获取城市信息
                    Tool.area({areaId:urlParam.provinceId},function(resp){
                        Params.city = Params.city.concat(resp);

                        //选中已选城市
                        if(urlParam.cityId){
                            for(var i=0;i<Params.city.length;i++){
                                Params.city[i].class = "";
                                //选中城市
                                if(Params.city[i].id==urlParam.cityId){
                                    Params.city[i].class = "selected";
                                    cityActive = Params.city[i];
                                    break;
                                }
                            }
                            //获取区县信息
                            Tool.area({areaId:urlParam.cityId},function(resp){
                                Params.area = Params.area.concat(resp);
                                //选中已选区县
                                if(urlParam.districtId){
                                    for(var i=0;i<Params.area.length;i++){
                                        Params.area[i].class = "";
                                        //选中区县
                                        if(Params.area[i].id==urlParam.districtId){
                                            Params.area[i].class = "selected";
                                            areaActive = Params.area[i];
                                            break;
                                        }
                                    }
                                    //渲染销售区域
                                    init.renderSaleArea(provinceActive,cityActive,areaActive);
                                }else{
                                    //渲染销售区域
                                    init.renderSaleArea(provinceActive,cityActive,areaActive);
                                }
                            });

                        }else{
                            //渲染销售区域
                            init.renderSaleArea(provinceActive,cityActive,areaActive);
                        }
                    });
                }else{
                    //渲染销售区域
                    init.renderSaleArea(provinceActive,cityActive,areaActive);
                }
            });
        },
        //渲染销售区域
        renderSaleArea : function(provinceActive,cityActive,areaActive){
            init.saleArea({
                list : Params.province,
                active : provinceActive
            },{
                list : Params.city,
                active : cityActive
            },{
                list : Params.area,
                active : areaActive
            });
        },
        //添加
        add : function(){
            new Vue({
                el: ".add",
                //数据
                data: {
                    newBtnClass : "btn-success "+(localStorage.permissions.indexOf(",dealer:retail:add,")>-1?"":"hidden"),
                    newBtnValue : "新增＋"
                },
                //事件
                methods : {
                    //添加
                    new : function(){
                        location.href = "/html/system-dealer/new-retail.html";
                    }
                }
            });
        },
        //获取零售经销商列表
        getRetailList : function(){
            var data = {
                province : Params.provinceId,
                city : Params.cityId,
                district : Params.districtId,
                isEnable : Params.isEnable,
                page : Params.page,
                limit : Params.limit
            };
            //获取搜索类型和值
            var searchParam = init.searchParam()
            $.extend(data,init.searchParam());
            //添加正在加载中...
            Tool.createLoadding();
            $.ajax({
                url :API.retailList,
                type:"POST",
                data : data,
                success : function(resp){
                    if(resp.code==0){
                        if(resp.data&&resp.data.length){
                            //信息整理
                            init.infoNeaten(resp.data);
                            //页码
                            init.page(resp.info);
                        }else{
                            if(Params.search){
                                //没有结果
                                init.nothingInfo(Params.search);
                            }else{
                                //表格信息
                                init.infoTable([]);
                            }
                        }
                    }else{
                        //没有结果
                        init.nothingInfo(resp.msg,"question");
                    }
                }
            });
        },
        //信息整理
        infoNeaten : function(resp){
            for(var i=0;i<resp.length;i++){
                resp[i].tools = {
                    edit : "修改",
                    editShow : localStorage.permissions.indexOf(",dealer:retail:update,")>-1?true:false,
                    statusChange : localStorage.permissions.indexOf(",dealer:retail:lock,")>-1?true:false,
                    statusTrue : "锁定",
                    statusFalse : "解锁",
                    look : "查看设备",
                    del : "删除",
                    delShow : localStorage.permissions.indexOf(",dealer:retail:del,")>-1?true:false
                };
            }
            //表格渲染
            init.infoTable(resp);
        },
        //没有结果
        nothingInfo : function(searchVal,status){
            $(".info-table-box").html('');
            //无结果
            Tool.nothing({
                searchVal:!status&&(searchVal||""),
                question : status=="question"?searchVal:""
            });
        },
        //销售区域
        saleArea : function(province,city,area){
            //创建销售区域
            new Vue({
                el : ".saleArea",
                data : {
                    title : "筛选销售区域：",
                    //省份
                    province : province.list,
                    provinceActive : {
                        areaName : province.active.areaName||Params.province[0].areaName,
                        areaId : province.active.id||""
                    },
                    //城市
                    city : city.list,
                    cityActive : {
                        areaName : city.active.areaName||Params.city[0].areaName,
                        areaId : city.active.id||""
                    },
                    //区县
                    area : area.list,
                    areaActive : {
                        areaName : area.active.areaName||Params.area[0].areaName,
                        areaId : area.active.id||""
                    },
                },
                methods : {
                    //省份选择
                    provinceSelect : function(option){
                        var self = this;
                        self.provinceActive.areaName = option.areaName;
                        self.provinceActive.areaId = option.id;
                        //获取城市
                        Tool.area({areaId:option.id},function(resp) {
                            if(!option.id){
                                resp = [];
                            }
                            //城市默认值
                            self.city = [{
                                areaName : "市区",
                                class : "selected"
                            }];
                            self.city = self.city.concat(resp);
                            self.cityActive.areaName = Params.city[0].areaName;
                            self.cityActive.areaId = "";
                            //区域默认值
                            self.area =  Params.area;
                            self.areaActive.areaName = Params.area[0].areaName;
                            self.areaActive.areaId = "";
                            //记录当前选择
                            self.saveSaleArea(self);
                        });
                    },
                    //城市选择
                    citySelect : function(option){
                        var self = this;
                        self.cityActive.areaName = option.areaName;
                        self.cityActive.areaId = option.id;
                        //获取区域
                        Tool.area({areaId:option.id},function(resp) {
                            if(!option.id){
                                resp = [];
                            }
                            //区域默认值
                            self.area = [{
                                areaName : "县/区",
                                class : "selected"
                            }];
                            self.area = self.area.concat(resp);
                            self.areaActive.areaName = Params.area[0].areaName;
                            self.areaActive.areaId = "";
                            //记录当前选择
                            self.saveSaleArea(self);
                        });
                    },
                    //区域选择
                    areaSelect : function(option){
                        this.areaActive.areaName = option.areaName;
                        this.areaActive.areaId = option.id;
                        //记录当前选择
                        this.saveSaleArea(this);
                    },
                    //记录当前选择
                    saveSaleArea : function(self){
                        Params.provinceId = self.provinceActive.areaId;
                        Params.cityId = self.cityActive.areaId;
                        Params.districtId = self.areaActive.areaId;
                        //改变链接值
                        Tool.changeUrlVal([
                            {name:"page",val:""},
                            {name:"provinceId",val:self.provinceActive.areaId},
                            {name:"cityId",val:self.cityActive.areaId},
                            {name:"districtId",val:self.areaActive.areaId}
                        ]);
                        //获取零售经销商列表
                        init.getRetailList();
                    },
                }
            });
        },
        //表格信息
        infoTable : function(dataList){
            $(".info-table-box").html(retail);
            // 创建表格信息
            new Vue({
                el: '.info-table',
                data : {
                    page : Params.page*Params.limit,
                    titles : [
                        { text : "序号"},
                        { text : "等级"},
                        { text : "销售区域"},
                        { text : "入驻时间"},
                        { text : "联系人"},
                        { text : "手机号码"}, 
                        { text : "联系地址"},
                        {
                            select:true, 
                            active : (Params.isEnable=="0"&&"锁定")||(Params.isEnable=="1"&&"未锁定")||"状态",
                            options : [
                                { text : "状态",class : (Params.isEnable=="")&&"selected"},
                                { text : "锁定",isEnable:"0",class:(Params.isEnable=="0")&&"selected"},
                                { text : "未锁定",isEnable:"1",class:(Params.isEnable=="1")&&"selected"}
                            ],
                            click : function(isEnable,list){
                                Params.isEnable = isEnable;
                                //改变链接值 
                                Tool.changeUrlVal([
                                    {name:"page",val:""},
                                    {name:"isEnable",val:isEnable}
                                ]);
                                //获取零售经销商列表
                                init.getRetailList();
                            }
                        },
                        { text : "操作"}
                    ],
                    dataList : dataList
                },
                methods : {
                    //状态改变
                    statueChange : function(tool){
                        $.ajax({
                            url : API.lockUser,
                            type : "POST",
                            data : {
                                userId : tool.webUserView.id,
                                isEnable : tool.webUserView.isEnable?0:1
                            },
                            success : function(resp){
                                if(resp.code=="0"){
                                    tool.webUserView.isEnable?tool.webUserView.isEnable=0:tool.webUserView.isEnable=1;
                                }else{
                                    //提示框-错误
                                    Tool.alertboxError(resp.msg);
                                }
                            }
                        });

                    },
                    //删除用户
                    dealerDel : function(val){
                        var self = this;
                        $.ajax({
                            url :API.dealerDel,
                            type:"post",
                            data : {
                                dealerId : val.dealerId
                            },
                            success : function(resp){
                                if(resp.code==0){
                                    //btn提交成功
                                    Tool.btnStautsSuccess("删除零售经销商成功","删除",function(){
                                        location.href = "./retail.html";
                                    });
                                    //提示框-成功
                                    Tool.alertboxSuccess("删除零售经销商成功");
                                }else{
                                    //btn提交失败
                                    Tool.btnStautsError("删除零售经销商失败","删除");
                                    //提示框-错误
                                    Tool.alertboxError(resp.msg);
                                    self.dislabedSubmit = false;
                                }
                            },
                            error: function(resp){
                                //btn提交失败
                                Tool.btnStautsError("删除零售经销商失败","删除");
                                self.dislabedSubmit = false;
                            }
                        });
                    }
                }
            });
        },
        //页码
        page : function(info){
            if(!info||info.totalPage<=1){
                return;
            }
            //页码
            Tool.page(info,function(num){
                Params.page=num;
                //改变链接值
                Tool.changeUrlVal([{name:"page",val:num}]);
                //获取零售经销商列表
                init.getRetailList();
            });
        },
        //查询参数
        searchParam : function(){
            if(Params.searchCategory=="联系人"){
                return {contactName:Params.search};
            }
            if(Params.searchCategory=="手机号码"){
                return {contactPhone:Params.search};
            }
        }
    };
    init.default();

});