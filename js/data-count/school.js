/*
* 校园新风统计页面
* */
define(['Tool','component','/js/plugIn/echarts.min.js'],function(Tool,component,echarts){
    var  urlParam = Tool.getUrlParam();
    var Params = {
    };  
    var init = {
        default : function(){
            //获取新增设备信息
            init.getNewDeviceInfo();
            //获取校园概况
            init.getSchoolStatus();
            //获取校园设备统计列表
            init.getSchoolDeviceCountList();
        },
        //获取新增设备信息
        getNewDeviceInfo : function(){
            $.ajax({
                url : API.statisticsMonthlyNewDevices,
                data : {
                    serviceType : 2
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
                data: {
                    show : true
                }
            });
            var myChart = echarts.init($('#new-device')[0]);
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
        //获取设备类型统计用户数量
        getDeviceCountUserNum : function(){
            $.ajax({
                url : API.statisticsUsersByModel, 
                type : "post",
                success : function(resp){
                    console.log(resp,"成功");
                    if(resp.code==0){
                        
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
        //获取校园概况
        getSchoolStatus : function(){
            $.ajax({
                url : API.statisticsSchoolGeneral, 
                type : "post",
                success : function(resp){
                    console.log(resp,"成功");
                    if(resp.code==0){
                        //展示校园概况
                        init.showSchoolStatus(resp.data);
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
        //展示校园概况
        showSchoolStatus : function(data){
            new Vue({
                el: ".school-device-status",
                //数据 
                data: {
                    list : [
                        {
                            title : "设备总量",
                            text : data.deviceTotal
                        },
                        {
                            title : "运行设备数",
                            text : data.running
                        }, 
                        {
                            title : "联网设备数",
                            text : data.connected
                        }
                    ],
                    schoolList : [
                        {
                            title : "学校总数",
                            text : data.schoolCount
                        },
                        {
                            title : "班级总数",
                            text : data.classCount
                        },
                        {
                            title : "支付设备数量",
                            text : data.paid
                        },
                        {
                            title : "支付总金额",
                            text : data.amount
                        }
                    ]
                }
            });
        },
        //获取校园设备统计列表
        getSchoolDeviceCountList : function(){
            $.ajax({
                url : API.statisticsSchoolDeviceNum,
                type : "post",
                success : function(resp){
                    if(resp.code==0){
                        //展示校园设备统计列表
                        init.showSchoolDeviceCountList(resp.data);
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
        //展示校园设备统计列表
        showSchoolDeviceCountList : function(datalist){
            new Vue({
                el: ".school-device-count",
                //数据 
                data: {
                    titles : [
                        { text : "序号"},
                        { text : "经销商名称"},
                        { text : "学校名称"},
                        { text : "安装设备（数量）"},
                        { text : "购买服务设备（数量）"},
                        { text : "未购买服务设备（数量）"}
                    ],
                    datalist : datalist
                }
            });
        }
    };
    init.default();
});