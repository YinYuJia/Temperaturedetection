<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="需求ID" prop="dialogId">
        <el-select style="width: 100%" filterable v-model="dataForm.dialogId" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="事项内容" prop="matterContent">
        <el-input type="textarea" rows="4" v-model="dataForm.matterContent" placeholder="事项内容"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker style="width: 100%"
                            v-model="dataForm.startTime"
                            type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划完成时间" prop="planTime">
          <el-date-picker style="width: 100%"
            v-model="dataForm.planTime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="办事人" prop="userIdList">
            <el-select multiple style="width: 100%" v-model="dataForm.userIdList" placeholder="办事人">
              <el-option v-for="item in userOptions" :key="item.userId" :label="item.name" :value="item.userId"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :disabled="isDisabled">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import API from '@/api'
  import {getDownUserList} from '@/utils/options.js'
  export default {
    data () {
      return {
        visible: false,
        userOptions:[],
        options:[],
        isDisabled: false,
        dataForm: {
          matterId: 0,
          dialogId: '',
          matterContent: '',
          startTime: '',
          planTime: '',
          userIdList: '',
        },
        dataRule: {
          // dialogId: [
          //   { required: true, message: '需求ID不能为空', trigger: 'blur' }
          // ],
          matterContent: [
            { required: true, message: '事项内容不能为空', trigger: 'blur' }
          ],
          startTime: [
            { required: true, message: '开始时间不能为空', trigger: 'blur' }
          ],
          planTime: [
            { required: true, message: '计划完成时间不能为空', trigger: 'blur' }
          ],
          userId: [
            { required: true, message: '用户ID不能为空', trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      init (id) {
        getDownUserList().then(({data}) => {
          this.userOptions = data.userList
        })
        this.$http({
          url: this.$http.adornUrl('/oa/oadialog/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          const options = [];
          data.page.list.map((item, index) => {
            options.push({value: item.dialogId, label: item.dialogName});
          });
          this.options = options;
        })
        this.dataForm.matterId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.matterId) {
            API.oamatter.info(this.dataForm.matterId).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.dialogId = data.oaMatter.dialogId
                this.dataForm.matterContent = data.oaMatter.matterContent
                this.dataForm.startTime = data.oaMatter.startTime
                this.dataForm.planTime = data.oaMatter.planTime
                this.dataForm.userId = data.oaMatter.userId
                this.dataForm.creator = data.oaMatter.creator
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
            var params = {
              'matterId': this.dataForm.matterId || undefined,
              'dialogId': this.dataForm.dialogId,
              'matterContent': this.dataForm.matterContent,
              'startTime': this.dataForm.startTime,
              'planTime': this.dataForm.planTime,
              'userIdList': this.dataForm.userIdList,
            }
            var tick = !this.dataForm.matterId ? API.oamatter.add(params) : API.oamatter.update(params)
            tick.then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 500,
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
