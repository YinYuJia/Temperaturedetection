<template>
  <!-- 健康统计 -->
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input style="width:200px" v-model="dataForm.membername" placeholder="请输入分类名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column prop="membername" header-align="center" align="center" min-width="180" label="姓名">
      </el-table-column>
      <el-table-column prop="amtemperature" header-align="center" align="center" :formatter="amtemperatureFormatter" min-width="180" label="上午测温">
      </el-table-column>
      <el-table-column prop="amcreattime" header-align="center" align="center" min-width="180" :formatter="timeamFormatter" label="上午测温时间">
      </el-table-column>
      <el-table-column prop="pmtemperature" header-align="center" align="center" :formatter="pmtemperatureFormatter" min-width="180" label="下午测温">
      </el-table-column>
      <el-table-column prop="pmcreattime" header-align="center" align="center" min-width="180" :formatter="timepmFormatter" label="下午测温时间">
      </el-table-column>
      <el-table-column prop="creattime" header-align="center" align="center" min-width="180" :formatter="creattimeFormatter" label="测温日期">
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
                <el-button v-if="isAuth('sys:role:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row)">修改</el-button>
                <el-button v-if="isAuth('sys:role:delete')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
    <el-dialog title="修改测温" :visible.sync="dialogFormVisible">
      <el-form :model="addForm">

        <el-form-item label="上午测温" :label-width="formLabelWidth">
          <el-input style="width:90%" v-model="amtemperature" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="下午测温" :label-width="formLabelWidth">
          <el-input style="width:90%" v-model="pmtemperature" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save()">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import AddOrUpdate from '../sys/user-add-or-update'
  export default {
    data() {
      return {
        amtemperature: "",
        pmtemperature: "",
        fileName: "",
        successUrl: "",
        isShow: false,
        name: "",
        url: "",
        dialogFormVisible: false,
        formLabelWidth: '120px',
        dataForm: {
          name: ''
        },
        addForm: {
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        isEdit: "",
        more: {}
      }
    },
    created() {
      let tunnel_token = sessionStorage.getItem("tunnel_token")
      this.url = "/health_body/sys/soprotocolcategory/upload?tunnel_token=" + tunnel_token
    },
    components: {
      AddOrUpdate,
    },
    activated() {
      this.getDataList()
    },
    methods: {
      timeamFormatter( val ) {
        console.log("上午时间",val.amcreattime)
        if( val.amcreattime != null) {
           return val.amcreattime.split(" ")[1]
        }else{
          return "暂无时间"
        }
      },
      timepmFormatter( val ) {
         console.log("下午时间",val.pmcreattime)
          if( val.pmcreattime != null) {
           return val.pmcreattime.split(" ")[1]
        }else{
          return "暂无时间"
        }
      },
      creattimeFormatter( val ) {
          return val.creattime.split(" ")[0]
          return ""
      },
      amtemperatureFormatter( val ) {
         return val.amtemperature + "℃"
      },
      pmtemperatureFormatter( val ) {
         return val.pmtemperature + "℃"
      },
      // 保存
      save() {
        this.dialogFormVisible = false
        let data = {}
        if (this.isEdit == "") {
          data = {
            ...this.addForm,
            filename: this.name,
            fileurl: this.successUrl
          }
        } else {
          data = {
            id: this.isEdit,
            amtemperature: this.amtemperature,
            pmtemperature: this.pmtemperature,
          }
        }
        this.$http({
          url: this.isEdit == "" ? this.$http.adornUrl('/sys/healthstatistics/save') : this.$http.adornUrl('/sys/healthstatistics/update'),
          method: 'post',
          data: this.$http.adornData(data, false)
        }).then((data) => {
          if (data.data.code == 0) {
            this.getDataList()
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                // this.getDataList()
              }
            })
          } else {
            this.$message({
              message: data.data,
              type: 'error',
              duration: 1500,
            })
          }
        })
      },
      // 获取数据列表
      getDataList() {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/healthstatistics/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'membername': this.dataForm.membername
          })
        }).then(({
          data
        }) => {
          if (data && data.code === 0) {
            let newList = []
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
      sizeChangeHandle(val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle(val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle(val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle(row) {
        this.isShow = true
        this.dialogFormVisible = true
        this.isEdit = row.id;
        this.amtemperature = row.amtemperature
        this.pmtemperature = row.pmtemperature
        this.$nextTick(() => {
        })
      },
      // 删除
      deleteHandle(id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.roleId
        })
        this.$confirm(`确定删除`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/healthstatistics/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({
            data
          }) => {
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
