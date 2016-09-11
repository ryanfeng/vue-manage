/*
 * 查看经销商设备列表页面
 * */
define(['Tool','component','text!/tpl/system-dealer/device-list.html'],function(Tool,component,deviceList){
    var urlParam = Tool.getUrlParam();
    //参数
    var Params = {
        limit : 10,
        page : urlParam.page||0,
        categoryId : urlParam.categoryId,
        modelId : urlParam.modelId,
        deviceSn : urlParam.deviceSn
    }
    var init = {
        default : function(){ 
            init.base();
            //获取列表
            init.getDeviceList();
            //获取设备分类列表
            init.getDeviceCategoryList(); 
        },
        base : function(){
            $("."+urlParam.body).addClass("active");
            //位置信息
            Tool.location([{ 
                class : "",
                href : "javascript:void(0)",
                text : "经销商管理" 
            },{
                class : "hover",
                href : urlParam.body=="system-dealer-retail"?"./retail.html":"./trade.html",
                text : urlParam.body=="system-dealer-retail"?"零售经销商":"行业经销商"
            },{
                class : "",
                href : "javascript:void(0)",
                text : "查看设备" 
            }]);
            //搜索
            Tool.search({
                placeholder : "请输入sn编码查询",
                val : Params.deviceSn||"",
            },{
                //提交搜索
                submitSearch : function(val,info){
                    Params.deviceSn=val;
                    Params.page=0;
                    //改变链接值
                    Tool.changeUrlVal([
                        {name:"deviceSn",val:val},
                        {name:"page",val:""}
                    ]);
                    //获取设备列表
                    init.getDeviceList();
                } 
            });
        },
        //获取设备分类列表
        getDeviceCategoryList : function(){
            $.ajax({
                url :API.categoryList,
                type:"POST",
                success : function(resp){
                    if(resp.code==0){
                        //获取当前已选中信息
                        var active = "";
                        for(var i=0;i<resp.data.length;i++){
                            if(resp.data[i].categoryId==Params.categoryId){
                                active = {
                                    categoryName : resp.data[i].categoryName,
                                    categoryId : resp.data[i].categoryId
                                };
                                resp.data[i].class = "selected";
                            }
                        }
                        Params.categoryId = Params.categoryId||resp.data[0].categoryId;
                        //插入
                        resp.data.unshift({
                            categoryName : "请选择设备分类",
                            class : Params.categoryId?"":"selected"
                        });
                        //获取设备型号列表
                        Params.categoryList = {
                            active : active||{
                                categoryName : "请选择设备分类"
                            },
                            list : resp.data
                            
                        };
                        //获取设备型号列表
                        init.getDeviceModelList();
                    }else{
                        //提示框-错误
                        Tool.alertboxError(resp.msg);
                    }
                }
            });
        },
        //获取设备型号列表
        getDeviceModelList : function(callback){
            $.ajax({
                url :API.findByCategory,
                type:"POST",
                data : {
                    categoryId : Params.categoryId
                },
                success : function(resp){
                    if(resp.code==0){
                        //获取当前已选中信息
                        var active = "";
                        for(var i=0;i<resp.data.length;i++){
                            resp.data[i].class = "";
                            if(resp.data[i].modelId==Params.modelId){
                                active = {
                                    modelName : resp.data[i].modelName, 
                                    modelId : resp.data[i].modelId
                                };
                                resp.data[i].class = "selected";
                            }
                        }
                        //插入 
                        resp.data.unshift({
                            modelName : "请选择设备类型",
                            class : Params.modelId?"":"selected"
                        });
                        if(callback){
                            callback(active||{
                                modelName : "请选择设备类型"
                            },resp.data);
                        }else{
                            //筛选
                            Params.modelList = {
                                active : active||{
                                    modelName : "请选择设备类型"
                                },
                                list : resp.data,
                                select : function(list,modelList) {
                                        modelList.active = {
                                            modelName : list.modelName,
                                            modelId : list.modelId
                                        };
                                        Params.modelId = list.modelId;
                                        Params.page=0;
                                        //改变链接值
                                        Tool.changeUrlVal([
                                            {name:"modelId",val:list.modelId},
                                            {name:"page",val:""}
                                        ]);
                                        //获取设备列表
                                        init.getDeviceList();
                                    }
                            };
                            init.select();
                        }
                    }else{
                        //提示框-错误
                        Tool.alertboxError(resp.msg);
                    }
                },
                error: function(resp){
                    console.log(resp,'失败')
                }
            });
        },
        //获取设备列表
        getDeviceList : function(){
            var data = {
                dealerId : urlParam.dealerId,
                deviceSn : Params.deviceSn,
                categoryId : Params.categoryId,
                modelId : Params.modelId, 
                page : Params.page,
                limit : Params.limit
            }; 
            //添加正在加载中...
            Tool.createLoadding();
            $.ajax({
                url :API.deviceList,
                type:"POST",
                data : data,
                success : function(resp){
                    if(resp.code==0){
                        if(resp.data&&resp.data.length){
                            //表格信息
                            init.infoTable(resp.data);
                            //页码 
                            init.page(resp.info);
                        }else{
                            if(Params.deviceSn){
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
        //筛选
        select : function(){
            new Vue({
                el: '.select',
                data : {
                    title : "筛选条件：",
                    categoryList : Params.categoryList,
                    modelList : Params.modelList
                },
                methods : {
                    selectCategory : function(list,categoryList) {
                        categoryList.active = {
                            categoryName : list.categoryName,
                            categoryId : list.categoryId
                        };
                        Params.categoryId = list.categoryId;
                        Params.modelId = "";
                        Params.page=0; 
                        //改变链接值 
                        Tool.changeUrlVal([ 
                            {name:"categoryId",val:list.categoryId},
                            {name:"modelId",val:""},
                            {name:"page",val:""} 
                        ]);
                        //获取设备列表
                        init.getDeviceList();
                        var self = this;
                        //获取设备型号列表
                        init.getDeviceModelList(function(active,list){
                            self.modelList.active = active;
                            self.modelList.list = list;
                        });
                    }
                }
            });
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
        //表格信息
        infoTable : function(dataList){
            $(".info-table-box").html(deviceList);
            // 创建表格信息
            new Vue({
                el: '.info-table',
                data : {
                    page : Params.page*Params.limit,
                    titles : [
                        { text : "序号"},
                        { text : "设备型号"},
                        { text : "设备类型"},
                        { text : "生产厂商"},
                        { text : "sn编码"},
                    ],
                    dataList : dataList
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
                //获取列表
                init.getDeviceList();
            });
        },
    };
    init.default();

});