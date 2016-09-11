/*
 * 设备分类列表页面
 * */
define(['Tool','component','text!/tpl/pre-sales/device.html'],function(Tool,component,device){
    var urlParam = Tool.getUrlParam();
    //参数
    var Params = {
        limit : 10,
        modelName : decodeURIComponent(urlParam.modelName||""),
        page : urlParam.page||0,
        categoryId : urlParam.categoryId
    };
    var init = {
        default : function(){
            init.base();
            //添加
            init.add();
            //获取设备分类列表
            init.getDeviceCategoryList();
            //获取设备型号列表
            init.getDeviceModelList();
        },
        base : function(){
            //位置信息
            Tool.location([{
                class : "",
                href : "javascript:void(0)",
                text : "售前设备" 
            },{
                class : "",
                href : "javascript:void(0)",
                text : "设备分类" 
            }]);
            //搜索
            Tool.search({
                placeholder : "请输入设备类型",
                val : Params.modelName
            },{
                //提交搜索
                submitSearch : function(val,info){
                    Params.modelName=val;
                    Params.page=0;
                    //改变链接值
                    Tool.changeUrlVal([
                        {name:"modelName",val:val},
                        {name:"page",val:""}
                    ]);
                    //获取设备型号列表
                    init.getDeviceModelList();
                }
            });
            //判断权限-新增类型
            if(localStorage.permissions.indexOf(",category:add,")){
                $(".new-category").removeClass("hidden");
            }
        },
        //展示分类
        category : function(info){
            var data = {
                list : [
                    { text : "全部分类" ,active:urlParam.categoryId?"":"active"}
                ]
            };
            //获取信息
            for(var i=0;i<info.length;i++){ 
                info[i].text = info[i].categoryName;
                if(info[i].categoryId==urlParam.categoryId){
                    info[i].active = "active";
                }else{
                    info[i].active = "";
                }
                data.list.push(info[i]);
            }
            //创建分类
            Tool.category(data,{
                select : function(val){
                    Params.categoryId=val.categoryId;
                    Params.page=0; 
                    //改变链接值
                    Tool.changeUrlVal([
                        {name:"categoryId",val:val.categoryId},
                        {name:"page",val:""}
                    ]);
                    //获取设备型号列表
                    init.getDeviceModelList();
                }
            });
        },
        //添加
        add : function(){
            new Vue({
                el: ".add",
                //数据
                data: {
                    newBtnClass : "btn-success "+(localStorage.permissions.indexOf(",model:add,")>-1?"":"hidden"),
                    newBtnValue : "创建型号＋"
                },
                //事件
                methods : {
                    //添加
                    new : function(){
                        location.href = "./new-model.html";
                    }
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
                        if(resp.data.length){
                            //展示分类
                            init.category(resp.data);
                        }else{
                            //提示框-错误
                            Tool.alertboxError("没有设备分类");
                        }
                    }else{
                        //提示框-错误
                        Tool.alertboxError(resp.msg);
                    }
                }
            });
        },
        //获取设备型号列表
        getDeviceModelList : function(){
            //添加正在加载中...
            Tool.createLoadding();
            $.ajax({
                url :API.modelList,
                type:"POST", 
                data : {
                    page : Params.page,
                    limit : Params.limit,
                    modelName : Params.modelName,
                    categoryId : Params.categoryId
                },
                success : function(resp){
                    if(resp.code==0){
                        if(resp.data.length){
                            //信息整理
                            init.infoNeaten(resp.data);
                            //页码
                            init.page(resp.info);
                        }else{
                            if(Params.modelName){
                                //没有结果
                                init.nothingInfo(Params.modelName);
                                Params.modelName = ""
                                $('.searchVal').val("")
                                Tool.changeUrlVal([
                                    {name:"modelName",val:""},
                                    {name:"page",val:""}
                                ]);
                                return;
                            }else{
                                //表格信息
                                init.infoTable([]);
                            }
                        }
                    }else{
                        //没有结果
                        init.nothingInfo("","question");
                    }
                }
            });
        },
        //信息整理
        infoNeaten : function(resp){
            for(var i=0;i<resp.length;i++){
                resp[i].tools = {
                    edit : "修改",
                    editShow : localStorage.permissions.indexOf(",model:update,")>-1?true:false,
                };
            }
            //表格信息
            init.infoTable(resp);
        },
        //表格信息
        infoTable : function(dataList){
           $(".info-table-box").html(device);
            // 创建表格信息
            new Vue({
                el: '.info-table',
                data : {
                    page : Params.page*Params.limit,
                    titles : [
                        { text : "序号"},
                        { text : "分类"},
                        { text : "设备型号"},
                        { text : "操作", styleObject : {
                            "width" : "150px"
                        }}
                    ],
                    dataList : dataList
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
                //获取设备型号列表
                init.getDeviceModelList();
            });
        }
    };
    init.default();

});