/*
 * 厂商用户列表
 * */
define(['Tool','component','text!/tpl/pre-sales/user-list.html'],function(Tool,component,userList){
    var urlParam = Tool.getUrlParam(); 
    var init = {
        default : function(){
            init.base();
            //添加 
            init.add();
            //获取工厂用户列表
            init.getFactoryBindersList();
        },
        base : function(){
            //位置信息
            Tool.location([{
                class : "",
                href : "javascript:void(0)",
                text : "售前设备" 
            },{
                class : "hover",
                href : "./manufacturer.html",
                text : "生产厂商" 
            },{ 
                class : "",
                href : "javascript:void(0)",
                text : "绑定用户" 
            }]);
        }, 
        //添加 
        add : function(){
            new Vue({
                el: ".add",
                //数据 
                data: { 
                    newBtnClass : "btn-success",
                    newBtnValue : "新增绑定用户＋",  
                    click : function(){
                        location.href = "./bind-user.html?factoryId="+urlParam.factoryId+"&factoryName="+urlParam.factoryName;
                    }
                }
            });
        },
        //获取工厂用户列表
        getFactoryBindersList : function(){
            var data = {
                factoryId : urlParam.factoryId
            };
            //添加正在加载中...
            Tool.createLoadding();
            $.ajax({
                url :API.factoryBindersList,
                type:"POST",
                data : data,
                success : function(resp){
                    if(resp.code==0){
                        if(resp.data&&resp.data.length){
                            //信息整理
                            init.infoNeaten(resp.data);
                        }else{
                            //表格信息
                            init.infoTable([]);
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
                    unBind : "解绑"
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
            $(".info-table-box").html(userList);
            // 创建表格信息
            new Vue({
                el: '.info-table',
                data : {
                    titles : [
                        { text : "序号"}, 
                        { text : "用户名称"},
                        { text : "登录账号"}, 
                        { text : "操作"}
                    ],
                    dataList : dataList
                },
                methods : {
                    //解绑
                    unBindUser : function(userId,index){
                        var self = this;
                        $.ajax({
                            url : API.factoryUnbindUser,
                            type : "post",
                            data : {
                                factoryId : urlParam.factoryId,
                                userId : userId
                            },
                            success : function(resp) {
                                if(resp.code==0){
                                    self.dataList.splice(index,1);
                                    //提示框-成功
                                    Tool.alertboxSuccess("解绑用户成功");
                                }else{
                                    //提示框-错误
                                    Tool.alertboxError(resp.msg);
                                }
                            }
                        });
                    }
                }
            });
        }
    };
    init.default();

}); 