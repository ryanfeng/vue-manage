/*
 * 编辑设备型号
 * */
define(['Tool','component','text!/tpl/pre-sales/new-model.html'],function(Tool,component,editModel){
    var urlParam = Tool.getUrlParam();
    var Params = {
        modelName : decodeURIComponent(urlParam.modelName)
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
                text : "修改设备类型"
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
                   console.log(resp,"成功");
                    if(resp.code==0){
                        if(resp.data.length){
                            //展示分类
                            // init.category(resp.data);
                            for(var i=0;i<resp.data.length;i++){
                                if(urlParam.categoryId==resp.data[i].categoryId){
                                    resp.data[i].class = "selected";
                                    //表单信息
                                    init.formInput(resp.data,resp.data[i]);
                                    return;
                                }
                            }
                        }else{
                            //展示报错信息
                            Tool.alertbox({
                                autoHide : true,
                                data : { 
                                    clickBGclose : true,
                                    statusShow : "error",
                                    hint : resp.msg
                                }, 
                            });
                        }
                    }else{
                        //展示报错信息
                        Tool.alertbox({
                            autoHide : true,
                            data : { 
                                clickBGclose : true,
                                statusShow : "error",
                                hint : resp.msg
                            }, 
                        });
                    }
                },
                error: function(resp){
                    console.log(resp,'失败')
                }
            });
        },
        //表单信息
        formInput : function(categoryList,categoryActive){
            $(".info-table-box").html(editModel);
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
                            if(val.value){
                                val.warning = false;
                                val.hint = "";
                                val.success = true;
                            }else{
                                val.warning = true;
                                val.hint = "设备型号不能为空";
                                val.success = false;
                            }  
                        },
                        success : true,
                        value : Params.modelName
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
                        console.log(option);
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
                        Tool.btnStautsBusy("修改设备类型");
                        this.dislabedSubmit = true;
                        //保存
                        this.save();
                    },
                    //取消
                    save : function(){ 
                        var self = this;
                        $.ajax({
                            url : API.modelSave,
                            type : "POST",
                            data : {
                                modelId : urlParam.modelId,
                                modelCode : urlParam.modelCode,
                                categoryId : this.deviceCategory.active.categoryId,
                                categoryCode : this.deviceCategory.active.categoryName,
                                modelName : this.list[0].value.trim()
                            },
                            success : function(resp){
                                if(resp.code==0){
                                    //btn提交成功
                                    Tool.btnStautsSuccess("修改设备类型成功","保存",function(){
                                        location.href = "./device.html";
                                    });
                                    //提示框-成功
                                    Tool.alertboxSuccess("修改设备类型成功");
                                }else{
                                    //btn提交失败
                                    Tool.btnStautsError("修改设备类型失败","保存");
                                    //提示框-错误
                                    Tool.alertboxError(resp.msg);
                                    self.dislabedSubmit = false;
                                }
                            },
                            error : function(resp){
                                //btn提交失败
                                Tool.btnStautsError("修改设备类型失败","保存");
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