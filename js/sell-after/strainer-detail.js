 /*
 * 售后设备滤网详情页
 * */
define(['Tool','component','text!/tpl/sell-after/strainer-detail.html','text!/tpl/sell-after/strainer-device.html'],function(Tool,component,strainerDetail,strainerDevice){
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
        },
        base : function(){
            //位置信息
            Tool.location([{
                class : "",
                href : "javascript:void(0)",
                text : "售后设备"
            },{
                class : "hover",
                href : "./strainer.html",
                text : "设备管理" 
            },{
                class : "hover",
                href : "./strainer.html",
                text : "滤网"
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
                Tool.createLoadding(['.strainer-device']);
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
                            $('.strainer-device').html("");
                            //没有结果
                            init.nothingInfo(resp.msg,'question',['.strainer-device']);
                        }
                    }
                });
            }
        },
        //表格信息
        deviceDetail : function(detail){
            $(".strainer-device").html(strainerDevice);
            // 创建表格信息
            new Vue({
                el: '.strainer-device-table',
                data : {
                    titles : [
                        { text : "设备类型"},
                        { text : "设备SN编码"},
                        { text : "生产厂商"},
                        { text : "是否联网"},
                        { text : "销售渠道"},
                        { text : "经销商（公司）", }
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
            $(".device-strainer").html(strainerDetail);
            // 创建表格信息
            new Vue({
                el: '.strainer-detail-table',
                data : { 
                    titles : [ 
                        { text : "滤网类型"},
                        { text : "滤网SN编码"},
                        { text : "滤网寿命"},
                        { text : "是否绑定"},
                        { text : "换网时间"},
                        { text : "生产厂商"},
                        { text : "销售渠道"},
                        { text : "经销商（公司）" },
                        { text : "设备用户"},
                        { text : "设备运行地址"},
                    ],
                    detail : detail
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