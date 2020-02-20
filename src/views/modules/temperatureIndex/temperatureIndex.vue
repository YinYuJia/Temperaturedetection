<template>
    <div class="temperature">
        <header>
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="grid-content bg-purple-left">
                        <div class="cella">
                            <div class="img"></div>
                            <div class="info">
                                <p>总人数（人）</p>
                                <p class="P2">132</p>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple-center">
                        <div class="cella">
                            <div class="img"></div>
                            <div class="info">
                                <p>健康人数（人）</p>
                                <p class="P2">132</p>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple-light">
                        <div class="cella">
                            <div class="img"></div>
                            <div class="info">
                                <p>思病人数（人）</p>
                                <p class="P2">132</p>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </header>
        <div id="temperatureEchart" style="width:100%;height:300px;">
        </div>
        <div class="Table">
            <el-table :row-class-name="tableRowClassName" :data="dataList" border @selection-change="selectionChangeHandle" style="width: 100%;height:350px">
                <el-table-column prop="name" header-align="center" align="center" min-width="130" label="姓名">
                </el-table-column>
                <el-table-column prop="am" header-align="center" align="center" min-width="130" label="上午测温">
                </el-table-column>
                <el-table-column prop="amTime" header-align="center" align="center" min-width="130" label="上午测温时间">
                </el-table-column>
                <el-table-column prop="date" header-align="center" align="center" min-width="130" label="预警时间">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import echarts from "echarts"
    export default {
        data() {
            return {
                // tableRowClassName({row,index}) {
                // if(index%3==1) {
                //     return "successRow"
                // }else{
                //     return "successRow1"
                // }
                // },
                tem: null,
                dataList: [{
                        name: "张三1",
                        am: "36.5℃",
                        amTime: "09:10",
                        bm: "36.5℃",
                        bmTime: "09:10",
                        date: "2020-02-02",
                        id: 1
                    },
                    {
                        name: "张三2",
                        am: "36.5℃",
                        amTime: "09:10",
                        bm: "36.5℃",
                        bmTime: "09:10",
                        date: "2020-02-02",
                        id: 2
                    },
                    {
                        name: "张三3",
                        am: "36.5℃",
                        amTime: "09:10",
                        bm: "36.5℃",
                        bmTime: "09:10",
                        date: "2020-02-02",
                        id: 3
                    }, {
                        name: "张三4",
                        am: "36.5℃",
                        amTime: "09:10",
                        bm: "36.5℃",
                        bmTime: "09:10",
                        date: "2020-02-02",
                        id: 4
                    }, {
                        name: "张三5",
                        am: "36.5℃",
                        amTime: "09:10",
                        bm: "36.5℃",
                        bmTime: "09:10",
                        date: "2020-02-02",
                        id: 5
                    }, {
                        name: "张三6",
                        am: "36.5℃",
                        amTime: "09:10",
                        bm: "36.5℃",
                        bmTime: "09:10",
                        date: "2020-02-02",
                        id: 6
                    }, {
                        name: "张三7",
                        am: "36.5℃",
                        amTime: "09:10",
                        bm: "36.5℃",
                        bmTime: "09:10",
                        date: "2020-02-02",
                        id: 7
                    }, {
                        name: "张三8",
                        am: "36.5℃",
                        amTime: "09:10",
                        bm: "36.5℃",
                        bmTime: "09:10",
                        date: "2020-02-02",
                        id: 8
                    }, {
                        name: "张三9",
                        am: "36.5℃",
                        amTime: "09:10",
                        bm: "36.5℃",
                        bmTime: "09:10",
                        date: "2020-02-02",
                        id: 9
                    }, {
                        name: "张三10",
                        am: "36.5℃",
                        amTime: "09:10",
                        bm: "36.5℃",
                        bmTime: "09:10",
                        date: "2020-02-02",
                        id: 10
                    },
                ],
            }
        },
        mounted() {
            this.temP()
            this.tem = setInterval(() => {
                this.dataList.push(this.dataList[0]); //把第一条数据插入数组最有一条
                this.dataList.shift(); //删除数组中第一条数据
            }, 2000);
        },
        beforeDestroy() {
            clearInterval(this.tem);
            this.tem = null;
        },
        methods: {
            tableRowClassName({
                row,
                rowIndex
            }) {
                if (rowIndex % 2 == 1) {
                    return 'warning-row';
                } else {
                    return 'success-row';
                }
            },
            selectionChangeHandle(val) {},
            temP() {
                let myChart = echarts.init(document.getElementById("temperatureEchart"))
                let option = {
                    title: {
                        text: '健康统计图'
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [{
                        type: 'category',
                        boundaryGap: false,
                        data: ['02/01', '02/02', '02/03', '02/04', '02/05', '02/06', '02/07', '02/08', '02/09', '02/10']
                    }],
                    yAxis: [{
                        type: 'value'
                    }],
                    series: [{
                        name: '邮件营销',
                        smooth: true, //true 为平滑曲线，false为直线
                        type: 'line',
                        stack: '总量',
                        areaStyle: {},
                        data: [120, 132, 101, 134, 90, 230, 210, 120, 132, 101],
                        color: '#8cd5c2' //改变区域颜色
                    }, ]
                };
                myChart.setOption(option)
                setTimeout(function() {
                    window.onresize = function() {
                        myChart.resize();
                    }
                }, 200)
            }
        }
    }
</script>

<style>
    .temperature {
        padding: 5px 20px;
    }
    .el-table .warning-row {
        background: #f7faff;
    }
    .el-table .success-row {
        background: #ebf1fb;
    }
    .Table {
        margin-top: 15px;
    }
    .el-row {
        margin-bottom: 20px;
    }
    .el-col {
        border-radius: 7px;
    }
    .bg-purple-dark {
        background: #99a9bf;
    }
    .bg-purple-left {
        background: #409EFF;
    }
    .bg-purple-center {
        background: #67C23A;
    }
    .bg-purple-light {
        background: #F56C6C;
    }
    .grid-content {
        border-radius: 7px;
        min-height: 36px;
        height: 130px;
        position: relative;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
    .cella {
        height: 60px;
        width: 70%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .img {
        height: 40px;
        width: 40px;
        background-color: #0f0;
        position: absolute;
        top: 50%;
        left: 10px;
        transform: translateY(-50%);
    }
    .info {
        height: 40px;
        width: 70%;
        color: #fff;
        position: absolute;
        top: 50%;
        left: 60px;
        transform: translateY(-50%);
    }
    .info p {
        margin-top: 5px;
        line-height: 10px;
    }
    .P2 {
        font-size: 20px;
    }
</style>