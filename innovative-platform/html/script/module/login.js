console.log("进入login.js");
$(document).on('click', '.login-aside .btn-login', function() {
    loadMenu();
	location.hash = getCurrentUrl(G.menu.menu,G.menu.default);
});
