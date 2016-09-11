/*
 * 新增分类
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
                text : "售前设备" 
            },{
                class : "hover",
                href : "./device.html",
                text : "设备分类" 
            },{
                class : "",
                href : "javascript:void(0)",
                text : "新增分类" 
            }]);
        },
        //表单信息
        formInput : function(roleList){
            new Vue({
                el: ".input-form",
                //数据
                data: {
                    list : [{
                        title : "分类名称",
                        placeholder : "请输入",
                        warning : false,
                        hint : "",
                        success : false,
                        listClass : "line",
                        blur : function(val){
                            //验证是否有值
                            Check.haveValue(val,"分类名称不能为空"); 
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
                        val.warning = "";
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
                        Tool.btnStautsBusy("新增分类");
                        this.dislabedSubmit = true;
                        //保存
                        this.save();
                    },
                    //保存
                    save : function(){
                        var self = this;
                        $.ajax({
                            url : API.categorySave,
                            type : "POST",
                            data : {
                                categoryName : this.list[0].value.trim()
                            },
                            success : function(resp){
                                if(resp.code==0){
                                    //btn提交成功
                                    Tool.btnStautsSuccess("新增分类成功","保存",function(){
                                        location.href = "./device.html";
                                    });
                                    //提示框-成功 
                                    Tool.alertboxSuccess("新增分类成功");
                                }else{
                                    //btn提交失败
                                    Tool.btnStautsError("新增分类失败","保存");
                                    //提示框-错误
                                    Tool.alertboxError(resp.msg);
                                    self.dislabedSubmit = false;
                                }
                            }, 
                            error : function(resp){
                                self.dislabedSubmit = false;
                                //btn提交失败
                                Tool.btnStautsError("新增分类失败","保存");
                            }
                        });
                    }
                }
            });
        }
    };
    init.default();

});