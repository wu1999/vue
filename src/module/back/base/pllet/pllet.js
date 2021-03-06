import $ from 'jQuery';
(function () {
    let $vue = new Vue({
        el: '.main-hook',
        data: {
            info:{
               palletName:'',
                palletId:'',
                palletCode:'',//托盘编码
                palletBarCode:'',//托盘条形编码
                palletType:'',
                memo:'',
            },
            rowData:{
                
            },

            boxs: {
                box1: {show: true, hook: '.box1-hook', lock: true, url: '/back/pllet/page', params: {}},
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
                debugger
                M.Page.refreshPage(this.boxs);
            },

            updatePllet:function(){
                var item = $vue.$data.rowData;
                $("#updateModal").modal('hide');
                $vue.$data.rowData = [];
                IOT.showOverlay('保存中，请稍等...');
                IOT.getServerData(URI.BASE.PLLET.UPDATE,item,(ret) => {

                    if (ret.code === 200) {
                        IOT.tips('保存成功！', 'success', 1000 , function () {
                            layer.closeAll();
                            M.Table.refresh.all();


                        });

                    } else {
                        IOT.tips(ret.message || '服务器请求失败，稍后再试！', 'error');
                    }
                });
            },

            insertPllet:function(){
                debugger
                var plletInfo = $vue.$data.info;
                $("#newModal").modal('hide');
                $vue.$data.info = {
                    plletId:'',
                    plletCode:'',//托盘编码
                    plletBarCode:'',//托盘条形编码
                    plletType:'',
                    memo:'',
                };

                IOT.showOverlay('保存中，请稍等...');
                IOT.getServerData(URI.BASE.PLLET.PLLET_ADD.SAVE,plletInfo,(ret) => {
                    debugger
                    if (ret.code == 200) {
                        IOT.tips('保存成功！', 'success', 1000 , function () {
                            layer.closeAll();
                            M.Table.refresh.all();


                        });

                    } else {
                        IOT.tips(ret.message || '服务器请求失败，稍后再试！', 'error');
                    }
                });
            }
            


        },
       /* created: function () {
            //获取货位信息
            var cellCode = IOT.getLocalStore("backWare");
            IOT.getServerData(URI.BASE.CELL.LIST,{cellCode:cellCode},(ret) => {
                if (ret.code === 200) {
                    var  list = ret.data.list;
                    $.each(list,function(i,v){
                        $vue.$data.cellItems.push({text:v.areaName,value:v.areaCode})
                    });
                } else {
                    IOT.tips(ret.message || '服务器请求失败，稍后再试！', 'error');
                }
            });
        },
        created: function () {
            //获取货架信息
            var wareCode = IOT.getLocalStore("backWare");
            IOT.getServerData(URI.BASE.AREA.LIST2,{wareCode:wareCode},(ret) => {
                if (ret.code === 200) {
                    var  list = ret.data.list;
                    $.each(list,function(i,v){
                        $vue.$data.areaItems.push({text:v.areaName,value:v.areaCode})
                    });
                } else {
                    IOT.tips(ret.message || '服务器请求失败，稍后再试！', 'error');
                }
            });
        },
        created: function () {
            //获取货区信息
            var wareCode = IOT.getLocalStore("backWare");
            IOT.getServerData(URI.BASE.AREA.LIST2,{wareCode:wareCode},(ret) => {
                if (ret.code === 200) {
                    var  list = ret.data.list;
                    $.each(list,function(i,v){
                        $vue.$data.areaItems.push({text:v.areaName,value:v.areaCode})
                    });
                } else {
                    IOT.tips(ret.message || '服务器请求失败，稍后再试！', 'error');
                }
            });
        },*/

        mounted: function () {
            this.$nextTick(() => {
                var $accountBox = $('.main-hook');
                let tableHookName = '.pllet-table-hook';
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
                    url: URI.BASE.PLLET.LIST,
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
                            field: 'no', title: '序号', align: 'center', width: 50,
                            formatter: function (val, rowData, index) {
                                return index + 1;
                            }
                        },
                        {
                            field: 'palletName', title: '托盘名称', align: 'center', fixedLeft: true, tips:true
                        },
                        {
                            field: 'palletCode', title: '托盘编码', align: 'center', fixedLeft: true, tips:true
                        },

                        {
                            field: 'palletBarCode', title: '托盘条形编码', align: 'center', fixedLeft: true, tips:true
                        },

                        {
                            field: 'cellCode', title: '', align: 'center', fixedLeft: true, tips:true
                        },
                        {
                            field: 'memo', title: '备注', align: 'center', fixedLeft: true, tips:true
                        },

                        {
                            field: 'operate', title: '操作', align: 'center', fixedLeft: true,width:300,
                            events: {
                                'click .update': function (e, value, rowData, index) {
                                    $vue.$data.rowData = $.extend({},   rowData);
                                    $("#updateModal").modal('show');
                                },

                                'click .print': function (e, value, rowData, index) {
                                    $vue.$data.rowData = $.extend({},   rowData);
                                    $("#palletBar").barcode(rowData.palletCode, "code128",{
                                        // output:'css',       //渲染方式 css/bmp/svg/canvas
                                        //bgColor: '#ff0000', //条码背景颜色
                                        color: '#000000',   //条码颜色
                                        barWidth: 2,        //单条条码宽度
                                        barHeight: 80,     //单体条码高度
                                        // moduleSize: 5,   //条码大小
                                        // posX: 10,        //条码坐标X
                                        // posY: 5,         //条码坐标Y
                                        //  addQuietZone: false  //是否添加空白区（内边距）
                                    });
                                    $("#palletCode").text(rowData.palletCode);
                                    $("#palletName").text(rowData.palletName);
                                    $("#palletBarCode").text(rowData.palletBarCode);
                                    $("#cellCode").text(rowData.cellCode);
                                    $("#palletPrintArea").printArea();

                                },

                                'click .delete': function (e, value, rowData, index) {

                                    layer.confirm(' &nbsp;&nbsp; &nbsp;&nbsp;是否确认删除此托盘？', {
                                        btn: ['确定','取消']
                                    }, function(){
                                        IOT.showOverlay('保存中，请稍等...');
                                        var palletCode = rowData.palletCode;
                                        IOT.getServerData(URI.BASE.PLLET.DELETE,{palletCode:palletCode},(ret) => {
                                            IOT.hideOverlay();
                                            if (ret.code === 200) {
                                                IOT.tips('保存成功！', 'success', 1000 , function () {
                                                    layer.closeAll();
                                                    M.Table.refresh.all();
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
                                operate.push(' <button class="btn btn-blue print">条码打印</button>');
                                return  operate.join(' ');
                            }
                        }
                    ]
                });
                //权限——查看
               /* if (!M.Authority.checkAuthority('unsubscribe-detail')) {
                    $(tableHookName).bootstrapTable('hideColumn', 'operate');//隐藏列
                }*/
            });
        }
    });
})();