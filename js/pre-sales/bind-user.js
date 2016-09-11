/*
 * 绑定工厂用户
 * */
define(['Tool','component'],function(Tool,component){
    var urlParam = Tool.getUrlParam();
    var Params = {
        factoryName : decodeURIComponent(urlParam.factoryName)
    };
    var init = {
        default : function(){
            init.base();
            //表单信息
            // init.formInput();
            init.getAccountList1();
        },
        base : function(){
            //位置信息
            Tool.location([{
                class : "",
                href : "javascript:void(0)",
                text : "售前设备"
            },{
                class : "hover",
                href : "./manufacturer.html",
                text : "生产厂商"
            },{
                class : "hover",
                href : "./user-list.html?factoryId="+urlParam.factoryId,
                text : "绑定用户"
            },{
                class : "",
                href : "javascript:void(0)",
                text : "新增绑定用户"
            }]);
        },
        //获取登录账号列表
        getAccountList1 : function(){
            $.ajax({
                url :API.factoryUser,
                type:"POST",
                data : {
                    page : 0,
                    limit : 1000
                },
                success : function(resp){
                    if(resp.code==0){
                        if(resp.data[0]){
                            resp.data[0].class = "selected";
                        }
                        init.formInput(resp.data);
                    }
                },
                error: function(resp){
                    console.log(resp,'失败')
                }
            });
        },
        //表单信息
        formInput : function(factoryList){
            new Vue({
                el: ".input-form",
                //数据
                data: {
                    title : "生产厂商",
                    titleName : Params.factoryName,
                    list : [{
                        title : "登录账号",
                        placeholder : "请选择",
                        warning : false,
                        hint : "",
                        listClass : "line",
                        blur : function(val){
                            //验证是否有值
                            Check.haveValue(val,"登录账号不能为空");
                        },
                        value : ""
                    }],
                    userGroup : {
                        selectClass : "selectUserGroup",
                        //选中
                        selectActive : factoryList[0],
                        option : factoryList
                    },
                    submitClass : "btn-success btn-submit",
                    submitValue : "保存",
                    cancelClass : "btn-default",
                    cancelValue : "取消",
                    cancelLink : "./user-list.html?factoryId="+urlParam.factoryId+"&factoryName="+urlParam.factoryName
                },
                methods : {
                    focus : function(val){
                        val.warning = false;
                        val.hint = "";
                    },
                    //设备分类选择
                    select : function(option,val){
                        val.active = option;
                    },
                    //提交
                    submit : function(){
                        var self = this;
                        if(self.dislabedSubmit){
                            return;
                        }
                        Tool.btnStautsBusy("绑定用户");
                        self.dislabedSubmit = true;
                        //保存
                        this.save();
                    },
                    //保存
                    save : function(){
                        var self = this;
                        var loginName
                        var factoryId
                        var innerVal = $('.sod_label').text()
                        if(self.userGroup.selectActive){
                            loginName = self.userGroup.selectActive.loginName
                        }else {
                            loginName = ""
                        }
                        if(innerVal == "请选择"){
                            Tool.btnStautsError("绑定用户失败","保存");
                            Tool.alertboxError("请选择用户！");
                            self.dislabedSubmit = false;
                            return
                        }
                        $.ajax({
                            url : API.factoryBindUser,
                            type : "POST",
                            data : {
                                factoryId : urlParam.factoryId,
                                loginName : loginName
                            },
                            success : function(resp){
                                console.log(innerVal)
                                console.log(resp)
                                if(resp.code==0){
                                    //btn提交成功
                                    Tool.btnStautsSuccess("绑定用户成功","保存",function(){
                                        location.href = "./user-list.html?factoryId="+urlParam.factoryId+"&factoryName="+urlParam.factoryName;
                                    });
                                    //提示框-成功
                                    Tool.alertboxSuccess("绑定用户成功");
                                }else{
                                    if(loginName == ""){
                                        Tool.btnStautsError("绑定用户失败","保存");
                                        Tool.alertboxError("工厂用户为空，请先添加工厂用户！");
                                        self.dislabedSubmit = false;
                                    }else{
                                        //btn提交失败
                                        Tool.btnStautsError("绑定用户失败","保存");
                                        //提示框-错误
                                        // Tool.alertboxError(resp.msg);
                                        self.dislabedSubmit = false;
                                    }
                                }
                            },
                            error : function(resp){
                                //btn提交失败
                                Tool.btnStautsError("绑定用户失败","保存");
                                self.dislabedSubmit = false;
                            }
                        });
                    },
                    //选中值
                    optionVal : function(val){
                        console.log(val)
                        this.userGroup.selectActive = val;
                    }
                }
            });
        }
    };
    init.default();
});