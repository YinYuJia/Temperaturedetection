<template>
  <el-dialog
    :title="!dataForm.dmId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="参数类型" prop="dmlx">
        <el-input v-model="dataForm.dmlx" placeholder="参数类型"></el-input>
      </el-form-item>
      <el-form-item label="参数名称" prop="dmmc">
        <el-input v-model="dataForm.dmmc" placeholder="参数名称"></el-input>
      </el-form-item>
      <el-form-item label="参数值" prop="dmz">
        <el-input v-model="dataForm.dmz" placeholder="参数值"></el-input>
      </el-form-item>
      <el-form-item label="参数说明" prop="dmsm">
        <el-input v-model="dataForm.dmsm" placeholder="参数说明"></el-input>
      </el-form-item>
      <el-form-item label="是否有效" prop="dmzt">
        <el-select v-model="dataForm.dmzt" :disabled="!dataForm.dmId" placeholder="请选择" class="dmzt-style">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
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
  export default {
    data () {
      return {
        visible: false,
        isDisabled: false,
        dataForm: {
          dmlx: '',
          dmz: '',
          dmmc: '',
          bz:'',
          dmzt: '1',
          dmsm:''
        },
        options: [{
          value: '1',
          label: '有效'
        },{
          value: '0',
          label: '无效'
        }],
        dataRule: {
          dmlx: [
            { required: true, message: '参数类型不能为空', trigger: 'blur' }
          ],
          dmz: [
            { required: true, message: '参数值不能为空', trigger: 'blur' }
          ],
          dmmc: [
            { required: true, message: '参数名称不能为空', trigger: 'blur' }
          ],
          dmsm: [
            { required: true, message: '参数说明不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.dmId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.dmId) {
            this.$http({
              url: this.$http.adornUrl(`/sys/config/info/${this.dataForm.dmId}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.dmlx = data.config.dmlx
                this.dataForm.dmz = data.config.dmz
                this.dataForm.dmmc = data.config.dmmc
                this.dataForm.bz = data.config.bz
                this.dataForm.dmzt = data.config.dmzt
                this.dataForm.dmsm = data.config.dmsm
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
          this.isDisabled=true
            this.$http({
              url: this.$http.adornUrl(`/sys/config/${!this.dataForm.dmId ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'dmId': this.dataForm.dmId || undefined,
                'dmlx': this.dataForm.dmlx,
                'dmz': this.dataForm.dmz,
                'dmmc': this.dataForm.dmmc,
                'dmzt': this.dataForm.dmzt,
                'bz': this.dataForm.bz,
                'dmsm':this.dataForm.dmsm
              })
            }).then(({data}) => {
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
  .dmzt-style{
    width:100%;
  }
</style>
