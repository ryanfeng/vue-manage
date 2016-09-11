/*
* 修改密码页面
* */
define(['Tool','component','text!/tpl/user/editPassword.html', 'ajaxAPI'],function(Tool,component,editPassword, API){
    var init = {
        default : function(){
            init.base();
        },   
        base : function() {
            //添加正在加载中...
            Tool.createLoadding();
            //获取用户信息
            if(publicParams.userInfo){
                //表单信息 
                init.formInput(publicParams.userInfo);
            }else{ 
                publicParams.getUserInfoBack = function(resp) {
                    //表单信息
                    init.formInput(resp);
                } 
            } 
            //位置信息
            Tool.location([{
                class : "",
                href : "javascript:void(0)",
                text : "修改密码" 
            }]);
        },
        //表单信息
        formInput : function(resp){
            $(".info-table-box").html(editPassword);
            new Vue({
                el: ".input-form", 
                //数据
                data: { 
                    caption : "修改"+resp.loginName+"账号的密码",
                    captionClass : "pb20",
                    list : [
                        {
                            title : "当前密码",
                            value : "",
                            hint : "",
                            placeholder : "请输入",
                            warning : false, 
                            success : false,
                            blur : function(val){
                                //验证密码
                                Check.ifPassword(val);
                            }
                        },
                        {
                            title : "新密码", 
                            value : "",
                            placeholder : "请输入",
                            class : "",
                            point : "强烈建议密码同时包含字母、数字和标点符号。",
                            hint : "",
                            warning : false,
                            blur : function(val){
                                //验证新密码
                                Check.ifPassword(val,['新密码不能为空','请输入6-16位不含特殊符号的密码']);
                            }
                        }, 
                        { 
                            title : "确认新密码",
                            value : "",
                            hint : "",
                            class : "",
                            placeholder : "请输入", 
                            listClass : "line",
                            warning : false,
                            blur : function(val,list){
                                //确认验证新密码
                                Check.reIfPassword(val,list);
                            }
                        }
                    ],
                    submitClass : "btn-success btn-submit",
                    submitValue : "确认修改密码",
                    cancelClass : "btn-default",
                    cancelValue : "取消" 
                },
                methods : { 
                    focus : function(val){
                        val.warning = false;
                        val.hint = "";
                    },
                    submit : function() {
                        //是否禁止点击
                        if(this.dislabedSubmit){
                            return;
                        }
                        //验证列表是否未填完整 
                        if(Check.list(this.list)){
                            return;
                        }
                        this.dislabedSubmit = true;
                        //btn提交等待中
                        Tool.btnStautsBusy("正在修改密码");
                        //修改密码
                        this.changePassword();
                    },
                    //修改密码
                    changePassword : function(){
                        var self = this;
                        $.ajax({
                            url : API.changePwd,
                            type : "post",
                            data : {
                                userId : publicParams.userInfo.id,
                                oldPassword : hex_md5("dqc"+this.list[0].value),
                                newPassword : hex_md5("dqc"+this.list[1].value),
                                confirmPassword : hex_md5("dqc"+this.list[2].value)
                            }, 
                            success : function(resp){
                                console.log(resp,"成功");
                                if(resp.code==0){
                                    //btn提交成功
                                    Tool.btnStautsSuccess("修改密码成功","确认修改密码",function(){
                                        localStorage.password = "";
                                        history.go(-1);
                                    });
                                    //提示框-成功 
                                    Tool.alertboxSuccess("修改密码成功");
                                }else{
                                    //btn提交失败
                                    Tool.btnStautsError("修改密码失败","确认修改密码");
                                    //提示框-错误
                                    Tool.alertboxError(resp.msg);
                                    self.dislabedSubmit = false;
                                }
                            },
                            error : function(resp){
                                //btn提交失败
                                Tool.btnStautsError("修改密码失败","确认修改密码");
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