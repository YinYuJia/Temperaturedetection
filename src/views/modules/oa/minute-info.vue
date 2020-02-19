<template>
  <el-dialog
    title="会议详细"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="150px">
      <el-form-item label="会议纪要内容" prop="content">
        <el-input class="el-textarea1" type="textarea" :rows="4" v-model="dataForm.content" placeholder="会议纪要内容" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="会议类型" prop="type">
        <el-select style="min-width: 400px" v-model="dataForm.type" placeholder="请选择" :disabled="true">
          <el-option v-for="item in typeOptions" :key="item.dmId" :label="item.dmsm" :value="item.dmz"/>
        </el-select>
      </el-form-item>
      <el-form-item label="会议时间" prop="time" >
        <el-date-picker
          style="min-width: 400px"
          v-model="dataForm.time"
          type="date"
          placeholder="会议时间"
          :disabled="true">
        </el-date-picker>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import API from '@/api'
  import {getOptions} from '@/utils/options.js'
  export default {
    data() {
      return {
        visible: false,
        typeOptions:[],
        aboutTypeOptions:[],
        dataForm: {
          id: 0,
          content: '',
          type: '',
          time: '',
          
          
        },
        dataRule: {
          content: [
            {required: true, }
          ],
          type: [
            {required: true, }
          ],
          time: [
            {required: true, }
          ],
          foreignType: [
            {required: true,  trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      init(id) {
        // getOptions('HYLX').then(({data})=>{
        //   this.typeOptions = data.dmlxList
        // })
        this.typeOptions = this.$store.state.options.options['HYLX']
        this.aboutTypeOptions = this.$store.state.options.options['RZGLLX']
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            API.oameetingminute.info(this.dataForm.id).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.content = data.oaMeetingMinute.content
                this.dataForm.type = data.oaMeetingMinute.type
                this.dataForm.time = data.oaMeetingMinute.time
              }
            })
          }
        })
      },
    }
  }
</script>
