<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.journalContent" placeholder="请输入日志内容" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="query">查询</el-button>
        <el-button v-if="isAuth('oa:oajournal:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('oa:oajournal:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column prop="index"
                       header-align="center"
                       align="center" label="序号" width="80">
        <template slot-scope="scope">
          <!--{{scope.$index}}-->
          <!--{{pageIndex}}-->
          <!--{{pageSize}}-->
          <span>{{(pageIndex - 1) * pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="foreignName"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="关联名称">
      </el-table-column>
      <el-table-column
        prop="foreignTypeName"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        width="120"
        label="关联类型">
      </el-table-column>
      <el-table-column
        prop="journalContent"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="日志内容">
      </el-table-column>
      <el-table-column
        prop="coordinate"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="需要协调的内容">
      </el-table-column>
<!--      <el-table-column-->
<!--        prop="creatorName"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        label="创建人"-->
<!--        width="150">-->
<!--      </el-table-column>-->
      <el-table-column
        prop="journalTime"
        header-align="center"
        align="center"
        label="日志时间"
        width="150">
      </el-table-column>
<!--      <el-table-column-->
<!--        prop="createTime"-->
<!--        header-align="center"-->
<!--        align="center"-->
<!--        label="创建时间"-->
<!--        width="200">-->
<!--      </el-table-column>-->
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('oa:oajournal:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.journalId)">修改</el-button>
          <el-button v-if="isAuth('oa:oajournal:delete')" type="text" size="small" @click="deleteHandle(scope.row.journalId)">删除</el-button>
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" z-index="10000"></add-or-update>
    <detail v-if="detailVisible" ref="detail" z-index="10000"></detail>
  </div>
</template>

<script>
  import API from '@/api'
  import AddOrUpdate from './journal-add-or-update'
  import detail from './journal-detail'
  export default {
    data () {
      return {
        dataForm: {
          journalContent: ''
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
      AddOrUpdate,
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
          journalContent: this.dataForm.journalContent,
          creator:this.$store.state.user.userId
        }
        API.oajournal.list(params).then(({data}) => {
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
      tableDbClickHandle(row){
        this.detailVisible = true
        this.$nextTick(() => {
          this.$refs.detail.init(row.journalId)
        })
      },
      query(){
        this.pageIndex = 1
        this.getDataList()
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.journalId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          API.oajournal.del(ids).then(({data}) => {
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
