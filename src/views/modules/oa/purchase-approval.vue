<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.projectName" placeholder="请输入项目名称" clearable></el-input>
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
      <el-table-column prop="index"
                       header-align="center"
                       align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span>{{(pageIndex - 1) * pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="purchaseName"
        header-align="center"
        align="center"
        label="采购名称"
        :show-overflow-tooltip="true"
        width="300"
      >
      </el-table-column>
      <el-table-column
        prop="projectName"
        header-align="center"
        align="center"
        label="项目名称"
        :show-overflow-tooltip="true"
        width="300"
      >
      </el-table-column>
      <el-table-column
        prop="purchaseTime"
        header-align="center"
        align="center"
        label="采购时间">
      </el-table-column>
      <el-table-column
        prop="count"
        header-align="center"
        align="center"
        label="采购金额">
      </el-table-column>
      <el-table-column
        prop="invoiceStatus"
        header-align="center"
        align="center"
        label="发票情况">
        <template slot-scope="scope">
          {{scope.row.invoicesStatus == 1 ? '已开票':'未开票'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="approvalStatusName"
        header-align="center"
        align="center"
        label="审批状态">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="创建时间"
        width="230"
      >
      </el-table-column>
      <el-table-column
        prop="creatorName"
        header-align="center"
        align="center"
        label="创建人">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text"  size="small" @click="approvalHandle(scope.row)">审批</el-button>
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
    <purchase-title v-if="detailVisible"  ref="purchaseTitle" z-index="10000"></purchase-title>
  </div>
</template>

<script>
  import API from '@/api'
  import purchaseTitle from './purchase-approval-detail'
  export default {
    data () {
      return {
        dataForm: {
          projectName: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        detailVisible: false
      }
    },
    components: {
      purchaseTitle
    },

    created () {
      this.getDataList()
    },
    methods: {
      approvalHandle (row) {
        if(row.approvalStatus!='0'){
          this.$message.error("该条信息已审核")
        }else{
          this.detailVisible = true
          this.$nextTick(() => {
            if(row.approvalStatus!=0){
              this.$refs.purchaseTitle.showApproval = false
            }else{
              this.$refs.purchaseTitle.showApproval = true
            }
            this.$refs.purchaseTitle.init(row.purchaseId)
          })
        }
      },
      tableDbClickHandle(oapurchase){
        this.handleDetailClick(oapurchase)
      },
      handleDetailClick(oapurchase) {
        this.detailVisible = true;
        this.$nextTick(()=>{
          if(oapurchase.approvalStatus!=0){
            this.$refs.purchaseTitle.showApproval = false
          }else{
            this.$refs.purchaseTitle.showApproval = true
          }
          this.$refs.purchaseTitle.init(oapurchase.purchaseId);
          this.$refs.purchaseTitle.getFileList(oapurchase.purchaseId)
        })
      },
      getDataList() {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/oa/oapurchase/list'),
          method: 'get',
        }).then(({data}) => {
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
      //  查询
      query() {
        this.pageIndex = 1;
        this.getDataList();
      },
    }
  }
</script>
