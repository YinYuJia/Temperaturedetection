<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.foreignName" placeholder="请输入名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select @change="getDataList" v-model="dataForm.approvalStatus" placeholder="请选择撞他" clearable>
          <el-option value="0" label="未审批"/>
          <el-option value="1" label="审批通过"/>
          <el-option value="2" label="审批不通过"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="query">查询</el-button>
        <el-button type="primary" @click="exportHandle()" :disabled="dataListSelections.length != 1">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      @row-dblclick="tableDbClickHandle"
      style="width: 100%;">
      <el-table-column
        v-if="isAuth('oa:oarepay:delete')"
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
        prop="repayApprovalName"
        header-align="center"
        align="center"
        label="审批人">
      </el-table-column>
      <el-table-column
        prop="repayApprovalStatus"
        header-align="center"
        align="center"
        label="审批状态">
        <template slot-scope="scope">
          <span>{{scope.row.repayApprovalStatus==0?'未审批':scope.row.repayApprovalStatus==1?'审批通过':scope.row.repayApprovalStatus==2?'审批不通过':''}}</span>
        </template>
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
        prop="repayStaffName"
        header-align="center"
        align="center"
        label="随行人员"
        :show-overflow-tooltip="true"
      >
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
    <repay-info  v-if="detailVisible"  ref="repayInfo" z-index="10000"></repay-info>
  </div>
</template>

<script>
  import API from '@/api'
  import repayInfo from './repay-info'
  import isInteger from 'lodash/isInteger'
  export default {
    data () {
      return {
        dataForm: {
          foreignName: '',
          approvalStatus:'1'
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        detailVisible: false
      }
    },
    components: {
      repayInfo
    },
    activated () {
      this.getDataList()
    },
    methods: {
      tableDbClickHandle(oaRepay){
        this.handleDetailClick(oaRepay.repayId)

      },
      handleDetailClick(repayId) {
        this.detailVisible = true;
        this.$nextTick(()=>{
          this.$refs.repayInfo.init(repayId);
        })
      },
      query(){
        this.pageIndex = 1
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        var params = {
          page: this.pageIndex,
          limit: this.pageSize,
          foreignName: this.dataForm.foreignName,
          approvalStatus: this.dataForm.approvalStatus,
        }
        API.oarepay.list(params).then(({data}) => {
          if (data && data.code === 0) {
            console.log(data.page.list)
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
      exportHandle(){
        const id = this.dataListSelections[0].repayId
        if(id==null||id==''){
          return this.$message.warning("请选择一条数据导出")
        }
        const that = this
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        xhr.open('get',window.SITE_CONFIG['baseUrl']+'/oa/oarepay/export' + (isInteger(id) ? `/${id}` : ''));  //url填写后台的接口地址，如果是post，在formData append参数（参考原文地址）
        xhr.setRequestHeader("tunnel_token", this.$cookie.get("tunnel_token"));
        xhr.responseType = 'blob';
        xhr.onload = function (e) {
          if (this.status == 200&&this.response.size>0) {
            const date = new Date();
            const blob = this.response;
            const filename = that.dataListSelections[0].repayCreatePersonName+"报销单-"
              +date.getFullYear()+"-"+(date.getUTCMonth()+1)+"-"+(date.getUTCDay()+1)+".xlsx";
            if (window.navigator.msSaveOrOpenBlob) {
              navigator.msSaveBlob(blob, filename);
            } else {
              const a = document.createElement('a');
              const url = URL.createObjectURL(blob);
              a.href = url;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
            }
          }else{
            that.$message.error("下载失败")
          }
        };
        xhr.send(formData);
      },
    }
  }
</script>
