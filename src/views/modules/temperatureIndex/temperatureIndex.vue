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
                                <p class="P2">{{constList.counts}}</p>
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
                                <p class="P2">{{constList.jk}}</p>
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
                                <p class="P2">{{constList.hb}}</p>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </header>
        <div style="position: relative">
            <div id="temperatureEchart" style="width:100%;height:300px">
            </div>
            <div class="sel">
                <el-form :inline="true" :model="dataForm">
                    <el-form-item>
                        <el-date-picker v-model="dataForm.value1" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="dataForm.region" placeholder="请选择人员">
                            <el-option v-for="item in option" :key="item.index" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
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
                constList: {
                    counts: "",
                    hb: "",
                    jk: "",
                },
                option: [],
                dataForm: {
                    value1: ["2020-02-06", "2020-03-06"],
                    region: ""
                },
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
                echartForm: {
                    echartsListX: [],
                    echartsListY: [],
                }
            }
        },
        activated() {
            this.getDataList();
            this.getPersonInfoList();
            console.log(this.getBeforeDate(7))
            this.dataForm.value1 = [this.getBeforeDate(7),this.getBeforeDate(0)]
        },
        created() {
            
        },
        watch: {
            dataForm: {
                handler(newVal, oldVal) {
                    console.log("---------", newVal)
                    if (newVal.value1.length != 0) {
                        this.getEchartList(newVal)
                    }
                },
                deep: true
            },
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
            getBeforeDate(n) {
                var n = n;
                var d = new Date();
                var year = d.getFullYear();
                var mon = d.getMonth() + 1;
                var day = d.getDate();
                if (day <= n) {
                    if (mon > 1) {
                        mon = mon - 1;
                    } else {
                        year = year - 1;
                        mon = 12;
                    }
                }
                d.setDate(d.getDate() - n);
                year = d.getFullYear();
                mon = d.getMonth() + 1;
                day = d.getDate();
                
                let s = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
                return s;
            },
            getEchartList(data) {
                console.log("有参数 可以请求", data)
                this.$http({
                    url: this.$http.adornUrl('/sys/healthstatistics/queryListByCreatTimeAndId'),
                    method: 'get',
                    params: this.$http.adornParams({
                        memberid: data.region,
                        startTime: data.value1[0] + " 00:00:00",
                        endTime: data.value1[1] + " 23:59:59",
                    })
                }).then(({
                    data
                }) => {
                    if (data && data.code === 0) {
                        console.log("echart返回参数----------", data)
                        this.echartForm.echartsListX = data.map.listX
                        this.echartForm.echartsListY = data.map.listY
                        this.temP()
                    } else {}
                })
            },
            getPersonInfoList() {
                this.$http({
                    url: this.$http.adornUrl('/sys/member/queryListBycf'),
                    method: 'get',
                    params: this.$http.adornParams()
                }).then(({
                    data
                }) => {
                    if (data && data.code === 0) {
                        console.log("返回参数----------", data)
                        this.option = data.memberEntities
                        this.dataForm.region = data.memberEntities[0].id
                    } else {}
                })
            },
            getDataList() {
                this.$http({
                    url: this.$http.adornUrl('/sys/member/queryAllCounts'),
                    method: 'get',
                    params: this.$http.adornParams()
                }).then(({
                    data
                }) => {
                    if (data && data.code === 0) {
                        this.constList = data.map
                    } else {}
                })
            },
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
                        data: this.echartForm.echartsListX
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
                        data: this.echartForm.echartsListY,
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
    .sel {
        position: absolute;
        z-index: 99999;
        right: 0;
        top: 0
    }
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