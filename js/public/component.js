/*
* 调用方法示例
 // 创建搜索
 //html
 <!--搜索-->
 <div class="search">
 <search></search>
 </div>

 component.search({
    btnText : "文案"
 });
 new Vue({
 el: '.search'
 });

* */
define('component',[],function(header,nav){
    window.component = {
        //顶部位置组件
        location : function(info){
            //数据集合
            info = info || {};
            var data = {
                list : [
                    { text : "位置" }
                ]
            } 
            $.extend(data,info);
            // 定义组件
            var location = Vue.extend({
                template:
                    '<ul>'+
                        '<li v-for="val in list"><a class="{{val.class}}" href="{{val.href}}">{{val.text}}</a></li>'+
                    '</ul>',
                data: function(){
                    return data
                }
            })
            // 全局注册组件
            Vue.component('location', location);
        },
        //搜索框组件
        search : function(info,callback){
            //数据集合
            info = info || {};
            var data = {
                placeholder : "请输入关键字查询",
                btnText : "查询",
                btnClass : "btn-success",
                value : ""
            }
            //扩展查询
            if(info.select){
                $.extend(data,{
                    selectClass : "searchClass",
                    searchValClass : "hasSelect",
                    option : [
                        { text : "销售区域", placeholder : "请输入销售区域查询"},
                        { text : "入驻时间", placeholder : "请输入入驻时间查询" },
                        { text : "联系人", placeholder : "请输入联系人查询" },
                        { text : "手机号码", placeholder : "请输入手机号码查询" },
                        { text : "联系地址", placeholder : "请输入联系地址查询" }
                    ]
                });
            }
            // 定义组件
            $.extend(data,info);
            var search = Vue.extend({
                template:
                    '<template v-if="select">' +
                        '<div class="sod_select define">'+
                            '<div class="sod_label">{{optionDefault||"关键字"}}</div>'+
                            '<div class="sod_list">'+
                                '<ul>'+
                                    '<li class="{{val.class}}" v-on:click="optionVal(val)" v-for="val in option">{{val.text}}</li>'+
                                '</ul>'+
                            '</div>'+
                        '</div>'+
                    '</template>'+
                    '<input type="text" v-model="value" class="input searchVal mr10 {{searchValClass}}" v-on:keyup="keyup" placeholder="{{placeholder}}" value="{{val}}"/>' +
                    '<input type="button" v-on:click="submitSearch" class="btn {{btnClass}}" value="{{btnText}}"/>'+
                    '<template v-if="value">'+
                        '<i class="icon icon-clean" v-on:click="clean">&#xe607;</i>'+
                    '</template>',
                data: function(){
                    return data 
                },
                methods:{
                    //提交搜索
                    submitSearch : function(){
                        var $val = $.trim($(".searchVal").val());
                        //搜索返回
                        callback["submitSearch"]($val,this);
                    },
                    //清楚输入框文字
                    clean : function(){
                        this.value = "";
                    },
                    //快速提交搜索
                    keyup : function(e){
                        if(e.keyCode==13){
                            //提交登录
                            this.submitSearch();
                        } 
                    },
                    //选项值
                    optionVal : function(val){ 
                        this.optionDefault = val.text;
                        this.selectActive = val;
                        this.placeholder = val.placeholder;
                        // for(var i=0;i<this.option.length;i++){
                        //     if(val==this.option[i].text){
                        //         this.placeholder = this.option[i].placeholder;
                        //         this.optionDefault = this.option[i].text;
                        //         return;
                        //     }
                        // }
                    }
                }
            })
            // 全局注册组件
            Vue.component('search', search);
        },
        //页面码组件
        page : function(info,callback){
            //数据集合
            var data = {
                prev : "上一页",
                pages : Tool.pageData(info),
                next : "下一页",
                number : info.currentPage
//                currentPage : 8,
//                currentSize : 2,
//                totalNum : 48,
//                totalPage : 12
            }
            $.extend(data,info);
            //当前为首页
            if(data.currentPage==1){
                data.prevClass = "disabled";
            }
            //当前为末页
            if(data.totalPage==data.currentPage){
                data.nextClass = "disabled";
            }
            // 定义组件
            var page = Vue.extend({
                template:
                    '<aside>显示1到{{totalNum}}的{{currentSize}}个条目</aside>'+
                    '<ul>'+
                        '<li class="" v-on:click=""><input class="pageNumber" v-model="number" /></li>'+
                        '<li class="prev" v-on:click="(number != currentPage)&&(number <= totalPage)&&changePage(number)">跳转</li>'+
                        '<li class="prev {{prevClass}}" v-on:click="!prevClass&&changePage(currentPage-1)"><i class="icon">&#xe62e;</i>{{prev}}</li>'+
                        '<li v-for="page in pages" class="{{page.active}} {{page.omit}}" v-on:click="(!page.active&&!page.omit)&&changePage(page.num)">{{page.num}}</li>'+
                        '<li v-on:click="!nextClass&&changePage(currentPage+1)" class="next {{nextClass}}"><i class="icon">&#xe611;</i>{{next}}</li>'+
                    '</ul>', 
                data: function(){
                    return data 
                },
                methods:{
                    //改变页码
                    changePage : function(num){
                        if(num>0){
                            callback["changePage"](num-1);
                        }
                    },
                    //清楚输入框文字
                    clean : function(){
                        $(".searchVal").val("").focus();
                    }
                }
            })
            // 全局注册组件
            Vue.component('page', page);

        },
        //没有结果
        nothing : function(info){
            //数据集合
            info = info || {};
            var data = {
                searchVal : "",
                hints : [
                    { text : "请检查您的输入是否正确" },
                    { text : "请更换关键词重新搜索。" }
                ]
            }
            $.extend(data,info);
            // 定义组件
            var nothing = Vue.extend({
                template:
                    '<div v-if="!hide" class="box">'+
                        '<h4 v-if="searchVal" class="caption">很抱歉，没有找到与“<span class="warningColor">{{searchVal}}</span>”相关的内容。</h4>'+
                        '<h4 v-if="!searchVal" class="caption"><span class="warningColor">{{question||"很抱歉，没有相关的内容。"}}</span></h4>'+
                        '<dl>' +
                            '<dt v-if="hints.length">温馨提示：</dt>'+
                            '<dd v-for="info in hints">{{info.text}}</dd>'+
                        '</dl>'+
                    '</div>', 
                data: function(){
                    return data
                },
                created : function(){
                    //延时展示
                    this.delayedShow&&this.show();
                }, 
                methods : {
                    //延时展示 
                    show : function(){
                        var self = this;  
                        var time = setTimeout(function(){
                            //删除正在加载中
                            Tool.removeLoadding([],info.removeLoadding);
                            self.hide = "";
                        },self.delayedTime||250000);
                    }
                }
            })
            // 全局注册组件
            Vue.component('nothing', nothing);
        },
        //重置密码
        resetPasswordModal : function(info){
            //数据集合
            info = info || {};
            var data = {
                show : "",
                hint : "<b>密码重置成功</b>新密码默认为123456",
                num : 5
            }
            $.extend(data,info);
            // 定义组件
            var resetPasswordModal = Vue.extend({
                template:
                    '<div class="modal modal-resetPassword hide {{show}}">'+
                        '<i class="bg"></i>'+
                        '<div class="center-box">'+
                            '<!--重置密码-->'+
                            '<div class="box reset-password">'+
                                '<i class="icon modal-close icon-close" v-on:click="hide" >&#xe607;</i>'+
                                '<!--提示-->'+
                                '<div class="reset-success">'+
                                    '<i class="icon icon-success">&#xe60a;</i>'+
                                    '<div class="hint">{{{hint}}}</div>'+
                                '</div>'+
                                '<div class="footer-modal">({{num}}秒后自动关闭此窗口)</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>',
                data: function(){
                    return data
                },
                created : function(){
                    var self = this;
                    //倒计时
                    var time = setInterval(function(){
                        if(!self.num){
                            self.show = "";
                            clearInterval(time);
                        }else{
                            self.num--;
                        }
                    },1000);
                    self.show = "show";
                },
                //事件
                methods : {
                    //添加角色
                    hide : function(){
                        this.show = "";
                    }
                }
            });
            // 全局注册组件
            Vue.component('resetpasswordmodal', resetPasswordModal);

        },
        //分类
        category : function(info,callback){
            //数据集合
            info = info || {};
            var data = {
                list : info.list||[
                    { text : "全部分类" ,active:"active"},
                    { text : "空气复原机"  ,active:""},
                    { text : "滤网"  ,active:""},
                    { text : "检测仪"  ,active:""}
                ]
            }
            $.extend(data,info);
            // 定义组件
            var category = Vue.extend({
                template:
                    '<ul>'+
                        '<li v-for="val in list" class="{{val.active}}" v-on:click="select($index,val)">{{val.text}}</li>'+
                    '</ul>',
                data: function(){
                    return data;
                },
                methods : {
                    //选中列表
                    select : function(index,val){
                        //取消选中
                        this.cancelActive();
                        this.list[index].active = "active";
                        //选中返回
                        if(callback){
                            callback["select"](val,this);
                        }
                    },
                    //取消选中
                    cancelActive : function(){
                        for(var i=0;i<this.list.length;i++){ 
                            this.list[i].active = "";
                        }
                    }
                }
            })
            // 全局注册组件
            Vue.component('category', category);
        },
        //加载数据中
        loaddinginfo : function(info){
            //数据集合
            info = info || {};
            var data = {
                img : '<img src="/images/public/loaddinginfo.gif"/>',
                text : "正在加载，请稍等..."
            }
            $.extend(data,info); 
            // 定义组件
            var loaddinginfo = Vue.extend({
                template:
                    '{{{img}}}<h5>{{text}}</h5>',
                data: function(){
                    return data;
                },
                methods : {
                    
                }
            })
            // 全局注册组件
            Vue.component('loaddinginfo', loaddinginfo);
        },
        //提示框
        alertbox  : function(info){
            //数据集合
            info = info || {};
            var data = {
                hint : "",
                statusShow : false,
                //状态
                status : {
                    show : false,
                    //错误
                    error : {
                        class : "warningColor",
                        icon : "&#xe612;"
                    },
                    //警告
                    warning : {
                        class : "primaryColor",
                        icon : "&#xe619;"
                    },
                    //成功
                    success : {
                        class : "openColor",
                        icon : "&#xe61a;"
                    },
                    //等待
                    loadding : {
                        class : "secondTextColor",
                        icon : "&#xe617;"
                    }
                },
                groupStatus : false,
                group : { 
                    submitText : "确定",
                    cancelText : "取消"
                }
            } 
            $.extend(data,info); 
            console.log(data);
            // 定义组件 
            var alertbox = Vue.extend({ 
                template:
                    '<div class="center-box">'+ 
                        '<i class="bg" v-on:click="clickBG"></i>'+
                        '<div class="box">'+  
                            '<i v-if="statusShow" class="icon mr5 main-icon {{status[statusShow].class}}">{{{status[statusShow].icon}}}</i>'+
                            '<span class="vm">{{hint}}</span>'+
                            '<div v-if="groupStatus" class="btn-group tl mt15">'+
                                '<input type="button" class="btn btn-success" value="{{group.submitText}}">'+
                                '<input type="button" class="btn btn-cancel" v-on:click="close" value="{{group.cancelText}}">'+
                            '</div>'+
                        '</div>'+ 
                    '</div>', 
                data: function(){  
                    return data;  
                },
                methods : {  
                    //点击背景   
                    clickBG : function(){
                        console.log(this.clickBGclose);
                        if(this.clickBGclose){
                            this.close();
                        }
                    }, 
                    //关闭 
                    close : function(){ 
                        var self = this;
                        $(self.box).animate({opacity:0},200,function(){
                            $(this).remove();
                        });
                    }
                }
            })
            // 全局注册组件
            Vue.component('alertbox', alertbox);
        },
    };
    
    return component;
});