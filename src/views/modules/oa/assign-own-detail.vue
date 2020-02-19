<template>
  <el-dialog
    title="事项详情"
    width="70%"
    top="5vh"
    :visible.sync="visible"
    :close-on-click-modal="false">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="info">
        <el-form :model="dataForm" ref="dataForm" label-width="120px">
          <el-form-item label="事项内容" prop="matterContent">
            <el-input :disabled="true" type="textarea" rows="4" v-model="dataForm.matterContent" placeholder="事项内容"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="计划完成时间" prop="planTime">
                <el-date-picker :disabled="true" style="width: 100%"
                                v-model="dataForm.planTime"
                                type="date"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>

            </el-col>
            <el-col :span="12">
              <el-form-item label="办事人" prop="userId">
                <el-select :disabled="true" style="width: 100%" v-model="dataForm.userId" placeholder="办事人">
                  <el-option v-for="item in userOptions" :key="item.userId" :label="item.name" :value="item.userId"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="备注" prop="remark">
            <el-input :disabled="true" type="textarea" rows="4" v-model="dataForm.remark"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="交流记录" name="record">
        <matter-record ref="matterRecord"></matter-record>
      </el-tab-pane>
      <el-tab-pane label="文件上传" name="matter">
        <matter-file ref="matterFile"></matter-file>
      </el-tab-pane>
<!--      <el-tab-pane label="我的待办" name="myMatter">-->
<!--        <detail-deal ref="detailDeal"></detail-deal>-->
<!--      </el-tab-pane>-->
    </el-tabs>
  </el-dialog>
</template>

<script>
  import API from '@/api'
  import {getDownUserList} from '@/utils/options.js'
  import matterRecord from './matter-record'
  import matterFile from './matter-file'
  export default {
    components:{
      matterRecord,
      matterFile
    },
    data () {
      return {
        activeName:'info',
        visible: false,
        userOptions:[],
        options:[],
        isDisabled: false,
        dataForm: {
          matterStatus:'',
          matterId: 0,
          dialogId: '',
          matterContent: '',
          planTime: '',
          userId: '',
          remark:'',
        },
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
                this.dataForm.planTime = data.oaMatter.planTime
                this.dataForm.matterStatus = data.oaMatter.matterStatus
                this.dataForm.userId = data.oaMatter.userId
                this.dataForm.creator = data.oaMatter.creator
                this.$refs.matterRecord.init(id)
                this.$refs.matterFile.init(data.oaMatter)
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
              'matterId': this.dataForm.matterId,
              'matterStatus': '1',
              'remark': this.dataForm.remark,
            }
            API.oamatter.status(params).then(({data}) => {
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
