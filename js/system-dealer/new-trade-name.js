/*
 * 新增行业
 * */

define(['Tool','component'],function(Tool,component){
    var Params = {

    };
    var init = {
        default : function(){
            init.base();
            //表单信息
            init.formInput();
        },
        base : function(){
            //位置信息
            Tool.location([{
                class : "",
                href : "javascript:void(0)",
                text : "经销商管理" 
            },{
                class : "hover",
                href : "./trade.html",
                text : "行业经销商" 
            },{
                class : "",
                href : "javascript:void(0)",
                text : "创建行业" 
            }]);
        },
        //表单信息
        formInput : function(roleList){
            new Vue({
                el: ".input-form",
                //数据
                data: {
                    list : [{ 
                        title : "所属行业",
                        placeholder : "请输入",
                        warning : false,
                        hint : "",
                        listClass : "line",
                        success : false,
                        check : function(val){
                            //验证是否有值
                            Check.haveValue(val,"联系人不行业名称不能为空能为空");
                        },
                        value : "" 
                    }],
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
                        this.dislabedSubmit = true;
                        //btn提交等待中
                        Tool.btnStautsBusy("创建行业");
                        //保存
                        this.save();    
                    },
                    //保存
                    save : function(){
                        var self = this;
                        $.ajax({
                            url : API.industrySave,
                            type : "post",
                            data : {
                                industryName : this.list[0].value
                            }, 
                            success : function(resp){
                                if(resp.code==0){
                                    //btn提交成功
                                    Tool.btnStautsSuccess("创建行业成功","保存",function(){
                                        location.href = "./trade.html";
                                    });
                                    //提示框-成功 
                                    Tool.alertboxSuccess("创建行业成功");
                                }else{
                                    //btn提交失败
                                    Tool.btnStautsError("创建行业失败","保存");
                                    //提示框-错误
                                    Tool.alertboxError(resp.msg);
                                    self.dislabedSubmit = false;
                                }
                            },
                            error : function(resp){
                                self.dislabedSubmit = false;
                                //btn提交失败
                                Tool.btnStautsError("创建行业失败","保存");
                            }
                        });
                    }
                }
            });
        }
    };
    init.default();

});