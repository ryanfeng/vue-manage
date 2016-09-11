/*
 * 学校设备管理列表
 * */
define(['Tool','component','text!/tpl/sell-after/school-manage.html'],function(Tool,component,schoolManage){
    var urlParam = Tool.getUrlParam();
    //参数
    var Params = {
        limit : 10,
        page : urlParam.page||0,
        searchCategory : decodeURIComponent(urlParam.searchCategory||"学校名称"),
        search : decodeURIComponent(urlParam.search||""),
        isEnable : urlParam.isEnable||""
    }
    var init = {
        default : function(){ 
            init.base();
            //添加
            init.add();
            //获取学校列表
            init.getSchoolList();
        },
        base : function(){
            //位置信息
            Tool.location([{
                class : "",
                href : "javascript:void(0)",
                text : "售后管理" 
            },{
                class : "hover",
                href : "./school-device.html",
                text : "校园新风"
            },{
                class : "",
                href : "javascript:void(0)",
                text : "学校管理"
            }]);
            //搜索
            Tool.search({
                placeholder : "请输入学校名称查询",
                val : Params.search,
                select : true,  
                option : [{
                    text : "学校名称", 
                    placeholder : "请输入学校名称查询",
                    class : Params.searchCategory=="学校名称"?"selected":""
                },{
                    text : "联系人",
                    placeholder : "请输入联系人查询",
                    class : Params.searchCategory=="联系人"?"selected":""
                },{
                    text : "联系电话",
                    placeholder : "请输入联系电话查询",
                    class : Params.searchCategory=="联系电话"?"selected":""
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
                    //获取学校列表
                    init.getSchoolList();
                }
            });
        },
        //添加
        add : function(){
            new Vue({
                el: ".add",
                //数据
                data: {
                    newBtnClass : "btn-success",
                    newBtnValue : "添加学校＋"
                },
                //事件
                methods : {
                    new : function(){
                        location.href = "/html/sell-after/new-school.html";
                    }
                }
            });
        },
        //获取学校列表
        getSchoolList : function(){
            var data = {
                page : Params.page,
                limit : Params.limit
            };
            //获取搜索类型和值
            var searchParam = init.searchParam()
            $.extend(data,init.searchParam());
            //添加正在加载中...
            Tool.createLoadding();
            $.ajax({
                url :API.schoolList,
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
                    new : "添加班级",
                    lookDevice : "查看设备列表",
                    lookClass : "查看班级列表",
                    editSchool : "修改学校"
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
            $(".info-table-box").html(schoolManage);
            // 创建表格信息
            new Vue({
                el: '.info-table',
                data : {
                    page : Params.page*Params.limit,
                    titles : [ 
                        { text : "序号"},
                        { text : "学校名称"},
                        { text : "学校地址"},
                        { text : "学校联系人"},
                        { text : "联系人电话"},
                        { text : "班级数量"}, 
                        { text : "操作"},
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
                //获取学校列表
                init.getSchoolList();
            });
        },
        //查询参数
        searchParam : function(){
            if(Params.searchCategory=="学校名称"){
                return {schoolName:Params.search};
            }
            if(Params.searchCategory=="联系人"){
                return {contactName:Params.search};
            }
            if(Params.searchCategory=="联系电话"){
                return {telphone:Params.search};
            }
        }
    };
    init.default();

});