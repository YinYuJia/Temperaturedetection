<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.foreignName" placeholder="请输入事项名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="query">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      row-key="matterId"
      v-loading="dataListLoading"
      @row-dblclick="tableDbClickHandle"
      style="width: 100%;">
      <el-table-column prop="index" label="序号"
                       header-align="center"
                       align="center" width="120">
        <template slot-scope="scope">
          <!--{{scope.$index}}-->
          <!--{{pageIndex}}-->
          <!--{{pageSize}}-->
          <span>{{(pageIndex - 1) * pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="matterContent"
        header-align="center"
        align="center"
        label="事项内容"
        :show-overflow-tooltip="true"
        width="400">
      </el-table-column>
      <el-table-column
        prop="foreignName"
        header-align="center"
        align="center"
        label="业务名称"
        width="400">
      </el-table-column>
      <el-table-column
        prop="foreignTypeName"
        header-align="center"
        align="center"
        label="业务类型"
        width="80">
      </el-table-column>
      <el-table-column
        prop="matterStatusName"
        header-align="center"
        align="center"
        label="事项状态"
        width="180">
      </el-table-column>
      <el-table-column
        prop="planTime"
        header-align="center"
        align="center"
        label="计划完成时间"
        width="180">
      </el-table-column>
      <el-table-column
        prop="actualTime"
        header-align="center"
        align="center"
        label="实际完成时间"
        width="180">
      </el-table-column>
      <el-table-column
        prop="username"
        header-align="center"
        align="center"
        label="办事人">
      </el-table-column>
      <el-table-column
        prop="creatorName"
        header-align="center"
        align="center"
        label="创建人">
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
    <detail v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" z-index="10000"></detail>
  </div>
</template>

<script>
  import API from '@/api'
  import detail from './assign-own-detail'
  export default {
    data () {
      return {
        dataForm: {
          foreignName: ''
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
      detail
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
          creator:this.$store.state.user.userId,
          foreignName: this.dataForm.foreignName
        }
        API.oamatter.assignByUser(params).then(({data}) => {
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
      query(){
        this.pageIndex = 1
        this.getDataList()
      },
      // 新增 / 修改
      tableDbClickHandle (row, column, event) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(row.matterId)
        })
      },
    }
  }
</script>
