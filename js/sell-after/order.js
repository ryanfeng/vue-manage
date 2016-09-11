/*
 * 订单管理列表
 * */
define(['Tool', 'component', 'text!/tpl/sell-after/order.html', 'ajaxAPI'], function (Tool, component, order, API) {
    var urlParam = Tool.getUrlParam();
    //参数
    var Params = {
        limit: 10,
        page: urlParam.page || 0,
        channelId: urlParam.channelId,
        searchCategory: decodeURIComponent(urlParam.searchCategory || "订单编号"),
        search: decodeURIComponent(urlParam.search || ""),
        isLock: urlParam.isLock || ""
    };
    var init = {
        default: function () {
            init.base();
            //添加 
            init.add();
            //获取订单列表
            init.getOrderList();
        },
        base: function () {
            //位置信息
            Tool.location([{
                class: "",
                href: "javascript:void(0)",
                text: "售后设备"
            }, {
                class: "",
                href: "javascript:void(0)",
                text: "订单管理"
            }]);
            //搜索
            Tool.search({
                placeholder: "请输入订单编号查询",
                val: Params.search,
                select: true,
                option: [{
                    text: "订单编号",
                    placeholder: "请输入订单编号查询",
                    class: Params.searchCategory == "订单编号" ? "selected" : ""
                }, {
                    text: "物流编号",
                    placeholder: "请输入物流编号查询",
                    class: Params.searchCategory == "物流编号" ? "selected" : ""
                }, {
                    text: "用户姓名",
                    placeholder: "请输入用户姓名查询",
                    class: Params.searchCategory == "用户姓名" ? "selected" : ""
                }, {
                    text: "用户电话",
                    placeholder: "请输入用户电话查询",
                    class: Params.searchCategory == "用户电话" ? "selected" : ""
                }],
                optionDefault: Params.searchCategory
            }, {
                //提交搜索
                submitSearch: function (val, info) {
                    Params.search = val;
                    Params.page = 0;
                    Params.searchCategory = info.optionDefault;
                    //改变链接值
                    Tool.changeUrlVal([
                        {name: "search", val: val},
                        {name: "page", val: ""},
                        {name: "searchCategory", val: info.optionDefault}
                    ]);
                    //获取订单列表
                    init.getOrderList();
                }
            });
        },
        //添加
        add: function () {
            new Vue({
                el: ".add",
                //数据 
                data: {
                    newBtnClass: "btn-success " + (localStorage.permissions.indexOf(",order:create,") > -1 ? "" : "hidden"),
                    newBtnValue: "新增订单＋",
                    click: function () {
                        location.href = "./new-order.html";
                    }
                }
            });
        },
        //获取订单列表
        getOrderList: function () {
            var data = {
                page: Params.page,
                channelId: Params.channelId,
                limit: Params.limit
            };
            //获取搜索类型和值
            var searchParam = init.searchParam();
            $.extend(data, init.searchParam());
            //加载数据中-生成loadding
            Tool.createLoadding();
            $.ajax({
                url: API.orderList,
                type: "POST",
                data: data,
                success: function (resp) {
                    if (resp.code == 0) {
                        if (resp.data && resp.data.length) {
                            //信息整理
                            init.infoNeaten(resp.data);
                            //页码
                            init.page(resp.info);
                        } else {
                            if (Params.search) {
                                //没有结果
                                init.nothingInfo(Params.search);
                            } else {
                                //获取订单类型列表
                                init.getChannelList([]);
                            }
                        }
                    } else {
                        //没有结果
                        init.nothingInfo(resp.msg, "question");
                    }
                }
            });
        },
        //信息整理
        infoNeaten: function (resp) {
            for (var i = 0; i < resp.length; i++) {
                resp[i].tools = {
                    detail: "查看详情"
                };
            }
            //获取订单类型列表
            init.getChannelList(resp);
        },
        //获取订单类型列表
        getChannelList: function (dataList) {
            $.ajax({
                url: API.channelList,
                type: "post",
                success: function (resp) {
                    var channelActive = "",
                        channelList = [];
                    if (resp.code == 0) {
                        resp.data.unshift({channelName: "订单类型", class: "selected"});
                        channelList = resp.data;
                        channelActive = "订单类型";
                        //获取选中订单
                        for (var i = 1; i < channelList.length; i++) {
                            if (channelList[i].channelId == Params.channelId) {
                                channelActive = channelList[i].channelName;
                                channelList[0].class = "";
                                channelList[i].class = "selected";

                            }
                        }
                    } else {
                        //提示框-错误
                        Tool.alertboxError(resp.msg);
                    }
                    //表格信息
                    init.infoTable(dataList, channelList, channelActive);
                }
            });
        },
        //没有结果
        nothingInfo: function (searchVal, status) {
            $(".info-table-box").html('');
            //无结果
            Tool.nothing({
                searchVal: !status && (searchVal || ""),
                question: status == "question" ? searchVal : ""
            });
        },
        //表格信息
        infoTable: function (dataList, channelList, channelActive) {
            $(".info-table-box").html(order);
            // 创建表格信息
            new Vue({
                el: '.info-table',
                data: {
                    page: Params.page * Params.limit,
                    titles: [
                        {text: "序号"},
                        {text: "订单编号"},
                        {text: "物留公司"},
                        {text: "物留编号"},
                        {text: "创建日期"},
                        {
                            select: true,
                            active: channelActive,
                            options: channelList,
                            click: function (channelId, list) {
                                Params.channelId = channelId;
                                Params.page=0;
                                //改变链接值 
                                Tool.changeUrlVal([
                                    {name: "page", val: ""},
                                    {name: "channelId", val: channelId}
                                ]);
                                //获取订单列表
                                init.getOrderList();
                            }
                        },
                        {text: "公司名称"},
                        {text: "订单用户"},
                        {text: "联系方式"},
                        {text: "数量"},
                        {text: "金额"},
                        {text: "操作"}
                    ],
                    dataList: dataList
                }
            });
        },
        //页码
        page: function (info) {
            if (!info || info.totalPage <= 1) {
                return;
            }
            //页码
            Tool.page(info, function (num) {
                Params.page = num;
                //改变链接值
                Tool.changeUrlVal([{name: "page", val: num}]);
                //获取订单列表
                init.getOrderList();
            });
        },
        //查询参数
        searchParam: function () {
            if (Params.searchCategory == "订单编号") {
                return {orderSn: Params.search};
            }
            if (Params.searchCategory == "物流编号") {
                return {logisticsSn: Params.search};
            }
            if (Params.searchCategory == "用户姓名") {
                return {receiverName: Params.search};
            }
            if (Params.searchCategory == "用户电话") {
                return {receiverPhone: Params.search};
            }
        }
    };
    init.default();

});