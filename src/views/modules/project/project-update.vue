<template>
  <el-dialog width="80%" :visible.sync="visible" title="项目信息修改" top="5vh"  :close-on-click-modal="false" @click="holder">
  <el-form :model="infoForm" ref="infoForm" label-width="150px" class="demo-projectForm">
    <el-row>
      <el-col :span="24">
        <el-form-item :required="true" label="需求关联" prop="dialogId">
          <el-select style="width: 100%" filterable v-model="infoForm.dialogId" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item :required="true" label="项目名称" prop="projectName">
          <el-input v-model="infoForm.projectName"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="项目编码" prop="projectCode">
          <el-input v-model="infoForm.projectCode"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item :required="true" label="技术领域" prop="skillFiled">
          <el-select style="width: 100%" v-model="infoForm.skillFiled" placeholder="请选择">
            <el-option v-for="item in skillFiledOptions" :key="item.dmId" :label="item.dmsm" :value="item.dmz"/>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :required="true" label="项目所属单位" prop="subUnit">
          <el-input v-model="infoForm.subUnit"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item :required="true" label="牵头单位" prop="leadUnit">
          <el-input v-model="infoForm.leadUnit"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :required="true" label="项目负责人" prop="projectLeader">
          <el-input v-model="infoForm.projectLeader"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item :required="true" label="开始时间" prop="startTime"
                      :rules="[{ required: true, message: '请选择开始时间',trigger:'change'}]">
          <el-date-picker type="date" placeholder="选择日期" v-model="infoForm.startTime"
                          style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :required="true" label="预计完成时间" prop="planTime"
                      :rules="[{ required: true, message: '请选择预计完成时间',trigger:'change'}]">
          <el-date-picker type="date" placeholder="选择日期" v-model="infoForm.planTime"
                          style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item :required="true" label="实际完成时间" prop="actualTime"
                      :rules="[{ required: true, message: '请选择实际完成时间',trigger:'change'}]">
          <el-date-picker type="date" placeholder="选择日期" v-model="infoForm.actualTime"
                          style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="申报金额" prop="declaredAmount">
          <el-input v-model="infoForm.declaredAmount"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="下达金额" prop="issuedAmount">
          <el-input v-model="infoForm.issuedAmount"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="中标金额" prop="targetAmount">
          <el-input v-model="infoForm.targetAmount"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
<!-- 开始start —————————————————————————————————————————————————————————————— -->

                <el-row>
              <el-col :span="24">
            <el-form-item label="详细信息" prop="detailData">
              <el-table
                :data="infoForm.detailData"
                border
              >
                <el-table-column type="index" width="50"
                                 label="序号" header-align="center" align="center">
                </el-table-column>
                <el-table-column label="类型" width="200" header-align="center" align="center">
                  <template slot-scope="scope">
                    <el-select size="small" v-model="scope.row.fileType" placeholder="请选择">
                      <el-option v-for="item in typeOptions" :key="item.dmId" :label="item.dmsm"
                                 :value="item.dmz"/>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="数量" width="140" header-align="center" align="center">
                  <template slot-scope="scope">
                    <el-input size="small" placeholder="请输入数量" v-model="scope.row.count">
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column label="备注" header-align="center" align="center">
                  <template slot-scope="scope">
                    <el-input size="small" placeholder="请输入备注" v-model="scope.row.remark">
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="80" header-align="center" align="center">
                  <template slot-scope="scope">
                    <el-button size="small" @click.prevent="removeDomain(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="el-table-add-row" @click="addDomains()"><span>+ 添加</span></div>
            </el-form-item>
              </el-col>
            </el-row>
<!-- 结束 end    —————————————————————————————————————————————————————————————— -->

    <el-row>
      <el-col :span="24">
        <el-form-item :required="true" label="主要研究内容" prop="mainContent">
          <el-input type="textarea" :rows="4" v-model="infoForm.mainContent"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :required="true" label="预期目标" prop="expectTarget">
          <el-input type="textarea" :rows="4" v-model="infoForm.expectTarget"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" :rows="4" v-model="infoForm.remark"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="infoFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import {getOptions} from '@/utils/options.js'
  export default {
    data() {
      return {
        visible:false,
        projectId:undefined,
        typeOptions:[],
        infoForm: {
          dialogId: '',
          projectName: '',
          projectCode: '',
          skillFiled: '',
          subUnit: '',
          mainContent: '',
          expectTarget: '',
          leadUnit: '',
          projectLeader: '',
          startTime:'',
          actualTime: '',
          planTime: '',
          declaredAmount: '',
          issuedAmount: '',
          targetAmount: '',
          approvalNumber: '',
          remark: '',
          detailData:[],

        },
        skillFiledOptions:[],
        options:[]
      }
    },
    mounted() {
      // this.getRecordData();
    },
    created() {
      // this.getDataList()
        // getOptions('WJLX').then(({data})=>{
        //   this.typeOptions = data.dmlxList
        // })
    },
    methods: {
      init(projectId){
        this.typeOptions = this.$store.state.options.options['WJLX']
        this.visible = true
        this.getDialogOptions()
        this.projectId = projectId
        // getOptions('JSLY').then(({data})=>{
        //   this.skillFiledOptions = data.dmlxList
        // })
        this.skillFiledOptions = this.$store.state.options.options['WJLX']
        this.$nextTick(()=>{
          this.$refs.infoForm.resetFields()
          this.$http({
            url: this.$http.adornUrl('/oa/oaproject/info/' + projectId),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.infoForm = data.oaProject
            }
          })
        })
      },
      getDialogOptions(){
        this.$http({
          url: this.$http.adornUrl('/oa/oadialog/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': 1,
            'limit': 100000,
          })
        }).then(({data}) => {
          const options = [];
          data.page.list.map((item, index) => {
            options.push({value: item.dialogId, label: item.dialogName});
          });
          this.options = options;
        })
      },
      infoFormSubmit(){
        this.$refs.infoForm.validate((valid)=>{
          if (valid) {
            this.$http({
              url: this.$http.adornUrl('/oa/oaproject/update'),
              method: 'post',
              data: this.$http.adornData({
                ...this.infoForm
              })
            }).then(({data})=>{
              if(data.code==0){
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration: 500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              }
            })
          }
        })
      },
      holder(){
        // 获取元素的位置 
        // 获取关闭的位置

      },
      addDomains() {
        this.infoForm.detailData.push({
          fileType: '1',
          count: '1',
          remark: '',
        })
      },
      removeDomain(index) {
        this.infoForm.detailData.splice(index, 1)
      },
    }
  }
</script>
<style>

</style>
