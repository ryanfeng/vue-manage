define([],function(){
    window.RegEx = {
        //手机正则表达式
        regExpPhone : function(val) {
            //return val.length==11?true:false;
            return /^1[34578]\d{9}$/.test(val) ? true : false;
        },
        //邮箱正则表达式
        RegExpEmail : function(val) {
            return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(val) ? true : false;
        },
        //验证密码
        RegExpPassword : function(val) {
            return /^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~\_\-]{6,16}$/.test(val) ? true : false;
        },
        //正整数
        RegExpInteger : function(val){
            return /^[1-9]\d*$/.test(val) ? true : false;
        },
        //正数
        RegExpPositive : function(val){
            return /^[+]?[\d]+(([\.]{1}[\d]+)|([\d]*))$/.test(val) ? true : false;
        }, 
        //验证日期
        RegExpDate : function(val){
             return /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))$/.test(val); 
        }, 
        
    };
});