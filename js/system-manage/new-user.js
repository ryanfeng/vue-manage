/*
 * 新增用户页面
 * */

define(['Tool','component','text!/tpl/system-manage/new-user.html'],function(Tool,component,newUser){
    var init = {
        default : function(){
            init.base();
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
                class : "hover",
                href : "./user.html",
                text : "用户管理" 
            },{
                class : "",
                href : "javascript:void(0)",
                text : "新增用户" 
            }]);
        },
        //获取角色列表
        getRoleList : function(){
            //添加正在加载中...
            Tool.createLoadding();
            $.ajax({
                url :API.roleList,
                type:"POST",
                data : {
                    page : 0,
                    limit : 1000
                },
                success : function(resp){
                    console.log(resp.data[0])
                    if(resp.code==0){
                        //表单信息
                        resp.data[0].class = "selected";
                        init.formInput(resp.data);
                    }
                },
                error: function(resp){
                    console.log(resp,'失败')
                }
            });
        },
        //获取角色id
        getRoleId : function(data){
            var $name = $(".sod_label").text();
            for(var i=0;i<data.length;i++){
                if(data[i].roleName==$name){
                    return data[i].roleId;
                }
            }
        },
        //表单信息
        formInput : function(roleList){
            $(".info-table-box").html(newUser);
            new Vue({
                el: ".input-form",
                //数据
                data: {
                    list : [
                        {
                            title : "用户姓名",
                            placeholder : "请输入",
                            success : false,
                            warning : false,
                            hint : "",
                            blur : function(val){
                                //验证是否有值
                                Check.haveValue(val,"用户名不能为空");
                            },
                            value : ""
                        },
                        {
                            title : "手机号码",
                            placeholder : "请输入",
                            success : false,
                            warning : false,
                            hint : "",
                            blur : function(val){
                                //验证联系电话
                                Check.ifPhone(val,["手机号码不能为空","请输入正确的手机号码"]);
                            },
                            value : ""
                        },
                        {
                            title : "密码设置",
                            placeholder : "请输入",
                            success : false,
                            warning : false,
                            hint : "",
                            type : "password",
                            blur : function(val){
                                //验证密码
                                Check.ifPassword(val);
                            },
                            value : ""
                        }
                    ],
                    userGroup : {
                        selectClass : "selectUserGroup",
                        title : "用户组",
                        //选中
                        selectActive : roleList[0],
                        option : roleList
                    },
                    submitClass : "btn-success btn-submit",
                    submitValue : "保存",
                    cancelClass : "btn-default",
                    cancelValue : "取消"
                },
                methods : {
                    focus : function(val){
                        val.warning = false;
                        val.hint = "";
                    },
                    //提交
                    submit : function(){
                        if(this.dislabedSubmit){
                            return;
                        }
                        //验证列表不正确
                        if(Check.list(this.list)){
                            return;
                        }
                        //btn提交等待中
                        Tool.btnStautsBusy("正在保存用户");
                        this.dislabedSubmit = true;
                        //保存角色
                        this.save();
                    },
                    //保存角色
                    save : function(){
                        var self = this;
                        $.ajax({
                            url : API.saveUser,
                            type : "POST",
                            dataType:"json",
	                        contentType: "application/json",
                            data : JSON.stringify({
                                userName : this.list[0].value.trim(),
                                loginName : this.list[1].value.trim(),
                                loginPass : hex_md5("dqc"+this.list[2].value.trim()),
                                role : { roleId : this.userGroup.selectActive.roleId },//获取角色id
                                isEnable : 1
                            }),
                            success : function(resp){
                                console.log(resp,"成功");
                                if(resp.code==0){
                                    //btn提交成功
                                    Tool.btnStautsSuccess("保存用户成功","保存",function(){
                                        location.href = "./user.html";
                                    });
                                    //提示框-成功 
                                    Tool.alertboxSuccess("保存用户成功");
                                }else{
                                    //btn提交失败
                                    Tool.btnStautsError("保存用户失败","保存");
                                    //提示框-错误
                                    Tool.alertboxError(resp.msg);
                                    self.dislabedSubmit = false;
                                }
                            }, 
                            error : function(resp){
                                //btn提交失败
                                Tool.btnStautsError("保存用户失败","保存");
                                self.dislabedSubmit = false;
                                console.log(resp,"失败");
                            }
                        });
                    },
                    //选中值
                    optionVal : function(val){
                        this.userGroup.selectActive = val;
                    }
                }
            });
        }
    };
    init.default();
});