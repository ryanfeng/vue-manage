/*
 * 行业经销商列表页面
 * */
define(['Tool','component','text!/tpl/system-dealer/trade.html'],function(Tool,component,trade){
    var urlParam = Tool.getUrlParam();
    //参数
    var Params = {
        limit : 10,
        page : urlParam.page||0,
        searchCategory : decodeURIComponent(urlParam.searchCategory||"联系人"),
        search : decodeURIComponent(urlParam.search||""),
        isEnable : urlParam.isEnable||""
    }
    var init = {
        default : function(){
            init.base(); 
            //添加
            init.add();
            //获取行业经销商列表
            init.getTradeList();
        },
        base : function(){
            //位置信息
            Tool.location([{ 
                class : "",
                href : "javascript:void(0)", 
                text : "经销商管理" 
            },{
                class : "",
                href : "javascript:void(0)",
                text : "行业经销商" 
            }]);
            //搜索
            Tool.search({
                placeholder : "请输入联系人查询",
                val : Params.search,
                select : true, 
                option : [{
                    text : "联系人",
                    placeholder : "请输入联系人查询",
                    class : Params.searchCategory=="联系人"?"selected":""
                },{
                    text : "手机号码",
                    placeholder : "请输入手机号码查询",
                    class : Params.searchCategory=="手机号码"?"selected":""
                }],
                optionDefault : Params.searchCategory
            },{
                //提交搜索
                submitSearch : function(val,info){
                    Params.search=val;
                    Params.page=0;
                    Params.searchCategory=info.optionDefault;
                    //改变链接值
                    Tool.changeUrlVal([
                        {name:"search",val:val},
                        {name:"page",val:""},
                        {name:"searchCategory",val:info.optionDefault}
                    ]);
                    //获取行业经销商列表
                    init.getTradeList();
                }
            });
        },
        //添加
        add : function(){
            new Vue({
                el: ".add",
                //数据
                data: {
                    btns : [{
                        newBtnClass : "btn-success "+(localStorage.permissions.indexOf(",industry:add,")>-1?"":"hidden"),
                        newBtnValue : "创建行业＋", 
                        click : function(){
                            location.href = "./new-trade-name.html";
                        }
                    },{
                        newBtnClass : "btn-success "+(localStorage.permissions.indexOf(",dealer:industry:add,")>-1?"":"hidden"),
                        newBtnValue : "创建经销商＋", 
                        click : function(){
                            location.href = "./new-trade.html";
                        }
                    }]
                    
                }
            });
        },
        //获取行业经销商列表
        getTradeList : function(){
            var data = {
                page : Params.page,
                isEnable : Params.isEnable,
                limit : Params.limit
            };
            //获取搜索类型和值
            var searchParam = init.searchParam()
            $.extend(data,init.searchParam());
            //添加正在加载中...
            Tool.createLoadding();
            $.ajax({
                url :API.industryList,
                type:"POST",
                data : data,
                success : function(resp){
                    if(resp.code==0){
                        if(resp.data&&resp.data.length){
                            //信息整理
                            init.infoNeaten(resp.data);
                            //页码
                            init.page(resp.info);
                        }else{
                            
                            if(Params.search){
                                //没有结果
                                init.nothingInfo(Params.search);
                            }else{
                                //表格信息
                                init.infoTable([]); 
                            }
                        }
                    }else{
                        //没有结果
                        init.nothingInfo(resp.msg,"question");
                    }
                }
            });
        },
        //信息整理
        infoNeaten : function(resp){
            for(var i=0;i<resp.length;i++){
                resp[i].tools = {
                    edit : "修改",
                    editShow : localStorage.permissions.indexOf(",dealer:industry:update,")>-1?true:false,
                    statusChange : localStorage.permissions.indexOf(",dealer:industry:lock,")>-1?true:false,
                    statusTrue : "锁定",
                    statusFalse : "解锁",
                    look : "查看设备",
                    del : "删除",
                    delShow : localStorage.permissions.indexOf(",dealer:industry:del,")>-1?true:false
                };
            }
            //获取行业经销商列表
            init.infoTable(resp);
        },
        //没有结果
        nothingInfo : function(searchVal,status){
            $(".info-table-box").html('');
            //无结果
            Tool.nothing({
                searchVal:!status&&(searchVal||""),
                question : status=="question"?searchVal:""
            });
        },
        //表格信息
        infoTable : function(dataList){
            $(".info-table-box").html(trade);
            // 创建表格信息
            new Vue({
                el: '.info-table',
                data : {
                    page : Params.page*Params.limit,
                    titles : [
                        { text : "序号"},
                        { text : "行业渠道"},
                        { text : "入驻时间"},
                        { text : "公司名称"},
                        { text : "联系人"},
                        { text : "手机号码"}, 
                        { text : "联系地址"},
                        {
                            select:true, 
                            active : (Params.isEnable=="0"&&"锁定")||(Params.isEnable=="1"&&"未锁定")||"状态",
                            options : [
                                { text : "状态",class : (Params.isEnable=="")&&"selected"},
                                { text : "锁定",isEnable:"0",class:(Params.isEnable=="0")&&"selected"},
                                { text : "未锁定",isEnable:"1",class:(Params.isEnable=="1")&&"selected"}
                            ],
                            click : function(isEnable,list){
                                Params.isEnable = isEnable;
                                //改变链接值 
                                Tool.changeUrlVal([
                                    {name:"page",val:""},
                                    {name:"isEnable",val:isEnable}
                                ]);
                                //获取行业经销商列表
                                init.getTradeList();
                            }
                        },
                        { text : "操作"}
                    ],
                    dataList : dataList
                },
                methods : {
                    //状态改变
                    statueChange : function(tool){
                        $.ajax({
                            url : API.lockUser,
                            type : "POST",
                            data : {
                                userId : tool.webUserView.id,
                                isEnable : tool.webUserView.isEnable?0:1
                            },
                            success : function(resp){
                                if(resp.code=="0"){
                                    tool.webUserView.isEnable?tool.webUserView.isEnable=0:tool.webUserView.isEnable=1;
                                }else{
                                    //提示框-错误
                                    Tool.alertboxError(resp.msg);
                                }
                            }
                        });

                    },
                    //删除用户
                    dealerDel : function(val){
                        var self = this;
                        $.ajax({
                            url :API.dealerDel,
                            type:"post",
                            data : {
                                dealerId : val.dealerId
                            },
                            success : function(resp){
                                if(resp.code==0){
                                    //btn提交成功
                                    Tool.btnStautsSuccess("删除零售经销商成功","删除",function(){
                                        location.href = "./trade.html";
                                    });
                                    //提示框-成功
                                    Tool.alertboxSuccess("删除零售经销商成功");
                                }else{
                                    //btn提交失败
                                    Tool.btnStautsError("删除零售经销商失败","删除");
                                    //提示框-错误
                                    Tool.alertboxError(resp.msg);
                                    self.dislabedSubmit = false;
                                }
                            },
                            error: function(resp){
                                //btn提交失败
                                Tool.btnStautsError("删除零售经销商失败","删除");
                                self.dislabedSubmit = false;
                            }
                        });
                    }
                }
            });
        },
        //页码
        page : function(info){
            if(!info||info.totalPage<=1){
                return;
            }
            //页码
            Tool.page(info,function(num){
                Params.page=num;
                //改变链接值
                Tool.changeUrlVal([{name:"page",val:num}]); 
                //获取行业经销商列表
                init.getTradeList();
            });
        },
        //查询参数
        searchParam : function(){
            if(Params.searchCategory=="联系人"){
                return {contactName:Params.search};
            }
            if(Params.searchCategory=="手机号码"){
                return {contactPhone:Params.search};
            }
        }
    };
    init.default();
});