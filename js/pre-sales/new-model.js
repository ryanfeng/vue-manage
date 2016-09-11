/*
 * 新增设备型号
 * */

define(['Tool','component','text!/tpl/pre-sales/new-model.html'],function(Tool,component,newModel){
    var Params = {

    };
    var init = {
        default : function(){
            init.base();
            //获取行业列表
            init.getDeviceCategoryList();
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
                text : "新增设备类型" 
            }]);
        },
        //获取设备分类列表
        getDeviceCategoryList : function(){
            //添加正在加载中...
            Tool.createLoadding();
            $.ajax({
                url :API.categoryList,
                type:"POST",
                success : function(resp){
                    if(resp.code==0){
                        if(resp.data.length){
                            //展示分类
                            resp.data[0].class = "selected";
                            //表单信息
                            init.formInput(resp.data,resp.data[0]);
                        }
                    }else{
                        //提示框-错误
                        Tool.alertboxError(resp.msg);
                    }
                }
            });
        },
        //表单信息
        formInput : function(categoryList,categoryActive){
            $(".info-table-box").html(newModel);
            new Vue({
                el: ".input-form",
                //数据
                data: {
                    //设备分类
                    deviceCategory : { 
                        title : "设备分类",
                        active : categoryActive,
                        list : categoryList
                    },
                    list : [{
                        title : "设备型号",
                        placeholder : "请输入",
                        warning : false,
                        hint : "",
                        listClass : "line",
                        blur : function(val){
                            //验证是否有值
                            Check.haveValue(val,"设备型号不能为空");
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
                    //设备分类选择
                    select : function(option,val){
                        val.active = option;
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
                        Tool.btnStautsBusy("新增设备类型");
                        this.dislabedSubmit = true;
                        //保存
                        this.save();
                    },
                    //保存
                    save : function(){
                        var self = this;
                        $.ajax({
                            url : API.modelSave,
                            type : "POST",
                            data : {
                                categoryId : this.deviceCategory.active.categoryId,
                                categoryCode : this.deviceCategory.active.categoryCode,
                                modelName : this.list[0].value.trim()
                            },
                            success : function(resp){
                                if(resp.code==0){
                                    //btn提交成功
                                    Tool.btnStautsSuccess("新增设备类型成功","保存",function(){
                                        location.href = "./device.html";
                                    });
                                    //提示框-成功 
                                    Tool.alertboxSuccess("新增设备类型成功");
                                }else{
                                    //btn提交失败
                                    Tool.btnStautsError("新增设备类型失败","保存");
                                    //提示框-错误
                                    Tool.alertboxError(resp.msg);
                                    self.dislabedSubmit = false;
                                }
                            }, 
                            error : function(resp){
                                //btn提交失败
                                Tool.btnStautsError("新增设备类型失败","保存");
                                self.dislabedSubmit = false;
                                console.log(resp,"失败");
                            }
                        });
                    }
                }
            });
        }
    };
    init.default();
});