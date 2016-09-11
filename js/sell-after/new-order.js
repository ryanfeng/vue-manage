/*
 * 新增订单
 * */
define(['Tool','component','text!/tpl/sell-after/new-order.html'],function(Tool,component,newOrder){
    var Params = {

    };
    var init = {
        default : function(){
            init.base();
            //获取订单渠道列表
            init.getChannelList();
        },
        base : function(){
            //位置信息
            Tool.location([{
                class : "",
                href : "javascript:void(0)",
                text : "售后设备"
            },{
                class : "hover",
                href : "./order.html", 
                text : "订单管理"
            },{
                class : "",
                href : "javascript:void(0)",
                text : "新增订单"
            }]);
        },
        //获取订单类型列表
        getChannelList : function(dataList){
            //添加正在加载中...
            Tool.createLoadding();
            $.ajax({
                url : API.channelList,
                type : "post",
                success : function(resp){
                    if(resp.data.length){
                        //展示分类
                        resp.data[0].class = "selected";
                        //表单信息
                        init.formInput(resp.data,resp.data[0]);
                    }else{
                        //提示框-失败
                        Tool.alertboxError(resp.msg);
                    }
                } 
            });
        },
        //表单信息
        formInput : function(channelList,channelActive){
            $(".info-table-box").html(newOrder);
            new Vue({
                el: ".input-form",
                //数据
                data: {
                    //行业渠道
                    channel : {
                        title : "行业渠道",
                        active : channelActive,
                        list : channelList,
                        click : function(val,list,channel){
                            channel.active = val;
                            if(val.isECommerce==0){//非电商
                                list[1].class = "hide";
                                list[1].disabled = true;
                                list[0].blur(list[0],list,channel);
                            }else{//电商
                                list[1].class = list[2].class = "";
                                list[1].disabled = list[2].disabled = false;
                            }
                            
                            if(val.isIndustry==1){
                                list[2].class = "";
                            }else{
                                list[2].class = "hide";
                            }
                        }
                    },
                    list : [{
                        title : "联系电话",
                        placeholder : "请输入",
                        warning : false,
                        hint : "", 
                        value : "",
                        blur : function(val,list,channel){
                            if(channel.active.isECommerce==0){//非电商
                                val.API = API.photoByDealer; 
                                val.paramPhone = "phone"; 
                                //验证联系电话是否正确 在获取信息
                                Check.ifPhoneGetInfo(val,function(status,resp){
                                    if(status=="success"){//成功 
                                        list[1].class = ""; 
                                        list[1].value = resp.data.contactName;
                                        list[1].dealerId = resp.data.dealerId;
                                        list[1].blur(list[1]);
                                        if(list[2].class==""){
                                            list[2].value = resp.data.company;
                                        }else{
                                            list[2].value = "";
                                        }
                                    }else{//失败
                                        list[1].class = "hide";
                                        list[2].value = "";
                                    }
                                });
                            }else{//电商
                                //验证是否有值
                                Check.ifPhone(val);
                            }
                        },
                        //联系人
                        user : {
                            id : "",
                            value : ""
                        },
                    },{
                        title : "订单用户",
                        placeholder : "请输入",
                        warning : false,
                        hint : "",
                        value : "",
                        disabled : channelActive.isECommerce==0?true:false,
                        class : channelActive.isECommerce==0?"hide":"",
                        blur : function(val){
                            //验证是否有值 
                            Check.haveValue(val,"订单用户不能为空");
                        }, 
                    },{
                        title : "经销商（公司）",
                        placeholder : "请输入",
                        warning : false,
                        hint : "",
                        value : "",
                        disabled : true,
                        success : channelActive.isIndustry==0?true:false,
                        class : channelActive.isIndustry==0?"hide":"",
                        blur : function(val){ 
                            //验证是否有值 
                            Check.haveValue(val,"经销商（公司）不能为空");
                        },
                    },{
                        title : "物流公司",
                        placeholder : "请输入",
                        warning : false,
                        hint : "",
                        value : "",
                        blur : function(val){
                            //验证是否有值 
                            Check.haveValue(val,"物流公司不能为空");
                        },
                    },{
                        title : "物流编号",
                        placeholder : "请输入",
                        warning : false,
                        hint : "",
                        value : "",
                        blur : function(val){
                            //验证是否有值 
                            Check.haveValue(val,"物流编号不能为空");
                        },
                    },{
                        title : "订单编号",
                        placeholder : "请输入", 
                        warning : false,
                        hint : "",
                        value : "",
                        blur : function(val){
                            //验证是否有值 
                            Check.haveValue(val,"订单编号不能为空");
                        },
                    },{
                        title : "订单金额",
                        placeholder : "请输入",
                        warning : false,
                        hint : "",
                        value : "",
                        blur : function(val){
                            //验证正数
                            Check.ifPositive(val,["订单金额不能为空"]);
                        },
                    }],
                    sn : {
                        title : "SN编码",
                        btnValue : "上传EXCEL表格",
                        cancelClass : "btn-default",
                        cancelValue : "取消",
                        status : "select",
                        name : "",
                        downloadValue : "下载订单上传模版",
                        //选择表格
                        select : function(sn){
                            var fileObj = document.getElementById("excel").files[0]; // 获取文件对象
                            var last = fileObj.name.split(".")[fileObj.name.split(".").length-1];
                            if(last == "xls" || last == "xlsx"){
                                sn.status = "selected";
                                sn.name = fileObj.name;
                            }else{ 
                                sn.status = "select";
                                //提示框-失败
                                Tool.alertboxWarning("请上传后缀为'.xls'或'xlsx'的文件");
                            }
                        },
                        //下载订单上传模版
                        download : function(){
                            window.open(API.orderTemplateDownload); 
                        },
                        //取消
                        cancel : function(sn){
                            $("#excel").val("");
                            sn.status = "select";
                        }
                    },
                    submitClass : "btn-success btn-submit",
                    submitValue : "保存",
                    cancelClass : "btn-default",
                    cancelValue : "取消"
                },
                methods : {
                    //获取焦点
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
                        if(Check.list(this.list,this.channel)){
                            return;
                        } 
                        //btn提交等待中
                        Tool.btnStautsBusy("正在新增订单");
                        this.dislabedSubmit = true;
                        //新增订单
                        this.newOrder();
                    }, 
                    //新增订单
                    newOrder : function(){
                        var self = this;
                        self.sn.cancelClass = "hide";

                        var fileObj = document.getElementById("excel").files[0]; // 获取文件对象
                        // FormData 对象
                        var form = new FormData();
                        // form.append("excel", "hooyes");                        // 可以增加表单数据
                        form.append("channelId", this.channel.active.channelId);
                        form.append("dealerId",this.channel.active.isECommerce==0?this.list[1].dealerId:0);
                        form.append("receiverPhone", this.list[0].value);
                        form.append("receiverName",this.list[1].value);
                        this.channel.active.isIndustry==1&&form.append("receiveCompany",this.list[2].value);
                        form.append("logisticsName", this.list[3].value); 
                        form.append("logisticsSn", this.list[4].value);
                        form.append("orderSn", this.list[5].value);
                        form.append("amount", this.list[6].value); 
                        form.append("excel", fileObj);                           // 文件对象
                        // XMLHttpRequest 对象
                        var xhr = new XMLHttpRequest(); 
                        xhr.open("post", API.newOrder, true);
                        xhr.upload.addEventListener("progress", progressFunction, false);
                        xhr.onload = function () {
                            var resp = JSON.parse(xhr.responseText);
                            if(resp.code==0){
                                //btn提交成功
                                Tool.btnStautsSuccess("新增订单成功","保存",function(){
                                    location.href = "./order.html";
                                });
                                Tool.alertboxSuccess("上传完成");
                            }else{
                                self.sn.cancelClass = "btn-default";
                                $(".progressBar").text("");
                                //btn提交失败 
                                Tool.btnStautsError("新增订单失败","保存");
                                //提示框-失败
                                Tool.alertboxError(resp.msg);
                                self.dislabedSubmit = false;
                            }
                        };

                        xhr.send(form);
                        //上传进度
                        function progressFunction(evt) {
                            var progressBar = document.getElementById("progressBar");
                            if (evt.lengthComputable) {
                                var val = (evt.loaded / evt.total)*100;
                                val = val.toFixed(2);
                                $(".progressBar").text("上传进度："+val+"%");
                            }

                        }
                    }
                }
            });
        }
    };
    init.default();
}); 