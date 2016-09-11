/*
 * 班级列表
 * */
define(['Tool', 'component', 'text!/tpl/sell-after/class-list.html'], function (Tool, component, classList) {
    var urlParam = Tool.getUrlParam();
    //参数
    var Params = {
        limit: 10,
        page: urlParam.page || 0,
        searchCategory: decodeURIComponent(urlParam.searchCategory || "班级名称"),
        search: decodeURIComponent(urlParam.search || "")
    };
    var init = {
        default: function () {
            init.base();
            //获取班级列表
            init.getClassList();
        },
        base: function () {
            //位置信息
            Tool.location([{
                class: "",
                href: "javascript:void(0)",
                text: "售后管理"
            }, {
                class: "hover",
                href: "./school-device.html",
                text: "校园新风"
            }, {
                class: "hover",
                href: "./school-manage.html",
                text: "学校管理"
            }, {
                class: "",
                href: "javascript:void(0)",
                text: "班级列表"
            }]);
            //搜索
            Tool.search({
                val: Params.search,
                select: false,
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
                    //获取班级列表
                    init.getClassList();
                }
            });
        },
        //获取班级列表
        getClassList: function () {
            var data = {
                schoolId: urlParam.schoolId,
                page: Params.page,
                limit: Params.limit
            };
            //获取搜索类型和值
            var searchParam = init.searchParam();
            $.extend(data, init.searchParam());
            //添加正在加载中...
            Tool.createLoadding();
            $.ajax({
                url: API.schoolClassList,
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
                    edit: "修改班级名称",
                    style: 'cursor: pointer'
                };
            }
            //表格信息
            init.infoTable(resp);
        },
        //没有结果 
        nothingInfo: function (searchVal, status) {
            $(".info-table-box").html('');
            Tool.nothing({
                searchVal: !status && (searchVal || ""),
                question: status == "question" ? searchVal : ""
            });
        },
        //表格信息
        infoTable: function (dataList) {
            $(".info-table-box").html(classList);
            // 创建表格信息
            new Vue({
                el: '.info-table',
                data: {
                    page: Params.page * Params.limit,
                    titles: [
                        {text: "序号"},
                        {text: "年级"},
                        {text: "班级名称"},
                        {text: "设备数量"},
                        {text: "操作"}
                    ],
                    dataList: dataList,
                    schooleId: urlParam.schoolId,
                }
            });
        },
        //页码
        page: function (info) {
            if (!info || info.totalPage <= 1) {
                return;
            }
            Tool.page(info, function (num) {
                Params.page = num;
                //改变链接值
                Tool.changeUrlVal([{name: "page", val: num}]);
                //获取班级列表
                init.getClassList();
            });
        },
        //查询参数
        searchParam: function () {
            if (Params.searchCategory == "班级名称") {
                return {className: Params.search};
            }
        }
    };
    init.default();

});