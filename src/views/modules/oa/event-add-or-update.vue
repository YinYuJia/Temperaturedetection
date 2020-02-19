<template>
  <el-dialog
    :title="dataForm.eventId==0 ? '新增' : '修改'"
    :visible.sync="visible"
    :close-on-click-modal="false"
    >
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="事件名称" prop="eventName">
        <el-input 
        v-model="dataForm.eventName"
        placeholder="事件名称"
        :show-word-limit="true" 
        maxlength="100"
          ></el-input>
      </el-form-item>
      <el-form-item label="事项内容" prop="matterContent">
        <el-input 
        type="textarea" 
        rows="4" 
        v-model="dataForm.matterContent" 
        placeholder="事项内容"
        :show-word-limit="true" 
        maxlength="1000"
        ></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker :disabled="dataForm.eventId!=0" style="width: 100%"
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
            <el-date-picker :disabled="dataForm.eventId!=0" style="width: 100%"
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
            <el-select multiple :disabled="dataForm.eventId!=0" style="width: 100%" v-model="dataForm.userIdList" placeholder="办事人">
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
  import {getMatterUserList} from '@/utils/options.js'
  export default {
    data () {
      return {
        visible: false,
        userOptions:[],
        isDisabled: false,
        dataForm: {
          eventId: 0,
          eventName: '',
            matterContent: '',
            startTime: '',
            planTime: '',
            userIdList: '',
        },
        dataRule: {
          eventName: [
            { required: true, message: '事件名称不能为空', trigger: 'blur' }
          ],
          matterContent: [
            { required: true, message: '事件内容不能为空', trigger: 'blur' }
          ],
          startTime: [
            { required: true, message: '开始时间不能为空', trigger: 'blur' }
          ],
          planTime: [
            { required: true, message: '计划完成时间不能为空', trigger: 'blur' }
          ],
          userIdList: [
            { required: true, message: '办事人不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created(){
      getMatterUserList().then(({data}) => {
        this.userOptions = data.userList
      })
    },
    methods: {
      init (id) {
        this.dataForm.eventId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.eventId) {
            API.oaevent.info(this.dataForm.eventId).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.eventName = data.oaEvent.eventName
                this.dataForm.matterContent = data.oaEvent.matter.matterContent
                this.dataForm.startTime = data.oaEvent.matter.startTime
                this.dataForm.planTime = data.oaEvent.matter.planTime
                this.dataForm.userIdList = data.oaEvent.matter.userIdList
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
              'eventId': this.dataForm.eventId || undefined,
              'eventName': this.dataForm.eventName,
              'matter': {
                matterContent: this.dataForm.matterContent,
                startTime: this.dataForm.startTime,
                planTime: this.dataForm.planTime,
                userIdList: this.dataForm.userIdList
              }
            }
            var tick = !this.dataForm.eventId ? API.oaevent.add(params) : API.oaevent.update(params)
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
