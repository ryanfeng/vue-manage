/*
 * 用户管理页面
 * */
define(['Tool','component','text!/tpl/system-manage/user.html'],function(Tool,component,user){
    var urlParam = Tool.getUrlParam();
    //参数
    window.Params = {
        limit : 10,
        search : decodeURIComponent(urlParam.search||""),
        page : urlParam.page||0,
        searchCategory : decodeURIComponent(urlParam.searchCategory||"用户名称")
    }
    var init = {
        default : function(){
            init.base();
            //添加
            init.add();
            //获取角色列表
            init.getUserList();
        },
        base : function(){
            //位置信息
            Tool.location([{
                class : "",
                href : "javascript:void(0)",
                text : "系统管理" 
            },{
                class : "",
                href : "javascript:void(0)",
                text : "用户管理" 
            }]);
            //搜索
            Tool.search({
                placeholder : "请输入用户名称查询",
                val : Params.search,
                select : true,
                option : [
                    {
                        text : "用户名称",
                        placeholder : "请输入用户名称查询",
                        class : Params.searchCategory=="用户名称"?"selected":""
                    },
                    {
                        text : "登录账号",
                        placeholder : "请输入登录账号查询",
                        class : Params.searchCategory=="登录账号"?"selected":""
                    }
                ],
                optionDefault : Params.searchCategory
            },{
                //提交搜索
                submitSearch : function(val,info){
                    Params.search=val;
                    Params.page=0;
                    Params.searchCategory=info.optionDefault;
                    //改变链接值
                    Tool.changeUrlVal([
                        {name:"search",val:val},
                        {name:"page",val:""},
                        {name:"searchCategory",val:info.optionDefault}
                    ]);
                    //获取角色列表
                    init.getUserList();
                }
            });
        },
        //添加
        add : function(){
            new Vue({
                el: ".add",
                //数据
                data: {
                    newBtnClass : "btn-success "+(localStorage.permissions.indexOf(",sys:user:add,")>-1?"":"hidden"),
                    newBtnValue : "新增＋"
                },
                //事件
                methods : {
                    //添加
                    new : function(){
                        location.href = "/html/system-manage/new-user.html";
                    }
                }
            });
        },
        //获取用户列表
        getUserList : function(){
            var data = {
                page : Params.page,
                limit : Params.limit
            };
            //获取搜索类型和值
            var searchParam = init.searchParam()
            $.extend(data,init.searchParam());
            //添加正在加载中...
            Tool.createLoadding();
            $.ajax({
                url :API.userList, 
                type:"POST",
                data : data,
                success : function(resp){
                    if(resp.code==0){
                        if(resp.data.length){
                            //信息整理
                            init.infoNeaten(resp.data);
                            //页码
                            init.page(resp.info);
                        }else{
                            if(Params.search){
                                //没有结果
                                init.nothingInfo(Params.search);
                            }else{
                                //表格信息
                                init.infoTable([]);
                            }
                        }
                    }else{
                        //没有结果
                        init.nothingInfo("没有数据","question");
                    }
                },
                error: function(resp){
                    //没有结果
                    init.nothingInfo("没有数据","question");
                }
            });
        },
        //查询参数
        searchParam : function(){
            if(Params.searchCategory=="用户名称"){
                return {userName:Params.search};
            }
            if(Params.searchCategory=="登录账号"){
                return {loginName:Params.search};
            }
        },
        //没有结果
        nothingInfo : function(searchVal,status){
            $(".info-table-box").html('');
            //无结果
            Tool.nothing({
                searchVal:!status&&(searchVal||""),
                question : status=="question"?searchVal:""
            });
        },
        //信息整理
        infoNeaten : function(resp){
            var page = Params.page*Params.limit;
            for(var i=0;i<resp.length;i++){
                resp[i].number = i+1+page;
                resp[i].tools = {
                    edit : "修改",
                    editShow : localStorage.permissions.indexOf(",sys:user:update,")>-1?true:false,
                    reset : "重置密码",
                    statusTrue : "锁定",
                    statusFalse : "解锁",
                    look : "查看权限",
                    del : "删除",
                    delShow : localStorage.permissions.indexOf(",sys:user:del,")>-1?true:false
                };
            }
            //表格信息
            init.infoTable(resp);
        },
        //表格信息
        infoTable : function(dataList){
            $(".info-table-box").html(user);
            // 创建表格信息
            new Vue({
                el: '.info-table',
                data : {
                    page : Params.page*Params.limit,
                    titles : [
                        { text : "序号"},
                        { text : "用户名称"},
                        { text : "登录账号"},
                        { text : "角色名称"},
                        { text : "状态"},
                        { text : "操作", styleObject : {
                            "width" : "240px"
                        }}
                    ],
                    dataList : dataList
                },
                methods : {
                    //状态改变
                    statueChange : function(tool){
                        $.ajax({
                            url : API.lockUser,
                            type : "POST",
                            data : {
                                userId : tool.id,
                                isEnable : tool.isEnable?0:1
                            },
                            success : function(resp){
                                if(resp.code==0){
                                    tool.isEnable?tool.isEnable=0:tool.isEnable=1;
                                }else{
                                    //提示框-失败
                                    Tool.alertboxError(resp.msg);
                                }
                            },
                            error : function(resp){
                                //提示框-失败
                                Tool.alertboxError("状态改变失败");
                            }
                        });

                    },
                    //删除用户
                    userDel : function(val){
                        var self = this;
                        $.ajax({
                            url :API.userDel,
                            type:"post",
                            data : {
                                userId : val.id
                            },
                            success : function(resp){
                                if(resp.code==0){
                                    //btn提交成功
                                    Tool.btnStautsSuccess("删除角色成功","删除",function(){
                                        location.href = "./user.html";
                                    });
                                    //提示框-成功
                                    Tool.alertboxSuccess("删除角色成功");
                                }else{
                                    //btn提交失败
                                    Tool.btnStautsError("删除角色失败","删除");
                                    //提示框-错误
                                    Tool.alertboxError(resp.msg);
                                    self.dislabedSubmit = false;
                                }
                            },
                            error: function(resp){
                                //btn提交失败
                                Tool.btnStautsError("删除角色失败","删除");
                                self.dislabedSubmit = false;
                            }
                        });
                    },
                    //重置密码
                    resetPassword : function(val){
                        $.ajax({
                            url : API.resetPwd,
                            type : "POST",
                            data : {
                                userId : val.id
                            },
                            success : function(resp){
                                if(resp.code==0){
                                    init.resetPassword();
                                }else{
                                    //提示框-失败
                                    Tool.alertboxError(resp.msg);
                                }
                            },
                            error : function(resp){
                                //提示框-失败
                                Tool.alertboxError("重置密码失败");
                            }
                        });
                    },
                }
            });
        },
        //页码
        page : function(info){
            if(!info||info.totalPage<=1){
                return;
            }
            //页码
            Tool.page(info,function(num){
                Params.page=num;
                //改变链接值
                Tool.changeUrlVal([{name:"page",val:num}]);
                //获取角色列表
                init.getUserList();
            });
        },
        //重置密码
        resetPassword : function(){
            $(".resetPasswordModal").remove();
            $("body").append(
                '<div class="resetPasswordModal">'+
                    '<resetpasswordmodal></resetpasswordmodal>'+
                '</div>');
            // 创建搜索
            component.resetPasswordModal();
            new Vue({
                el: '.resetPasswordModal'
            });
        }
    };
    init.default();

});