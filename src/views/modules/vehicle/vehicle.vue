<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.vehicleType" placeholder="请输入车型" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="query">查询</el-button>
        <el-button v-if="isAuth('oa:oavehicle:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
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
      <el-table-column
        prop="vehicleType"
        header-align="center"
        align="center"
        label="车型">
      </el-table-column>
      <el-table-column
        prop="plate"
        header-align="center"
        align="center"
        label="车牌">
      </el-table-column>
      <!-- <el-table-column
        prop="commissioner"
        header-align="center"
        align="center"
        label="专管员">
      </el-table-column> -->
      <el-table-column
        prop="commissionerName"
        header-align="center"
        align="center"
        label="专管员姓名">
      </el-table-column>
      <el-table-column
        prop="oilCard"
        header-align="center"
        align="center"
        label="油卡">
      </el-table-column>
      <el-table-column
        prop="etc"
        header-align="center"
        align="center"
        label="ETC">
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="备注"
        :show-overflow-tooltip="true"
        >
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.vehicleId)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.vehicleId)">删除</el-button>
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
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <vehicle-info v-if="detailVisible"  ref="vehicleInfo" z-index="10000"></vehicle-info>
  </div>
</template>

<script>
  import API from '@/api'
  import AddOrUpdate from './vehicle-add-or-update'
  import vehicleInfo from './vehicle-info'
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
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate,
      vehicleInfo
    },
    created () {
      this.getDataList()
    },
    // activated () {
    //   this.getDataList()
    // },
    methods: {
      // 双击

      tableDbClickHandle(oavehicle){
        this.handleDetailClick(oavehicle.vehicleId)
        
      },
      handleDetailClick(id) {
        this.detailVisible = true;
        this.$nextTick(()=>{
          this.$refs.vehicleInfo.init(id);
        })
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        var params = {
          page: this.pageIndex,
          limit: this.pageSize,
          vehicleType: this.dataForm.vehicleType,
          repayCreatePerson:this.$store.state.user.userId
        }
        API.oavehicle.list(params).then(({data}) => {
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
      query() {
        this.pageIndex = 1;
        this.getDataList();
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
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.vehicleId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          API.oavehicle.del(ids).then(({data}) => {
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
