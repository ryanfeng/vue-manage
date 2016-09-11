/*
 * 地图页面
 * */
define(['Tool', 'component', 'ajaxAPI', 'echarts', 'numRun'], function (Tool, component, API, echarts) {
    var spotMapTime, baseMapTime, time, numTime, vm;
    var interTime = 10000;
    var numRun, baseEcharts, spotEcharts;

    function resize() {
        $('#mapChartSpot').height($(window).height() * 0.9);
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
                            numRun ? numRun.resetData(init.getTotalLineCount1()) : '';
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
                            // if (obj.value != 0) {
                            //     baseData.numData.push(obj);
                            //     baseData.contyrData[obj.name] = obj.name + '\n' + obj.value;
                            // }
                            baseData.numData.push(obj);
                            baseData.contyrData[obj.name] = obj.name + '\n' + obj.value;
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

        },
        //画出省份地图
        paintBaseMap: function (baseData) {
            require(['/json/china.js'], function (chinaJson) {
                echarts.registerMap('china', chinaJson);

                if (!baseEcharts) {
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
                            data: baseData.numData
                            //nameMap: baseData.contyrData
                        }
                    ]
                };
                baseEcharts.setOption(option);
            });
        },
        //画出地图的地理位子信息
        paintGetAllGisDevView: function () {
            function getFormateData(arr) {
                for (var i = 0; i < arr.length; i++) {
                    arr[i].value = arr[i].geoCoord;
                    delete  arr[i].geoCoord;
                }
                return arr;
            }

            $.get(API.gisGetAllGisDevView, function (resp) {
                if (!spotEcharts) {
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
                        x: 'left',
                        data: ['设备', '区', '市'],
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    geo: {
                        map: 'china',
                        label: {
                            emphasis: {
                                show: false
                            }
                        },
                        itemStyle: {
                            normal: {
                                borderColor: '#fff',
                                borderWidth: 0.05,
                                areaColor: '#000911'
                            },
                            emphasis: {
                                areaColor: '#000911'
                            }
                        }
                    },
                    series: [
                        {
                            name: '设备',
                            type: 'scatter',
                            coordinateSystem: 'geo',
                            data: getFormateData(placeList[0]),
                            symbolSize: 1,
                            itemStyle: {
                                normal: {
                                    color: '#0778f9'
                                }
                            }
                        },
                        {
                            name: '区',
                            type: 'scatter',
                            coordinateSystem: 'geo',
                            data: getFormateData(placeList[1]),
                            symbolSize: 1.5,
                            itemStyle: {
                                normal: {
                                    color: 'rgba(14, 241, 242, 0.8)'
                                }
                            }
                        },
                        {
                            name: '市',
                            type: 'effectScatter',
                            coordinateSystem: 'geo',
                            data: getFormateData(placeList[2]),
                            symbolSize: 1,
                            showEffectOn: 'render',
                            rippleEffect: {
                                brushType: 'stroke'
                            },
                            itemStyle: {
                                normal: {
                                    color: '#FFF',
                                    shadowBlur: 20,
                                    shadowColor: '#FFF'
                                }
                            },
                            zlevel: 1
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
                        if (!numRun) {
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

