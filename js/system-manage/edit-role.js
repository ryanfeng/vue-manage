/*
* 编辑角色页面
* */
define(['Tool','component','text!/tpl/system-manage/edit-role.html'],function(Tool,component,editRole){
    var urlParam = Tool.getUrlParam();
    var Params = {
        roleId : urlParam.roleId,
        roleName : decodeURIComponent(urlParam.roleName)
    };
    var init = {
        default : function(){
            init.base();
            //新增角色
            init.newRole();
            //获取权限列表
            init.getRoleDetail();
        },
        base : function(){
            //位置信息
            Tool.location([{
                class : "",
                href : "javascript:void(0)",
                text : "系统管理"
            },{
                class : "hover",
                href : "./role.html",
                text : "角色管理" 
            },{
                class : "",
                href : "javascript:void(0)",
                text : "修改角色" 
            }]);
        },
        //新增角色
        newRole : function(){
            new Vue({
                el: ".input-form",
                //数据
                data: {
                    class : "new-role-input",
                    caption : "角色名称：",
                    warning : false,
                    hint : "",
                    value : Params.roleName,
                    placeholder : "请输入"
                },
                methods : {
                    focus : function(){
                        this.warning = "";
                        this.hint = "";
                    },
                    //按键
                    blur : function(){
                        //验证是否有值
                        Check.haveValue(this,"角色名称不能为空");
                    }
                }
            });
        },
        //获取权限列表
        getRoleDetail : function(){
            //添加正在加载中...
            Tool.createLoadding();
            $.ajax({
                url :API.roleDetail,
                type:"POST",
                data : {
                    roleId : Params.roleId
                },
                success : function(resp){
                    console.log(resp,"成功");
                    if(resp.code==0){
                        //表格信息
                        init.infoNeaten(resp.data.permissionList);
                    }
                },
                error: function(resp){
                    console.log(resp,'失败')
                }
            });
        },
        //信息整理
        infoNeaten : function(resp){
           for(var i=0;i<resp.length;i++){
                resp[i].number = i+1;
                resp[i].pwViewList = resp[i].pwViewList||[];
                resp[i].row = resp[i].pwViewList.length;
                resp[i].subInfo = [];
                resp[i].hasIt = resp[i].hasIt;
                resp[i].isDisplay = resp[i].isDisplay;
                for(var j=0;j<resp[i].pwViewList.length;j++){
                    var third = [];
                    resp[i].pwViewList[j].pwViewList = resp[i].pwViewList[j].pwViewList||[];
                    for(var k=0;k<resp[i].pwViewList[j].pwViewList.length;k++){
                        third.push({
                            hasIt : resp[i].pwViewList[j].pwViewList[k].hasIt,
                            isDisplay : resp[i].pwViewList[j].pwViewList[k].isDisplay,
                            permissionId : resp[i].pwViewList[j].pwViewList[k].permissionId,
                            text : resp[i].pwViewList[j].pwViewList[k].permissionName
                        });
                    }

                    resp[i].subInfo.push({
                        first : j==0?true:false,
                        second : {
                            hasIt : resp[i].pwViewList[j].hasIt,
                            isDisplay : resp[i].pwViewList[j].isDisplay,
                            permissionId : resp[i].pwViewList[j].permissionId,
                            text : resp[i].pwViewList[j].permissionName
                        },
                        third : third
                    });
                }
                //只有一级目录
                if(!resp[i].row){
                    resp[i].row = 1;
                    resp[i].subInfo = [
                        {
                            first : true,
                            second : [],
                            third : []
                        }
                    ];
                }
            }
            //表格信息
            init.infoTable(resp);
        },
        //表格信息
        infoTable : function(dataList){
            $(".info-table-box").html(editRole);
            // 创建表格信息
            new Vue({
                el: '.info-table',
                data : {
                    submitText : "保存",
                    submitClass : "btn-success btn-submit",
                    submitDisabled : false,
                    cancelText : "取消",
                    titles : [
                        { text : "序号", styleObject:{
                            width : "50px"
                        }},
                        { text : "一级权限", styleObject:{
                            width : "130px",
                            paddingLeft : "60px"
                        }},
                        { text : "二级权限",styleObject:{
                            width : "140px",
                            paddingLeft : "60px"
                        }},
                        { text : "三级权限",styleObject:{
                            paddingLeft : "60px"
                        }}
                    ],
                    dataList : dataList
                },
                methods : {
                    //一级权限设定
                    firstSelect : function(info){
                        if(info.hasIt){
                            info.hasIt=false;
                            for(var i=0;i<info.subInfo.length;i++){
                                info.subInfo[i].second.hasIt = false;
                                for(var j=0;j<info.subInfo[i].third.length;j++){
                                    info.subInfo[i].third[j].hasIt = false;
                                }
                            }
                            //检查权限
                            this.check();
                        }else{
                            this.submitDisabled = false;
                            info.hasIt=true;
                        }
                    },
                    //二级权限设定
                    secondSelect : function(info,second,third){
                        if(second.hasIt){
                            second.hasIt=false;
                            for(var i=0;i<third.length;i++){
                                third[i].hasIt = false;
                            }
                        }else{
                            this.submitDisabled = false;
                            second.hasIt=true;
                            info.hasIt=true;
                        }
                    },
                    //三级权限设定
                    thirdSelect : function(info,second,third,self){
                        if(self.hasIt){
                            self.hasIt=false;
                        }else{
                            this.submitDisabled = false;
                            self.hasIt=true;
                            second.hasIt=true;
                            info.hasIt=true;
                        }
                    },
                    //检查权限
                    check : function(){
                        var data = [];
                        //根目录遍历
                        for(var i=0;i<this.dataList.length;i++){
                            var first = this.dataList[i];
                            if(first.hasIt){
                                data.push({
                                    permissionId : first.permissionId
                                });
                            }
                            //子权限遍历
                            for(var j=0;j<first.subInfo.length;j++){
                                //二级权限判定
                                var second = first.subInfo[j].second;
                                if(second.hasIt){
                                    data.push({
                                        permissionId : second.permissionId
                                    });
                                }
                                //三级权限遍历
                                var third = first.subInfo[j].third;
                                for(var k=0;k<third.length;k++){
                                    if(third[k].hasIt){
                                        data.push({
                                            permissionId : third[k].permissionId
                                        });
                                    }
                                }
                            }
                        }
                        if(data.length){
                            this.submitDisabled = false;
                        }else{
                            this.submitDisabled = true;
                        }
                        return data;
                    },
                    //提交
                    submit : function(){
                        var self = this;
                        if(self.dislabedSubmit){
                            return;
                        }
                        var $val = $.trim($(".new-role-input").val()); 
                        if($val){
                            //获取权限数据
                            var permissionList = this.check(); 
                            if(!permissionList.length){
                                //提示框-警告
                                Tool.alertboxWarning("请勾选权限");
                                return;
                            }
                            //btn提交等待中
                            Tool.btnStautsBusy("正在保存角色");
                            self.dislabedSubmit = true;
                            //保存角色
                            this.roleSave($val,permissionList);
                        }else{
                            $("body,html").animate({scrollTop:0},500,function(){
                                $(".new-role-input").blur().focus();
                            });
                        }
                    },
                    //保存角色
                    roleSave : function(roleName,permissions){
                        var self = this;
                        $.ajax({
                            url :API.roleSave,
                            type:"post", 
                            dataType:"json",
                            contentType: "application/json", 
                            data : JSON.stringify({
                                roleId : urlParam.roleId,
                                roleName : roleName,
                                permissions : permissions
                            }),
                            success : function(resp){
                                console.log(resp,"成功");
                                if(resp.code==0){
                                    //btn提交成功
                                    Tool.btnStautsSuccess("保存角色成功","保存",function(){
                                        location.href = "./role.html";
                                    });
                                    //提示框-成功 
                                    Tool.alertboxSuccess("保存角色成功");
                                }else{
                                    //btn提交失败
                                    Tool.btnStautsError("保存角色失败","保存");
                                    //提示框-错误
                                    Tool.alertboxError(resp.msg);
                                    self.dislabedSubmit = false;
                                }
                            },
                            error: function(resp){
                                console.log(resp,'失败')
                                //btn提交失败
                                Tool.btnStautsError("保存角色失败","保存");
                                self.dislabedSubmit = false;
                            }
                        });
                    }
                }
            });
            
        }
    };
    init.default();

});