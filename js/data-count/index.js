/*
 * 数据统计页面
 * */
define(['Tool', 'component', 'text!/tpl/data-count/trend-table.html', 'echarts', 'dateTimePicker'], function (Tool, component, trendTable, echarts) {
    var urlParam = Tool.getUrlParam();
    var Params = {
        startDate: urlParam.startDate || "",
        endDate: urlParam.endDate || "",
        day: urlParam.day || (!urlParam.startDate && "1") || ""
    };
    var init = {
        default: function () {
            //获取应用概况
            init.getAppStatus();
            //展示趋势分析头部
            init.showTrendTop();
            //获取趋势分析信息
            init.getTrendInfo();
            //获取设备统计数据
            init.getDeivceStatistics();
            //获取终端统计数据
            init.getTerminalStatistics();
            //获取地图信息
            init.getMapInfo();
            //获取新增用户信息
            init.getNewUserInfo();
            //获取新增设备信息
            init.getNewDeviceInfo();
            //获取区域信息
            init.getAreaInfo();
            //获取时间选择器
            init.getDatePicker();
        },
        //时间选择器的配置
        getDatePicker: function () {
            $('#dateStart').datetimepicker({
                lang: 'ch',
                timepicker: false,
                format: 'Y-m-d',
                formatDate: 'Y-m-d',
                maxDate: new Date()
            });
            $('#dateEnd').datetimepicker({
                lang: 'ch',
                timepicker: false,
                format: 'Y-m-d',
                formatDate: 'Y-m-d',
                maxDate: new Date()
            });
        },
        //获取应用概况
        getAppStatus: function () {
            $.ajax({
                url: API.statisticsDeviceGeneral,
                type: "post",
                success: function (resp) {
                    if (resp.code == 0) {
                        //展示应用概况
                        init.showAppStatus(resp.data);
                    } else {
                        //提示框-错误
                        Tool.alertboxError(resp.msg);
                    }
                },
                error: function (resp) {
                    console.log(resp, "失败");
                }
            });
        },
        //展示应用概况
        showAppStatus: function (data) {
            new Vue({
                el: ".app-status",
                //数据 
                data: {
                    list: [
                        {
                            title: "设备总量",
                            text: data.total
                        },
                        {
                            title: "在线设备",
                            text: data.online
                        },
                        {
                            title: "离线设备",
                            text: data.offline
                        },
                        {
                            title: "未激活设备",
                            text: data.inactived
                        }
                    ]
                }
            });
        },
        //展示趋势分析头部
        showTrendTop: function () {
            new Vue({
                el: ".trend-top",
                //数据 
                data: {
                    btns: [{
                        value: "当天",
                        class: Params.day == "1" && "btn-success",
                        day: "1"
                    }, {
                        value: "最近7天",
                        class: Params.day == "7" && "btn-success",
                        day: "7"
                    }, {
                        value: "最近30天",
                        class: Params.day == "30" && "btn-success",
                        day: "30"
                    }],
                    //筛选
                    select: {
                        title: "时间筛选:",
                        startValue: Params.startDate,
                        startClass: "",
                        endValue: Params.endDate,
                        endClass: "",
                        placeholder: "YYYY-MM-dd",
                        submitValue: "确定"
                    }
                },
                methods: {
                    focus: function (select, Class) {
                        select[Class] = "";
                    },
                    //选择日期
                    clickBtn: function (val) {
                        if (val.class != "btn-success") {
                            for (var i = 0; i < this.btns.length; i++) {
                                this.btns[i].class = "";
                            }
                            val.class = "btn-success";
                            //改变链接值
                            Params.startDate = "";
                            Params.endDate = "";
                            Params.day = val.day;
                            Tool.changeUrlVal([
                                {name: "startDate", val: ""},
                                {name: "endDate", val: ""},
                                {name: "day", val: val.day}
                            ]);
                            //获取趋势分析信息  
                            init.getTrendInfo();
                        }
                    },
                    //判断格式
                    blur: function (val, select, Class) {
                        if (RegEx.RegExpDate(val)) {
                            select[Class] = "";
                        } else {
                            select[Class] = "warning";
                        }
                    },
                    //搜索
                    submit: function () {
                        if (!RegEx.RegExpDate(this.select.startValue) || !RegEx.RegExpDate(this.select.endValue)) {
                            //提示框-警告
                            Tool.alertboxWarning("请填写正确的时间筛选");
                            Params.startDate = "";
                            Params.endDate = "";
                        } else {
                            if (this.select.startValue > this.select.endValue) {
                                Tool.alertboxWarning("请填写正确的时间范围");
                            } else {
                                Params.startDate = this.select.startValue;
                                Params.endDate = this.select.endValue;
                                Params.day = "";
                                //改变链接值
                                Tool.changeUrlVal([
                                    {name: "startDate", val: this.select.startValue},
                                    {name: "endDate", val: this.select.endValue},
                                    {name: "day", val: ""}
                                ]);
                                //获取趋势分析信息
                                init.getTrendInfo();
                            }
                        }
                    }
                }
            });
        },
        //获取趋势分析信息
        getTrendInfo: function () {
            $(".trend-table").html(trendTable);
            var data = {
                startDate: Params.startDate || Tool.getTimeDate(Params.day - 1),
                endDate: (Params.endDate ? Tool.getNextTime(Params.endDate) : '') || Tool.getTimeDate(-1)
            };
            console.log(data);
            $.ajax({
                url: API.statisticsTendencyAnalyze,
                type: "post",
                data: data,
                success: function (resp) {
                    if (resp.code == 0) {
                        //展示趋势分析
                        init.showTrend(resp.data);
                    } else {
                        //提示框-错误
                        Tool.alertboxError(resp.msg);
                    }
                },
                error: function (resp) {
                    console.log(resp, "失败");
                }
            });
        },
        //展示趋势分析
        showTrend: function (data) {
            new Vue({
                el: ".trend-table",
                //数据 
                data: {
                    list: [
                        {
                            title: "设备用户",
                            text: data.totalCount,
                            status: "up",
                            other: "新增设备用户4987"
                        },
                        {
                            title: "活跃用户",
                            text: data.activeCount,
                            status: "down",
                            other: "最高峰12000"
                        },
                        {
                            title: "新用户",
                            text: data.newCount,
                            status: "up",
                            other: "新增设备用户4987"
                        },
                        {
                            title: "用户绑定设备数",
                            text: data.binderCount,
                            status: "up",
                            other: "4"
                        }
                    ]
                }
            });
        },
        //获取设备统计数据
        getDeivceStatistics: function () {
            $.ajax({
                url: API.statisticsDeviceStatistics,
                type: "post",
                success: function (resp) {
                    if (resp.code == 0) {
                        ////展示设备统计
                        init.showDeivceStatistics(resp.data);
                    } else {
                        $(".deivce-statistics").find(".hint").text(resp.msg);
                        //提示框-错误
                        Tool.alertboxError(resp.msg);
                    }
                },
                error: function (resp) {
                    console.log(resp, "失败");
                }
            });
        },
        //展示设备统计
        showDeivceStatistics: function (data) {
            new Vue({
                el: ".deivce-statistics",
                //数据 
                data: {
                    list: [
                        {
                            title: "一周内到期滤网数量",
                            text: data.expiringCount,
                            status: "link",
                            link: "./be-about-to-over.html"
                        },
                        {
                            title: "已更换滤网数量（累计）",
                            text: data.changedCount
                        },
                        {
                            title: "设备锁定状态数据",
                            text: data.lockedCount
                        }
                    ]
                }
            });
        },
        //获取终端统计数据
        getTerminalStatistics: function () {
            $.ajax({
                url: API.statisticsTerminalStatistics,
                type: "post",
                success: function (resp) {
                    if (resp.code == 0) {
                        //展示终端统计数据
                        init.showTerminalStatistics(resp.data);
                    } else {
                        $(".terminal-statistics").find(".hint").text(resp.msg);
                        //提示框-错误
                        Tool.alertboxError(resp.msg);
                    }
                },
                error: function (resp) {
                    console.log(resp, "失败");
                }
            });
        },
        //展示终端统计数据
        showTerminalStatistics: function (data) {
            new Vue({
                el: ".terminal-statistics",
                //数据 
                data: {
                    titles: [
                        {text: "APP类型"},
                        {text: "累计用户"},
                        {text: "累计用户占比"},
                        {text: "累计新用户"},
                        {text: "累计新用户占比"}
                    ],
                    ios: "ios系统",
                    android: "android系统",
                    data: data
                }
            });
        },
        //获取地图信息
        getMapInfo: function () {
            $.ajax({
                url: API.statisticsDeviceDistribution,
                type: "post",
                success: function (resp) {
                    if (resp.code == 0) {
                        var baseData = {};
                        baseData.numData = [];
                        baseData.contyrData = {};
                        $.each(resp.data, function (index, obj) {
                            obj.name = obj.shortName;
                            obj.value = obj.deviceCount;
                            if (obj.value != 0) {
                                baseData.numData.push(obj);
                                baseData.contyrData[obj.name] = {};
                                baseData.contyrData[obj.name].name = obj.name;
                                baseData.contyrData[obj.name].value = obj.deviceCount;
                            }
                        });
                        //展示地图信息
                        init.showMapInfo(baseData.numData, baseData.contyrData);
                    } else {
                        //提示框-错误
                        Tool.alertboxError(resp.msg);
                    }
                },
                error: function (resp) {
                    console.log(resp, "失败");
                }
            });
        },
        //展示地图信息
        showMapInfo: function (numData, contyrData) {
            require(['/json/china.js'], function (chinaJson) {
                new Vue({
                    el: ".map",
                    //数据 
                    data: {
                        show: true
                    }
                });
                //地图展示
                echarts.registerMap('china', chinaJson);
                var myChart = echarts.init($('#map_chart')[0]);
                var option = {
                    title: {text: '全国设备分布图', x: 'left', padding: [20, 15], textStyle: {color: "#afaebc"}},
                    tooltip: {
                        trigger: 'item',
                        formatter: function (params) {
                            var num = params.value | 0;
                            return "地球村设备<br>数量:<num style='vertical-align: middle'>" + num + "</num>";
                        }
                    },
                    legend: {show: false, padding: [50, 15], x: 'left', data: ['地球村设备'], textStyle: {color: "#afaebc"}},
                    dataRange: {
                        x: 'left',
                        y: 'bottom',
                        splitList: [
                            {start: 10000},
                            {start: 4000, end: 8000},
                            {start: 2000, end: 4000},
                            {start: 1000, end: 2000},
                            {start: 1, end: 1000},
                            {start: 0, end: 0}
                        ],
                        color: ['#01579b', '#0288d1', '#03a9f4', '#039be5', '#b3e5fc', '#e1f5fe']
                    },
                    series: [
                        {
                            name: '地球村设备',
                            type: 'map',
                            mapType: 'china',
                            padding: [0, 0],
                            itemStyle: {
                                normal: {
                                    areaColor: '#e1f5fe',
                                    borderColor: '#FFF',
                                    borderWidth: 0.3,
                                    color: '#1bb8ce',
                                    label: {
                                        show: true,
                                        textStyle: {color: "#231816"}
                                    }
                                },
                                emphasis: {
                                    areaColor: "#00b3a9",
                                    color: '#FFF',
                                    label: {
                                        show: true,
                                        textStyle: {color: "#FFF"}
                                    }
                                }
                            },
                            data: numData
                            //nameMap: baseData.contyrData
                        }
                    ]
                };
                myChart.setOption(option);
            });
        },
        //获取新增用户信息
        getNewUserInfo: function () {
            $.ajax({
                url: API.statisticsMonthlyNewUsers,
                type: "post",
                success: function (resp) {
                    if (resp.code == 0) {
                        var data = [];
                        for (var i = 11; i >= 0; i--) {
                            data.push(resp.data[0]["month" + i]);
                        }

                        //展示新增用户
                        init.showNewUser(data);
                    } else {
                        //提示框-错误
                        Tool.alertboxError(resp.msg);
                    }
                },
                error: function (resp) {
                    console.log(resp, "失败");
                }
            });
        },
        //展示新增用户
        showNewUser: function (data) {
            new Vue({
                el: ".new-user",
                data: {
                    show: true
                }
            });
            var myChart = echarts.init($('#new-user')[0]);
            var option = {
                color: ['#3398DB'],
                tooltip: {
                    //trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: Tool.getNowMonthAndAfter(),//获取现在月份至之后
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '直接访问',
                        type: 'bar',
                        barWidth: '40%',
                        data: data
                    }
                ]
            };
            myChart.setOption(option);
        },
        //获取新增设备信息
        getNewDeviceInfo: function () {
            $.ajax({
                url: API.statisticsMonthlyNewDevices,
                data: {
                    serviceType: 1
                },
                type: "post",
                success: function (resp) {
                    if (resp.code == 0) {
                        var data = [];
                        for (var i = 11; i >= 0; i--) {
                            data.push(resp.data[0]["month" + i]);
                        }

                        //展示新增设备
                        init.showNewDevice(data);
                    } else {
                        //提示框-错误
                        Tool.alertboxError(resp.msg);
                    }
                },
                error: function (resp) {
                    console.log(resp, "失败");
                }
            });
        },
        //展示新增设备
        showNewDevice: function (data) {
            new Vue({
                el: ".new-device",
                data: {
                    show: true
                }
            });
            var myChart = echarts.init($('#new-device')[0]);
            var option = {
                color: ['#3398DB'],
                tooltip: {
                    //trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: Tool.getNowMonthAndAfter(),//获取现在月份至之后
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '直接访问',
                        type: 'bar',
                        barWidth: '40%',
                        data: data
                    }
                ]
            };
            myChart.setOption(option);
        },
        //获取区域信息
        getAreaInfo: function () {
            $.ajax({
                url: API.statisticsDeviceDistribution,
                type: "post",
                success: function (resp) {
                    if (resp.code == 0) {
                        $(".pie-hint").remove();
                        $(".pie").find(">ul").show();
                        //筛选数据 
                        var data = [];
                        for (var i = 0; i < resp.data.length; i++) {
                            if (resp.data[i].deviceCount != 0) {
                                resp.data[i].name = resp.data[i].shortName;
                                resp.data[i].value = resp.data[i].deviceCount;
                                data.push(resp.data[i]);
                            }
                        }
                        //饼图展示区域信息
                        init.pieShowAreaInfo(data);
                        //列表展示区域信息
                        init.ListShowAreaInfo(data);

                    } else {
                        //提示框-错误
                        Tool.alertboxError(resp.msg);
                    }
                },
                error: function (resp) {
                    console.log(resp, "失败");
                }
            });
        },
        //饼图展示区域信息
        pieShowAreaInfo: function (data) {
            data[0].selected = true;
            var myChart = echarts.init($('#pie-area')[0]);
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        selectedMode: 'single',
                        radius: [0, '70%'],
                        data: data
                    }
                ]
            };
            myChart.setOption(option);
        },
        //列表展示区域信息
        ListShowAreaInfo: function (datalist) {
            new Vue({
                el: ".list-show-area",
                //数据 
                data: {
                    titles: [
                        {text: ""},
                        {text: "省份"},
                        {text: "设备总量"},
                        {text: "设备占比"}
                    ],
                    datalist: datalist
                }
            });
        }
    };
    init.default();
});