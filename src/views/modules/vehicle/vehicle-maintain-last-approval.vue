<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.vehicleType" placeholder="请输入车型" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="query">查询</el-button>
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
        prop="vehicleMaintainId"
        header-align="center"
        align="center"
        label="车辆保养申请ID">
      </el-table-column> -->
      <el-table-column
        prop="vehicleType"
        header-align="center"
        align="center"
        label="车型">
      </el-table-column>
      <el-table-column
        prop="time"
        header-align="center"
        align="center"
        label="时间">
      </el-table-column>
      <el-table-column
        prop="mileage"
        header-align="center"
        align="center"
        label="里程数">
      </el-table-column>
      <!-- <el-table-column
        prop="agentName"
        header-align="center"
        align="center"
        label="经办人">
      </el-table-column> -->
      <el-table-column
        prop="agentName"
        header-align="center"
        align="center"
        label="经办人姓名">
      </el-table-column>
      <el-table-column
        prop="item"
        header-align="center"
        align="center"
        label="保养/请修项目">
      </el-table-column>
      <el-table-column
        prop="budgetAmount"
        header-align="center"
        align="center"
        label="预算金额">
      </el-table-column>
      <el-table-column
        prop="repairDepot"
        header-align="center"
        align="center"
        label="修理厂">
      </el-table-column>
      <el-table-column
        prop="damageReason"
        header-align="center"
        align="center"
        label="损坏原因">
      </el-table-column>
      <el-table-column
        prop="approvalStatusName"
        header-align="center"
        align="center"
        label="审批状态">
      </el-table-column>
      <el-table-column
        prop="firstName"
        header-align="center"
        align="center"
        label="初审人">
      </el-table-column>
      <!-- <el-table-column
        prop="lastName"
        header-align="center"
        align="center"
        label="终审人">
      </el-table-column> -->
      <!-- <el-table-column
        prop="creator"
        header-align="center"
        align="center"
        label="创建人">
      </el-table-column>
      <el-table-column
        prop="creatorName"
        header-align="center"
        align="center"
        label="创建人姓名">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column> -->
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="approvalHandle(scope.row)">审批</el-button>
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
    <approval v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></approval>
  </div>
</template>

<script>
  import API from '@/api'
  import approval from './vehicle-maintain-last-approval-detail'
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
        addOrUpdateVisible: false,
        approvalStatus: "1,3,4"
      }
    },
    components: {
      approval
    },
    activated () {
      this.getDataList()
    },
    methods: {

    
      qiche(id){
         this.$nextTick(()=>{
          this.$refs.vehicleMaintainInfo.queryVehicle(id);
        })
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        var params = {
          page: this.pageIndex,
          limit: this.pageSize,
          approvalStatus: this.approvalStatus,
          vehicleType: this.dataForm.vehicleType
        }
        API.oavehiclemaintain.list(params).then(({data}) => {
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
      // 查询
      query(){
        this.pageIndex = 1
        this.getDataList()
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
     



detailViewChange(flag){ 
        this.addOrUpdateVisible = flag
      },
      approvalHandle (row) {
        if(row.approvalStatus!='1'){
          this.$message.warning("该条信息已审核")
        }else{
          this.addOrUpdateVisible = true
          this.$nextTick(() => {
            if(row.approvalStatus!=1){
              this.$refs.addOrUpdate.showApproval = false
            }else{
              this.$refs.addOrUpdate.showApproval = true
            }
            this.$refs.addOrUpdate.init(row.vehicleMaintainId)
          })
        }
      },
      tableDbClickHandle(row, column, event){
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          if(row.approvalStatus!=1){
            this.$refs.addOrUpdate.showApproval = false
          }else{
            this.$refs.addOrUpdate.showApproval = true
          }
          this.$refs.addOrUpdate.init(row.vehicleMaintainId)
        })
      }






     
    }
  }
</script>
