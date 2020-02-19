<template>
  <div class="mod-config">
    <el-form :disabled="!flag" :inline="true">
      <el-form-item>
        <el-button @click="addFood()" type="primary">加班订餐</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
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
        prop="foodPerson"
        header-align="center"
        align="center"
        label="用户名">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="类型">
        <template slot-scope="scope">
          加班订餐
        </template>
      </el-table-column>
      <el-table-column
        prop="foodTime"
        header-align="center"
        align="center"
        label="日期">
      </el-table-column>
      <el-table-column
        v-if="flag"
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="deleteHandle(scope.row.foodId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[ 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
  import http from '@/utils/httpRequest.js'
  export default {
    data () {
      return {
        flag:false,
        dataList: [],
        pageIndex: 1,
        pageSize: 20,
        totalPage: 0,
        dataListLoading: false,
        detailVisible : false,
      }
    },
    created(){
      this.flag = 15<=(new Date().getHours())&&(new Date().getHours())<17
      this.getDataList()
    },
    methods: {
      addFood(){
        const params = {
          'foodPerson': this.$store.state.user.name,
        }
        http({
          url: http.adornUrl('/oa/oafood/save'),
          method: 'post',
          data: http.adornData(params)
        }).then(({data})=>{
          if(data.code==0){
            this.$message.success('添加成功')
            this.getDataList()
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      deleteHandle(id){
        const foodIds = []
        foodIds.push(id)
        this.$confirm(`确定进行删除操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          http({
            url: http.adornUrl('/oa/oafood/delete'),
            method: 'post',
            data: foodIds
          }).then(({data})=>{
            if(data.code == 0){
              this.$message.success('删除成功')
              this.getDataList()
            }else{
              this.$message.error(data.msg)
            }
          })
        })
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        var params = {
          page: this.pageIndex,
          limit: this.pageSize,
        }
        http({
          url: http.adornUrl('/oa/oafood/list'),
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
    }
  }
</script>
