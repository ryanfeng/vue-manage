/*
* 设备用户页面
* */
define(['Tool','component','text!/tpl/user/device-user.html', 'ajaxAPI'],function(Tool,component,deviceUser, API){
    var urlParam = Tool.getUrlParam();
    //参数
    var Params = {
        limit : 10,
        remainLifeSort : urlParam.remainLifeSort||"",
        appUserPhone : decodeURIComponent(urlParam.appUserPhone||""),
        page : urlParam.page||0
    }
    var init = {
        default : function(){
            init.base();
            //获取用户列表
            init.getUserList();
        },
        base : function(){
            //位置信息
            Tool.location([{
                class : "",
                href : "javascript:void(0)",
                text : "设备用户" 
            }]);
            //搜索
            Tool.search({
                val : Params.appUserPhone,
                placeholder:"请输入设备用户查询"
            },{
                //提交搜索
                submitSearch : function(val){
                    Params.appUserPhone=val;
                    Params.page=0;
                    //改变链接值
                    Tool.changeUrlVal([
                        {name:"appUserPhone",val:val},
                        {name:"page",val:""}
                    ]);
                    //获取用户列表
                    init.getUserList();
                }
            });
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
        //获取用户列表
        getUserList : function(){
            var data = {
                page : Params.page,
                limit : Params.limit,
                remainLifeSort : Params.remainLifeSort||0,
                appUserPhone : Params.appUserPhone
            };
            //添加正在加载中...
            Tool.createLoadding();
            $.ajax({
                url :API.deviceListUsers,
                type:"POST",
                data : data,
                success : function(resp){
                    if(resp.code==0){
                        if(resp.data.length){ 
                            //信息整理
                            init.infoNeaten(resp.data);
                            //页码
                            init.page(resp.info);
                            return;
                        }
                        if(Params.appUserPhone){
                            //没有搜索结果
                            init.nothingInfo(Params.appUserPhone);
                        }else{
                            //表格信息
                            init.infoTable([]);
                        }
                        return;
                    }
                    //提示框-错误
                    Tool.alertboxError(resp.msg);
                    //没有结果
                    init.nothingInfo("没有数据","question");
                }
            });
        },
        //信息整理
        infoNeaten : function(resp){
            for(var i=0;i<resp.length;i++){
                resp[i].tools = {
                    detail : "查看详情"
                };
            }
            //表格信息
            init.infoTable(resp);
        },
        //表格信息
        infoTable : function(dataList){
            $(".info-table-box").html(deviceUser);
            // 创建表格信息
            new Vue({
                el: '.info-table',
                data : {
                    page : Params.page*Params.limit,
                    titles : [
                        { text : "序号"},
                        { text : "设备用户"},
                        { text : "注册时间"},
                        { text : "APP类型"},
                        { text : "配置设备"},
                        { text : "配置滤网"},
                        {  
                            select:true,  
                            active : (Params.remainLifeSort=="0"&&"倒序")||(Params.remainLifeSort=="1"&&"正序")||"滤网寿命",
                            options : [{
                                channelName : "滤网寿命",
                                class : (Params.remainLifeSort=="")&&"selected", 
                            },{
                                channelName : "正序",
                                class : (Params.remainLifeSort=="1")&&"selected",
                                remainLifeSort : "1"
                            },{
                                channelName : "倒序",
                                class : (Params.remainLifeSort=="0")&&"selected",
                                remainLifeSort : "0"
                            }],
                            click : function(val){
                                console.log(val,"123"); 
                                Params.remainLifeSort = val.remainLifeSort;
                                //改变链接值 
                                Tool.changeUrlVal([
                                    {name:"page",val:""},
                                    {name:"remainLifeSort",val:val.remainLifeSort}
                                ]);
                                //获取用户列表
                                init.getUserList();
                            }
                        },
                        { text : "运行地址"},
                        { text : "操作", styleObject : {
                            "width" : "150px"
                        }}
                    ], 
                    dataList : dataList
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
                //获取用户列表
                init.getUserList();
            });
        }
    };
    init.default();

});