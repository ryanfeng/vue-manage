/*
* 数据统计页面
* */
define(['Tool','component','text!/tpl/data-count/trend-table.html','/js/plugIn/echarts.min.js'],function(Tool,component,trendTable,echarts){
    var  urlParam = Tool.getUrlParam();
    var Params = {
    };  
    var init = {
        default : function(){
            //获取趋势分析信息
            init.getTrendInfo();
            //获取新增用户信息
            init.getNewUserInfo();
            //获取新增设备信息
            init.getNewDeviceInfo();
            //获取终端统计
            init.getCountUserNum();
        },
        //获取趋势分析信息
        getTrendInfo : function(){
            $(".trend-table").html(trendTable);
            $.ajax({
                url : API.statisticsTendencyAnalyze, 
                type : "post", 
                data : {
                    startDate : Tool.getTimeDate(30),
                    endDate : Tool.getTimeDate(-1)
                    
                },
                success : function(resp){
                    if(resp.code==0){
                        //展示趋势分析
                        init.showTrend(resp.data);
                    }else{
                        //提示框-错误 
                        Tool.alertboxError(resp.msg);
                    }
                },
                error : function(resp){
                    console.log(resp,"失败");
                }
            });
        },
        //展示趋势分析
        showTrend : function(data){
            new Vue({
                el: ".trend",
                //数据 
                data: { 
                    time : "("+Tool.getTimeDate(30)+"—"+Tool.getTimeDate(-1)+")",
                    list : [ 
                        { 
                            title : "设备用户",
                            text : data.totalCount,
                            status : "up",
                            other : "新增设备用户4987"
                        },
                        {
                            title : "活跃用户",
                            text : data.activeCount,
                            status : "down", 
                            other : "最高峰12000"
                        },
                        {
                            title : "新用户",
                            text : data.newCount, 
                            status : "up",
                            other : "新增设备用户4987"  
                        },
                        {
                            title : "用户绑定设备数",
                            text : data.binderCount,
                            status : "up",
                            other : "04:36:23"
                        }
                    ]
                }
            });
        },
        //获取新增用户信息
        getNewUserInfo : function(){
            $.ajax({
                url : API.statisticsMonthlyNewUsers,
                type : "post",
                success : function(resp){
                    if(resp.code==0){
                        var data = [];
                        for(var i=11;i>=0;i--){
                            data.push(resp.data[0]["month"+i]);
                        }
                        //展示新增用户
                        init.showNewUser(data);
                    }else{
                        //提示框-错误
                        Tool.alertboxError(resp.msg);
                    }
                },
                error : function(resp){
                    console.log(resp,"失败");
                }
            });
        },
        //展示新增用户
        showNewUser : function(data){
            new Vue({
                el: ".new-user", 
                //数据 
                data: {
                    show : true
                }
            });
            var myChart = echarts.init($('#new-user')[0]);
            var option = {
                color: ['#3398DB'],
                tooltip : {
//                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                }, 
                xAxis : [
                    {
                        type : 'category',
                        data : Tool.getNowMonthAndAfter(),//获取现在月份至之后
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'直接访问',
                        type:'bar', 
                        barWidth: '40%',
                        data:data
                    }
                ]
            };
            myChart.setOption(option);
        },
        //获取新增设备信息
        getNewDeviceInfo : function(){
            $.ajax({
                url : API.statisticsMonthlyNewDevices,
                data : {
                    serviceType : 1
                },
                type : "post",
                success : function(resp){
                    if(resp.code==0){
                        var data = [];
                        for(var i=11;i>=0;i--){
                            data.push(resp.data[0]["month"+i]);
                        }
                        //展示新增设备
                        init.showNewDevice(data);
                    }else{
                        //提示框-错误
                        Tool.alertboxError(resp.msg);
                    }
                },
                error : function(resp){
                    console.log(resp,"失败");
                }
            });
        },
        //展示新增设备
        showNewDevice : function(data){
            new Vue({
                el: ".new-device", 
                //数据 
                data: {
                    show : true
                }
            });
            var myChart = echarts.init($('#new-device')[0]);
            var option = {
                color: ['#3398DB'],
                tooltip : {
//                  trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                }, 
                xAxis : [
                    {
                        type : 'category',
                        data : Tool.getNowMonthAndAfter(),//获取现在月份至之后
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'直接访问',
                        type:'bar', 
                        barWidth: '40%',
                        data:data
                    }
                ]
            };
            myChart.setOption(option);
        },
        //获取终端统计
        getCountUserNum : function(){
            $.ajax({
                url : API.statisticsUsersByModel,
                type : "post",
                success : function(resp){
                    console.log(resp,"成功");
                    if(resp.code==0){
                        //展示新增用户
                        // init.showNewUser(data);
                        //展示终端统计
                        init.showCountUserNum(resp.data);
                    }else{
                        //提示框-错误
                        Tool.alertboxError(resp.msg);
                    }
                }
            });
        },
        //展示终端统计
        showCountUserNum : function(datalist){
            new Vue({
                el: ".terminal-statistics",
                //数据 
                data: {
                    titles : [
                        { text : "序号"},
                        { text : "设备型号"},
                        { text : "累计用户"},
                        { text : "累计新用户"},
                        { text : "累计新用户占比"},
                        { text : "库存"}
                    ],
                    datalist : datalist
                }
            });
        }
    };
    init.default();
});