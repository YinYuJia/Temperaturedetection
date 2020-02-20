<template>
  <!-- 健康统计 -->
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input style="width:200px" v-model="dataForm.name" placeholder="请输入分类名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column prop="name" header-align="center" align="center" min-width="180" label="姓名">
      </el-table-column>
      <el-table-column prop="am" header-align="center" align="center"  min-width="180" label="上午测温">
      </el-table-column>
      <el-table-column prop="amTime" header-align="center" align="center"  min-width="180"  label="上午测温时间">
      </el-table-column>
      <el-table-column prop="bm" header-align="center" align="center"   min-width="180" label="下午测温">
      </el-table-column>
      <el-table-column prop="bmTime" header-align="center" align="center"  min-width="180" label="下午测温时间">
      </el-table-column>
      <el-table-column prop="date" header-align="center" align="center"  min-width="180" label="测温日期">
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
          <el-input style="width:90%" v-model="addForm.am" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="下午测温" :label-width="formLabelWidth">
          <el-input style="width:90%" v-model="addForm.bm" autocomplete="off"></el-input>
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
        fileName:"",
        successUrl: "",
        isShow:false,
        name: "",
        url: "",
        dialogFormVisible: false,
        formLabelWidth: '120px',
        dataForm: {
          name: ''
        },
        addForm: {
          name: "",
          modeType: "3",
          axespage: "",
          axessign: "",
          axestime: ""
        },
        dataList: [
          {
            name:"张三",
            am:"36.5℃",
            amTime:"09:10",
            bm:"36.5℃",
            bmTime:"09:10",
            date:"2020-02-02",
            id:1
          },
          {
            name:"张三",
            am:"36.5℃",
            amTime:"09:10",
            bm:"36.5℃",
            bmTime:"09:10",
            date:"2020-02-02",
            id:2
          },
          {
            name:"张三",
            am:"36.5℃",
            amTime:"09:10",
            bm:"36.5℃",
            bmTime:"09:10",
            date:"2020-02-02",
            id:3
          },
        ],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        isEdit: "",
        more:{}
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
      // this.getDataList()
    },
    methods: {
      selectBD() {
        this.$forceUpdate();
      },
      uploadSuccess(data) {
        this.successUrl = data.res.url
        this.name = data.res.name
        this.isShow = false
      },
      uploadFiles() {
        let file = this.$refs.upload.$refs['upload-inner'].$refs.input; //获取文件数据
        let fileList = file.files;
        let myform = new FormData()
        myform.append('file', fileList[0]);
        this.$http({
          url: this.$http.adornUrl('/sys/topinion/upload'),
          method: 'post',
          data: this.$http.adornData(myform, false)
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
          if(this.successUrl == "") {
            data = {
              ...this.addForm,
                id: this.isEdit,
              filename:this.more.file.name,
              fileurl:this.more.file.url,
            }
          }else{
            data = {
              ...this.addForm,
                id: this.isEdit,
              filename: this.name,
            fileurl: this.successUrl
            }
          }

        }
        this.$http({
          url: this.isEdit == "" ? this.$http.adornUrl('/sys/soprotocolcategory/save') : this.$http.adornUrl('/sys/soprotocolcategory/update'),
          method: 'post',
          data: this.$http.adornData(data, false)
        }).then((data) => {
          if( data.data.code == 0 ) {
            this.getDataList()
            this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  // this.getDataList()
                }
              })
          }
        })
      },
      // 获取数据列表
      getDataList() {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/soprotocolcategory/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'name': this.dataForm.name
          })
        }).then(({
          data
        }) => {
          if (data && data.code === 0) {
            let newList = []
            data.page.list.map((item, index) => {
              let aaa = JSON.parse(item.more)
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
        this.addForm = row
          this.$nextTick(() => {

          })
      },
      // 删除
      deleteHandle(id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.roleId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/soprotocolcategory/delete'),
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
