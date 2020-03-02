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
                <p>异常人数（人）</p>
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
            <el-date-picker v-model="dataForm.value1" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="daterange"
              range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-select v-model="dataForm.region" placeholder="请选择人员">
              <el-option v-for="item in option" :key="item.index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <!-- <el-button @click="exportExcle()">导出</el-button> -->
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="Table">
      <span class="TableInfo">实时预警数据</span>
      <div class="Table_time">
        <el-form :inline="true" :model="dataFormYuJing">
          <el-form-item>
            <el-date-picker v-model="dataFormYuJing.value1" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <el-table :row-class-name="tableRowClassName" :cell-class-name="cellStyle" class="Table_time_form"
        :data="dataList" border @selection-change="selectionChangeHandle" style="width: 100%;height:285px">
        <el-table-column prop="membername" header-align="center" align="center" min-width="130" label="姓名">
        </el-table-column>
        <el-table-column prop="amtemperature" header-align="center" align="center" style="color:red"
          :formatter="amtemperatureFormatter" min-width="130" label="上午测温">
        </el-table-column>
        <el-table-column prop="pmtemperature" header-align="center" align="center" :formatter="pmtemperatureFormatter"
          min-width="130" label="下午测温">
        </el-table-column>
        <el-table-column prop="creattime" header-align="center" align="center" min-width="130"
          :formatter="creattimeFormatter" label="预警时间">
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
          value1: [],
          region: ""
        },
        dataFormYuJing: {
          value1: [],
        },
        tem: null,
        dataList: [],
        echartForm: {
          echartsListX: [],
          echartsListY: [],
        }
      }
    },
    activated() {
      this.getDataList();
      this.getPersonInfoList();
      this.dataForm.value1 = [this.getBeforeDate(7), this.getBeforeDate(0)]
      this.dataFormYuJing.value1 = [this.getBeforeDate(7), this.getBeforeDate(0)]
    },
    watch: {
      dataForm: {
        handler(newVal, oldVal) {
          if (newVal.value1.length != 0) {
            this.getEchartList(newVal)
          }
        },
        deep: true
      },
      dataFormYuJing: {
        handler(newVal, oldVal) {
          this.dataFormYuJingList(newVal)
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
      creattimeFormatter(val) {
        return val.creattime.split(" ")[0]
      },
      amtemperatureFormatter(val) {
        if (val.amtemperature == null) {
          return "未监测"
        } else {
          return val.amtemperature + "℃"
        }
      },
      pmtemperatureFormatter(val) {
        if (val.pmtemperature == null) {
          return "未监测"
        } else {
          return val.pmtemperature + "℃"
        }
      },
      dataFormYuJingList(data) {
        this.$http({
          url: this.$http.adornUrl('/sys/healthstatistics/queryListForTunusual'),
          method: 'get',
          params: this.$http.adornParams({
            startTime: data.value1[0] + " 00:00:00",
            endTime: data.value1[1] + " 23:59:59",
          })
        }).then(({
          data
        }) => {
          if (data && data.code === 0) {
            this.dataList = data.map.tunusualinfo
          } else {}
        })
      },
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
      exportExcle() {
        // 导出excle
        console.log(this.option)
        let temp = ""
        this.option.map((item, index) => {
          if (this.dataForm.region == item.id) {
            temp = item.name
          }
        })

        console.log(temp)
        this.$http({
          url: this.$http.adornUrl('/sys/healthstatistics/excel'),
          method: 'get',
          params: this.$http.adornParams({
            membername: temp,
            startTime: this.dataForm.value1[0] + " 00:00:00",
            endTime: this.dataForm.value1[1] + " 23:59:59",
          })
        }).then(({
          data
        }) => {
          if (data && data.code === 0) {
            console.log("-----", data)
          } else {}
        })
      },
      getEchartList(data) {
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
      cellStyle({
        row,
        column,
        rowIndex,
        columnIndex
      }) {
        if (columnIndex == 2) {
          if (row.pmtemperature > 37.3) {
            return 'cellStyle-red';
          }
        } else if (columnIndex == 1) {
          if (row.amtemperature > 37.3) {
            return 'cellStyle-red';
          }
        }
      },
      selectionChangeHandle(val) {},
      temP() {
        let myChart = echarts.init(document.getElementById("temperatureEchart"))
        let option = {
          title: {
            text: '健康统计图'
          },
          tooltip: {
            trigger: 'axis',
            formatter: '{b0}<br />温度:  {c0}℃',
            axisPointer: {
              type: 'cross',

              label: {
                backgroundColor: '#0f0'
              }
            }
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
            data: this.echartForm.echartsListX,
            // axisLabel: {
            //   interval: 0,
            //   rotate: 40
            // }
          }],
          yAxis: [{
            type: 'value',
            min: function (value) {
              return 35.5;
            },

          }],
          series: [{
            name: '温度',
            smooth: true, //true 为平滑曲线，false为直线
            type: 'line',
            stack: '总量',
            areaStyle: {},
            data: this.echartForm.echartsListY,
            color: '#8cd5c2' //改变区域颜色
          }, ]
        };
        myChart.setOption(option)
        setTimeout(function () {
          window.onresize = function () {
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

  .el-table .cellStyle-red {
    color: red;
  }

  .temperature {
    padding: 5px 20px;
  }

  .el-table .cellStyle-row {
    background: #f7faff;
  }

  .el-table .success-row {
    background: #ebf1fb;
  }

  .Table {
    margin-top: 15px;
    position: relative;
    border-top: 1px solid transparent;
  }

  .TableInfo {
    font-size: 20px;
    font-weight: 700;
    color: rgba(0, 0, 0, .9);
  }

  .Table_time {
    position: absolute;
    height: 35px;
    z-index: 99999;
    top: 0;
    right: 0;
  }

  .Table_time_form {
    margin-top: 45px;
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
