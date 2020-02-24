<template>
  <!-- 人员统计 -->
  <div class="mod-role">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input style="width:200px" v-model="dataForm.name" placeholder="请输入关键字" clearable></el-input>
        <!-- <el-input style="width:200px" v-model="dataForm.keyword" placeholder="角色名称" clearable></el-input> -->
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('sys:role:save')" type="primary" @click="add()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <!-- <el-table-column type="selection" header-align="center" align="center" width="50">
          </el-table-column> -->
      <el-table-column prop="name" header-align="center" align="center" width="180" label="姓名">
      </el-table-column>
      <el-table-column prop="sex" header-align="center" align="center" :formatter="sexFormatter" width="180" label="性别">
      </el-table-column>
      <el-table-column prop="mobile" header-align="center" align="center" min-width="180" label="联系方式">
      </el-table-column>
      <el-table-column prop="idcard" header-align="center" :formatter="idcardFormatter" align="center" width="280" label="身份证号">
      </el-table-column>
      <el-table-column header-align="center" align="center" width="180" label="其他信息">
        <template slot-scope="scope">
              <el-button v-if="isAuth('sys:role:update')" type="success" style="width:100px" @click="look(scope.row)">查看</el-button>
</template>
      </el-table-column>
      <el-table-column prop="creattime" header-align="center" align="center" width="280"  label="操作时间">
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
  <span>|</span>
  <el-button v-if="isAuth('sys:role:delete')" style="color:red" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
    <el-dialog title="添加协议" :visible.sync="dialogFormVisible">
      <el-form :model="addForm">
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input style="width:90%" v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="协议模板" :label-width="formLabelWidth">
          <el-select style="width:90%" v-model="addForm.region" placeholder="请选择协议模板">
            <el-option v-for="item in xieyiList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="性别" :label-width="formLabelWidth"  >
          <el-radio-group  v-model="addForm.sex" >
            <el-radio label="0">男</el-radio>
            <el-radio label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
                 <el-form-item label="部门" :label-width="formLabelWidth">
          <el-cascader
            style="width:90%"
            :options="options"
            :props="props"
            :show-all-levels="false"
            ref="myCascader"
            v-model="gcode"
            @change="changeCascader"
            clearable>
          </el-cascader>
        </el-form-item>
        <el-form-item label="联系方式" :label-width="formLabelWidth">
          <el-input style="width:90%" v-model="addForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码" :label-width="formLabelWidth">
          <el-input style="width:90%" v-model="addForm.idcard" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="当前所在地区" :label-width="formLabelWidth">
          <el-input style="width:90%" v-model="addForm.area" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="当前所在地区详细地址" :label-width="formLabelWidth">
          <el-input style="width:90%" v-model="addForm.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="近14天是否接触过新冠确诊病人或疑似病人" :label-width="formLabelWidth">
          <el-radio-group v-model="addForm.contact" >
            <el-radio label="0">否</el-radio>
            <el-radio label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="目前健康状态" size="mini" prop="roleIdList" :label-width="formLabelWidth">
          <el-radio-group v-if="ishealthstatus" v-model="FFFhealthstatus" >
            <el-radio label="0">无异常</el-radio>
            <el-radio label="1">发热(体温大于37.3℃)</el-radio>
          </el-radio-group>
         <el-checkbox-group v-if="!ishealthstatus" v-model="healthstatus">
            <el-checkbox style="width:130px;margin-left:0" v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{ role.roleName }}</el-checkbox>
          </el-checkbox-group>
      </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="commit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    groupData,
    groupChangeTree
  } from "@/api/modules/sys/group"
  export default {
    data() {
      return {
        ishealthstatus: true,
        FFFhealthstatus: "",
        // 0，无异常 1，发热 2乏力 3干咳 4 鼻塞 5流涕 6咽痛 7腹泻
        roleList: [{
          roleName: "发热",
          roleId: "1",
          id: 1,
        }, {
          roleName: "乏力",
          roleId: "2",
          id: 1,
        }, {
          roleName: "干咳",
          roleId: "3",
          id: 1,
        }, {
          roleName: "鼻塞",
          roleId: "4",
          id: 1,
        }, {
          roleName: "流涕",
          roleId: "5",
          id: 1,
        }, {
          roleName: "咽痛",
          roleId: "6",
          id: 1,
        }, {
          roleName: "腹泻",
          roleId: "7",
          id: 1,
        }],
        multipleSelection: [],
        beizhu: "",
        gridData: [],
        sendData: {},
        sssss: [],
        cascader: ["30"],
        props: {
          multiple: false,
          label: 'gName',
          value: "gCode",
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
        formLabelWidth: '180px',
        dataForm: {
          name: '',
        },
        gcode: [],
        addForm: {
          name: "",
          gcode: '',
          sex: "",
          mobile: "",
          idcard: "",
          area: "",
          address: "",
          contact: "",
        },
        healthstatus: [],
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        selectedList: [],
        isId: "",
        editData: {},
        tem: [],
        no: true
      }
    },
    watch: {
      "FFFhealthstatus": function(val) {
        if (val == 1) {
          this.ishealthstatus = false
        }
      }
    },
    activated() {
      this.getDataList()
      groupData().then((data => { //部门列表请求
        this.options = groupChangeTree(data.data.groupList)
      }))
    },
    methods: {
      cancel() {
           this.dialogFormVisible = false
      },
      sexFormatter( val ) {
         if( val.sex == 0) {
           return "男"
         }else{
           return "女"
         }
      },
      idcardFormatter(val) { //身份证脱敏
        let temp = val.idcard
        let NewStr = String(val.idcard.substr(0, 6) + "****" + val.idcard.substr(6 + "****".length))
        return NewStr.substr(0, 14) + "****" + NewStr.substr(14 + "****".length)
      },
      changeCascader(val) { //改变部门函数
        let temp = ""
        val.map((item, index) => {
          temp += item + ","
        })
        this.addForm.personList = temp
      },
      gcodeFn(val) { // 部门码
        let temp = ""
        val.map((item, index) => {
          temp += item + ","
        })
        return temp
      },
      healthstatusFn(val) { //症状码
        let temp = ""
        val.map((item, index) => {
          temp += item + ","
        })
        return temp
      },
      addCommit() { //添加请求
        let temhealthstatus = ""
        if (this.FFFhealthstatus == 0) {
          temhealthstatus = 0
        } else {
          temhealthstatus = this.healthstatusFn(this.healthstatus).slice(0, this.healthstatusFn(this.healthstatus).length - 1)
          if (temhealthstatus.split(",").indexOf("1") == -1) {
            this.$message({
              message: "请勾选发热选项",
              type: 'wraning',
            })
            return
          }
        }
        this.$http({
          url: this.$http.adornUrl('/sys/member/save'),
          method: 'POST',
          data: this.$http.adornData({
            name: this.addForm.name,
            gcode: this.gcodeFn(this.gcode).slice(0, this.gcodeFn(this.gcode).length - 1),
            sex: this.addForm.sex,
            mobile: this.addForm.mobile,
            idcard: this.addForm.idcard,
            area: this.addForm.area,
            address: this.addForm.address,
            contact: this.addForm.contact,
            healthstatus: temhealthstatus
          })
        }).then((data) => {
          if (data.data.code == 0) {
            this.dialogFormVisible = false
            this.$message({
              message: "保存成功",
              type: 'success',
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message({
              message: data.data.msg,
              type: 'wraning',
            })
          }
        })
      },
      updateHandle(row) { //编辑
        this.dialogFormVisible = true
        this.addForm = row
        if (row.healthstatus == 0) {
          this.ishealthstatus = true
          this.FFFhealthstatus = "0"
        } else {
          this.ishealthstatus = false
        }
        this.editData = row
        this.addForm.sex = String(row.sex)
        this.addForm.contact = String(row.contact)
        let temGcode = row.gcode
        this.gcode = temGcode.split(",")
        let healthstatus = row.healthstatus
        this.healthstatus = healthstatus.split(",")
      },
      editCommit() { //编辑请求
        let temhealthstatus = ""
        if (this.FFFhealthstatus == 0) {
          temhealthstatus = 0
        } else {
          temhealthstatus = this.healthstatusFn(this.healthstatus).slice(0, this.healthstatusFn(this.healthstatus).length - 1)
          if (temhealthstatus.split(",").indexOf("1") == -1) {
            this.$message({
              message: "请勾选发热选项",
              type: 'wraning',
            })
            return
          }
        }
        this.$http({
          url: this.$http.adornUrl('/sys/member/update'),
          method: 'POST',
          data: this.$http.adornData({
            name: this.addForm.name,
            gcode: this.gcodeFn(this.gcode).slice(0, this.gcodeFn(this.gcode).length - 1),
            sex: this.addForm.sex,
            mobile: this.addForm.mobile,
            idcard: this.addForm.idcard,
            area: this.addForm.area,
            address: this.addForm.address,
            contact: this.addForm.contact,
            healthstatus: this.healthstatusFn(this.healthstatus).slice(0, this.healthstatusFn(this.healthstatus).length - 1),
            id: this.editData.id
          })
        }).then((data) => {
          if (data.data.code == 0) {
            if (data.data.code == 0) {
              this.dialogFormVisible = false
              this.$message({
                message: "更新成功",
                type: 'success',
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message({
                message: data.data.msg,
                type: 'wraning',
              })
            }
          }
        })
      },
      commit() { //提交
        if (!/^1[3456789]\d{9}$/.test(this.addForm.mobile)) {
          this.$message.error("请填写正确手机号")
          return
        }
        if (!/^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/.test(this.addForm.idcard)) {
          this.$message.error("请填写正确身份证号码")
          return
        }
        if (Object.keys(this.editData).length == 0) { // 新增
          this.addCommit()
        } else { //修改
          this.editCommit()
        }
      },
      add() { // 添加
        this.dialogFormVisible = true
        this.editData = {}
        this.addForm = {}
        this.gcode = []
        this.healthstatus = []
        this.ishealthstatus = true
        this.FFFhealthstatus = ""
      },
      getDataList() { // 获取数据列表
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/sys/member/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'name': this.dataForm.name,
          })
        }).then(({
          data
        }) => {
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
      sizeChangeHandle(val) { // 每页数
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      currentChangeHandle(val) { // 当前页
        this.pageIndex = val
        this.getDataList()
      },
      selectionChangeHandle(val) { // 多选
        this.dataListSelections = val
      },
      deleteHandle(id) { // 删除
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.roleId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/member/delete'),
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
