/*
 工具包
 */
define([], function () {
    window.Tool = {};
    //经过提示信息
    Tool.Tooltip = function (info) {
        info.status = info.status || "append";  //append 添加事件  remove 删除事件
        this.init = function () {
            //删除事件
            if (info.status == "remove") {
                this.unbindEvent();
                return;
            }
            //添加事件
            info.box.mouseover(function () {
                $(".tooptip").remove();
                var $title = info.message;
                if (!$title) {
                    return;
                }
                $("body").append("<i class='tooptip'>" + $title + "</i>");
                var $offset = info.input.offset()
                //箭头位置
                if (info.status == "right") {
                    $(".tooptip").css({
                        right: $(window).width() - $offset.left
                    });
                } else {
                    $(".tooptip").css({
                        left: $offset.left
                    });
                }
                $(".tooptip").css({
                    width: info.width,
                    top: $offset.top,
//                    left:$offset.left,//info.left||0,
                    whiteSpace: info.whiteSpace || "normal",
                    lineHeight: info.lineHeight
                }).animate({
                    opacity: 1
                }, 100);
            });
            info.box.mouseout(function () {
//                $(".tooptip").remove();
            });
            if (!!info.input) {
                info.input.blur(function () {
//                    $(".tooptip").remove();
                });
            }
        };
        this.unbindEvent = function () {
            info.box.unbind("mouseover");
            info.box.unbind("mouseout");
        }
        this.init();
    };
//    Tool.Tooltip({box:$('.aa').closest("li"),message:"请填写正确的邮箱！",input:$('.aa'),status:"right"});
    //获取链接
    Tool.getUrlParam = function (val) {
        var href = location.href.replace("?", "&");
        href = href.split("&");
        href.shift();
        var data = {
            urlParamVal: 0
        };
        for (var i = 0; i < href.length; i++) {
            var val = href[i].split("=");
            if (val[1]) {
                data[val[0]] = val[1];
                data.urlParamVal++;
            }
        }
        return data;
    };
    //改变链接值
    Tool.changeUrlVal = function (data, status) {
        //清理location
        if (status == "clean") {
            Tool.setUrlParam({});
        }
        //获取location信息
        data = data || [];
        var urlParam = Tool.getUrlParam();
        for (var i = 0; i < data.length; i++) {
            if (data[i].val) {
                urlParam[data[i].name] = data[i].val;
            } else {
                delete urlParam[data[i].name];
            }
        }
        //设置location值
        Tool.setUrlParam(urlParam);
    };
    //设置href值
    Tool.setUrlParam = function (info) {
        var data = "";
        for (var i in info) {
            if (i != "urlParamVal") {
                data += i + "=" + info[i] + "&";
            }
        }
        data = data.slice(0, data.length - 1);
        history.pushState({}, ".html", "?" + data);
    };
    //页码整理  
    Tool.pageData = function (data) {
        data = data || {};
        var pages = [];
        //小于6页全部展示
        if (data.totalPage <= 6) {
            for (var i = 0; i < data.totalPage; i++) {
                pages.push({
                    num: i + 1,
                    active: i == data.currentPage - 1 ? "active" : ""
                });
            }
        }
        if (data.totalPage > 6) {
            //当前页面小于4前面全部展示
            if (data.currentPage < 5) {
                for (var i = 0; i < 4; i++) {
                    pages.push({
                        num: i + 1,
                        active: i == data.currentPage - 1 ? "active" : ""
                    });
                }
                if (data.currentPage == 4) {
                    pages.push({num: 5});
                }
                pages.push({num: "...", omit: "omit"});
                pages.push({num: data.totalPage});
            } else
            //当前页面在最后3页后面全部展示
            if (data.currentPage >= data.totalPage - 4) {
                pages.push({num: 1});
                pages.push({num: "...", omit: "omit"});
                for (var i = data.totalPage - 4; i < data.totalPage; i++) {
                    pages.push({
                        num: i + 1,
                        active: i == data.currentPage - 1 ? "active" : ""
                    });
                }
            } else
            //页面在中间
            if (data.currentPage >= 5 && data.currentPage < data.totalPage - 4) {
                pages.push({num: 1});
                pages.push({num: "...", omit: "omit"});
                for (var i = data.currentPage - 1; i < data.currentPage + 3; i++) {
                    pages.push({
                        num: i + 1,
                        active: i == data.currentPage - 1 ? "active" : ""
                    });
                }
                pages.push({num: "...", omit: "omit"});
                pages.push({num: data.totalPage});
            }
        }
        return pages;
    };
    //省份获取
    Tool.area = function (data, callback) {
        data = data || {areaId: 0};
        $.ajax({
            url: API.areaChildren,
            type: "post",
            data: data,
            success: function (resp) {
                if (callback) {
                    callback(resp.data);
                } else {
                    return resp.data;
                }
            },
            error: function (resp) {
                console.log(resp, "失败");
            }
        });
    };
    //加载数据中
    Tool.loaddding = function (data) {
        data.status = data.status || "add";
        this.init = function () {
            this[data.status]();
        };
        //删除
        this.remove = function () {
            for (var i = 0; i < data.box.length; i++) {
                $(data.box[i]).find(".loaddinginfo").remove();
            }
            if (data.selfBox) {
                for (var i = 0; i < data.selfBox.length; i++) {
                    $(data.selfBox[i]).remove();
                }
            }
        };
        this.add = function () {
            //添加
            component.loaddinginfo();
            var newBox = [];
            for (var i = 0; i < data.box.length; i++) {
                var $box = "loaddinginfo" + $.now() + i;
                newBox.push("." + $box);
                if (data.cover) {
                    $(data.box[i]).html('<div class="loaddinginfo ' + $box + '"><loaddinginfo></loaddinginfo></div>');
                } else {
                    $(data.box[i]).append('<div class="loaddinginfo ' + $box + '"><loaddinginfo></loaddinginfo></div>');
                }
                new Vue({
                    el: "." + $box
                });
                if (data.delayShow) {
                    $("." + $box).css({display: "none"});
                    //延时展示
                    this.delayShow($box);
                }
            }
            if (data.callback) {
                data.callback(newBox, data.box);
            }
        };
        //延时展示
        this.delayShow = function ($box) {
            setTimeout(function () {
                $("." + $box).css({display: "block"});
            }, data.timeout || 100);
        };
        this.init();
    };
    //加载数据中-生成loadding
    Tool.createLoadding = function (box, cover, callback) {
        if (!box) {
            $(".page").html("");
        }
        Tool.loaddding({
            box: box || [".info-table-box"],
            cover: cover == false ? false : true,//覆盖
            delayShow: true,//N毫秒后展示 默认N毫秒"timeOut:N" 时间太快不显示正在加载中...
            callback: function (newBox, box) {
                //超时
                Tool.nothing({
                    question: "获取数据超时，请再刷新试试",
                    hints: [{
                        text: "请检查您的网络是否连接正常"
                    }],
                    removeLoadding: newBox,
                    hide: true,
                    delayedShow: true
                }, box, callback);
            }
        });
    };
    //删除正在加载中
    Tool.removeLoadding = function (box, selfBox) {
        box = box || [".loadding-box"];
        Tool.loaddding({
            box: box || [".loadding-box"],
            selfBox: selfBox || [],
            status: "remove"
        });
        //删除超时会展示的提示文字
        for (var i = 0; i < box.length; i++) {
            $(box[i]).find(".nothing").remove();
        }
    };
    //btn处理
    Tool.btnStauts = function (data) {
        var self = this;
        self.init = function () {
            //设置状态
            self.common();
            //设置值
            if (data.val) {
                self.setValue(data.val);
            }
            //设置状态
            self[data.status]();
        };
        //还原
        self.common = function () {
            //设置状态
            $(data.box).removeClass("submit-save submit-success submit-error disabled").find("i").remove();
            if (data.common) {
                $(data.box).text(data.common);
            }
        };
        //保存中 
        self.save = function () {
            $(data.box).addClass("submit-save disabled");
        };
        //成功 
        self.success = function () {
            $(data.box).addClass("submit-success disabled").append("<i class='icon'>&#xe61c;</i>");
            self.callback();
        };
        //失败
        self.error = function () {
            $(data.box).addClass("submit-error disabled").append("<i class='icon'>&#xe607;</i>");
            self.callback();
        };
        //setValue  
        self.setValue = function (val) {
            $(data.box).text(val);
        };
        //回调  
        self.callback = function () {
            setTimeout(function () {
                self.common();
                if (data.callback) {
                    data.callback();
                }
            }, data.outTime || 1500);
        };
        self.init();
    };
    //btn提交等待中
    Tool.btnStautsBusy = function (text) {
        //按扭状态改变
        Tool.btnStauts({
            status: "save",
            box: ".btn-submit",
            val: text || "正在保存"
        });
    };
    //btn提交成功
    Tool.btnStautsSuccess = function (text, common, callback) {
        //按扭状态改变
        Tool.btnStauts({
            status: "success",
            box: ".btn-submit",
            common: common || "保存",
            val: text || "保存成功",
            callback: function () {
                if (callback) {
                    callback();
                }
            }
        });
    };
    //btn提交失败
    Tool.btnStautsError = function (text, common, callback) {
        //按扭状态改变
        Tool.btnStauts({
            status: "error",
            box: ".btn-submit",
            common: common || "保存",
            val: text || "保存失败",
            callback: function () {
                if (callback) {
                    callback();
                }
            }
        });
    };
    //提示框
    Tool.alertbox = function (data) {
        var self = this;
        self.init = function () {
            //添加基础容器
            self.addBox();
            //使用组件
            self.useComponent();
            //显示提示框
            self.show();
            //自动隐藏
            self.autoHide();
        };
        //添加基础容器
        self.addBox = function () {
            self.box = "alertbox" + $.now();
            $("body").append('<div class="alertbox ' + self.box + ' ' + data.box + '"><alertbox></alertbox></div> ')
        };
        //使用组件
        self.useComponent = function () {
            data.data.box = "." + self.box;
            component.alertbox(data.data);
            new Vue({
                el: '.' + self.box
            });
        };
        //show 
        self.show = function () {
            //延时展示 调用接口快的时候用上 
            if (data.delayShow) {
                setTimeout(function () {
                    $("." + self.box).animate({opacity: 1}, 200);
                }, data.delayTime || 200);
            } else {
                $("." + self.box).animate({opacity: 1}, 200);
            }
        };
        //自动隐藏      
        self.autoHide = function () {
            data.hideTime = data.hideTime || [2000, 200];
            if (data.autoHide) {
                clearTimeout(self.time);
                self.time = setTimeout(function () {
                    $("." + self.box).animate({opacity: 0}, data.hideTime[1], function () {
                        $(this).remove();
                    });
                }, data.hideTime[0]);
            }
        };
        self.init();
    };
    //提示框-成功
    Tool.alertboxSuccess = function (text) {
        Tool.alertbox({
            autoHide: true,
            data: {
                clickBGclose: false,
                statusShow: "success",
                hint: text || "保存成功"
            },
        });
    };
    //提示框-错误
    Tool.alertboxError = function (text) {
        //展示报错信息
        Tool.alertbox({
            autoHide: true,
            data: {
                clickBGclose: true,
                statusShow: "error",
                hint: text || "保存失败"
            },
        });
    };
    //提示框-警告
    Tool.alertboxWarning = function (text, autoHide, clickBGclose) {
        autoHide = autoHide || true;
        clickBGclose = clickBGclose || true;
        //提示框 
        Tool.alertbox({
            autoHide: autoHide,
            data: {
                clickBGclose: clickBGclose,
                statusShow: "warning",
                hint: text || "警告"
            },
        });
    };
    //位置信息
    Tool.location = function (list) {
        // 创建位置
        component.location({
            list: list
        });
        new Vue({
            el: '.location'
        });
    };
    //搜索
    Tool.search = function (data, methods) {
        component.search(data, methods);
        new Vue({
            el: '.search'
        });
    };
    //无结果
    Tool.nothing = function (data, box, callback) {
        callback = callback || function () {
            };
        var $nothing;
        //添加nothing标签
        if (box && box.length) {
            for (var i = 0; i < box.length; i++) {
                $nothing = "nothing" + $.now() + i;
                $(box[i]).append('<div class="nothing ' + $nothing + '"><nothing></nothing></div>');
                component.nothing(data);
                new Vue({
                    el: "." + $nothing
                });
            }
            callback();
            return;
        } else {
            $nothing = "nothing" + $.now();
            $(".info-table-box").append('<div class="nothing ' + $nothing + '"><nothing></nothing></div>');
        }
        component.nothing(data);
        new Vue({
            el: "." + $nothing
        });
        callback();
    };
    //返回报错信息
    Tool.showErrorMsg = function (val, box) {
        //没有结果
        $(box || '.info-table-box').html("");
        Tool.nothing({
            question: val || "", hints: []
        }, [box || '.info-table-box']);
    };
    //页码 
    Tool.page = function (info, changePage) {
        $(".page").html("<page></page>");
        // 创建搜索
        component.page(info, {
            changePage: function (num) {
                changePage(num);
            }
        });
        new Vue({
            el: '.page'
        });
    };
    //分类
    Tool.category = function (info, methods) {
        component.category(info, methods);
        new Vue({
            el: '.category'
        });
    };
    //获取整十
    Tool.tenNum = function (val) {
        val += "";
        if (val.length === 1) {
            return 0 + val;
        } else {


            return val;
        }
    };
    //获取时间
    Tool.getTime = function (n) {
        var now = new Date;
        now.setDate(now.getDate() - n);
        return now;
    };
    //获取时间日期  
    Tool.getTimeDate = function (date) {
        var time = Tool.getTime(date);
        return Tool.tenNum(time.getFullYear()) + "-" + Tool.tenNum((time.getMonth() + 1)) + "-" + Tool.tenNum(time.getDate());
    };
    //获取next时间
    Tool.getNextTime = function (str) {
        var date = new Date(str);
        date.setDate(date.getDate() + 1);
        return Tool.tenNum(date.getFullYear()) + "-" + Tool.tenNum((date.getMonth() + 1)) + "-" + Tool.tenNum(date.getDate());
    };
    //获取现在月份至之后
    Tool.getNowMonthAndAfter = function () {
        var time = new Date(),
            nowMonth = time.getMonth() + 1,
            month = [];
        for (var i = 1; i < 12; i++) {
            var val = nowMonth + i;
            month.push((val > 12 ? val % 12 : val) + "月");
        }
        month.push(nowMonth + "月");
        return month;
    };
    return Tool;
});    