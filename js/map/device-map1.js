/*
 * 地图页面
 * */
define(['Tool', 'component', 'ajaxAPI','/js/plugIn/echarts-all.js', '/js/plugIn/animateBackground-plugin.js'], function (Tool, component, API) {
    var spotMapTime, baseMapTime, time, numTime, vm;
    var interTime = 10000;
    var numRun,baseEcharts,spotEcharts;

    function resize() {
        $('#mapChartSpot').height($(window).height() * 0.8);
    }
    resize();
    $(window).resize(resize);

    var init = {
        default: function () {
            //信息展示
            init.infoShow();
            //获取设备统计
            init.getStatisticsDeviceGeneral();
            //获取省份地图数据
            init.getStatisticsDeviceDistribution();
            //定时刷新地图省份数据
            baseMapTime = setInterval(function () {
                init.getStatisticsDeviceDistribution();
            }, interTime);
        },
        //信息展示
        infoShow: function () {
            vm = new Vue({
                el: "#map",
                data: {
                    list: [
                        {
                            title: "设备总量",
                            text: '...'
                        },
                        {
                            title: "在线设备",
                            text: '...'
                        },
                        {
                            title: "离线设备",
                            text: '...'
                        },
                        {
                            title: "未激活设备",
                            text: '...'
                        }
                    ],
                    showMap: false,
                    showStatistics: false
                },
                methods: {
                    toggle: function () {
                        this.showMap = !this.showMap;
                        //关闭计时器,开启计时器
                        clearInterval(baseMapTime);

                        //spotMap在线数量callback获取
                        init.paintGetAllGisDevView();
                        //定时刷新地图地理位置信息
                        spotMapTime = setInterval(function () {
                            init.paintGetAllGisDevView();
                        }, interTime);

                        //获取在线设备总数
                        init.getTotalLineCount();
                        numTime = setInterval(function () {
                            numRun?numRun.resetData(init.getTotalLineCount1()):'';
                        }, 5000);

                        //时钟开始
                        init.getTime();
                        time = setInterval(function () {
                            init.getTime();
                        }, 500)
                    },
                    closeMap: function () {
                        this.showMap = !this.showMap;
                        numRun = null;
                        clearInterval(spotMapTime);
                        clearInterval(time);
                        clearInterval(numTime);
                        //开启地图省份信息刷新
                        baseMapTime = setInterval(function () {
                            init.getStatisticsDeviceDistribution();
                        }, interTime);
                    }
                }
            });
        },
        //获取设备统计
        getStatisticsDeviceGeneral: function () {
            $.ajax({
                url: API.statisticsDeviceGeneral,
                type: "post",
                success: function (resp) {
                    if (resp.code == 0) {
                        vm.list[0].text = resp.data.total;
                        vm.list[1].text = resp.data.online;
                        vm.list[2].text = resp.data.offline;
                        vm.list[3].text = resp.data.inactived;
                        vm.showStatistics = true;
                    } else {
                        Tool.alertboxError(resp.msg);
                    }
                },
                error: function (resp) {
                    Tool.alertboxError(resp.msg);
                }
            });
        },
        //获取地图省份信息
        getStatisticsDeviceDistribution: function () {
            $.ajax({
                url: API.statisticsDeviceDistribution,
                type: "post",
                success: function (resp) {
                    //成功
                    if (resp.code == 0) {
                        var baseData = {};
                        baseData.numData = [];
                        baseData.contyrData = {};
                        $.each(resp.data, function (index, obj) {
                            obj.name = obj.shortName;
                            obj.value = obj.deviceCount;
                            //obj.value = Math.round(Math.random() * 10000);
                            if (obj.value != 0) {
                                baseData.numData.push(obj);
                                baseData.contyrData[obj.name] = obj.name + '\n' + obj.value;
                            }
                        });
                        init.paintBaseMap(baseData);
                    } else {
                        Tool.alertboxError(resp.msg);
                    }
                },
                error: function (resp) {
                    Tool.alertboxError(resp.msg);
                }
            });
        },
        //获取中国地图
        getChinaMap: function () {
            require(['/json/china.js'], function (chinaJson) {
                echarts.registerMap('china', chinaJson);
            });
        },
        //画出省份地图
        paintBaseMap: function (baseData) {
            if(!baseEcharts){
                baseEcharts = echarts.init($('#mapChart')[0]);
            }
            var option = {
                title: {
                    text: '全国设备分布图',
                    x: 'left',
                    padding: [10, 10],
                    textStyle: {color: '#4a4a4a'}
                },
                tooltip: {
                    trigger: 'item', formatter: function (params) {
                        var num = params.value | 0;
                        return "地球村设备<br>数量:<num style='vertical-align: middle'>" + num + "</num>";
                    }
                },
                dataRange: {
                    x: 'left',
                    y: 'bottom',
                    splitList: [
                        {start: 10000},
                        {start: 4000, end: 8000},
                        {start: 2000, end: 4000},
                        {start: 1000, end: 2000},
                        {start: 1, end: 1000},
                        {end: 0}
                    ],
                    color: ['#01579b', '#0288d1', '#03a9f4', '#039be5', '#b3e5fc', '#e1f5fe']
                },
                series: [
                    {
                        name: '地球村设备',
                        type: 'map',
                        padding: [40, 40],
                        mapType: 'china',
                        showLegendSymbol: false,
                        roam: false,
                        itemStyle: {
                            normal: {
                                label: {show: true, textStyle: {color: "#116fal"}},
                                color: '#e1f5fe',
                                borderColor: '#FFF',
                                borderWidth: 0.2
                            },
                            emphasis: {label: {show: true, textStyle: {color: "#FFF"}}, color: '#00b3a9'}
                        },
                        data: baseData.numData,
                        nameMap: baseData.contyrData
                    }
                ]
            };
            baseEcharts.setOption(option);
        },
        //画出地图的地理位子信息
        paintGetAllGisDevView: function () {
            $.get(API.gisGetAllGisDevView, function (resp) {
                if(!spotEcharts) {
                    spotEcharts = echarts.init($('#mapChartSpot')[0]);
                }
                var placeList = resp.data;
                var option = {
                    backgroundColor: '#091826',
                    color: [
                        '#0778f9',
                        'rgba(14, 241, 242, 0.8)',
                        '#FFF'
                    ],
                    legend: {
                        padding: 30,
                        orient: 'vertical',
                        x:'left',
                        data:['设备','区','市'],
                        textStyle : {
                            color: '#fff'
                        }
                    },
                    series: [
                        {
                            name: '设备',
                            type: 'map',
                            mapType: 'china',
                            hoverable: false,
                            itemStyle: {
                                normal: {
                                    borderColor: '#fff',
                                    borderWidth: 0.05,
                                    areaStyle: {color: '#000911'}
                                }
                            },
                            data: [],
                            markPoint: {
                                symbolSize: 0.7,
                                large: true,
                                effect: {show: true},
                                itemStyle: {
                                    normal: {
                                        color: "#0778f9"
                                    }
                                },
                                data: placeList[0]
                            }
                        },
                        {
                            name: '区',
                            type: 'map',
                            mapType: 'china',
                            hoverable: false,
                            data: [],
                            markPoint: {
                                symbolSize: 1,
                                large: true,
                                effect: {show: true},
                                itemStyle: {
                                    normal: {
                                        color: "rgba(14, 241, 242, 0.8)"
                                    }
                                },
                                data: placeList[1]
                            }
                        },
                        {
                            name: '市',
                            type: 'map',
                            mapType: 'china',
                            hoverable: false,
                            data: [],
                            markPoint: {
                                symbolSize: 1,
                                large: true,
                                effect: {show: true},
                                itemStyle: {
                                    normal: {
                                        color: "#FFF"
                                    }
                                },
                                data: placeList[2]
                            }
                        }
                    ]
                };
                spotEcharts.setOption(option);
            })
        },
        //获取在线总数量
        getTotalLineCount: function () {
            var totalNum = 0;
            $.ajax({
                url: API.gisGetonlineCount,
                type: "get",
                success: function (resp) {
                    if (resp.code == 0) {
                        totalNum = resp.data;
                        if(!numRun) {
                            numRun = $(".number-run").numberAnimate({num: totalNum, speed: 2000, symbol: ","});
                        }
                    }
                },
                error: function (resp) {
                    Tool.alertboxSuccess(resp.msg);
                }
            });
            return totalNum;
        },
        getTotalLineCount1: function () {
            var totalNum = 0;
            $.ajax({
                url: API.gisGetonlineCount,
                type: "get",
                async: false,
                success: function (resp) {
                    if (resp.code == 0) {
                        totalNum = resp.data;
                    }
                },
                error: function (resp) {
                    console.log(resp, '失败')
                }
            });
            //return Math.round(Math.random() * 10000);
            return totalNum;
        },

        //获取当前时间
        getTime: function () {
            var today = new Date();
            var h = today.getHours();
            var m = today.getMinutes();
            var s = today.getSeconds();
            m = checkTime(m);
            s = checkTime(s);
            $("#mapTime").html(h + " : " + m + " : " + s);
            function checkTime(i) {
                if (i < 10) {
                    i = "0" + i
                }
                return i
            }
        }

    };
    init.default();
});

