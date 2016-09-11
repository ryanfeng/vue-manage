/*
* 省份统计列表页面
* */
define(['Tool','component','text!/tpl/data-count/area-info.html'],function(Tool,component,areaInfo){
    var urlParam = Tool.getUrlParam();
    //参数
    var Params = {
    }
    var init = {
        default : function(){
            init.base();
            //获取区域信息
            init.getAreaInfo();
        },
        base : function(){
            //位置信息
            Tool.location([{
                class : "hover",
                href : "./index.html",
                text : "数据统计" 
            },{
                class : "",
                href : "javascript:void(0)",
                text : "全国省份统计"
            }]);
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
        //获取区域信息
        getAreaInfo : function(){
            var data = {
                page : Params.page,
                limit : Params.limit
            };
            //添加正在加载中...
            Tool.createLoadding();
            $.ajax({
                url :API.statisticsDeviceDistribution,
                type:"POST",
                success : function(resp){
                    if(resp.code==0){
                        resp.data = resp.data||[];
                        if(resp.data.length){
                            //筛选数据 
                            var data = [];
                            for(var i=0;i<resp.data.length;i++){
                                if(resp.data[i].deviceCount!=0){
                                    data.push(resp.data[i]);
                                }
                            }
                            //表格信息
                            init.infoTable(data);
                            return;
                        }
                        //页码
                        init.infoTable([]);
                        return;
                    }
                    //提示框-错误
                    Tool.alertboxError(resp.msg);
                    //没有结果
                    init.nothingInfo("没有数据","question");
                },
                error: function(resp){
                    //没有结果
                    init.nothingInfo("没有数据","question");
                }
            });
        },
        //表格信息
        infoTable : function(dataList){
            $(".info-table-box").html(areaInfo);
            // 创建表格信息
            new Vue({
                el: '.info-table-box',
                data : {
                    titles : [
                        { text : "序号"},
                        { text : "省/市/区"},
                        { text : "设备总量"},
                        { text : "设备占比份额"},
                    ], 
                    dataList : dataList
                }
            });
        }
    };
    init.default();

});