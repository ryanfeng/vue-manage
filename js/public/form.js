define([],function(header){
    var params = {};
    var init = {
        default : function(){
            init.event();
            //选项事件
            init.selectEvent();
        },
        event : function(){
            //按扭按下/松开  
            $("body").on("mousedown",".btn:not(.disabled)",function(){
                $(this).addClass("btn-active");
            }).on("mouseup",function(){
                $(".btn-active").removeClass("btn-active");
            });
            //点击input选框
            $("body").on("click",".checkout-box:not(.disabled):not(.notClick)",function(){
                if($(this).hasClass("on")){
                    $(this).removeClass("on").find("input").attr("checked",false);
                }else{
                    $(this).addClass("on").find("input").attr("checked",true);
                }
            });
            //input获取/推动焦点
            $("body").on("focus",".input",function(){
                var self = $(this);
                setTimeout(function(){
                    self.addClass("focus");
                });
            }).on("blur",".input",function(){
                $(this).removeClass("focus");
            }); 
        },
        //选项事件
        selectEvent : function(){
            $("body").on("click",function(){
                $(".sod_list").hide();  
            });
            //点击select
            $("body").on("click",".sod_select",function(){
                //清楚另外一些select选择效果
                $(this).addClass("now"); 
                $(".sod_select:not(.now)").find(".sod_list").hide();
                $(this).removeClass("now");
                //隐藏/显示选择 
                var $list = $(this).find(".sod_list");
                if($list.css("display")=="block"){ 
                    $list.hide();
                }else{
                    $list.show();
                }
                return false;
            });
            //点击select option 
            $("body").on("click",".sod_select .sod_list li:not(.notSetVal)",function(){
                var $val = $(this).text(); 
                $(this).closest(".sod_select").find(".sod_label").text($val);
                $(this).addClass("selected").siblings().removeClass("selected");
            });
            //点击select option
            $("body").on("click",".sod_select .sod_list li.notSetVal",function(){
                $(".sod_list").hide();
                $(this).addClass("selected").siblings().removeClass("selected");
                return false;
            });
        }
    };

    init.default();
});