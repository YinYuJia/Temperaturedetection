<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.vehicleType" placeholder="请输入车型" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="query">查询</el-button>
        <el-button v-if="isAuth('oa:oavehicletravel:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      @row-dblclick="tableDbClickHandle"
      style="width: 100%;">
      <el-table-column prop="index" label="序号" width="80" header-align="center" align="center">
        <template slot-scope="scope">
          <span>{{(pageIndex - 1) * pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="vehicleTravelId"
        header-align="center"
        align="center"
        label="车辆行驶单ID"
        width="110"
        >
      </el-table-column> -->
      <!-- <el-table-column
        prop="vehicleId"
        header-align="center"
        align="center"
        label="车辆ID">
      </el-table-column> -->
      <el-table-column
        prop="vehicleApplyName"
        header-align="center"
        align="center"
        label="申请描述"
        width="110"
        
        >
      </el-table-column>
      <el-table-column
        prop="reason"
        header-align="center"
        align="center"
        label="用车事由"
        width="80"
        >
      </el-table-column>
      <el-table-column
        prop="startNumber"
        header-align="center"
        align="center"
        label="起始公里表数"
        width="80"
        >
      </el-table-column>
      <el-table-column
        prop="endNumber"
        header-align="center"
        align="center"
        label="返回公里表数"
        width="80"
        
        >
      </el-table-column>
      <el-table-column
        prop="driverMileage"
        header-align="center"
        align="center"
        label="行驶里程数">
      </el-table-column>
      <el-table-column
        prop="highCost"
        header-align="center"
        align="center"
        label="高速费用">
      </el-table-column>
      <el-table-column
        prop="topCost"
        header-align="center"
        align="center"
        label="停车费用">
      </el-table-column>
      <el-table-column
        prop="oilCost"
        header-align="center"
        align="center"
        label="加油费用">
      </el-table-column>
      <el-table-column
        prop="otherCost"
        header-align="center"
        align="center"
        label="其他费用">
      </el-table-column>
      <el-table-column
        prop="surplus"
        header-align="center"
        align="center"
        label="加油时剩余油量">
      </el-table-column>
      <el-table-column
        prop="fuelAmount"
        header-align="center"
        align="center"
        label="加油量">
      </el-table-column>
      <el-table-column
        prop="oilCardBalance"
        header-align="center"
        align="center"
        label="油卡余额">
      </el-table-column>
      <el-table-column
        prop="cash"
        header-align="center"
        align="center"
        label="现金加油">
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="备注">
      </el-table-column>
      <!-- <el-table-column
        prop="creator"
        header-align="center"
        align="center"
        label="创建人">
      </el-table-column> -->
      <el-table-column
        prop="creatorName"
        header-align="center"
        align="center"
        label="创建人姓名"
        width="100"
        
        >
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="创建时间"
        width="160"
        >
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="90"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.vehicleTravelId,scope.row.vehicleApplyId)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.vehicleTravelId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <vehicle-travel-info v-if="detailVisible"  ref="vehicleTravelInfo" z-index="10000"></vehicle-travel-info>
  </div>
</template>

<script>
  import API from '@/api'
  import AddOrUpdate from './vehicle-travel-add-or-update'
  import vehicleTravelInfo from './vehicle-travel-info'
  export default {
    data () {
      return {
        dataForm: {
          vehicleType: ''
        },
        detailVisible: false,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate,
      vehicleTravelInfo
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        var params = {
          page: this.pageIndex,
          limit: this.pageSize,
          vehicleType: this.dataForm.vehicleType
        }
        API.oavehicletravel.list(params).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
       // 双击弹窗
      tableDbClickHandle(oavehicletravel){
        this.handleDetailClick(oavehicletravel.vehicleTravelId)
        this.queryVehicle(oavehicletravel.vehicleApplyId)  
      },
      handleDetailClick(vehicleTravelId) {
        this.detailVisible = true;
        this.$nextTick(()=>{
          this.$refs.vehicleTravelInfo.init(vehicleTravelId);
        })
      },
      queryVehicle(vehicleApplyId) {
        // this.detailVisible = true;
        this.$nextTick(()=>{
          // this.$refs.vehicleTravelInfo.init(vehicleTravelId);
          this.$refs.vehicleTravelInfo.queryVehicleApply(vehicleApplyId);
        })
      },
       // 查询
      query() {
        this.pageIndex = 1;
        this.getDataList();
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id,vehicleApplyId) {
        this.addOrUpdateVisible = true
        this.$nextTick(()=>{
          this.$refs.addOrUpdate.getVehicleData()
        })
        this.$nextTick(()=>{
          this.$refs.addOrUpdate.queryVehicleApply(vehicleApplyId)
        })
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.vehicleTravelId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          API.oavehicletravel.del(ids).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    }
  }
</script>
