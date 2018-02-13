/**
 * 初始化信息
 * yulianlian on 2018/02/05
 */

$(function () {
	/**
     * 会话超时重新登录到首页
     * */
    var autoGoHome = null;
    $(window).on('click', function () {
    	if (autoGoHome) clearTimeout(autoGoHome);
        autoGoHome = setTimeout(function () {
            location.hash = 'login';
        }, 1000 * 60 * 90);
    })
    
    /**
     * 判断用户是否登录
     * */
    tk.checkLogin=function(){
    	var flag = false;
    	/*$.ajax({
       		url:'http://localhost:6500/islogin',
       		type : 'get',
			async:false,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			dataType : "json",
			success:function(data,status){
				if(data.status==1){
				   console.log("已经登录");
				   flag=true;
				}
				else
				   console.log("未登录");
			},
			error:function(data,status){
				console.log("出现错误");
			}
		});*/
		return false;
    }
   
    /**
      * 退出登录
     * */
    tk.logout = function () {
        tk.confirm('是否退出本系统?', function (data) {
            if (data) {
               console.log("退出");
            }
        })
    }

    /**
     * 初始化用户数据
     * */
    tk.initUserData = function () {
        var isLogin=tk.checkLogin();
        if(!isLogin){
        	tk.loadViewport();
        }
    } 
    tk.initUserData();

    /**
     * 一级导航绑定点击事件
     * */
    $(document).on('click', '#global-header-list .nav-name', function() {
        $(this).addClass('active');
        $(this).parent().siblings().children().removeClass('active');
        var nId = $(this).attr('nid'),
            dId = $(this).attr('did');
        var menu = G.menu,
            listMenu = menu.menu;
        if(dId == "null"){
            $('#life_menu').addClass('disshow');
        }else{
            loadItems(nId,dId);
            $('#life_menu').removeClass('disshow');
        }
        location.hash = getCurrentUrl(listMenu,nId);
    });

    /**
     * 左侧一级菜单绑定点击事件
     * */
    $(document).on('click', '#life_menu .childMenu', function(){
        var url = $(this).attr('item');
        if(url != 'undefined'){
            location.hash = url;
        }
        else{
            if($(this).hasClass('active') && !$(this).parent('li').find('ul').hasClass('disshow')){
                $(this).parent('li').find('ul').addClass('disshow');
            }else{
                $(this).parent('li').find('ul').removeClass('disshow');
            }
        }
        $(this).addClass('active');
        $(this).parent('li').siblings().find('a').removeClass('active');
    });

    /**
     * 左侧二级菜单绑定点击事件
     * */
    $(document).on('click', '#life_menu .lastMenu', function(){
        var url = $(this).attr('item');
        $(this).addClass('active');
        $(this).parents('li').siblings().find('a').removeClass('active');
        $(this).parents('li').find('.childMenu').addClass('active');
        location.hash = url;
    });

});

//加载头部导航
function loadMenu () {
    var menu = G.menu,
        menuList = menu.menu,
        menuDefault = menu.default;
    var headerNav = $('#global-header-list');
    var menustr = '';
    if(!menuList){
        return;
    }
    $.each(menuList,function(i,n){
        var className = 'nav-name';
        var hasDefault = "null";
        if(n.nodeId == menuDefault){
            className += ' active';
            if(n.default){
                loadItems(n.nodeId,n.default);
                $('#life_menu').removeClass('disshow');
            }
        }
        if(n.default){
            hasDefault = n.default;
        }
        menustr += '\
            <li class="nav-children fl on">\
                <a href="javascript:;" class="'+className+'" nid="'+n.nodeId+'" did="'+hasDefault+'">'+n.title+'</a>\
            </li>\
        ';
    });
    headerNav.append(menustr);
}

//加载左侧菜单
function loadItems (nId,dId) {
    var data = getItems(nId);
    var leftMenu = $('#life_menu');
    var itemStr = '';
    $.each(data,function(i,n){
        var className = 'childMenu',
            childStr = '',
            childShowClass = 'disshow';
        if(n.nodeId == dId){
            className += ' active';
            childShowClass = '';
        }
        if(n.items){
            $.each(n.items,function(k,v){
                var childClassName = 'lastMenu mgl25';
                if(n.nodeId == dId && n.default == v.nodeId){
                    childClassName += ' active';
                }
                childStr += '<li><a class="'+childClassName+'" href="javascript:;" item="'+v.url+'">'+v.title+'</a></li>'
            });
        }
        itemStr += '<li><a class="'+className+'" href="javascript:;" item="'+n.url+'">'+n.title+'</a><ul class="'+childShowClass+'">'+childStr+'</ul></li>'
    });
    leftMenu.html(itemStr);
}

/*获取当前点击导航元素url的方法*/
function getCurrentUrl (data, nId) {
    var url;
    $.each(data,function(i,n){
        if(n.nodeId == nId){
            if(n.url){
                url = n.url;
                return false;
            }else{
                $.each(n.items,function(k,v){
                    if(v.nodeId == n.default){
                        if(v.url){
                            url = v.url;
                            return false;
                        }else{
                            $.each(v.items,function(j,m){
                                if(m.nodeId == v.default){
                                    url = m.url;
                                    return false;
                                }
                            });
                        }
                    }
                })
            }
        }
    });
    return url;
}

//获取子级菜单的方法
function getItems (nId) {
    var items;
    $.each(G.menu.menu,function(i,n){
        if(n.nodeId == nId){
            if(!n.default){
                return
            }
            items =  n.items;
        }
    });
    return items;
}