<template>
  <el-dialog
    :title="!dataForm.gId ? '部门新增' : '部门修改'"
    :close-on-click-modal="false"
    :visible.sync="visible" width="40%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="部门编号" prop="gCode">
        <el-input v-model="dataForm.gCode" placeholder="部门编号" @blur="codeCheck" ref="gCode" :disabled="!dataForm.groupId?false:true"></el-input>
      </el-form-item>
      <el-form-item label="部门名称" prop="gName">
        <el-input v-model="dataForm.gName" placeholder="部门名称"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="gLxfs">
        <el-input v-model="dataForm.gLxfs" placeholder="部门名称"></el-input>
      </el-form-item>
      <el-form-item label="上级部门" prop="p_codes">
        <el-cascader v-model="dataForm.p_codes" placeholder="上级部门"  :options="options" filterable clearable expand-trigger="hover"  style="width: 100%" change-on-select>
        </el-cascader>
      </el-form-item>
      <el-form-item label="备注" prop="bz">
        <el-input v-model="dataForm.bz" placeholder="备注"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :disabled="isDisabled">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {groupAdd,groupData,groupInfo,groupCheck,groupUpdate,groupChangeTree} from "@/api/modules/sys/group"

  export default {
    data () {
      return {
        visible: false,
        isDisabled: false,
        dataForm: {
          groudId: 0,
          gCode: '',
          gName: '',
          bz: '',
          p_codes:[],
          gLxfs:''
        },
        dataRule: {
          gCode: [
            { required: true, message: '部门编号不能为空', trigger: 'blur' }
          ],
          gName: [
            { required: true, message: '部门名称不能为空', trigger: 'blur' }
          ],
          p_codes: [
            { type:'array', required: true, message: '上级部门不能为空', trigger: 'blur'}
          ],
        },
        options:[],
      }
    },
    methods: {
      getPCode(){
        groupData().then(({data}) => {
          if (data && data.code === 0) {
            this.options = groupChangeTree(data.groupList);
          }
        })
      },
      init (id) {
        this.options.length = 0
        this.dataForm.groupId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.getPCode();
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.groupId) {
            groupInfo(this.dataForm.groupId).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.gCode = data.sysGroup.gCode
                this.dataForm.gName = data.sysGroup.gName
                this.dataForm.gpCode = data.sysGroup.gpCode
                this.dataForm.bz = data.sysGroup.bz
                this.dataForm.p_codes = data.pcodeList
                this.dataForm.gLxfs = data.sysGroup.gLxfs
                this.dataForm.gpName = data.sysGroup.gpName
              }
            })
          }
        })
      },
      codeCheck(){
        let gCode = this.dataForm.gCode;
        if(gCode){
          groupCheck({'gCode':gCode}).then(({data})=>{
            if(data&&data.code===0){

            }else{
              this.$message.error(data.msg)
              //this.$refs.gCode.focus();
            }
          })
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
         this.isDisabled=true
            console.log(params.p_codes)
            return
            var params = {
              'groupId': this.dataForm.groupId || undefined,
              'gCode': this.dataForm.gCode,
              'gName': this.dataForm.gName,
              'gJb': this.dataForm.gJb,
              'gpCode': this.dataForm.gpCode,
              'gpName' : this.dataForm.gpName,
              'bz': this.dataForm.bz,
              'p_codes':this.dataForm.p_codes,
              'gLxfs':this.dataForm.gLxfs
            }
            var tick = !this.dataForm.groupId ? groupAdd(params) : groupUpdate(params)
            tick.then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$nextTick(()=>{
                        this.isDisabled=false
                      })
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
                 this.$nextTick(()=>{
                        this.isDisabled=false
                      })
              }
            })
          }
        })
      }
    }
  }
</script>
<style>
  /*.codeFocus{*/
  /*border-color: #f56c6c;*/
  /*}*/
</style>
