/*
* 角色详情页面
* */
define(['Tool','component','text!/tpl/system-manage/role-detail.html'],function(Tool,component,roleDetail){
    var urlParam = Tool.getUrlParam();
    var init = {
        default : function(){
            init.base();
            //角色名字
            init.roleName();
            //获取角色权限详情
            init.getRoleDetail();
        },
        base : function(){
            if(urlParam.before == "user"){
                $(".system-manage-role").removeClass("active");
                $(".system-manage-user").addClass("active");
                //位置信息
                Tool.location([{
                    class : "",
                    href : "javascript:void(0)",
                    text : "系统管理"
                },{
                    class : "hover",
                    href : "./user.html",
                    text : "用户管理"
                },{
                    class : "",
                    href : "javascript:void(0)",
                    text : "查看权限"
                }]);
            }else{
                //位置信息
                Tool.location([{
                    class : "",
                    href : "javascript:void(0)",
                    text : "系统管理"
                },{
                    class : "hover",
                    href : "./role.html",
                    text : "角色管理"
                },{
                    class : "",
                    href : "javascript:void(0)",
                    text : "查看权限"
                }]);
            }
        },
        //角色名字
        roleName : function(){
            new Vue({
                el: ".input-form",
                //数据
                data: {
                    caption : "角色名称：",
                    roleName : decodeURIComponent(urlParam.roleName)
                }
            });
        },
        //获取角色权限详情
        getRoleDetail : function(){
            //添加正在加载中...
            Tool.createLoadding();
            $.ajax({
                url :API.roleDetail,
                data : {
                    roleId : urlParam.roleId
                },
                type:"POST",
                success : function(resp){
                    console.log(resp,"成功");
                    if(resp.code==0){
                        //表格信息
                        init.infoNeaten(resp.data.permissionList);
                    }
                },
                error: function(resp){
                    console.log(resp,'失败')
                }
            });
        },
        //信息整理
        infoNeaten : function(resp){
            for(var i=0;i<resp.length;i++){
                resp[i].number = i+1;
                resp[i].row = resp[i].pwViewList.length;
                resp[i].subInfo = [];
                resp[i].hasIt = resp[i].hasIt;
                for(var j=0;j<resp[i].pwViewList.length;j++){
                    var third = [];
                    for(var k=0;k<resp[i].pwViewList[j].pwViewList.length;k++){
                        third.push({
                            hasIt : resp[i].pwViewList[j].pwViewList[k].hasIt,
                            permissionId : resp[i].pwViewList[j].pwViewList[k].permissionId,
                            text : resp[i].pwViewList[j].pwViewList[k].permissionName
                        });
                    }

                    resp[i].subInfo.push({
                        first : j==0?true:false,
                        second : {
                            hasIt : resp[i].pwViewList[j].hasIt,
                            permissionId : resp[i].pwViewList[j].permissionId,
                            text : resp[i].pwViewList[j].permissionName
                        },
                        third : third
                    });
                }
                //只有一级目录
                if(!resp[i].row){
                    resp[i].row = 1;
                    resp[i].subInfo = [
                        {
                            first : true,
                            second : [],
                            third : []
                        }
                    ];
                }
            }
            console.log(resp,resp.length,"length",resp[6].hasIt);
            //表格信息
            init.infoTable(resp);
        },
        //表格信息
        infoTable : function(dataList){
            $(".info-table-box").html(roleDetail);
            // 创建表格信息
            new Vue({
                el: '.info-table',
                data : {
                    submitText : "保存",
                    submitDisabled : true,
                    titles : [
                        { text : "序号", styleObject:{
                            width : "50px"
                        }},
                        { text : "一级权限", styleObject:{
                            width : "130px",
                            paddingLeft : "60px"
                        }},
                        { text : "二级权限",styleObject:{
                            width : "140px",
                            paddingLeft : "60px"
                        }},
                        { text : "三级权限",styleObject:{
                            paddingLeft : "60px"
                        }}
                    ],
                    dataList : dataList
                }
            });
        }
    };
    init.default();

});