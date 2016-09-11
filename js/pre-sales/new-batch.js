/*
 * 新增批次
 * */

define(['Tool','component','text!/tpl/pre-sales/new-batch.html'],function(Tool,component,newBatch){
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
                href : "./batch-list.html",
                text : "批次管理" 
            },{
                class : "",
                href : "javascript:void(0)",
                text : "新增批次" 
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
                            resp.data[0].class = "selected";
                            //表单信息
                            Params.deviceCategory = {
                                categoryActive : {
                                    categoryName : resp.data[0].categoryName,
                                    categoryId : resp.data[0].categoryId
                                },
                                categoryList : resp.data
                            };
                            //获取设备型号列表
                            init.getDeviceModelList();
                        }else{
                            //无结果
                            $('.info-table-box').html("");            
                            Tool.nothing({
                                question : "没有设备分类，请先去新增分类",hints:[]
                            },['.info-table-box']);
                        }
                    }else{
                        //提示框-错误
                        Tool.alertboxError(resp.msg);
                    }
                }
            });
        },
        //获取设备型号列表
        getDeviceModelList : function(success,error){
            error = error || function(){};
            $.ajax({
                url :API.modelList,
                data : {
                    categoryId : Params.deviceCategory.categoryActive.categoryId,
                    limit : 10000000
                },
                type:"POST",
                success : function(resp){
                    if(resp.code==0){
                        if(resp.data.length){
                            resp.data[0].class = "selected"; 
                            //表单信息
                            Params.deviceModel = {
                                modelActive : resp.data[0],
                                modelList : resp.data
                            };
                            if(success){
                                success(resp.data);
                            }
                        }else{
                            error();
                            //提示框-错误
                            Tool.alertboxError("该设备分类没有数据");
                        }
                        if(!success){
                            //获取生产厂商列表
                            init.getManufacturerList();
                        }
                        
                    }else{
                        error();
                        //提示框-错误
                        Tool.alertboxError(resp.msg);
                    }
                },
                error : function(){
                    error();
                    //提示框-错误
                    Tool.alertboxError(resp.msg);
                }
            });
        },
        //获取生产厂商列表
        getManufacturerList : function(){
            $.ajax({
                url :API.factoryList,
                data : {
                    isLock : 0,
                    limit : 10000000
                },
                type:"POST",
                success : function(resp){
                   console.log(resp,"成功");
                    if(resp.code==0){
                        if(resp.data.length){
                            resp.data[0].class = "selected";
                            //表单信息
                            Params.manufacturer = {
                                active : resp.data[0],
                                list : resp.data
                            };
                            init.formInput();
                        }else{
                            //无结果
                            $('.info-table-box').html("");            
                            Tool.nothing({
                                question : "没有可选择厂商，请先去新增厂商",hints:[]
                            },['.info-table-box']);
                        }
                    }else{
                        //提示框-错误
                        Tool.alertboxError(resp.msg);
                    }
                }
            });
            
        },
        //表单信息
        formInput : function(){
            $(".info-table-box").html(newBatch);
            new Vue({
                el: ".input-form",
                //数据
                data: {
                    //设备分类  
                    deviceCategory : {
                        title : "设备分类",
                        active : Params.deviceCategory.categoryActive,
                        list : Params.deviceCategory.categoryList,
                        // 选择
                        select : function(option,val,deviceModel){
                            val.active.categoryId = option.categoryId;
                            //获取设备型号列表
                            init.getDeviceModelList(function(resp){
                                deviceModel.show = true;
                                deviceModel.active = Params.deviceModel.modelActive;
                                deviceModel.list = Params.deviceModel.modelList;
                            },function(){
                                deviceModel.show = false;
                            });
                        }
                    },
                    //设备型号
                    deviceModel : {
                        show : true,
                        title : "设备型号",
                        active : Params.deviceModel.modelActive,
                        list : Params.deviceModel.modelList
                    },
                    //生产产商
                    manufacturer : {
                        title : "生产厂商",
                        active : Params.manufacturer.active,
                        list : Params.manufacturer.list
                    },
                    list : [{
                        title : "批次名称",
                        placeholder : "请输入",
                        warning : false,
                        hint : "",
                        blur : function(val){
                            //验证是否有值
                            Check.haveValue(val,"批次名称不能为空");
                        },
                        value : ""
                    },{
                        title : "生产数量",
                        placeholder : "请输入",
                        warning : false,
                        hint : "",
                        listClass : "line",
                        blur : function(val){
                            //验证正整数
                            Check.ifPositiveInteger(val,["生产数量不能为空","请输入正整数"]);
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
                    //设备分类选择
                    select : function(option,val){
                        val.active = option;
                    },
                    //提交
                    submit : function(){ 
                        if(this.dislabedSubmit){
                            return;
                        }
                        if(!this.deviceModel.show){
                            //提示框-错误
                            Tool.alertboxWarning("请选择有设备类型的设备分类");
                            return; 
                        }
                        //验证列表不正确
                        if(Check.list(this.list)){
                            return;
                        }
                        //btn提交等待中 
                        Tool.btnStautsBusy("新增批次");
                        self.dislabedSubmit = true;
                        //保存
                        this.save();
                    },
                    //保存
                    save : function(){
                        var self = this;
                        $.ajax({ 
                            url : API.batchAdd,
                            type : "POST",
                            dataType : "json",
                            contentType: "application/json",
                            data : JSON.stringify({
                                company : {
                                    companyId : 1,
                                    companyCode : '0001'
                                },
                                deviceModel : {
                                    deviceCategory : {
                                        categoryId : this.deviceModel.active.categoryId,
                                        categoryCode : this.deviceModel.active.categoryCode,
                                        categoryName : this.deviceModel.active.categoryName
                                    },
                                    modelId : this.deviceModel.active.modelId,
                                    modelCode : this.deviceModel.active.modelCode,
                                    modelName : this.deviceModel.active.modelName
                                },
                                factory : {
                                    factoryId : this.manufacturer.active.factoryId,
                                    factoryCode : this.manufacturer.active.factoryCode
                                },
                                batchName : this.list[0].value,
                                quantity : this.list[1].value
                            }),
                            success : function(resp){
                                if(resp.code==0){ 
                                    //btn提交成功
                                    Tool.btnStautsSuccess("新增批次成功","保存",function(){
                                        location.href = "./batch-list.html";
                                    });
                                    //提示框-成功 
                                    Tool.alertboxSuccess("新增批次成功");
                                }else{
                                    //btn提交失败
                                    Tool.btnStautsError("新增批次失败","保存");
                                    //提示框-错误
                                    Tool.alertboxError(resp.msg);
                                    self.dislabedSubmit = false;
                                }
                            }, 
                            error : function(resp){
                                //btn提交失败
                                Tool.btnStautsError("新增批次失败","保存");
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