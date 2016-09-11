/*
* 角色管理页面
* */
define(['Tool','component','text!/tpl/system-manage/role.html'],function(Tool,component,role){
    var urlParam = Tool.getUrlParam();
    //参数
    var Params = {
        limit : 10,
        roleName : decodeURIComponent(urlParam.roleName||""),
        page : urlParam.page||0
    }
    console.log(Params);
    var init = {
        default : function(){
            init.base();
            //添加
            init.add(); 
            //获取角色列表
            init.getRoleList();
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
                text : "角色管理"
            }]);
            //搜索
            Tool.search({
                val : Params.roleName,
                placeholder:"请输入角色名称查询"
            },{
                //提交搜索
                submitSearch : function(val){
                    Params.roleName=val;
                    Params.page=0;
                    //改变链接值  
                    Tool.changeUrlVal([
                        {name:"roleName",val:val},
                        {name:"page",val:""}
                    ]);
                    //获取角色列表
                    init.getRoleList();
                }
            });
        },
        //添加
        add : function(){
            new Vue({
                el: ".add",  
                //数据
                data: { 
                    newBtnClass : "btn-success "+(localStorage.permissions.indexOf(",sys:role:add,")>-1?"":"hidden"),
                    newBtnValue : "新增＋"
                },
                //事件
                methods : {
                    //添加
                    new : function(){
                        location.href = "/html/system-manage/new-role.html";
                    }
                }
            });
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
        //获取角色列表
        getRoleList : function(){
            var data = {
                page : Params.page,
                limit : Params.limit,
                roleName : Params.roleName
            };
            //添加正在加载中...
            Tool.createLoadding();
            $.ajax({
                url :API.roleList,
                type:"POST",
                data : data,
                success : function(resp){
                    if(resp.code==0){
                        if(resp.data.length){ 
                            //信息整理
                            init.infoNeaten(resp.data);
                            //页码
                            init.page(resp.info);
                            return;
                        }
                        if(Params.roleName){
                            //没有搜索结果
                            init.nothingInfo(Params.roleName);
                        }else{
                            //表格信息
                            init.infoTable([]);
                        }
                        return;
                    }
                    //提示框-错误
                    Tool.alertboxError(resp.msg);
                    //没有结果
                    init.nothingInfo("没有数据","question");
                },
                error: function(resp){
                    //没有结果
                    init.nothingInfo("没有数据","question");
                }
            });
        },
        //信息整理
        infoNeaten : function(resp){
            for(var i=0;i<resp.length;i++){
                resp[i].tools = {
                    edit : "修改", 
                    editShow : localStorage.permissions.indexOf(",sys:role:update,")>-1?true:false,
                    detail : "查看权限",
                    del : "删除",
                    delShow : localStorage.permissions.indexOf(",sys:role:del,")>-1?true:false
                };
            }
            //表格信息
            init.infoTable(resp);
        },
        //表格信息
        infoTable : function(dataList){
            $(".info-table-box").html(role);
            // 创建表格信息
            new Vue({
                el: '.info-table',
                data : {
                    page : Params.page*Params.limit,
                    titles : [
                        { text : "序号"},
                        { text : "角色列表"},
                        { text : "操作", styleObject : {
                            "width" : "150px"
                        }}
                    ], 
                    dataList : dataList
                },
                methods : {
                    //删除用户
                    roleDel : function(val){
                        console.log(val.roleId)
                        var self = this;
                        $.ajax({
                            url :API.roleDel,
                            type:"post",
                            data : {
                                roleId : val.roleId
                            },
                            success : function(resp){
                                if(resp.code==0){
                                    //btn提交成功
                                    Tool.btnStautsSuccess("删除角色成功","删除",function(){
                                        location.href = "./role.html";
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
                init.getRoleList();
            });
        }
    };
    init.default();

});