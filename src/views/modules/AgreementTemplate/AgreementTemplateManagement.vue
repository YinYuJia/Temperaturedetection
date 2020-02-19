<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input style="width:200px" v-model="dataForm.name" placeholder="请输入分类名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('sys:role:save')" type="primary" @click="add()">添加协议分类</el-button>

        <!--<el-button v-if="isAuth('sys:role:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50">
      </el-table-column>
      <el-table-column prop="id" header-align="center" align="center" width="80" label="ID">
      </el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="分类名称">
      </el-table-column>
      <el-table-column prop="status" header-align="center" align="center" :formatter="formatterData" label="状态">
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
              <el-button v-if="isAuth('sys:role:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row)">编辑</el-button>
              <!-- <el-button v-if="isAuth('sys:role:update')" type="text" size="small" @click="ToExamine(scope.row.id)">隐藏</el-button> -->
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
    <ToExamine v-if="addOrUpdateVisible" @istoExamine="istoExamine"></ToExamine>
    <el-dialog title="添加协议" :visible.sync="dialogFormVisible">
      <el-form :model="addForm">
        <el-form-item label="分类" :label-width="formLabelWidth">
          <el-select style="width:90%" v-model="addForm.modeType" placeholder="请选择协议模板">
            <!-- <el-option label="保密工作协议书" value="1"></el-option>
            <el-option label="员工保密承诺书" value="2"></el-option>
            <el-option label="涉密人员保证书" value="3"></el-option>
            <el-option label="涉密人员离岗保密承诺书" value="4"></el-option> -->
            <el-option :label="item.bankName" :key="item.bankId" v-for="item in banklist" :value="item.bankId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="协议标题" :label-width="formLabelWidth">
          <el-input style="width:90%" v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="协议模板文件" :label-width="formLabelWidth">
          <!-- :http-request="uploadFiles" -->
          <el-upload ref='upload' :auto-upload='true'  :on-success="uploadSuccess"  :multiple='false' :limit="1"  :action='url' >
              <el-button slot="trigger" size="mini" type="primary">选取文件</el-button>
               <p v-if="isShow">{{fileName}}</p>
              <!--<el-button @click='uploadFiles' size="mini" type="primary">点击上传</el-button> -->
          </el-upload>
        </el-form-item>
        <p style="margin-left:30px;font-size:20px">文件位置</p>
        <el-form-item label="承诺人" :label-width="formLabelWidth">
          <el-input style="width:29.6%" placeholder="页数" v-model="addForm.axespage" autocomplete="off"></el-input>
          <el-input style="width:29.6%" placeholder="请填写签名坐标" v-model="addForm.axessign" autocomplete="off"></el-input>
          <el-input style="width:29.6%" placeholder="请填写签名日期" v-model="addForm.axestime" autocomplete="off"></el-input>
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
  import ToExamine from './ToExamine'
  export default {
    data() {
      return {
        fileName:"",
        successUrl: "",
        isShow:false,
        name: "",
        url: "",
        banklist: [{
            bankName: "保密工作协议书",
            bankId: "1",
          },
          {
            bankName: "员工保密承诺书",
            bankId: "2",
          },
          {
            bankName: "涉密人员保证书",
            bankId: "3",
          },
          {
            bankName: "涉密人员离岗保密承诺书",
            bankId: "4",
          },
          {
            bankName: "合规管理员工承诺书",
            bankId: "5",
          },
        ],
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
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
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
      ToExamine
    },
    activated() {
      this.getDataList()
    },
    methods: {
      selectBD() {
        this.$forceUpdate();
      },
      formatterData(val) {
        if (val.status == 1) {
          return "显示"
        } else {
          return "隐藏"
        }
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
      istoExamine(data) {
        this.addOrUpdateVisible = false
      },
      // 添加协议
      add() {
        this.dialogFormVisible = true
        this.isShow = false
        this.addForm = {
          name: "",
          modeType: "3",
          axespage: "",
          axessign: "",
          axestime: ""
        }
        this.isEdit = ""
        if(this.$refs.upload != undefined ) {
          // this.$refs.upload.clearFiles()
        }
      },
      // 审核
      ToExamine(id) {
        this.addOrUpdateVisible = true
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
        if( this.$refs.upload!=undefined) {
          this.$refs.upload.clearFiles()
        }
         this.isShow = true
        this.dialogFormVisible = true
        this.isEdit = row.id;
        let more = JSON.parse(row.more)
        this.more = JSON.parse(row.more)
        this.fileName = more.file.name
        this.addForm = {
            name: row.name,
            modeType: String(row.modeType),
            axespage: more.axes.page,
            axessign: more.axes.sign,
            axestime: more.axes.time,
          },
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
