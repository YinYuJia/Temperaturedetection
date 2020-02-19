<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="所属部门" prop="userName">
        <el-input v-if="isShow" v-model="dataForm.gName" placeholder="所属部门" ></el-input>
        <el-cascader v-if="!isShow" style="width:90%" :options="options" :props="props" :show-all-levels="false" ref="myCascader" v-model="dataForm.gName" @change="changeCascader" clearable></el-cascader>
        <!-- <el-input v-model="dataForm.gName" placeholder="所属部门"></el-input> -->
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="dataForm.userName" placeholder="登录帐号" @blur="userNameCheck"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.password" type="password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="comfirmPassword" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.comfirmPassword" type="password" placeholder="确认密码"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="dataForm.name" placeholder="姓名"></el-input>
      </el-form-item>
      <!-- <el-form-item label="邮箱" prop="email">
          <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
        </el-form-item> -->
      <!-- <el-form-item label="手机号" prop="mobile">
          <el-input v-model="dataForm.mobile" placeholder="手机号"></el-input>
        </el-form-item> -->
      <el-form-item label="角色" size="mini" prop="roleIdList">
        <el-checkbox-group v-model="dataForm.roleIdList">
          <el-checkbox v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{ role.roleName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="dataFormSubmit()" >确定</el-button>
      </span>
  </el-dialog>
</template>

<script>
  // import { isEmail, isMobile } from '@/utils/validate'
  import {
    groupByCode
  } from "@/api/modules/sys/group"
  export default {
    data() {
      var validatePassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('密码不能为空'))
        } else {
          callback()
        }
      }
      var validateComfirmPassword = (rule, value, callback) => {
        if (!this.dataForm.id && !/\S/.test(value)) {
          callback(new Error('确认密码不能为空'))
        } else if (this.dataForm.password !== value) {
          callback(new Error('确认密码与密码输入不一致'))
        } else {
          callback()
        }
      }
      // var validateEmail = (rule, value, callback) => {
      //   if (!isEmail(value)) {
      //     callback(new Error('邮箱格式错误'))
      //   } else {
      //     callback()
      //   }
      // }
      // var validateMobile = (rule, value, callback) => {
      //   if (!isMobile(value)) {
      //     callback(new Error('手机号格式错误'))
      //   } else {
      //     callback()
      //   }
      // }
      return {
        isShow:true,
        options:[],
        sssss:"",
        visible: false,
        isDisabled: true,
        roleList: [],
         props: {
          multiple: false,
          label: 'label',
          value: "id",
        },
        dataForm: {
          id: 0,
          userName: '',
          password: '888888',
          comfirmPassword: '888888',
          name: '',
          salt: '',
          // email: '',
          // mobile: '',
          roleIdList: [],
          status: 1,
          gCode: '',
          gName: '',
        },
        dataRule: {
          userName: [{
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
          }],
          password: [{
            validator: validatePassword,
            trigger: 'blur'
          }],
          comfirmPassword: [{
            validator: validateComfirmPassword,
            trigger: 'blur'
          }],
          // email: [
          //   { required: true, message: '邮箱不能为空', trigger: 'blur' },
          //   { validator: validateEmail, trigger: 'blur' }
          // ],
          // mobile: [
          //   { required: true, message: '手机号不能为空', trigger: 'blur' },
          //   { validator: validateMobile, trigger: 'blur' }
          // ],
          name: [{
            required: true,
            message: '姓名不能为空',
            trigger: 'blur'
          }, ]
        }
      }
    },
    methods: {
            getTreeData() { // 获取树形结构list
        this.$http({
          url: this.$http.adornUrl('/protocol/userTree'),
          method: 'get',
          params: this.$http.adornParams({})
        }).then(({
          data
        }) => {
          if (data && data.code === 0) {

            this.getData(data.data);
            this.options = this.getData(data.data);
            
          }
        })
      },
      getData( val ) {
         console.log("11111111",val)
          for (let i = 0 ; i < val.length ; i++) {
              if( val[i].children != null ) {
                  val[i].children = null
              }
          }
          return val
      },
      changeCascader(val) {
       console.log(val)
       this.dataForm.gCode = val[val.length -1]
      },
      init(id, code) {
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/sys/role/select'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({
          data
        }) => {
          this.roleList = data && data.code === 0 ? data.list : []
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (this.dataForm.id) {
            console.log("修改11111111111")
            this.isShow = false
            this.getTreeData()
            this.$http({
              url: this.$http.adornUrl(`/sys/user/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({
              data
            }) => {
              if (data && data.code === 0) {
                console.log("11111------111111",data)
                
                this.dataForm.userName = data.user.username
                this.dataForm.salt = data.user.salt
                // this.dataForm.email = data.user.email
                // this.dataForm.mobile = data.user.mobile
                this.dataForm.roleIdList = data.user.roleIdList
                this.dataForm.status = data.user.status
                this.dataForm.name = data.user.name
                this.dataForm.oldUsername = data.user.username
                this.dataForm.gCode = data.user.gCode
                this.dataForm.gName = [data.user.gCode]
              }
            })
          } else {
            this.dataForm.gCode = code;
            this.isShow = true
            groupByCode({
              'gCode': code
            }).then(({
              data
            }) => {
              if (data && data.code === 0) {
                this.dataForm.gName = data.group.gName
              }
            })
          }
        })
      },
      userNameCheck() {
        // let username = this.dataForm.userName;
        // if (username) {
        //   this.$http({
        //     url: this.$http.adornUrl(`/sys/user/userCheck`),
        //     method: 'get',
        //     params: this.$http.adornParams({
        //       'userName': username
        //     })
        //   }).then(({
        //     data
        //   }) => {
        //     if (data && data.code === 0) {
        //     } else {
        //       this.$message.error(data.msg)
        //     }
        //   })
        // }
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.isDisabled = true
            console.log(this.dataForm)
            
            this.$http({
              url: this.$http.adornUrl(`/sys/user/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'userId': this.dataForm.id || undefined,
                'username': this.dataForm.userName,
                'password': this.dataForm.password,
                'salt': this.dataForm.salt,
                // 'email': this.dataForm.email,
                // 'mobile': this.dataForm.mobile,
                'status': this.dataForm.status,
                'roleIdList': this.dataForm.roleIdList,
                "name": this.dataForm.name,
                "oldUsername": this.dataForm.oldUsername,
                'gCode': this.dataForm.gCode
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
                    this.visible = false
                    this.$nextTick(() => {
                      this.isDisabled = true
                    })
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
                this.$nextTick(() => {
                  this.isDisabled = true
                })
              }
            })
          }
        })
      }
    }
  }
</script>
