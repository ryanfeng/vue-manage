/*
 * 设备管理列表页面
 * */
define(['Tool', 'component', 'text!/tpl/sell-after/device.html', 'ajaxAPI'], function (Tool, component, device, API) {
    var urlParam = Tool.getUrlParam();
    //参数
    var Params = {
        limit: 10,
        page: urlParam.page || 0,
        channelId: urlParam.channelId,
        categoryId: 1,
        modelId: urlParam.modelId || "",
        remainLifeSort: urlParam.remainLifeSort || "",
        searchCategory: decodeURIComponent(urlParam.searchCategory || "设备SN"),
        search: decodeURIComponent(urlParam.search || ""),
        isLock: urlParam.isLock || ""
    };
    var init = {
        default: function () {
            init.base();
            //设备菜单
            init.deivceSelect();
            //获取设备型号列表
            init.getFindByCategory();
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
                text: "设备管理"
            }, {
                class: "",
                href: "javascript:void(0)",
                text: "空气复原机"
            }]);
            //搜索
            Tool.search({
                placeholder: "请输入设备SN查询",
                val: Params.search,
                select: true,
                option: [{
                    text: "设备SN",
                    placeholder: "请输入设备SN查询",
                    class: Params.searchCategory == "设备SN" ? "selected" : ""
                }, {
                    text: "滤网SN",
                    placeholder: "请输入滤网SN查询",
                    class: Params.searchCategory == "滤网SN" ? "selected" : ""
                }, {
                    text: "设备用户",
                    placeholder: "请输入设备用户查询",
                    class: Params.searchCategory == "设备用户" ? "selected" : ""
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
                    //获取列表
                    init.getList();
                }
            });
        },
        //获取设备型号列表
        getFindByCategory: function () {
            $.ajax({
                url: API.findByCategory,
                type: "post",
                data: {
                    categoryId: Params.categoryId
                },
                success: function (resp) {
                    var active = "";
                    if (resp.code == 0) {
                        for (var i = 0; i < resp.data.length; i++) {
                            if (resp.data[i].modelId == Params.modelId) {
                                Params.modelId = resp.data[i].modelId;
                                active = i;
                                break;
                            } else {
                                resp.data[i].class = "";
                            }
                        }
                        if (!Params.modelId) {
                            Params.modelId = resp.data[0].modelId;
                            active = 0;
                        }
                        //设备型号菜单
                        init.deviceCategorySelect(resp.data, active);
                    }
                    //获取列表
                    init.getList();
                }
            });
        },
        //设备菜单
        deivceSelect: function (list) {
            new Vue({
                el: '.device-select',
                data: {
                    list: [{
                        class: "active",
                        text: "空气复原机",
                        categoryId: 1,
                        href: "javascript:void(0)"
                    }, {
                        text: "滤网",
                        categoryId: 2,
                        href: "./strainer.html"
                    }]
                }
            });
        },
        //设备型号菜单
        deviceCategorySelect: function (list, active) {
            new Vue({
                el: '.device-category-select',
                data: {
                    active: active,
                    list: list
                },
                methods: {
                    //切换设备型号
                    select: function (index, list) {
                        this.active = index;
                        Params.modelId = list.modelId;
                        Params.page = 0;
                        //改变链接值
                        Tool.changeUrlVal([
                            {name: "modelId", val: list.modelId},
                            {name: "page", val: ""}
                        ]);
                        //获取列表 
                        init.getList();
                    }
                }
            });
        },
        //获取设备列表
        getList: function () {
            var data = {
                page: Params.page,
                modelId: Params.modelId,
                categoryId: Params.categoryId,
                channelId: Params.channelId,
                remainLifeSort: Params.remainLifeSort || 0,
                limit: Params.limit
            };
            //获取搜索类型和值
            var searchParam = init.searchParam()
            $.extend(data, init.searchParam());
            //加载数据中-生成loadding
            Tool.createLoadding();
            $.ajax({
                url: API.sellDeviceList,
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
                        resp.data.unshift({channelName: "销售渠道", class: "selected"});
                        channelList = resp.data;
                        channelActive = "销售渠道";
                        //获取选中订单
                        for (var i = 1; i < channelList.length; i++) {
                            if (channelList[i].channelId == Params.channelId) {
                                channelActive = channelList[i].channelName;
                                channelList[0].class = "";
                                channelList[i].class = "selected";
                            }
                        }
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
            $(".info-table-box").html(device);
            // 创建表格信息
            new Vue({
                el: '.info-table',
                data: {
                    page: Params.page * Params.limit,
                    titles: [
                        {text: "序号"},
                        {text: "设备类型"},
                        {text: "设备SN编码"},
                        {text: "滤网类型"},
                        {text: "滤网SN编码"},
                        {
                            select: true,
                            active: (Params.remainLifeSort == "0" && "倒序") || (Params.remainLifeSort == "1" && "正序") || "滤网寿命",
                            options: [{
                                channelName: "滤网寿命",
                                class: (Params.remainLifeSort == "") && "selected",
                            }, {
                                channelName: "正序",
                                class: (Params.remainLifeSort == "1") && "selected",
                                remainLifeSort: "1"
                            }, {
                                channelName: "倒序",
                                class: (Params.remainLifeSort == "0") && "selected",
                                remainLifeSort: "0"
                            }],
                            click: function (val) {
                                Params.remainLifeSort = val.remainLifeSort;
                                //改变链接值 
                                Tool.changeUrlVal([
                                    {name: "page", val: ""},
                                    {name: "remainLifeSort", val: val.remainLifeSort}
                                ]);
                                //获取设备列表
                                init.getList();
                            }
                        },
                        {text: "运行地址"},
                        {text: "设备状态"},
                        {text: "是否联网"},
                        {
                            select: true,
                            active: channelActive,
                            options: channelList,
                            click: function (val, list) {
                                Params.channelId = val.channelId;
                                Params.page = 0;
                                //改变链接值 
                                Tool.changeUrlVal([
                                    {name: "page", val: ""},
                                    {name: "channelId", val: val.channelId}
                                ]);
                                //获取设备列表
                                init.getList();
                            }
                        },
                        {text: "设备用户"},
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
                //获取列表
                init.getList();
            });
        },
        //查询参数
        searchParam: function () {
            if (Params.searchCategory == "设备SN") {
                return {deviceSn: Params.search};
            }
            if (Params.searchCategory == "滤网SN") {
                return {strainerSn: Params.search};
            }
            if (Params.searchCategory == "设备用户") {
                return {appUserPhone: Params.search};
            }
        }
    };
    init.default();

});