/*
 * 批次详情页面
 * */
define(['Tool', 'component', 'text!/tpl/pre-sales/batch-detail.html'], function (Tool, component, detail) {
    var urlParam = Tool.getUrlParam();
    //参数
    window.Params = {
        limit: 10,
        batchId: urlParam.batchId,
        func: urlParam.func,
        categoryCode: decodeURIComponent(urlParam.categoryCode || ""),
        batchName: decodeURIComponent(urlParam.batchName || ""),
        sn: urlParam.sn,
        page: urlParam.page || 0
    };
    var init = {
        default: function () {
            init.base();
            //添加 
            init.add();
            //获取批次详情
            init.getbatchDetail();
            //获取列表
            init[urlParam.func || "getBatchSnList"]();
            //展示分类 
            init.category();
        },
        base: function () {
            //位置信息
            Tool.location([{
                class: "",
                href: "javascript:void(0)",
                text: "售前设备"
            }, {
                class: "hover",
                href: "./batch-list.html",
                text: "生产批次"
            }, {
                class: "",
                href: "javascript:void(0)",
                text: "批次详情"
            }]);
            //搜索
            Tool.search({
                val: Params.sn || "",
                categoryCode: urlParam.categoryCode,
                placeholder: "请输入SN编码"
            }, {
                //提交搜索
                submitSearch: function (val) {
                    Params.sn = val;
                    Params.page = 0;
                    //改变链接值
                    Tool.changeUrlVal([
                        {name: "sn", val: val},
                        {name: "page", val: ""}
                    ]);
                    //获取SN列表
                    init.getBatchSnList();
                }
            });
        },
        //添加
        add: function () {
            new Vue({
                el: ".add",
                //数据
                data: {
                    btns: [{
                        newBtnClass: "btn-success leadingOut",
                        newBtnValue: "导出批次信息",
                        click: function () {
                            window.open(API.batchExport + "?batchId=" + urlParam.batchId);
                        }
                    }, {
                        newBtnClass: "btn-success nullify",
                        newBtnValue: "作废SN编码＋",
                        click: function () {
                            location.href = "./new-nullify.html?batchId=" + urlParam.batchId + "&categoryCode=" + urlParam.categoryCode + "&func=" + Params.func;
                        }
                    }]

                }
            });
        },
        //展示分类
        category: function () {
            var data = {
                list: [
                    {
                        text: "sn编码列表",
                        active: (urlParam.func == "getBatchSnList" || !urlParam.func) ? "active" : "",
                        func: "getBatchSnList"
                    },
                    {
                        text: "作废sn编码列表",
                        active: urlParam.func == "getBatchDiscardSnList" ? "active" : "",
                        func: "getBatchDiscardSnList"
                    }
                ]
            };
            //创建分类
            Tool.category(data, {
                select: function (val) {
                    Params.func = val.func;
                    Params.page = 0;
                    //改变链接值
                    Tool.changeUrlVal([
                        {name: "func", val: val.func},
                        {name: "page", val: ""}
                    ]);
                    //获取SN列表
                    init[Params.func]();
                }
            });
        },
        //没有结果
        nothingInfo: function (searchVal, status) {
            //无结果
            Tool.nothing({
                searchVal: !status && (searchVal || ""),
                question: status == "question" ? searchVal : ""
            });
        },
        //获取批次详情
        getbatchDetail: function () {
            var data = {
                batchId: Params.batchId
            };
            //添加正在加载中...
            Tool.createLoadding(['.area-block'], false);
            $.ajax({
                url: API.batchDetail,
                type: "POST",
                data: data,
                success: function (resp) {
                    if (resp.code == 0) {
                        //详情信息
                        init.detailInfo(resp.data);
                    } else {
                        //提示框-错误
                        Tool.alertboxError(resp.msg);
                    }
                }
            });
        },
        //获取SN编码列表
        getBatchSnList: function () {
            $(".nullify").hide();
            $(".leadingOut,.search").show();
            //添加正在加载中...
            Tool.createLoadding();
            var data = {
                batchId: Params.batchId,
                page: Params.page,
                limit: Params.limit,
                sn: Params.sn,
                categoryCode: Params.categoryCode
            };
            $.ajax({
                url: API.batchSnList,
                type: "POST",
                data: data,
                success: function (resp) {
                    if (resp.code == 0) {
                        if (resp.data.length) {
                            //表格信息
                            init.SNInfoList(resp.data);
                            //页码
                            init.page(resp.info);
                        } else {
                            if (Params.sn) {
                                //没有结果
                                $(".info-table-box").html('');
                                init.nothingInfo(Params.sn);
                            } else {
                                //表格信息
                                init.SNInfoList([]);
                            }
                        }
                    } else {
                        //没有结果
                        $(".info-table-box").html('');
                        init.nothingInfo("", "question");
                    }
                }
            });
        },
        //获取作废SN编码列表
        getBatchDiscardSnList: function () {
            $(".nullify").show();
            $(".leadingOut,.search").hide();
            var data = {
                batchId: Params.batchId,
                page: Params.page,
                limit: Params.limit,
                categoryCode: Params.categoryCode,
                isWaste: 1
            };
            //添加正在加载中...
            Tool.createLoadding();
            $.ajax({
                url: API.batchSnList,
                type: "POST",
                data: data,
                success: function (resp) {
                    if (resp.code == 0) {
                        if (resp.data && resp.data.length) {
                            //信息整理
                            init.SNInfoList(resp.data);
                            //页码
                            init.page(resp.info);
                        } else {
                            //表格信息
                            init.SNInfoList([]);
                        }
                    } else {
                        //没有结果
                        $(".info-table-box").html('');
                        init.nothingInfo("", "question");
                    }
                }
            });
        },
        //详情信息
        detailInfo: function (val) {
            //删除正在加载中
            Tool.removeLoadding([".area-block"]);
            val.number = 1;
            // 创建表格信息
            new Vue({
                el: '.detail-info',
                data: {
                    page: Params.page * Params.limit,
                    titles: [
                        {text: "序号"},
                        {text: "批次名称"},
                        {text: "创建时间"},
                        {text: "操作人"},
                        {text: "设备分类"},
                        {text: "设备型号"},
                        {text: "数量"},
                        {text: "生产厂商"}
                    ],
                    val: val
                }
            });
        },
        //SN列表信息
        SNInfoList: function (dataList) {
            $(".info-table-box").html(detail);
            // 创建表格信息
            new Vue({
                el: '.SN-list',
                data: {
                    page: Params.page * Params.limit,
                    titles: [
                        {text: "序号"},
                        {text: "SN编码"}
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
                //获取SN列表
                urlParam = Tool.getUrlParam();
                init[urlParam.func || "getBatchSnList"]();
            });
        }
    };
    init.default();

});