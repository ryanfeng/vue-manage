/*
* 批次管理列表页面 
* */
define(['Tool','component','text!/tpl/pre-sales/batch-list.html'],function(Tool,component,list){ 
    var urlParam = Tool.getUrlParam();
    //参数
    var Params = {
        limit : 10,
        batchName : decodeURIComponent(urlParam.batchName||""),
        page : urlParam.page||0
    }
    var init = {
        default : function(){
            init.base(); 
            //添加
            init.add();
            //获取批次列表
            init.getbatchList();
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
                text : "批次管理" 
            }]);
            //搜索
            Tool.search({
                val : Params.batchName,
                placeholder : "请输入批次名称"
            },{
                //提交搜索
                submitSearch : function(val){
                    Params.batchName=val;
                    Params.page=0;
                    //改变链接值
                    Tool.changeUrlVal([
                        {name:"batchName",val:val},
                        {name:"page",val:""}
                    ]);
                    //获取批次列表
                    init.getbatchList();
                }
            });
        },
        //添加
        add : function(){
            new Vue({
                el: ".add",
                //数据
                data: {
                    newBtnClass : "btn-success "+(localStorage.permissions.indexOf(",batch:add,")>-1?"":"hidden"),
                    newBtnValue : "添加批次＋"
                },
                //事件
                methods : {
                    //添加
                    new : function(){
                        location.href = "./new-batch.html";
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
        //获取批次列表
        getbatchList : function(){
            var data = {
                page : Params.page,
                limit : Params.limit,
                batchName : Params.batchName
            };
            //添加正在加载中...
            Tool.createLoadding();
            $.ajax({
                url :API.batchList,
                type:"POST",
                data : data,
                success : function(resp){
                    if(resp.code==0){
                        if(resp.data.length){
                            //信息整理
                            init.infoNeaten(resp.data);
                            //页码
                            init.page(resp.info);
                        }else{
                            if(Params.batchName){
                                //没有结果
                                init.nothingInfo(Params.batchName);
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
                    detail : "查看详情"
                };
            }
            //表格信息
            init.infoTable(resp);
        },
        //表格信息
        infoTable : function(dataList){
            $(".info-table-box").html(list);
            // 创建表格信息
            new Vue({
                el: '.info-table',
                data : { 
                    page : Params.page*Params.limit,
                    titles : [
                        { text : "序号"},
                        { text : "批次名称"},
                        { text : "创建时间"},
                        { text : "操作人"},
                        { text : "设备分类"},
                        { text : "设备型号"}, 
                        { text : "数量"},
                        { text : "生产厂商"},
                        { text : "操作", styleObject : {
                            "width" : "150px"
                        }}
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
                //获取批次列表
                init.getbatchList();
            });
        }
    };
    init.default();

});