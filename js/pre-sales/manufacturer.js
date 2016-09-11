/*
 * 生产厂商列表
 * */
define(['Tool', 'component', 'text!/tpl/pre-sales/manufacturer.html', 'ajaxAPI'], function (Tool, component, manufacturer, API) {
    var urlParam = Tool.getUrlParam();
    //参数
    var Params = {
        limit: 10,
        page: urlParam.page || 0,
        searchCategory: decodeURIComponent(urlParam.searchCategory || "生产厂商"),
        search: decodeURIComponent(urlParam.search || ""),
        isLock: urlParam.isLock || ""
    };
    var init = {
        default: function () {
            init.base();
            //添加 
            init.add();
            //获取列表
            init.getManufacturerList();
        },
        base: function () {
            //位置信息
            Tool.location([{
                class: "",
                href: "javascript:void(0)",
                text: "售前设备"
            }, {
                class: "",
                href: "javascript:void(0)",
                text: "生产厂商列表"
            }]);
            //搜索
            Tool.search({
                placeholder: "请输入生产厂商查询",
                val: Params.search,
                select: true,
                option: [{
                    text: "生产厂商",
                    placeholder: "请输入生产厂商查询",
                    class: Params.searchCategory == "生产厂商" ? "selected" : ""
                }, {
                    text: "联系电话",
                    placeholder: "请输入联系电话查询",
                    class: Params.searchCategory == "联系电话" ? "selected" : ""
                }, {
                    text: "联系人",
                    placeholder: "请输入联系人查询",
                    class: Params.searchCategory == "联系人" ? "selected" : ""
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
                    init.getManufacturerList();
                }
            });
        },
        //添加
        add: function () {
            new Vue({
                el: ".add",
                //数据 
                data: {
                    newBtnClass: "btn-success " + (localStorage.permissions.indexOf(",factory:add,") > -1 ? "" : "hidden"),
                    newBtnValue: "新增厂商＋",
                    click: function () {
                        location.href = "./new-manufacturer.html";
                    }
                }
            });
        },
        //获取工厂列表
        getManufacturerList: function () {
            var data = {
                page: Params.page,
                isLock: Params.isLock,
                limit: Params.limit
            };
            //获取搜索类型和值
            var searchParam = init.searchParam();
            $.extend(data, init.searchParam());
            Tool.createLoadding();
            console.log(data)
            $.ajax({
                url: API.factoryList,
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
                                //表格信息
                                init.infoTable([]);
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
                    edit: "修改",
                    editShow: localStorage.permissions.indexOf(",factory:update,") > -1 ? true : false,
                    statusTrue: "锁定",
                    statusFalse: "解锁",
                    bindUser: "绑定用户"
                };
            }
            //表格信息
            init.infoTable(resp);
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
        infoTable: function (dataList) {
            $(".info-table-box").html(manufacturer);
            // 创建表格信息
            new Vue({
                el: '.info-table',
                data: {
                    page: Params.page * Params.limit,
                    titles: [
                        {text: "序号"},
                        {text: "生产厂商"},
                        {text: "工厂编码"},
                        {text: "地址"},
                        {text: "联系人"},
                        {text: "联系电话"},
                        {
                            select: true,
                            active: (Params.isLock == "1" && "锁定") || (Params.isLock == "0" && "未锁定") || "状态",
                            options: [
                                {text: "状态", class: (Params.isLock == "") && "selected"},
                                {text: "锁定", isLock: "1", class: (Params.isLock == "1") && "selected"},
                                {text: "未锁定", isLock: "0", class: (Params.isLock == "0") && "selected"}
                            ],
                            click: function (isLock, list) {
                                Params.isLock = isLock;
                                Params.page = 0;
                                //改变链接值 
                                Tool.changeUrlVal([
                                    {name: "page", val: ""},
                                    {name: "isLock", val: isLock}
                                ]);
                                //获取列表
                                init.getManufacturerList();
                            }
                        },
                        {text: "操作"}
                    ],
                    dataList: dataList
                },
                methods: {
                    //状态改变
                    statueChange: function (tool, id) {
                        $.ajax({
                            url: API.factoryLock,
                            type: "POST",
                            data: {
                                factoryId: id,
                                isLock: tool.isLock == "1" ? "0" : "1"
                            },
                            success: function (resp) {
                                if (resp.code == 0) {
                                    tool.isLock == "1" ? tool.isLock = "0" : tool.isLock = "1";
                                    Tool.alertboxSuccess(resp.msg);
                                } else {
                                    //提示框-错误
                                    Tool.alertboxError(resp.msg);
                                }
                            }
                        });

                    },
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
                init.getManufacturerList();
            });
        },
        //查询参数
        searchParam: function () {
            if (Params.searchCategory == "生产厂商") {
                return {factoryName: Params.search};
            }
            if (Params.searchCategory == "联系电话") {
                return {factoryMobile: Params.search};
            }
            if (Params.searchCategory == "联系人") {
                return {factoryContact: Params.search};
            }
        }
    };
    init.default();
});