<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.projectName" placeholder="请输入项目名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="query">查询</el-button>
        <el-button v-if="isAuth('oa:oainvoicei:save')" type="primary" @click="addOrUpdateHandle()" >新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
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
        prop="invoiceiInfo"
        header-align="center"
        align="center"
        label="开票信息"
        :show-overflow-tooltip="true"
        >
      </el-table-column>
      <el-table-column
        prop="projectName"
        header-align="center"
        align="center"
        label="项目名称"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        prop="invoiceiTime"
        header-align="center"
        align="center"
        label="开票时间">
      </el-table-column>
      <el-table-column
        prop="invoiceiUnit"
        header-align="center"
        align="center"
        label="开票单位"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="invoiceiAmount"
        header-align="center"
        align="center"
        label="金额">
      </el-table-column>
      <el-table-column
        prop="contractAmount"
        header-align="center"
        align="center"
        label="合同金额">
      </el-table-column>
      <el-table-column
        prop="invoiceiPercent"
        header-align="center"
        align="center"
        label="开票百分比">
      </el-table-column>
      <el-table-column
        prop="planTime"
        header-align="center"
        align="center"
        label="预计回款时间">
      </el-table-column>
      <el-table-column
        prop="actualTime"
        header-align="center"
        align="center"
        label="实际回款时间">
      </el-table-column>
      <el-table-column
        prop="creatorName"
        header-align="center"
        align="center"
        label="创建人">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text"  size="small" @click="addOrUpdateHandle(scope.row.invoiceiId)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.invoiceiId)">删除</el-button>
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
    <invoicei-title v-if="detailVisible"  ref="invoiceiTitle" z-index="10000"></invoicei-title>
  </div>
</template>

<script>
  import API from '@/api'
  import AddOrUpdate from './invoicei-add-or-update'
  import invoiceiTitle from './invoicei-info'
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
      AddOrUpdate,
      invoiceiTitle
    },
    activated () {
      this.getDataList()
    },
    methods: {
      tableDbClickHandle(oaInvoicei){
        this.handleDetailClick(oaInvoicei.invoiceiId)
        
      },
      handleDetailClick(invoiceiId) {
        this.detailVisible = true;
        this.$nextTick(()=>{
          this.$refs.invoiceiTitle.init(invoiceiId);
        })
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        var params = {
          page: this.pageIndex,
          limit: this.pageSize,
          projectName: this.dataForm.projectName
        }
        API.oainvoicei.list(params).then(({data}) => {
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
      query(){
        this.pageIndex = 1
        this.getDataList()
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.invoiceiId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          API.oainvoicei.del(ids).then(({data}) => {
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
