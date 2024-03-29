import $ from 'jQuery';
(function () {
    let $vue = new Vue({
        el: '.main-hook',
        data: {

            rowData:[],
            info:{
                itemMasterName:'',
                linkMan:'',
                linkPhone:'',
                memo:'',


            },


            boxs: {
                box1: {show: true, hook: '.box1-hook', lock: true, url: '/back/itemMaster/page', params: {}},
                box2: {show: false, hook: '.box2-hook', url: '', params: {}},
                box3: {show: false, hook: '.box3-hook', url: '', params: {}},
                box4: {show: false, hook: '.box4-hook', url: '', params: {}}
            }
        },
        methods: {
            emitPage: function () {
                M.Page.load(this.boxs);
            },
            // 上一页
            prePage: function () {
                M.Page.prePage(this.boxs);
            },
            // 触发刷新页(当前显示的页面)
            refreshPage: function () {
                M.Page.refreshPage(this.boxs);
            },


            updateItemMaster:function(){
                var item = $vue.$data.rowData;
                $("#updateModal").modal('hide');
                $vue.$data.rowData = [];
                IOT.showOverlay('保存中，请稍等...');
                IOT.getServerData(URI.BASE.ITEM_MASTER.UPDATE,item,(ret) => {

                    if (ret.code === 200) {
                        IOT.tips('保存成功！', 'success', 1000 , function () {

                            location.reload(true);


                        });

                    } else {
                        IOT.tips(ret.message || '服务器请求失败，稍后再试！', 'error');
                    }
                });
            },

            insertItemMaster:function(){
                var item = $vue.$data.info;
                var itemMasterName   =   item.itemMasterName.replace(/^\s+|\s+$/g,'');
                 if(itemMasterName == null || itemMasterName == ''){
                    layer.alert('请输入货主名称！');
                    return false;
                };
                $("#newModal").modal('hide');
                $vue.$data.info = [];
                IOT.showOverlay('保存中，请稍等...');
                IOT.getServerData(URI.BASE.ITEM_MASTER.ITEM_MASTER_ADD.SAVE,item,(ret) => {

                    if (ret.code === 200) {
                        IOT.tips('保存成功！', 'success', 1000 , function () {
                            layer.closeAll();
                            location.reload(true);


                        });

                    } else {
                        IOT.tips(ret.message || '服务器请求失败，稍后再试！', 'error');
                    }
                });
            },



        },
        created: function () {
            M.Page.changeWareAndMaster();
        },
        mounted: function () {
            this.$nextTick(() => {
                var $accountBox = $('.item-master-hook');
                let tableHookName = '.item-master-table-hook';
                // 查询
                $accountBox.find('.search-hook').on('click', function () {
                    $(tableHookName).bootstrapTable('onCustomSearch');
                });
                $('.search-hook').on('click', function () {
                    $(tableHookName).bootstrapTable('onCustomSearch');
                });
                var $form = $accountBox.find('.form-search-hook');

                var $tableHook = $accountBox.find(tableHookName).bootstrapTable({
                    scrollbar: 'return-table-body',
                    striped: true, // 设置为 true 会有隔行变色效果
                    pagination: true, // true 显示分页
                    paginationDetail: false, // 分页详情
                    sidePagination: 'server', // 服务器端
                    method: 'post',
                    url: URI.BASE.ITEM_MASTER.LIST,
                    debug: false,
                    cache: false,
                    pageNumber: 1,
                    pageSize: 20,
                    // fixedColumns: true,
                    customButton: '',
                    showColumns:true,
                    customQueryParams: function (params) {
                        var formParams = $form.serializeJson();
                        var queryParams = $.extend({}, params, formParams);
                        return queryParams;
                    },
                    onLoadSuccess: function () {
                    },
                    onLoadError: function (status, xhr) {
                    },
                    onCheckAll: function (rows) {

                    },
                    columns: [

                        {
                            field: 'itemMasterId', title: '货主编号', align: 'center', fixedLeft: true, tips:true
                        },
                        {
                            field: 'itemMasterName', title: '货主名称', align: 'center', fixedLeft: true, tips:true
                        },

                        {
                            field: 'linkMan', title: '联系人', align: 'center', fixedLeft: true, tips:true
                        },
                        {
                            field: 'linkPhone', title: '联系方式', align: 'center', fixedLeft: true, tips:true
                        },

                        {
                            field: 'memo', title: '备注', align: 'center', fixedLeft: true, tips:true
                        },

                        {
                            field: 'operate', title: '操作', align: 'center', fixedLeft: true,
                            events: {
                                'click .update': function (e, value, rowData, index) {
                                    $vue.$data.rowData = $.extend({},   rowData);
                                    $("#updateModal").modal('show');
                                },
                                'click .delete': function (e, value, rowData, index) {

                                    layer.confirm(' &nbsp;&nbsp; &nbsp;&nbsp;是否确认删除此货主？', {
                                        btn: ['确定','取消']
                                    }, function(){
                                        IOT.showOverlay('保存中，请稍等...');
                                        var itemMasterId = rowData.itemMasterId;
                                        debugger;
                                        IOT.getServerData(URI.BASE.ITEM_MASTER.DELETE,{itemMasterId:itemMasterId},(ret) => {
                                            IOT.hideOverlay();
                                            if (ret.code === 200) {
                                                IOT.tips('保存成功！', 'success', 1000 , function () {
                                                    layer.closeAll();
                                                    location.reload(true);
                                                });

                                            } else {
                                                IOT.tips(ret.message || '服务器请求失败，稍后再试！', 'error');
                                            }
                                        });
                                    }, function(){
                                        //取消
                                    });

                                }
                            },
                            formatter: function (value, row, index) {
                                let operate = [];
                                operate.push(' <button style="" class="btn btn-blue update">修改</button>');
                                operate.push(' <button class="btn btn-red delete">删除</button>');

                                return  operate.join(' ');
                            }
                        }
                    ]
                });
                //权限——查看
                /*if (!M.Authority.checkAuthority('unsubscribe-detail')) {
                    $(tableHookName).bootstrapTable('hideColumn', 'operate');//隐藏列
                }*/
            });
        }
    });
})();