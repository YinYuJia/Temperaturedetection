<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.userName" placeholder="请输入用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="query" type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @row-dblclick="tableDbClickHandle"
      style="width: 100%;">
      <el-table-column prop="index" 
                       label="序号" 
                       width="80" 
                       header-align="center" 
                       align="center">
        <template slot-scope="scope">
          <span>{{(pageIndex - 1) * pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="scoreValue"
        header-align="center"
        align="center"
        label="信用分值">
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
    <score-info v-if="detailVisible"  ref="scoreInfo" z-index="10000"></score-info>
  </div>
</template>

<script>
import http from '@/utils/httpRequest.js'
import API from '@/api'
import scoreInfo from './score-info'
  export default {
    data () {
      return {
        dataForm: {
          userName: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        detailVisible : false,
        scoreId : ''
        // addOrUpdateVisible: false
      }
    },
    components: {
      scoreInfo
    },
    created(){
        this.getDataList()
    },
   
    // activated () {
    //   this.getDataList()
    // },
    methods: {
      tableDbClickHandle(oaScore){
        this.detailVisible = true;
        this.handleDetailClick(oaScore.scoreId)
      },
      handleDetailClick(scoreId) {
        this.detailVisible = true;
        this.$nextTick(()=>{
          this.$refs.scoreInfo.init(scoreId);
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
          userName: this.dataForm.userName,
        }
        http({
            url: http.adornUrl('/oa/oascore/list'),
            method: 'get',
            params: http.adornParams(params, 'get')
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
      // 多选
     
      // 新增 / 修改
      
      // 删除
     
    }
  }
</script>
