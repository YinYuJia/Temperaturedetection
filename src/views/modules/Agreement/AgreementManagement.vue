<template>
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input style="width:200px" v-model="dataForm.keyword" placeholder="请输入关键字" clearable></el-input>
        <el-date-picker style="width:200px" v-model="dataForm.start_time" type="date" placeholder="选择开始时间">
        </el-date-picker>
        <el-date-picker style="width:200px" v-model="dataForm.end_time" type="date" placeholder="选择结束时间">
        </el-date-picker>
        <!-- <el-input style="width:200px" v-model="dataForm.keyword" placeholder="角色名称" clearable></el-input> -->
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('sys:role:save')" type="primary" @click="add()">添加协议</el-button>
        <el-button v-if="isAuth('sys:role:save')" type="primary" @click="personExport()">人员导出</el-button>
        <!--<el-button v-if="isAuth('sys:role:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50">
      </el-table-column>
      <el-table-column prop="id" header-align="center" align="center" width="80" label="ID">
      </el-table-column>
      <el-table-column prop="postTitle" header-align="center" align="center" label="标题">
      </el-table-column>
      <el-table-column prop="protocolCategoryName" header-align="center" align="center" label="分类">
      </el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" width="180" :formatter="createTimeFormatter" label="添加时间">
      </el-table-column>
      <el-table-column header-align="center" align="center" width="180" label="状态">
        <template slot-scope="scope">
                           <span style="color:#0f0">{{scope.row.tpCount}}</span> 个人员未审核
</template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
<template slot-scope="scope">
  <el-button v-if="isAuth('sys:role:update')" type="text" size="small" @click="updateHandle(scope.row)">
    修改</el-button>
  <el-button v-if="isAuth('sys:role:update')" type="text" size="small" @click="ToExamine(scope.row)">审核</el-button>
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
    <!-- <ToExamine v-if="addOrUpdateVisible" @istoExamine="istoExamine" :sendData="sendData"  ></ToExamine> -->
    <el-dialog title="添加协议" :visible.sync="dialogFormVisible">
      <el-form :model="addForm">
        <el-form-item label="标题" :label-width="formLabelWidth">
          <el-input style="width:90%" v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="协议模板" :label-width="formLabelWidth">
          <el-select style="width:90%" v-model="addForm.region" placeholder="请选择协议模板">
            <el-option v-for="item in xieyiList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="承诺人" :label-width="formLabelWidth">
          <!-- <el-input style="width:90%" type="text" @focus="focusfns" v-model="personList"></el-input> -->

          <el-cascader
          style="width:90%"
    :options="options"
    :props="props"
    :show-all-levels="false"
     ref="myCascader"
     v-model="sssss"
    @change="changeCascader"
    clearable></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="commit()">确 定</el-button>
      </div>
    </el-dialog>


            <el-dialog title="用户协议审核" :visible.sync="toExamine" width="70%">
            <el-table @selection-change="handleSelectionChange" :data="gridData" height="400px" ref="multipleTable">
                <el-table-column type="selection" header-align="center"  align="center" width="50">
                </el-table-column>
                <el-table-column property="name" label="名称" width="150"></el-table-column>
                <el-table-column property="signStatusDesc" label="状态" width="200"></el-table-column>
                <el-table-column property="address" label="备注">
<template slot-scope="scope">
  <!-- <el-button v-if="isAuth('sys:role:update')" type="text" size="small" @click="shenhetongguo(scope.row)">审核通过</el-button> -->
  <el-input style="width:90%" v-model="scope.row.notes"  autocomplete="off"></el-input>
</template>
                </el-table-column>
                <el-table-column property="updateTime" :formatter="updateTimeFormatter" label="签约时间"></el-table-column>
                <el-table-column property="address" label="操作" width="300px">
<template slot-scope="scope">
  <el-button v-if="isAuth('sys:role:update')" v-show="scope.row.signStatus!=9" type="text" size="small" @click="shenhetongguo(scope.row)">审核通过</el-button>
  <el-button v-if="isAuth('sys:role:update')" v-show="scope.row.signStatus==9" type="text" size="small" style="color:red">签约完成</el-button>
  <el-button v-if="isAuth('sys:role:update')" v-show="scope.row.signStatus!=9" type="text" size="small" @click="shenheshibai(scope.row)">审核失败</el-button>
  <el-button v-if="isAuth('sys:role:update')" v-show="scope.row.signStatus==9" type="text" size="small" style="color:red">无法修改</el-button>
  <el-button v-if="isAuth('sys:role:update')" type="text" size="small" @click="preview(scope.row)">预览</el-button>
  <el-button v-if="isAuth('sys:role:update')" type="text" size="small" @click="daochuPDF(scope.row)">导出PDF</el-button>
