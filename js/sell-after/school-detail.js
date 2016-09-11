/*
 * 学校详情列表页面
 * */
define(['Tool','component','text!/tpl/sell-after/school-device-detail.html','text!/tpl/sell-after/school-strainer-detail.html','text!/tpl/sell-after/buy-history.html'],function(Tool,component,deviceDetail,deviceStrainer,buyHistory){
    var urlParam = Tool.getUrlParam();
    //参数 
    var Params = {

    }
    var init = {
        default : function(){
            init.base();
            //获取设备详情
            init.getDeviceDetail();
            //获取滤镜详情
            init.getDeviceStrainer();
            //服务购买记录
            init.buyHistory();
        },
        base : function(){
            //位置信息
            Tool.location([{
                class : "",
                href : "javascript:void(0)",
                text : "售后设备"
            },{
                class : "hover",
                href : "./school-device.html",
                text : "校园新风"
            },{
                class : "",
                href : "javascript:void(0)",
                text : "查看详情"
            }]);
        },
        //获取设备详情
        getDeviceDetail : function(){
            if(urlParam.deviceId){
                //添加正在加载中...
                Tool.createLoadding(['.device-detail']);
                $.ajax({
                    url : API.sellDeviceDetail,
                    data : {
                        deviceId : urlParam.deviceId,
                    },
                    type : "post",
                    success : function(resp){
                        if(resp.code==0){
                            //表格信息
                            init.deviceDetail(resp.data);
                        }else{
                            $('.device-detail').html("");
                            //没有结果
                            init.nothingInfo(resp.msg,'question',['.device-detail']);
                        }
                    }
                });
            }
        },
        //表格信息
        deviceDetail : function(detail){
            $(".device-detail").html(deviceDetail);
            // 创建表格信息
            new Vue({
                el: '.device-detail-table',
                data : {
                    number : 1,
                    titles : [
                        { text : "序号"},
                        { text : "设备类型"},
                        { text : "设备SN编码"},
                        { text : "生产厂商"},
                        { text : "是否联网"},
                        { text : "销售渠道"},
                        { text : "经销商（公司）", },
                        { text : "设备运行地址"}
                    ],
                    detail : detail
                }
            });
        },
        //获取滤镜详情
        getDeviceStrainer : function(){
            if(urlParam.strainerId){
                //添加正在加载中...
                Tool.createLoadding(['.device-strainer']);
                $.ajax({
                    url : API.sellDeviceStrainerDetail,
                    data : {
                        strainerId : urlParam.strainerId,
                    },
                    type : "post",
                    success : function(resp){
                        if(resp.code==0){
                            //表格信息
                            init.deviceStrainer(resp.data);
                        }else{
                            $('.device-strainer').html("");
                            //没有结果
                            init.nothingInfo(resp.msg,'question',['.device-strainer']);
                        }
                    } 
                });
            }
        },
        //渲染滤镜详情
        deviceStrainer : function(detail){
            $(".device-strainer").html(deviceStrainer);
            // 创建表格信息
            new Vue({
                el: '.device-strainer-table',
                data : { 
                    number : 1,
                    titles : [ 
                        { text : "序号"},
                        { text : "滤网类型"},
                        { text : "滤网SN编码"}, 
                        { text : "滤网寿命"},
                        { text : "滤网更换时间"},
                        { text : "生产厂商"},
                        { text : "是否绑定"},
                        { text : "销售渠道"},
                        { text : "经销商（公司）" }
                    ],
                    detail : detail
                }
            });
        },
        //服务购买记录
        buyHistory : function(){
            //添加正在加载中...
            Tool.createLoadding(['.buy-history']);
            $.ajax({
                url : API.schoolClassServiceList,
                data : {
                    deviceId : urlParam.deviceId,
                }, 
                type : "post",
                success : function(resp){
                    if(resp.code==0){
                        //服务购买详情
                        init.buyHistoryDetail(resp.data||[]);
                    }else{
                        $('.buy-history').html("");
                        //没有结果
                        init.nothingInfo(resp.msg,'question',['.buy-history']);
                    }
                } 
            });
        }, 
        //服务购买详情 
        buyHistoryDetail : function(dataList){
            $(".buy-history").html(buyHistory);
            // 创建表格信息
            new Vue({
                el: '.buy-history-table',
                data : { 
                    titles : [ 
                        { text : "序号"},
                        { text : "购买账号"},
                        { text : "购买金额"}, 
                        { text : "购买时间"},
                        { text : "服务到期时间"},
                        { text : "发票抬头"},
                        { text : "发票联系人"},
                        { text : "发票联系电话"},
                        { text : "发票地址" }
                    ],
                    dataList : dataList
                }
            });
        },
        //没有结果
        nothingInfo : function(searchVal,status,box){
            //无结果
            Tool.nothing({
                searchVal:!status&&(searchVal||""),
                question : status=="question"?searchVal:""
            },box);
        },
    };
    init.default();

});