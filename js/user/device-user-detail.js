/*
 * 设备用户详情页面
 * */
define(['Tool','component','text!/tpl/user/device-detail.html','text!/tpl/user/strainer-detail.html','text!/tpl/user/user-detail.html', 'ajaxAPI'],function(Tool,component,deviceDetail,deviceStrainer,userDetail, API){
    var urlParam = Tool.getUrlParam();
    //参数 
    var Params = {

    };
    var init = {
        default : function(){ 
            init.base();
            //获取设备详情
            init.getDeviceDetail();
            //获取滤镜详情
            init.getDeviceStrainer();
            //获取用户设备数量
            init.getUserDeviceNum();
        },
        base : function(){
            //位置信息
            Tool.location([{
                class : "hover",
                href : "./device-user.html",
                text : "设备用户"
            },{
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
                    titles : [
                        { text : "设备类型"},
                        { text : "设备SN编码"},
                        { text : "生产厂商"},
                        { text : "是否联网"},
                        { text : "销售渠道"},
                        { text : "经销商（公司）", },
                        { text : "设备用户"},
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
                    titles : [ 
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
        //获取用户设备数量
        getUserDeviceNum : function(){
            //添加正在加载中...
            Tool.createLoadding(['.user-info-detail']);
            $.ajax({
                url : API.deviceUserDevice,
                data : {
                    appUserId : urlParam.appUserId
                }, 
                type : "post",
                success : function(resp){
                    if(resp.code==0){
                        Params.deviceNum = resp.data;
                        //用户信息
                        init.userInfo();
                    }else{
                        //提示框-错误
                        Tool.alertboxError(resp.msg);
                    }
                } 
            });
        },
        //用户信息
        userInfo : function(){
            $.ajax({
                url : API.deviceListUsers,
                data : {
                    appUserPhone : urlParam.appUserPhone
                }, 
                type : "post",
                success : function(resp){
                    if(resp.code==0){
                        //用户信息详情
                        init.userInfoDetail(resp.data[0]);
                    }else{
                        $('.user-info-detail').html("");
                        //没有结果
                        init.nothingInfo(resp.msg,'question',['.user-info-detail']);
                    }
                } 
            });
        },
        //用户信息详情
        userInfoDetail : function(detail){
            $(".user-info-detail").html(userDetail);
            // 创建表格信息
            new Vue({
                el: '.user-info-detail-table',
                data : { 
                    titles : [ 
                        { text : "设备用户"},
                        { text : "注册时间"},
                        { text : "APP类型"}, 
                        { text : "配置设备"},
                        { text : "配置滤网"},
                        { text : "滤网寿命"},
                        { text : "运行地址"},
                        { text : "设备数量"}
                    ],
                    deviceNum : Params.deviceNum,
                    detail : detail
                }
            });
        }
    };
    init.default();

});