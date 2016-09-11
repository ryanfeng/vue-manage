/*
 * 学校设备列表
 * */
define(['Tool','component','text!/tpl/sell-after/school-device.html'],function(Tool,component,schoolDevice){
    var urlParam = Tool.getUrlParam();
    //参数
    var Params = {
        limit : 10,
        page : urlParam.page||0,
        searchCategory : decodeURIComponent(urlParam.searchCategory||"设备sn"),
        search : decodeURIComponent(urlParam.search||""),
        oper : urlParam.oper||"",
        remainLifeSort : urlParam.remainLifeSort||"",
        isEnable : urlParam.isEnable||""
    }
    var init = {
        default : function(){
            init.base();
            //添加
            init.add();
            //获取学校设备列表
            init.getSchoolDeviceList();
        },
        base : function(){
            //位置信息
            Tool.location([{
                class : "",
                href : "javascript:void(0)", 
                text : "售后管理" 
            },{
                class : "",
                href : "javascript:void(0)",
                text : "校园新风"
            }]);
            //搜索
            Tool.search({
                val : Params.search,
                select : true, 
                option : [{
                    text : "设备sn", 
                    placeholder : "请输入设备sn查询",
                    class : Params.searchCategory=="设备sn"?"selected":""
                },{
                    text : "滤网sn",
                    placeholder : "请输入滤网sn查询",
                    class : Params.searchCategory=="滤网sn"?"selected":""
                },{
                    text : "学校名称",
                    placeholder : "请输入学校名称查询",
                    class : Params.searchCategory=="学校名称"?"selected":""
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
                    //获取学校设备列表
                    init.getSchoolDeviceList();
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
                        newBtnClass : "btn-success "+(localStorage.permissions.indexOf(",school:mgr,")>-1?"":"hidden"),
                        newBtnValue : "学校管理＋", 
                        click : function(){
                            location.href = "./school-manage.html";
                        }
                    },{
                        newBtnClass : "btn-success "+(localStorage.permissions.indexOf(",fee:set,")>-1?"":"hidden"),
                        newBtnValue : "服务费设置",
                        click : function(){
                            location.href = "./server-set.html";
                        }
                    }] 
                }
            });
        },
        //获取学校设备列表
        getSchoolDeviceList : function(){
            var data = {
                page : Params.page,
                remainLifeSort : Params.remainLifeSort||0,
                limit : Params.limit
            };
            //获取搜索类型和值
            var searchParam = init.searchParam()
            $.extend(data,init.searchParam());
            //添加正在加载中...
            Tool.createLoadding();
            $.ajax({
                url :API.schoolDeviceList,
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
                    statusTrue : "UV关闭",
                    statusShow : localStorage.permissions.indexOf(",statistics:school:uv,")>-1?true:false,
                    statusFalse : "UV开启",
                    look : "查看详情"
                };
            }
            //表格信息
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
            $(".info-table-box").html(schoolDevice);
            // 创建表格信息
            new Vue({
                el: '.info-table',
                data : {
                    page : Params.page*Params.limit,
                    titles : [
                        { text : "序号"},
                        { text : "学校地址"},
                        { text : "学校名称"},
                        { text : "班级"},
                        { text : "安装时间"},
                        { text : "设备SN编码"}, 
                        { text : "滤网SN编码"},
                        {  
                            select:true, 
                            active : (Params.remainLifeSort=="0"&&"倒序")||(Params.remainLifeSort=="1"&&"正序")||"滤网寿命",
                            options : [{
                                text : "滤网寿命",
                                class : (Params.remainLifeSort=="")&&"selected", 
                            },{
                                text : "正序",
                                class : (Params.remainLifeSort=="1")&&"selected",
                                remainLifeSort : "1"
                            },{
                                text : "倒序",
                                class : (Params.remainLifeSort=="0")&&"selected",
                                remainLifeSort : "0"
                            }],
                            click : function(val){
                                Params.remainLifeSort = val.remainLifeSort;
                                //改变链接值 
                                Tool.changeUrlVal([
                                    {name:"page",val:""},
                                    {name:"remainLifeSort",val:val.remainLifeSort}
                                ]);
                                //获取学校设备列表
                                init.getSchoolDeviceList();
                            }
                        },
                        { text : "状态"},
                        { text : "设备运行地址"},
                        { text : "行业经销商"},
                        { text : "全部UV状态"},
                        { text : "操作"}
                    ],
                    dataList : dataList
                },
                methods : {
                    //状态改变
                    statueChange : function(tool){
                        $.ajax({
                            url : API.deviceUvRun,
                            type : "POST",
                            data : {
                                deviceId : tool.deviceId,
                                oper : tool.uvRun=="1"?10:9
                            },
                            success : function(resp){
                                if(resp.code==0){
                                    tool.uvRun=="1"?tool.uvRun=0:tool.uvRun=1;
                                    Tool.alertboxSuccess(resp.msg);
                                }else{
                                    //提示框-错误
                                    Tool.alertboxError(resp.msg);
                                }
                            }
                        });

                    },
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
                //获取学校设备列表
                init.getSchoolDeviceList();
            });
        },
        //查询参数
        searchParam : function(){
            if(Params.searchCategory=="设备sn"){
                return {deviceSn:Params.search};
            }
            if(Params.searchCategory=="滤网sn"){
                return {strainerSn:Params.search};
            }
            if(Params.searchCategory=="学校名称"){
                return {schoolName:Params.search};
            }
        }
    };
    init.default();

});