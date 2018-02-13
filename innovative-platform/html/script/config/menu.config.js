/**
 * 菜单配置,根据数据权限控制生成菜单
 * yulianlian 2018/02/07
 */
(function() {
	//菜单 
	var menu = {
		"default": "4", //默认登录之后的界面，指定的nodeId设定的值
		"menu": [{
				title: '首页',
				nodeId: 1,
				url: 'userhome',
			},
			{
				title: '我的申报',
				nodeId: 2,
				"default": "2_1",
				items: [{
						title: '创新点子申报',
						nodeId: '2_1',
						url: 'dianzi'
					},
					{
						title: '创新产品申报',
						nodeId: '2_2',
						url: 'chanpin'
					}
				]
			},
			{
				title: '我的评审',
				nodeId: 3,
				url: 'review'
			},
			{
				title: '我的管理',
				nodeId: 4,
				"default": "4_2",
				items: [{
						title: '设置管理员',
						nodeId: '4_1',
						url: 'admin'
					},
					{
						title: '设置大赛规则',
						nodeId: '4_2',
						"default" : "4_2_1",
							items: [{
								title: '申报规则设置',
								nodeId: '4_2_1',
								url: 'declare-rules'
							},
							{
								title: '评审规则设置',
								nodeId: '4_2_2',
								url: 'review-rules'
							},
							{
								title: '上报规则设置',
								nodeId: '4_2_3',
								url: 'report-rules'
							}
						]
					}
				]
			}
		]
	}
	window.G = window.G || {};
	window.G.menu = menu;
})();