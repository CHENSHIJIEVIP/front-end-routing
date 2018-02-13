/**
 * 提供一些通用方法
 * yulianlian on 2018/02/05
 */
jQuery(function(){
    window.tk = window.tk || window.app || {};

    //复制全局设置至sino变量
    if(window.envconfig){
        for(var key in window.envconfig){
            tk[key] = window.envconfig[key];
        }
    }
    
    /** 获取html页面连接中的传参 **/
    tk.getParams = function(){
        var data = {};
        var str = location.search;
        if(str){
            str = str.slice(1);
            dataArr = str.split('&');
            for(var i=0;i<dataArr.length;i++){
                var _dataArr = dataArr[i].split('=');
                data[_dataArr[0]] = _dataArr[1];
            }
        }
        return data;
    };

    /** 限制输入框输入的内容长度 **/
    tk.inputMaxLength = function(field, length) {
        if (!length)
            return;
        field.keyup(function() {
            // 过滤输入框长度
            if (length && field.val().length > length) {
                field.val(field.val().slice(0, length));
            }
        });
    };

    /** 限制输入框只能输入数字 **/
    tk.onlyNumber = function(field, length) {
        field.keyup(function(event) {
            // 过滤长度
            if (length && field.val().length > length) {
                field.val(field.val().slice(0, length));
            }
            // 过滤非数字
            field.val(field.val().replace(/[^0-9]/g, ''));
        });
    };

    /** 将数字字符串添加千粉符 **/
    tk.splitNumber = function(str){
        str = str ||'';

        var result = '';
        var lastIndex = str.lastIndexOf('.');
        if(lastIndex != -1){
            result = str.slice(lastIndex);
            str = str.slice(0,lastIndex);
        }

        while(str.length > 3){
            result = ','+str.slice(-3)+result;
            str = str.slice(0,-3);
        }
        return str + result;
    };
 
})
