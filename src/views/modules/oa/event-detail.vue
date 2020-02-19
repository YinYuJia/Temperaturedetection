<template>
  <el-dialog
    title="详细信息"
    :visible.sync="visible"
    :close-on-click-modal="false"
    >
    <el-form :model="dataForm" :disabled="true" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="事件名称" prop="eventName">
        <el-input v-model="dataForm.eventName" placeholder="事件名称"></el-input>
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
        dataForm: {
          eventId: 0,
          eventName: '',
          matterContent: '',
          startTime: '',
          planTime: '',
          userIdList: '',
        },
      }
    },
    created(){
    },
    methods: {
      init (id) {
        getMatterUserList().then(({data}) => {
          this.userOptions = data.userList
        })
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
    }
  }
</script>
