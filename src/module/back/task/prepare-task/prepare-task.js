import $ from 'jQuery';
require('../../../../../static/lib/bootstrap-table/tableExport');

(function () {
    let $vue = new Vue({
        el: '.main-hook',
        data: {

            typeItems:[{text:'全部',value:''}],
            wareItems:[{text:'全部',value:''}],
            keyWords:'',
            wareCode:'',
            itemTypeCode:'',

            boxs: {
                box1: {show: true, hook: '.box1-hook', lock: true, url: '/back/task/prepareTask/page', params: {}},
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

            clearType:function(){

                $vue.$data.itemTypeCode = '';

            },




        },
        created: function () {
            //获取产品类型信息
            IOT.getServerData(URI.BASE.TYPE.LIST,{},(ret) => {
                if (ret.code === 200) {

                    var  list = ret.rows;
                    $.each(list,function(i,v){
                        $vue.$data.typeItems.push({text:v.itemTypeName,value:v.itemTypeCode})
                    });
                } else {
                    IOT.tips(ret.message || '服务器请求失败，稍后再试！', 'error');
                }
            });


        },
        mounted: function () {
            this.$nextTick(() => {
                var $accountBox = $('.prepareTask-hook');


                let tableHookName = '.prepareTask-table-hook';
                // 查询
                $accountBox.find('.search-hook').on('click', function () {
                    $(tableHookName).bootstrapTable('onCustomSearch');
                });
                $('.search-hook').on('click', function () {
                    $(tableHookName).bootstrapTable('onCustomSearch');
                });
                var $form = $accountBox.find('.form-search-hook');


                var $tableHook = $accountBox.find(tableHookName).bootstrapTable({
                    scrollbar: 'upShelf-table-body',
                    striped: true, // 设置为 true 会有隔行变色效果
                    pagination: true, // true 显示分页
                    paginationDetail: false, // 分页详情
                    sidePagination: 'server', // 服务器端
                    method: 'post',
                    url: URI.TASK.PREPARE_TASK.LIST,
                    debug: false,
                    cache: false,
                    pageNumber: 1,
                    pageSize: 20,
                    // fixedColumns: true,
                    customButton: '',


                    customQueryParams: function (params) {
                        var wareCode = IOT.getLocalStore("backWare");
                        var formParams = $form.serializeJson();
                        var queryParams = $.extend({wareCode:wareCode}, params, formParams);
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
                            field: 'billNo', title: '出库单据', align: 'center',fixedLeft: true, tips:true,width:240
                        },
                        {
                            field: 'areaName', title: '货区', align: 'center',fixedLeft: true, tips:true
                        },
                        {
                            field: 'shelfName', title: '货架', align: 'center',fixedLeft: true, tips:true
                        },
                        {
                            field: 'cellCode', title: '货位', align: 'center',fixedLeft: true, tips:true
                        },
                        {
                            field: 'sColumn', title: '列', align: 'center',fixedLeft: true, tips:true,width: 80
                        },
                        {
                            field: 'sRow', title: '行', align: 'center',fixedLeft: true, tips:true,width: 80
                        },
                        {
                            field: 'itemName', title: '物料', align: 'center', fixedLeft: true, tips:true
                        },
                        {
                            field: 'quantity', title: '数量', align: 'center',fixedLeft: true, tips:true,width: 120

                        },
                        {
                            field: 'taskBatch', title: '分拣批次', align: 'center',fixedLeft: true, tips:true

                        },
                        {
                            field: 'state', title: '状态', align: 'center',fixedLeft: true, tips:true,
                            formatter: function (value, row, index) {
                                /* 1-初始化 2-审核 3-作业中 4-完成 */


                                if (value === 0 ){return "<button style='background-color: #dd4444;border-style: none' class='btn btn-blue detail-account'>未分拣</button>";}
                                else if (value === 1 ){return "<button style='background-color: #66b94a;border-style: none' class='btn btn-blue detail-account'>已完成</button>";}


                            }

                        },

                    ],

                });
                //权限——查看
               /* if (!M.Authority.checkAuthority('unsubscribe-detail')) {
                    $(tableHookName).bootstrapTable('hideColumn', 'operate');//隐藏列
                }*/
            });
        }
    });
})();