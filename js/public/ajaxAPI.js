/*
API
*/
define([],function(){
    // var head = "http://192.168.5.122:8080/manageSystem/";
    // var head = "http://120.26.87.159:18080/manageSystem/";
    var head = "/manageSystem/"; 
    // window.API.login = "localhost:8888/manageSystem/web/user/login";
    window.API = { 
        //用户管理
        login : head+"web/user/login",//登录
        logout : head+"web/user/logout",//登出
        userCurrent : head+"web/user/current",//获取当前登陆用户信息
        changePwd : head+"web/user/pwd/modify",//修改密码
        resetPwd : head+"web/user/pwd/reset",//重置密码
        userList : head+"web/user/list",//用户列表
        userDel : head+"/web/user/del",//用户删除
        userDetail : head+"web/user/detail",//用户详情
        saveUser : head+"web/user/save",//新增/修改用户
        lockUser : head+"web/user/lock",//禁用/启用用户
        photoByName : head+"web/user/get/by/name",//根据电话号码查找用户
        photoByDealer : head+"web/dealer/find/by/phone",//根据经销商电话查找经销商
        deviceListUsers : head+"web/device/list/users",//获取设备用户列表
        deviceUserDevice : head+"web/device/user/device/num",//获取用户设备数量
        factoryUser : head+"web/user/list/factory/users",//获取工厂的登录用户
        
        //地区管理
        areaChildren : head+"web/area/children",//获取地区

        //角色管理
        roleList : head+"web/role/list",//角色列表
        roleSave : head+"web/role/save",//新增/修改角色
        roleDetail : head+"web/role/detail",//角色详情
        roleDel : head+"/web/role/del", //删除角色
        permissionList : head+"web/permission/list",//权限列表

        //经销商管理
        dealerSave : head+"web/dealer/save",//新增/修改零售/行业经销商
        dealerDel : head+"/web/dealer/del",//删除经销商
        retailDetail : head+"web/dealer/retail/detail",//零售经销商详情
        retailList : head+"web/dealer/retail/list",//零售经销商列表
        industryDetail : head+"web/dealer/industry/detail",//行业经销商详情
        industryList : head+"web/dealer/industry/list",//行业经销商列表
        deviceList : head+"web/dealer/list/device",//经销商设备列表
        industrySave : head+"web/industry/save",//新增行业
        industryNameList : head+"web/industry/list",//行业列表
        
        /****售前设备****/
        //设备分类
        categorySave : head+"web/device/category/save",//新增/修改设备分类
        categoryList : head+"web/device/category/list",//获取设备分类列表
        modelSave : head+"web/device/model/save",//新增/修改设备型号
        modelList : head+"web/device/model/list",//获取设备型号列表

        //生产厂商
        factorySave : head+"web/factory/save",//新增/修改生产厂商
        factoryList : head+"web/factory/list",//获取生产厂商列表
        factoryDetail : head+"web/factory/detail",//获取生产厂商详情
        factoryLock : head+"web/factory/lock",//锁定生产厂商
        factoryBindersList : head+"web/factory/list/binders",//查询工厂员工列表
        factoryBindUser : head+"web/factory/bind/user",//绑定工厂用户
        factoryUnbindUser : head+"web/factory/unbind/user",//解除绑定工厂用户

        //批次管理
        batchAdd : head+"web/device/batch/add",//创建生产批次
        batchList : head+"web/device/batch/list",//查询生产批次
        batchDetail : head+"web/device/batch/detail",//查看批次详情
        batchSnList : head+"web/device/batch/list/sn",//查询SN列表
        batchDiscardSn : head+"web/device/batch/discardSn",//作废SN编码
        batchExport : head+"web/device/batch/export",//导出生产批次
        deviceAllocate : head+"web/device/allocate",//设置出厂身份
        deviceResetInitState : head+"web/device/resetInitState",//设置出厂身份

        /****售后设备****/
        //订单管理
        newOrder : head+"web/order/add",//新增订单
        orderList : head+"web/order/list",//订单列表
        orderDetail : head+"web/order/detail",//订单详情
        orderListDevice : head+"web/order/list/device",//获取订单设备列表
        channelList : head+"web/channel/list",//订单类型列表
        orderTemplateDownload : head+"web/order/template/download",//下载订单上传模版
        
        //设备管理
        sellDeviceList : head+"web/device/list",//获取设备列表
        sellDeviceDetail : head+"web/device/detail",//获取设备详情
        sellDeviceStrainerList : head+"web/device/strainer/list",//获取滤网列表  
        sellDeviceStrainerDetail : head+"web/device/strainer/detail",//获取滤网详情
        findByCategory : head+"web/device/model/find/by/category",//根据设备分类获取设备型号
 
        //校园新风
        schoolSave : head+"web/school/save",//保存学校
        schoolEdit : head+"/web/school/detail",//修改学校
        schoolClassDetail : head+"web/school/class/detail",//获取班级详情
        schoolClassSave : head+"web/school/class/save",//保存班级
        schoolClassList : head+"web/school/class/list",//获取班级列表
        schoolServiceFeeSet : head+"web/school/service/fee/set",//服务费设置
        schoolServiceFeeGet : head+"web/school/service/fee/get",//服务费设置
        schoolDeviceList : head+"web/school/list/device",//获取学校设备列表
        schoolList : head+"web/school/list",//获取学校列表
        schoolClassListDevice : head+"web/school/class/list/device",//获取班级设备列表
        schoolClassServiceList : head+"web/school/class/service/list",//获取服务购买记录
        deviceUvRun : head+"web/device/uv/run",//Uv开启状态改变
        
        //数据统计
        statisticsDeviceGeneral : head+"web/statistics/device/general",//应用概况统计
        statisticsMonthlyNewUsers : head+"web/statistics/monthly/new/users",//月度新增用户统计
        statisticsMonthlyNewDevices : head+"web/statistics/monthly/new/devices",//月度新增设备统计
        statisticsTendencyAnalyze : head+"web/statistics/tendency/analyze",//趋势分析统计
        statisticsDeviceStatistics : head+"web/statistics/device/statistics",//趋势设备统计
        statisticsTerminalStatistics : head+"web/statistics/terminal/statistics",//终端统计
        statisticsDeviceDistribution : head+"web/statistics/devices/distribution",//按省份统计设备
        statisticsExpiringStrainers : head+"web/statistics/expiring/strainers",// 统计即将到期滤网
        statisticsSchoolDeviceNum : head+"web/statistics/school/device/num",//获取校园设备统计列表
        statisticsSchoolGeneral : head+"web/statistics/school/general",//校园设备概况
        statisticsUsersByModel : head+"web/statistics/users/by/model",//根据设备类型统计用户数量


        //设备定位
        gisGetonlineCount: head+"/web/gis/getAllGisDev/onlineCount",
        gisGetAllGisDevView: head+"/web/gis/getAllGisDev/view"
    };
    return API;
});