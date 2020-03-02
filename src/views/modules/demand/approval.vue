<template>
  <div>
    <div class="queryDiv">
      <span>年度</span>
      <el-date-picker
        v-model="inputYear"
        type="year"
        placeholder="选择年">
      </el-date-picker>
      <span>地区</span>
      <el-input class="el-input1" v-model="inputArea" placeholder="请输入地区"></el-input>
      <span>名称</span>
      <el-input class="el-input1" v-model="inputName" placeholder="请输入名称"></el-input>
      <el-button @click="query" type="primary">查询</el-button>
    </div>
    <div style="margin-top: 20px">
      <el-divider content-position="left">需求信息列表</el-divider>
      <el-table
        :data="dataList"
        stripe
        v-loading="dataListLoading"
        :border="true"
        style="width: 100%">
        <el-table-column prop="index" label="序号" width="100">
          <template slot-scope="scope">
            <span>{{(pageIndex - 1) * pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dialogId" label="序号" v-if="false" width="100"/>
        <el-table-column prop="dialogName" label="需求名称" width="400"/>
        <el-table-column prop="belongArea" label="所属地区"/>
        <el-table-column prop="customLeader" label="客户负责人"/>
        <el-table-column prop="phone" label="联系电话"/>
        <el-table-column prop="submitter" label="提交人"/>
        <el-table-column prop="submitTime" label="提交时间"/>
        <el-table-column prop="approvalStatus" label="审批状态">
          <template slot-scope="scope">
            {{scope.row.approvalStatus==null?'':scope.row.approvalStatus==0?'未审批':scope.row.approvalStatus==1?'审批通过':'审批不通过'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="op"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="handleApprovalClick(scope.row)"
                       type="text" size="small">{{scope.row.approvalStatus!=0&&scope.row.approvalStatus!=null?'已审批查看详情':'审批'}}</el-button>
          </template>
          <!--:disabled="scope.row.approvalStatus!=0&&scope.row.approvalStatus!=null"-->
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
    </div>
    <approval-form :detailForm="detailFormData" :detailVisible="detailVisible" :flag="flag" z-index="10000"></approval-form>
  </div>
</template>

<script>
  import approvalForm from './approvalForm'
  export default {
    components:{
      approvalForm
    },
    data() {
      return {
        detailVisible:false,
        flag:false,
        inputYear:'2019',
        inputArea:'',
        inputName:'',
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading:false,
        detailFormData:{checkList:[],fileList:[]},
        dataList: []
      };
    },
    created(){
      this.getDataList()
    },
    methods:{
      detailViewChange(flag){
        this.detailVisible = flag
      },
      handleApprovalClick(row){
        if(row.approvalStatus==0||row.approvalStatus==null){
          this.flag = true
        }else{
          this.flag = false
        }
        this.$http({
          url: this.$http.adornUrl('/oa/oadialog/info/'+row.dialogId),
          method: 'get'
        }).then(({data})=>{
          if (data && data.code === 0) {
            this.detailFormData= data.oaDialog
            const otherRequirement = data.oaDialog.otherRequirement
            const list = otherRequirement==null?[]:otherRequirement.split(",")
            this.detailFormData.checkList = list
            const fileList = [];
            data.oaDialog.fileList.map((item,index)=>{
              fileList.push({name:item.fileName,url:''+item.fileId})
            })
            this.detailFormData.fileList = fileList;
            this.detailVisible = true
          }
        })
      },
      getDataList(){
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/oa/oadialog/noList'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'year': this.inputYear,
            'dialogName': this.inputName,
            'belongArea': this.inputArea,
          })
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
      query(){
        this.pageIndex = 1
        this.getDataList()
      },
    }
  }
</script>

<style>
  .el-input1{
    width: 12%;
  }
  .queryDiv{
    margin-top: 20px;
    margin-bottom: 20px;
  }
</style>

