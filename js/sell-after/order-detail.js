/*
* 订单详情页面
* */
define(['Tool','component','text!/tpl/sell-after/order-detail.html','text!/tpl/sell-after/order-detail_device.html'],function(Tool,component,orderDetail,deviceList){
    var urlParam = Tool.getUrlParam();
    //参数
    var Params = { 
        limit : 10,
        orderId : urlParam.orderId,
        searchCategory : decodeURIComponent(urlParam.searchCategory||"滤网sn"),
        search : decodeURIComponent(urlParam.search||""),
        page : urlParam.page||0
    }
    var init = {
        default : function(){ 
            init.base(); 
            //获取订单详情
            init.getOrderDetail();
            //获取订单设备列表
            init.getOrderDeviceList();
        },
        base : function(){
            //位置信息
            Tool.location([{
                class : "",
                href : "javascript:void(0)",
                text : "售后设备" 
            },{
                class : "hover",  
                href : "./order.html",
                text : "订单管理" 
            },{
                class : "",
                href : "javascript:void(0)",
                text : "查看详情" 
            }]);
            //搜索
            Tool.search({
                placeholder : "请输入滤网sn查询",
                val : Params.search,
                select : true, 
                option : [{
                    text : "滤网sn",
                    placeholder : "请输入滤网sn查询",
                    class : Params.searchCategory=="滤网sn"?"selected":""
                },{
                    text : "设备sn",
                    placeholder : "请输入设备sn查询",
                    class : Params.searchCategory=="设备sn"?"selected":""
                }],
                optionDefault : Params.searchCategory
            },{
                //提交搜索
                submitSearch : function(val,info){
                    Params.search=val;
                    Params.page=0;
                    Params.searchCategory=info.optionDefault;
                    //改变链接值
                    Tool.changeUrlVal([
                        {name:"search",val:val},
                        {name:"page",val:""},
                        {name:"searchCategory",val:info.optionDefault}
                    ]);
                    //获取订单设备列表
                    init.getOrderDeviceList();
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
        //获取批次详情
        getOrderDetail : function(){
            var data = {
                orderId : Params.orderId
            };
            //添加正在加载中...
            Tool.createLoadding(['.detail-info']);
            $.ajax({
                url :API.orderDetail,
                type:"POST",
                data : data,
                success : function(resp){
                    if(resp.code==0){
                        //信息整理
                        init.detailInfo(resp.data);
                    }else{
                        $('.detail-info').html("");            
                        Tool.nothing({
                            question : resp.msg||"获取详情失败",
                            hints:[]
                        },['.detail-info']);
                    }
                }
            });
        },
        //获取订单设备列表
        getOrderDeviceList : function(){
            var data = {
                orderId : Params.orderId,
                page : Params.page,
                limit : Params.limit
            };
            //获取搜索类型和值
            var searchParam = init.searchParam()
            $.extend(data,init.searchParam());
            //添加正在加载中...
            Tool.createLoadding(['.info-table-box']);
            $.ajax({
                url :API.orderListDevice,
                type:"POST",
                data : data,
                success : function(resp){
                    if(resp.code==0){
                        if(resp.data.length){
                            //表格信息
                            init.deviceInfoList(resp.data); 
                            //页码
                            init.page(resp.info);
                        }else{
                            if(Params.sn){
                                //没有结果
                                init.nothingInfo(Params.sn);
                            }else{
                                //表格信息
                                init.deviceInfoList([]);
                            }
                        }
                    }else{
                        //没有结果
                        init.nothingInfo("","question"); 
                    }
                }
            });
        },
        //详情信息
        detailInfo : function(val){
            $(".detail-info").html(orderDetail);
            // 创建表格信息
            new Vue({
                el: '.detail-info',
                data : {
                    titles : [
                        { text : "订单编号"},
                        { text : "物流编号"},
                        { text : "创建日期"},
                        { text : "经销商（公司）"},
                        { text : "订单类型"},
                        { text : "用户名称"},
                        { text : "联系方式"},
                        { text : "数量"}
                    ],
                    val : val
                }
            });
        },
        //设备列表信息
        deviceInfoList : function(dataList){
            $(".info-table-box").html(deviceList);
            // 创建表格信息
            new Vue({
                el: '.order-device-list',
                data : {
                    page : Params.page*Params.limit,
                    titles : [
                        { text : "序号"},
                        { text : "滤网类型"},
                        { text : "滤网sn"},
                        { text : "设备类型"},
                        { text : "设备sn"},
                        { text : "（设备）生产厂商"},
                        { text : "（滤网）生产厂商"}, 
                    ],
                    dataList : dataList,
                    categoryCode : urlParam.categoryCode
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
                //获取订单设备列表
                init.getOrderDeviceList();
            });
        },
        //查询参数
        searchParam : function(){
            if(Params.searchCategory=="滤网sn"){
                return {strainerSn:Params.search};
            }
            if(Params.searchCategory=="设备sn"){
                return {deviceSn:Params.search};
            }
        }
    };
    init.default();
});