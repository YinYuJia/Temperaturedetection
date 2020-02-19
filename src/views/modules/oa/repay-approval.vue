<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="query">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @row-dblclick="tableDbClickHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column prop="index" label="序号" width="80" header-align="center" align="center">
        <template slot-scope="scope">
          <span>{{(pageIndex - 1) * pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="foreignName"
        header-align="center"
        align="center"
        label="名称"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="foreignTypeName"
        header-align="center"
        align="center"
        label="类型"
        width="80">
      </el-table-column>
      <el-table-column
        prop="repayStaffName"
        header-align="center"
        align="center"
        label="随行人员">
      </el-table-column>
      <el-table-column
        prop="repayApprovalName"
        header-align="center"
        align="center"
        label="审批人">
      </el-table-column>
      <el-table-column
        prop="repayCreatePersonName"
        header-align="center"
        align="center"
        label="创建人">
      </el-table-column>
      <el-table-column
        prop="repayCreateTime"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="repayApprovalStatusName"
        header-align="center"
        align="center"
        label="审批状态">
      </el-table-column>
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
    <apprvoal v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" z-index="10000"></apprvoal>
  </div>
</template>

<script>
  import API from '@/api'
  import apprvoal from './repay-approval-detail'
  export default {
    data () {
      return {
        dataForm: {
          key: ''
        },
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
      apprvoal
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
          key: this.dataForm.key
        }
        API.oarepay.noList(params).then(({data}) => {
          if (data && data.code === 0) {
            data.page.list.map((item,index)=>{
              item.dialogName = item.dialogName==null?item.projectName:item.dialogName
            })
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
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
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      query(){
        this.pageIndex = 1
        this.getDataList()
      },
      detailViewChange(flag){
        this.addOrUpdateVisible = flag
      },
      approvalHandle (row) {
        if(row.repayApprovalStatus!='0'){
          this.$message.error("该条信息已审核")
        }else{
          this.addOrUpdateVisible = true
          this.$nextTick(() => {
            if(row.repayApprovalStatus!=0){
              this.$refs.addOrUpdate.showApproval = false
            }else{
              this.$refs.addOrUpdate.showApproval = true
            }
            this.$refs.addOrUpdate.init(row.repayId)
          })
        }
      },
      tableDbClickHandle(row, column, event){
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          if(row.repayApprovalStatus!=0){
            this.$refs.addOrUpdate.showApproval = false
          }else{
            this.$refs.addOrUpdate.showApproval = true
          }
          this.$refs.addOrUpdate.init(row.repayId)
        })
      }
    }
  }
</script>
