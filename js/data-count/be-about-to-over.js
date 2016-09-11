/*
* 即将到期列表页面
* */
define(['Tool','component','text!/tpl/data-count/be-about-to-over.html'],function(Tool,component,over){
    var urlParam = Tool.getUrlParam();
    //参数
    var Params = {
        limit : 10,
        channelId : urlParam.channelId,
        remainLifeSort : urlParam.remainLifeSort||"",
        page : urlParam.page||0
    }
    console.log(Params);
    var init = {
        default : function(){
            init.base();
            //获取即将到期信息
            init.getBeAboutToInfo();
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
                text : "一周内到期滤网数量"
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
        //获取即将到期信息
        getBeAboutToInfo : function(){
            var data = {
                page : Params.page,
                limit : Params.limit,
                channelId : Params.channelId,
                remainLifeSort : Params.remainLifeSort||0
            };
            //添加正在加载中...
            Tool.createLoadding();
            $.ajax({
                url :API.statisticsExpiringStrainers,
                type:"POST",
                data : data,
                success : function(resp){
                    if(resp.code==0){
                        resp.data = resp.data||[];
                        if(resp.data.length){
                            //获取订单类型列表
                            init.getChannelList(resp.data,resp.info);
                            return;
                        }
                        //获取订单类型列表
                        init.getChannelList(resp.data,resp.info);
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
        //获取订单类型列表
        getChannelList : function(dataList,info){
            $.ajax({
                url : API.channelList,
                type : "post",
                success : function(resp){
                    console.log(resp,'成功');
                    var channelActive = "",
                        channelList = [];
                    if(resp.code==0){
                        resp.data.unshift({channelName:"销售渠道",class:"selected"});
                        channelList = resp.data;
                        channelActive = "销售渠道";
                        //获取选中订单
                        for(var i=1;i<channelList.length;i++){
                            if(channelList[i].channelId==Params.channelId){
                                channelActive = channelList[i].channelName;
                                channelList[0].class = "";
                                channelList[i].class = "selected";
                            }
                        }
                    }
                    //表格信息
                    init.infoTable(dataList,info,channelList,channelActive);
                    //页码
                    init.page(info);
                },
                error : function(resp){
                    console.log(resp,'失败');
                } 
            });
        },
        //表格信息
        infoTable : function(dataList,info,channelList,channelActive){
            $(".info-table-box").html(over);
            // 创建表格信息
            new Vue({
                el: '.be-about-to-over-table',
                data : {
                    page : Params.page*Params.limit, 
                    caption : "即将到期滤网数量：总计："+info.totalNum+"台",
                    titles : [
                        { text : "序号"},
                        { text : "滤网类型"},
                        { text : "滤网sn编码"},
                        {  
                            select:true, 
                            active : (Params.remainLifeSort=="0"&&"倒序")||(Params.remainLifeSort=="1"&&"正序")||"滤网寿命",
                            options : [{
                                channelName : "滤网寿命",
                                class : (Params.remainLifeSort=="")&&"selected", 
                            },{
                                channelName : "正序",
                                class : (Params.remainLifeSort=="1")&&"selected",
                                remainLifeSort : "1"
                            },{
                                channelName : "倒序",
                                class : (Params.remainLifeSort=="0")&&"selected",
                                remainLifeSort : "0"
                            }],
                            click : function(val){
                                console.log(val,"123"); 
                                Params.remainLifeSort = val.remainLifeSort;
                                //改变链接值 
                                Tool.changeUrlVal([
                                    {name:"page",val:""},
                                    {name:"remainLifeSort",val:val.remainLifeSort}
                                ]);
                                //获取即将到期信息
                                init.getBeAboutToInfo();
                            }
                        },
                        { text : "是否联网"}, 
                        {
                            select:true, 
                            active : channelActive,
                            options : channelList,
                            click : function(val,list){
                                Params.channelId = val.channelId;
                                //改变链接值 
                                Tool.changeUrlVal([
                                    {name:"page",val:""},
                                    {name:"channelId",val:val.channelId}
                                ]);
                                //获取即将到期信息
                                init.getBeAboutToInfo();
                            }
                        },
                        { text : "用户名称"},
                        { text : "设备运行地址"},
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
                //获取即将到期信息
                init.getBeAboutToInfo();
            });
        }
    };
    init.default();

});