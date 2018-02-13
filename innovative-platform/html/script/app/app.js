/**
 * 路由控件
 * yulianlian on 2018/02/05
 */
var app = {
    defaultViewID :'global-content',
    modalViewID: 'global-popups',
    basePath: envconfig.basePath,
    route:{
        'default':'main',//lacation.hash为空 时,默认加载的页面
        'main':{
            //主页
        	hideHeader:true,//是否隐藏头部导航
            html:'view/main.html',
            js:['script/lib/taikang/tk-silder.js','script/module/main.js']
        },
        'login' : {
            //登录页
            hideHeader:true,//是否隐藏头部导航
            html:'view/login.html',
            js:['script/module/login.js']
        },
        'register' : {
            //注册页
            hideHeader:true,//是否隐藏头部导航
            html:'view/register/register.html',
            js:['script/module/register/register.js']
        },
        'forget-pwd' : {
            //忘记密码页
            hideHeader:true,//是否隐藏头部导航
            html:'view/register/forget-pwd.html',
            js:['script/module/register/forget-pwd.js']
        },
        'userhome' : {
            //首页
            html:'view/home/user-home.html',
            js:['script/module/home/user-home.js']
        },
        'dianzi':{
            //点子申报
            html:'view/shenbao/dianzi.html',
            js:['script/module/shenbao/dianzi.js']
        },
        'chanpin':{
            //产品申报
            html:'view/shenbao/chanpin.html',
            js:['script/module/shenbao/chanpin.js']
        },
        'review':{
            //产品申报
            html:'view/review/review.html',
            js:['script/module/review/review.js']
        },
        'admin':{
            //我的管理-设置管理员
            html:'view/manage/set-admin.html',
            js:['script/module/manage/set-admin.js']
        },
        'declare-rules':{
            //设置大赛规则-申报规则设置
            html:'view/manage/rules/declare-rules.html',
            js:['script/module/manage/rules/declare-rules.js']
        },
        'review-rules':{
            //设置大赛规则-评审规则设置
            html:'view/manage/rules/review-rules.html',
            js:['script/module/manage/rules/review-rules.js']
        },
        'report-rules':{
            //设置大赛规则-上报规则设置
            html:'view/manage/rules/report-rules.html',
            js:['script/module/manage/rules/report-rules.js']
        }
    }
};
$(function(){
    //当前文件的路径
    var _filePath = app.basePath + 'script/index.js';

    app.findCurrentPath = function(){
        var path = null;
        var scripts = document.getElementsByTagName('script');
        for (var n = scripts.length-1; n>-1; n--) {
            var src = scripts[n].src.replace(/\?.*$/, ''); // 去掉查询字段
            if (src.indexOf(_filePath) == (src.length - _filePath.length)) {
                path = src.substring(0, src.length - _filePath.length);
                break;
            }
        }

        if(path && path.lastIndexOf('/') != path.length-1) path += '/';
        return path;
    };

    /*当前访问的地址*/
    app.LOCALPATH = (function(){
        return app.findCurrentPath();
    })();

    /*控制全局loading*/
    app.globalLoading = {
        hide:function(){
            $('#global-loading-shadow').hide();
        },
        show:function(id){
            //console.trace('显示全局Loading'+ (id ? (',id:' + id) : '' ) );
            $('#global-loading-shadow').show();
        },
        isHidden:function () {
            return $('#global-loading-shadow').is(':hidden');
        }
    };
    
    /*控制全局shadow*/
    app.globalShadow = {
        _times: 0,
        _list:{},
        _hide:function(){
            this._list = {};
            $('#global-shadow').css('z-index','2000').hide();
        },
        hide:function(id){
            if(this._list[id]){
                this._times = Math.max(this._times - 1,0);
                this._list[id] = null;
            }

            var _arr = [];
            for(var key in this._list){
                _arr.push(this._list[key]);
            }
            $('#global-shadow').css('z-index',Math.max.apply(null,_arr))
            if(this._times === 0){
                $('#global-shadow').css('z-index','2000').hide();
            }
        },
        show:function(id){
            if(!this._list[id]){
                this._times = Math.max(this._times,0) + 1;
                this._list[id] = ($('#'+id).css('z-index') || 2000);
                if($('#'+id).length > 0){
                    $('#global-shadow').css('z-index',this._list[id] - 1);
                }
            }
            $('#global-shadow').show();
        }
    }
  
    /*控制页面底部的显示隐藏*/
    app.footer = {
        hide:function(){
            $('#mainviewport').addClass('footer-hide');
        },
        show:function(){
            $('#mainviewport').removeClass('footer-hide');
        }
    };

    /* 控制页面头的显示隐藏*/
    app.header = {
        hide:function(){
        	if(!($('#mainviewport').hasClass("header-hide")))
                $('#mainviewport').addClass('header-hide');
        },
        show:function(){
        	if($('#mainviewport').hasClass("header-hide"))
        	    $('#mainviewport').removeClass('header-hide');
        }
    };
    
    //左侧菜单的显示与隐藏
    app.leftMenu={
    	hide:function(){
        	if(!($('#life_menu').hasClass("disshow"))){
                $('#life_menu').addClass('disshow');
                $('#global-content').css({'margin-left':'0'});
            }
        },
        show:function(){
        	if($('#life_menu').hasClass("disshow")){
        	    $('#life_menu').removeClass('disshow');
        	    $('#global-content').css({'margin-left':'270px'});
            }
        }
    }

    /**
     * 用于引入js文件
     * @param src js文件路径 可以为字符串或数组
     * @param asyncLoadType 逐个加载 false 同时加载 默认为false
     * @param 加载完成的回调函数 可以为空
     */
    app.loadJS = function(src,asyncLoadType,callback){
        //将src放在数组中 便于统一处理
        if(!$.isArray(src)) src = [src];
        var needSrcs = [],
            haveSrcs = [];

        
        //取得当前页面中的所有js标签
        var scripts = document.getElementsByTagName('script');
        var _data = {
            flag:1//,加载是否成功标记
        };
        
        for(var i=0;i<scripts.length;i++){
            haveSrcs.push(scripts[i].src);
        }

        for(var i=0;i<src.length;i++){
            if(haveSrcs.indexOf(src[i]) == -1) needSrcs.push(src[i]);
        }

        if(needSrcs.length > 0){
            if(asyncLoadType){
                parallelLoad();
            }else{
                serialLoad(0);
            }
        } else {
             if(callback) callback({flag:1});
        }

        /** 串行加载 **/
        function serialLoad(i){
            var scriptE = document.createElement('script');
            scriptE.setAttribute('type','text/javascript');
            scriptE.onload = ready;
            scriptE.onerror = ready;
            scriptE.setAttribute('src',needSrcs[i]);
            document.getElementsByTagName('head')[0].appendChild(scriptE);

            function ready(e){
                if(e.type == 'error'){
                    //加载js出错
                    _data.flag = 0;
                }
                //如果不是最后一个 则继续加载
                if(i != needSrcs.length-1) {
                    serialLoad(i+1);
                }else{
                    if(callback){
                        callback(_data);
                    }
                }
            }
        }

        /** 并行加载 **/
        function parallelLoad(){
            var loaded = 0;
            //加载所有js
            for(var i=0;i<needSrcs.length;i++){
                var scriptE = document.createElement('script');
                scriptE.setAttribute('type','text/javascript');
                scriptE.setAttribute('src',app.LOCALPATH+needSrcs[i]);
                scriptE.onload = ready;
                scriptE.onerror = ready;
                document.head.appendChild(scriptE);
            }

            function ready(e){
                if(e.type == 'error'){
                	//加载js出错
                    _data.flag = 0;
                }
                loaded++;
                if(loaded == needSrcs.length){
                    if(callback) callback(_data);
                }
            }
        }
    };

    /**
     * 加载全局modal弹出框
     * @param modalId
     * @param callback
     */
    app.loadModal = function(modalId,callback){
        var modalData = app.modal[modalId];
        if(!modalData){
            console.error('[APP] [加载modal错误] 没有查找到id为:'+modalId+'的相关配置');
            callback({html:0,js:0,flag:0,modal:modalData});
        }else{
            //已经加载过的modal不再进行加载
            if(modalData.ready){
                callback({html:1,js:1,flag:1,modal:modalData});
            }else{
                console.log('[APP] 开始加载modal:'+modalId);
                $.ajax({
                    url:app.LOCALPATH + app.basePath + modalData.html,
                    dataType:'html',
                    success:function(data){
                        $('#'+app.modalContentID).append(data);
                        if(modalData.js) app.loadJS(app.LOCALPATH + app.basePath + modalData.js,0,function(data){
                            var _data = {
                                html:1,
                                js:data.flag,
                                flag: data.flag,
                                modal:modalData
                            };
                            modalData.ready = true;
                            callback(_data);
                        });
                    },
                    error:function(){
                        console.error('[加载modal错误] 加载路径为:' + modalData.html + '的文件失败');
                        callback({html:0,js:0,flag:0,modal:modalData});
                    }
                });
            }
        }
    }

    /**
     * 加载指定路径的内容
     * @param path
     * @param callback
     */
    app.loadPath = function(path,callback){
        var route = app.route;
        //如果没有配置路径则不做操作
        if(!route[path]){
            if(callback) callback();
            return;
        }
        var contendID=(route[path] && route[path].viewID) ? route[path].viewID : app.defaultViewID;

        //加载HTML
        $('#'+contendID).load(app.LOCALPATH + app.basePath + route[path].html,function(){
            //移除上一个页面加载的js
            if(app.curr && app.curr.js){
                app.curr.js.map(function(value){
                    $('script[src="'+app.LOCALPATH + app.basePath + value+'"]').remove();
                });
            }

            //如果有undo函数则调用 用来消除之前页面js对当前环境造成的影响
            if(app.curr && app.curr.undo) app.curr.undo();

            app.curr = route[path];
            
            var jsArr = [];
            //如果存在js则遍历增加
            if(app.curr.js){
                app.curr.js.map(function(value){
                    jsArr.push(app.LOCALPATH + app.basePath +  value);
                });
            }else{
                if(callback) callback(app.curr);
            }

            //加载完成后将页面移动到顶端
            $('#'+app.defaultViewID).scrollTop(0);

            app.loadJS(jsArr,false,function(){
                if(callback) callback(app.curr);
            });
        });
    };

    /** 路径发生变化时触发加载页面的操作 **/
    function loadViewport(){
        var path = location.hash || '#' + app.route.default;
        var keyroute = path.slice(1),
            hideHeader=(app.route[keyroute] && app.route[keyroute].hideHeader) ? app.route[keyroute].hideHeader : false,
            contentID = (app.route[keyroute] && app.route[keyroute].viewID) ? app.route[keyroute].viewID : app.defaultViewID;
          
        //app.globalLoading.show();

        /*开始加载页面*/
        $('#'+contentID).hide();
        app.loadPath(path.slice(1),function(data){
        	if(keyroute==app.route.default || hideHeader){
        		app.header.hide();
        	} else {
        		app.header.show();
        	}
        	//加载页面['+path+']完成
            $('#'+contentID).show();
            
            //如果页面没有设置 则默认隐藏全局loading
            //if(!data || !data.selfHideLoading) app.globalLoading.hide();
        });
    }

    app.loadViewport = loadViewport;

    /** 当浏览器的hash发生变化时进行页面的加载 **/
    window.onhashchange = loadViewport;
});

