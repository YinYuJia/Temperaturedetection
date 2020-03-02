<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-row>
        <el-col :span="12">
      <el-form-item label="车型" prop="vehicleType">
        <!-- <el-input v-model="dataForm.vehicleId" placeholder="车辆ID"></el-input> -->
        <el-select style="width: 100%"  v-model="dataForm.vehicleType" placeholder="请选择" :disabled="true">
            <el-option v-for="item in vehicleData" :key="item.key" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="时间" prop="time" >
            <!-- <el-input v-model="dataForm.time" placeholder="时间"></el-input> -->
            <span v-if="true">
                <el-date-picker
                  style="width: 100%"
                  size="small"
                  v-model="dataForm.time"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期时间"
                  :disabled="true"
                  >
                  </el-date-picker>
            </span>
          </el-form-item>
        </el-col>
      </el-row>
       <!-- ----------------------------车辆详细----------------------------------- -->

      <el-row>
        <el-col :span="12">
          <el-form-item label="车牌" prop="plate">
            <el-input v-model="queryVehicleInfo.plate" placeholder="车牌" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="专管人" prop="commissionerName">
            <el-input v-model="queryVehicleInfo.commissionerName" placeholder="专管人" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- ----------------------------E--N--D------------------------------------ -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="里程数" prop="mileage">
            <el-input v-model="dataForm.mileage" placeholder="里程数" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经办人" prop="agent">
            <!-- <el-input v-model="dataForm.agent" placeholder="经办人"></el-input> -->
            <el-select style="width: 100%"  v-model="dataForm.agent" placeholder="请选择" :disabled="true">
              <el-option v-for="item in staffSelectData" :key="item.key" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-form-item label="经办人姓名" prop="agentName">
        <el-input v-model="dataForm.agentName" placeholder="经办人姓名"></el-input>
      </el-form-item> -->
      <el-row>
        <el-col :span="12">
      <el-form-item label="预算金额" prop="budgetAmount" >
        <el-input v-model="dataForm.budgetAmount" placeholder="预算金额" :disabled="true"></el-input>
      </el-form-item>
        </el-col>
        <el-col :span="12">
      <el-form-item label="修理厂" prop="repairDepot">
        <el-input v-model="dataForm.repairDepot" placeholder="修理厂" :disabled="true"></el-input>
      </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="保养/请修项目" prop="item">
        <el-input v-model="dataForm.item" placeholder="保养/请修项目" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="损坏原因" prop="damageReason">
        <el-input v-model="dataForm.damageReason" placeholder="损坏原因" :disabled="true"></el-input>
      </el-form-item>
      <!-- <el-form-item label="创建人" prop="creator">
        <el-input v-model="dataForm.creator" placeholder="创建人"></el-input>
      </el-form-item>
      <el-form-item label="创建人姓名" prop="creatorName">
        <el-input v-model="dataForm.creatorName" placeholder="创建人姓名"></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
      </el-form-item> -->

    <el-form-item label="初审备注" prop="firstRemark">
        <el-input :disabled="true" v-model="dataForm.firstRemark"/>
      </el-form-item>
    <el-form-item label="终审备注" prop="lastRemark">
        <el-input :disabled="!showApproval" v-model="dataForm.lastRemark"/>
      </el-form-item>
    </el-form>
    <span v-if="showApproval" slot="footer" class="dialog-footer">
      <el-button type="warning" @click="approvalSubmit(4)">不通过</el-button>
      <el-button type="primary" @click="approvalSubmit(3)">通过</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import API from '@/api'
  export default {
    data () {
      return {
        showApproval:true,
        visible: false,
        vehicleData: '',
        isDisabled: false,
        staffSelectData: [],
        queryVehicleInfo: [],
        dataForm: {
          vehicleMaintainId: 0,
          vehicleType: '',
          time: '',
          mileage: '',
          agent: '',
          agentName: '',
          item: '',
          budgetAmount: '',
          repairDepot: '',
          damageReason: '',
          creator: '',
          creatorName: '',
          createTime: '',
          firstRemark: '',
          lastRemark: '',
        },
        dataRule: {
          vehicleId: [
            { required: true, message: '车辆ID不能为空', trigger: 'blur' }
          ],
          time: [
            { required: true, message: '时间不能为空', trigger: 'blur' }
          ],
          mileage: [
            { required: true, message: '里程数不能为空', trigger: 'blur' }
          ],
          agent: [
            { required: true, message: '经办人不能为空', trigger: 'blur' }
          ],
          agentName: [
            { required: true, message: '经办人姓名不能为空', trigger: 'blur' }
          ],
          item: [
            { required: true, message: '保养/请修项目不能为空', trigger: 'blur' }
          ],
          budgetAmount: [
            { required: true, message: '预算金额不能为空', trigger: 'blur' }
          ],
          repairDepot: [
            { required: true, message: '修理厂不能为空', trigger: 'blur' }
          ],
          damageReason: [
            { required: true, message: '损坏原因不能为空', trigger: 'blur' }
          ],
          creator: [
            { required: true, message: '创建人不能为空', trigger: 'blur' }
          ],
          creatorName: [
            { required: true, message: '创建人姓名不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '创建时间不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created () {
      this.getVehicleData()
      this.getStaffSelectData()
    },
    methods: {
                // ----------------查询车辆内容
      queryVehicle(vehicleId){
        this.$http({
          url: this.$http.adornUrl('/oa/oaveshicle/info/' + vehicleId),
          method: 'get',
        }).then(({data}) => {
          if (data && data.code === 0) {
            // const queryVehicleApplyInfo = []
            // data.page.list.map((item, index) => {
            //   vehicleApplication.push({
            //     // key: item.vehicleId,
            //     label: item.vehicleApplyId,
            //     value: item.vehicleApplyId
            //   })
            // })
            this.queryVehicleInfo = data.oaVehicle
          }
        })
      },
      // ---------------
       // 获取用车人员
      getStaffSelectData() {
        this.$http({
          url: this.$http.adornUrl('/sys/user/allList'),
          method: 'get',
        }).then(({data}) => {
          if (data && data.code === 0) {
            const staffSelectData = []
            data.userList.map((item, index) => {
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
      // ----------------
        getVehicleData() {
        this.$http({
          url: this.$http.adornUrl('/oa/oavehicle/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': 1,
            'limit': 100000,
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            const vehicleData = []
            data.page.list.map((item, index) => {
              vehicleData.push({
                key: item.vehicleId,
                label: item.vehicleType,
                value: item.vehicleId
              })
            })
            this.vehicleData = vehicleData
          }
        })
      },
      // ---------------
      init (id) {
        this.dataForm.vehicleMaintainId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.vehicleMaintainId) {
            API.oavehiclemaintain.info(this.dataForm.vehicleMaintainId).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.vehicleType = data.oaVehicleMaintain.vehicleType
                this.dataForm.time = data.oaVehicleMaintain.time
                this.dataForm.mileage = data.oaVehicleMaintain.mileage
                this.dataForm.agent = data.oaVehicleMaintain.agent
                this.dataForm.agentName = data.oaVehicleMaintain.agentName
                this.dataForm.item = data.oaVehicleMaintain.item
                this.dataForm.budgetAmount = data.oaVehicleMaintain.budgetAmount
                this.dataForm.repairDepot = data.oaVehicleMaintain.repairDepot
                this.dataForm.damageReason = data.oaVehicleMaintain.damageReason
                this.dataForm.creator = data.oaVehicleMaintain.creator
                this.dataForm.creatorName = data.oaVehicleMaintain.creatorName
                this.dataForm.createTime = data.oaVehicleMaintain.createTime
                this.dataForm.firstRemark = data.oaVehicleMaintain.firstRemark
                this.dataForm.lastRemark = data.oaVehicleMaintain.lastRemark
              }
            })
          }
        })
      },
      // 表单提交


// --------审批状态----------
      approvalSubmit(status){
        this.$http({
          url: this.$http.adornUrl('/oa/oavehiclemaintain/last/approval'),
          method: 'post',
          data: this.$http.adornData({
            'vehicleMaintainId':this.dataForm.vehicleMaintainId,
            'approvalStatus':status,
            'lastRemark': this.dataForm.lastRemark
          })
        }).then(({data})=>{
          if (data && data.code === 0) {
            this.$parent.detailViewChange(false)
            this.$parent.getDataList()
          }
        })
      },


    }
  }
</script>