</template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel()">返回</el-button>
                <el-button type="primary" @click="piliangshenhe()">批量审核通过</el-button>
                <el-button type="primary" @click="piliangshenheshibai()">批量审核失败</el-button>
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
        multipleSelection: [],
        beizhu: "",
        gridData: [],
        toExamine: false,
        sendData: {},
        sssss: [],
        cascader: ["30"],
        props: {
          multiple: true,
          label: 'label',
          value: "id",
        },
        options: [], //树形结构
        checkedRoleIds: [30],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        data: [],
        dialogFormVisible: false,
        xieyiList: [],
        formLabelWidth: '120px',
        dataForm: {
          keyword: '',
          start_time: "",
          end_time: ""
        },
        addForm: {
          name: "",
          region: "",
          personList: ""
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        selectedList: [],
        personList: "",
        isId: "",
        editData: {},
        tem: [],
        no:true
      }
    },
    components: {
      AddOrUpdate,
      ToExamine
    },
    activated() {
      this.getDataList()
      this.getTreeData()
    },
    methods: {
      //人员导出
      personExport() {
            console.log("人员导出")
                      this.$http({
            url: this.$http.adornUrl('/protocol/exportExecl'),
            method: 'post',
            data: this.$http.adornData()
          }).then(({
            data
          }) => {
            if (data && data.code === 0) {
              console.log("----",data.url)
              window.location.href = data.url
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
              })
            } else {
              this.$message.error(data.msg)
            }
          })
      },
      preview( val ) {
        // return
         window.open("http://zhou.nat300.top/fourbook/upload/view/sign_"+val.postId+"_"+val.userId+".pdf")
      },
      daochuPDF( val ) {
        let token = sessionStorage.getItem("token")
        // return
         window.location.href = "http://zhou.nat300.top/fourbook/protocol/exportPdf?filename=" + "sign_"+val.postId+"_"+val.userId+".pdf"

        // this.$http({
        //   url: this.$http.adornUrl('/protocol/exportPdf'),
        //   method: 'post',
        //   data: this.$http.adornData({
        //     filename:"sign_"+val.postId+"_"+val.userId+".pdf"
        //   })
        // }).then(({
        //   data
        // }) => {
        //   if (data && data.code === 0) {
        //     this.gridData = data.data
        //     this.$message.success("操作成功")
        //     this.toExamine = false
        //   } else {
        //     this.$message.error(data.msg)
        //   }
        // })
      },
      piliangshenheshibai() {
        if (this.multipleSelection.length == 0) {
          return
        }
        this.multipleSelection.map((item, index) => {
          if (item.signStatus != 1) {
            this.no = false
            return
          }
        })
        if (!this.no) {
          this.$message.error("操作有误,请确认后从新操作")
          this.toExamine = false
          return
        }
        this.$http({
          url: this.$http.adornUrl('/protocol/userRet'),
          method: 'post',
          data: this.$http.adornData(this.multipleSelection)
        }).then(({
          data
        }) => {
          if (data && data.code === 0) {
            this.gridData = data.data
            this.$message.success("操作成功")
            this.toExamine = false
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      notesFormatter( val) {
          console.log("notes---------",val)
      },
        shenheshibai(val) {
        if (val.signStatus == 1) {
          this.$http({
            url: this.$http.adornUrl('/protocol/userRet'),
            method: 'post',
            data: this.$http.adornData([val])
          }).then(({
            data
          }) => {
            if (data && data.code === 0) {
              this.gridData = data.data
              this.toExamine = false
               this.$message.success("操作成功")
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          this.$message.error("暂不能做审核操作")
        }
      },
      piliangshenhe() {
        if (this.multipleSelection.length == 0) {
          return
        }
        this.multipleSelection.map((item, index) => {
          if (item.signStatus != 1) {
            this.no = false
            return
          }
        })
        if (!this.no) {
          this.$message.error("操作有误,请确认后从新操作")
          this.toExamine = false
          return
        }
        this.$http({
          url: this.$http.adornUrl('/protocol/userCommit'),
          method: 'post',
          data: this.$http.adornData(this.multipleSelection)
        }).then(({
          data
        }) => {
          if (data && data.code === 0) {
            this.gridData = data.data
            this.toExamine = false
             this.$message.success("操作成功")
          } else {
            this.$message.error(data.msg)
          }
        })
      },

      shenhetongguo(val) {
        if (val.signStatus == 1) {
          this.$http({
            url: this.$http.adornUrl('/protocol/userCommit'),
            method: 'post',
            data: this.$http.adornData([val])
          }).then(({
            data
          }) => {
            if (data && data.code === 0) {
              this.gridData = data.data
              this.toExamine = false
              this.$message.success("操作成功")
            } else {
              this.$message.error(data.msg)
            }
          })
        } else {
          this.$message.error("暂不能做审核操作")
        }
      },
      allRight() {
        this.toExamine = false
        shenhetongguo
      },
      cancel() {
        this.toExamine = false
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      changeCascader(val) {
        let temp = ""
        val.map((item, index) => {
          temp += item[item.length - 1] + ","
        })
        this.addForm.personList = temp
      },
      handleCheckChange(data, checked, indeterminate) {
      },
      focusfns() {
        // this.getTreeData()
      },
      getTreeData() { // 获取树形结构list
        this.$http({
          url: this.$http.adornUrl('/protocol/userTree'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({
          data
        }) => {
          if (data && data.code === 0) {
            this.data = data.data
            this.options = data.data
          }
        })
      },
      addCommit() {
        this.$http({
          url: this.$http.adornUrl('/protocol/add'),
          method: 'get',
          params: this.$http.adornParams({
            'PostTitle': this.addForm.name,
            'ProtocolCategoryId': this.addForm.region,
            'personList': this.addForm.personList.slice(0, this.addForm.personList.length - 1),
          })
        }).then((data) => {
          if (data.data.code == 0) {
            this.getDataList()
            this.dialogFormVisible = false
          }
        })
      },
      updateHandle(row) {
        this.dialogFormVisible = true
        this.editData = row
        this.addForm.name = row.postTitle
        this.getxieyiDataList()
        this.edit(row.id)
      },
      edit(id) {
        this.isId = id
        this.$http({
          url: this.$http.adornUrl('/protocol/edit'),
          method: 'get',
          params: this.$http.adornParams({
            id: id
          })
        }).then(({
          data
        }) => {
          if (data && data.code === 0) {
            let tem = []
            data.data.map((item, index) => {
              tem.push([item.parentId, String(item.id)])
            })
            this.sssss = tem
            this.tem = tem
          } else {
            this.$message({
              message: data.msg,
              type: 'wraning',
            })
          }
        })
      },
      editCommit() {
        let aaa = this.tem
        let gggg = ""
        aaa.map((item, index) => {
          gggg += item[item.length - 1] + ","
        })
        this.$http({
          url: this.$http.adornUrl('/protocol/editSave'),
          method: 'get',
          params: this.$http.adornParams({
            'post_title': this.addForm.name,
            'protocol_category_id': this.addForm.region,
            'personList_old': gggg.slice(0, gggg.length - 1),
            'personList_new': this.addForm.personList.slice(0, this.addForm.personList.length - 1),
            'id': this.editData.id
          })
        }).then((data) => {
          if (data.data.code == 0) {
            this.getDataList()
            this.dialogFormVisible = false
          }
        })
      },
      commit() {
        if (Object.keys(this.editData).length == 0) { // 新增
          this.addCommit()
        } else { //修改
          this.editCommit()
        }
      },
      tpCountFormatter(val) {
        return val.tpCount + "个人员未审核"
      },
      createTimeFormatter(val) {
        var date = new Date(val.createTime * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        if (String(D).length < 3) {
          D = "0" + D
        }
        return Y + M + D;
      },
      updateTimeFormatter(val) {
        if(val.updateTime != null ) {
          var date = new Date(val.updateTime * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
          var Y = date.getFullYear() + '-';
          var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
          var D = date.getDate() + ' ';
          var h = date.getHours() + ':';
          var m = date.getMinutes() + ':';
          var s = date.getSeconds();
          if (String(D).length < 3) {
            D = "0" + D
          }
          return Y + M + D;
        }
      },
      istoExamine(data) {
      },
      // 添加协议
      add() {
        this.dialogFormVisible = true
        this.editData = {}
        this.addForm = {
            name: "",
            region: "",
            personList: ""
          },
          this.isId = ""
        this.sssss = []
        this.getxieyiDataList()
      },
      getxieyiDataList() {
        this.$http({
          url: this.$http.adornUrl('/sys/soprotocolcategory/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': 1,
            'limit': 10000,
          })
        }).then(({
          data
        }) => {
          if (data && data.code === 0) {
            this.xieyiList = data.page.list
            if (Object.keys(this.editData).length != 0) {
              this.addForm.region = Number(this.editData.protocolCategoryId)
            }
          }
        })
      },
      // 审核
      ToExamine(row) {
        this.toExamine = true
        this.$http({
          url: this.$http.adornUrl('/protocol/userVerify'),
          method: 'post',
          data: this.$http.adornData({
            id: String(row.id),
            limit: 10,
            page: 1
          })
        }).then(({
          data
        }) => {
          if (data && data.code === 0) {
            this.gridData = data.data
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 获取数据列表
      getDataList() {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/protocol/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'keyword': this.dataForm.keyword,
            'start_time': this.dataForm.start_time,
            'end_time': this.dataForm.end_time,
          })
        }).then(({
          data
        }) => {
          if (data && data.code === 0) {
            this.dataList = data.data.list
            this.totalPage = data.data.totalCount
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
      // 删除
      deleteHandle(id) {
        // var ids = id ? [id] : this.dataListSelections.map(item => {
        //   return item.roleId
        // })
        this.$confirm(`确定对id=${id}删除操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/protocol/delete'),
            method: 'post',
            data: this.$http.adornData({
              id: String(id)
            })
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
