<template>
  <el-dialog
    width="70%"
    title="审批"
    :close-on-click-modal="false"
    :visible.sync="visible" z-index="10000">
    <el-form :disabled="true" :model="dataForm" ref="dataForm"
             label-width="80px">
      <el-row>
        <el-col :span="14">
          <el-form-item label-width="85px" label="项目/需求">
            <el-select style="width: 25%" :value="dataForm.foreignType" placeholder="请选择">
              <el-option v-for="item in typeOptions" :key="item.dmId" :label="item.dmsm" :value="item.dmz"/>
            </el-select>
            <el-select v-if="!(dataForm.foreignType==3)" filterable style="width: 70%" v-model="dataForm.foreignId" placeholder="请选择">
              <el-option v-for="item in selectData" :key="item.key" :label="item.label" :value="item.value"/>
            </el-select>
            <el-input style="width: 70%" v-if="dataForm.foreignType==3" v-model="dataForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="随行人员" label-width="85px" prop="repayStaff">
            <el-select style="width: 100%" multiple v-model="dataForm.repayStaff" placeholder="请选择">
              <el-option v-for="item in staffSelectData" :key="item.key" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="详细信息" :required="true" label-width="85px" prop="detailData">
        <el-table
          :data="dataForm.detailData"
          border
        >
          <el-table-column type="index" width="50"
                           label="序号" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="repayDetailTime" width="245"
                           label="费用发生时间" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="repayDetailPlace" width="150"
                           label="费用发生地点" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="repayDetailTypeName" width="150"
                           label="费用类型" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="billTypeName" width="150"
                           label="单据类型" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="repayDetailAmount" width="150"
                           label="金额" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="content"
                           label="内容摘要" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="repayDetailRemark"
                           label="备注" header-align="center" align="center">
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="审批人" prop="repayApproval">
            <el-select style="width: 100%;" v-model="dataForm.repayApproval" placeholder="请选择">
              <el-option v-for="item in approvalData" :key="item.key" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="金额总计" prop="total">
            <el-input disabled v-model="dataForm.total"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="repayApprovalRemark">
        <el-input :disabled="!showApproval" v-model="dataForm.repayApprovalRemark"/>
      </el-form-item>
    </el-form>
    <span v-if="showApproval" slot="footer" class="dialog-footer">
      <el-button type="warning" @click="approvalSubmit(2)">不通过</el-button>
      <el-button type="primary" @click="approvalSubmit(1)">通过</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import API from '@/api'
  import {getOptions} from '@/utils/options.js'

  export default {
    data() {
      return {
        showApproval:true,
        staffSelectData:[],
        approvalData: [],
        selectData: [],
        visible: false,
        typeOptions:[],
        dataForm: {
          type: '',
          id: '',
          detailData: [],
          repayId: 0,
          repayStaff: '',
          dialogId: '',
          dialogName: '',
          projectId: '',
          projectName: '',
          repayApproval: '',
          repayApprovalRemark: '',
          repayCreateTime: '',
          repayCreatePerson: '',
          foreignId: '',
          foreignType: '',
          name:'',
          total:undefined
        }
      }
    },
    methods: {
      init(id) {
        this.getStaffSelectData()
        this.getApprovalData()
        // getOptions('BXGLLX').then(({data}) => {
        //   this.typeOptions = data.dmlxList
        // })
        this.typeOptions = this.$store.state.options.options['BXGLLX']
        this.dataForm.repayId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.repayId) {
            API.oarepay.info(this.dataForm.repayId).then(({data}) => {
              if (data && data.code === 0) {
                const list = []
                if (data.oaRepay.repayStaff != null) {
                  data.oaRepay.repayStaff.split(",").map((item, index) => {
                    list.push(parseInt(item))
                  })
                }
                this.dataForm.repayStaff = list
                this.dataForm.repayApproval = data.oaRepay.repayApproval
                this.dataForm.detailData = data.oaRepay.detailData
                // if (data.oaRepay.projectId != null) {
                //   this.dataForm.type = '1'
                //   this.dataForm.id = data.oaRepay.projectId
                // } else {
                //   this.dataForm.type = '2'
                //   this.dataForm.id = data.oaRepay.dialogId
                // }
                this.dataForm.foreignId = data.oaRepay.foreignId
                this.dataForm.foreignType = data.oaRepay.foreignType
                this.dataForm.name = data.oaRepay.name
                this.dataForm.repayApprovalRemark = data.oaRepay.repayApprovalRemark
                this.dataForm.total = data.oaRepay.total
                this.getSelectData(data.oaRepay.type)
              }
            })
          }
        })
      },
      approvalSubmit(status){
        this.$http({
          url: this.$http.adornUrl('/oa/oarepay/approval'),
          method: 'post',
          data: this.$http.adornData({
            'repayId':this.dataForm.repayId,
            'repayApprovalStatus':status,
            'repayApprovalRemark': this.dataForm.repayApprovalRemark
          })
        }).then(({data})=>{
          if (data && data.code === 0) {
            this.$parent.detailViewChange(false)
            this.$parent.getDataList()
          }
        })
      },
      getStaffSelectData(){
        this.$http({
          url: this.$http.adornUrl('/sys/user/allList'),
          method: 'get',
        }).then(({data})=>{
          if (data && data.code === 0) {
            const staffSelectData = []
            data.userList.map((item,index)=>{
              staffSelectData.push({
                key: item.userId,
                label: item.name,
                value: item.userId
              })
            })
            this.staffSelectData = staffSelectData
          }
        })
      },
      getSelectData(value) {
        if (value == 1) {
          this.$http({
            url: this.$http.adornUrl('/oa/oaproject/list'),
            method: 'get',
            params: this.$http.adornParams({
              'page': 1,
              'limit': 10000,
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              const selectData = []
              data.page.list.map((item, index) => {
                selectData.push({
                  key: item.projectId,
                  label: item.projectName,
                  value: item.projectId
                })
              })
              this.selectData = selectData
            }
          })
        } else {
          this.$http({
            url: this.$http.adornUrl('/oa/oadialog/list'),
            method: 'get',
            params: this.$http.adornParams({
              'page': 1,
              'limit': 10000,
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              const selectData = []
              data.page.list.map((item, index) => {
                selectData.push({
                  key: item.dialogId,
                  label: item.dialogName,
                  value: item.dialogId
                })
              })
              this.selectData = selectData
            }
          })
        }
      },
      getApprovalData() {
        this.$http({
          url: this.$http.adornUrl('/sys/user/allList'),
          method: 'get',
        }).then(({data}) => {
          const approvalData = []
          data.userList.map((item, index) => {
            approvalData.push({key: item.userId.toString(), label: item.name,value:item.userId.toString()})
          })
          this.approvalData = approvalData
        })
      },
    }
  }
</script>

<style>
</style>
