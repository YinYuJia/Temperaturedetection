<template>
  <el-dialog
    :title="!dataForm.vehicleTravelId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="用车事由" prop="reason">
        <el-input v-model="dataForm.reason" placeholder="用车事由"></el-input>
      </el-form-item>
      <!-- <el-form-item label="车辆ID" prop="vehicleId">
        <el-input v-model="dataForm.vehicleId" placeholder="车辆ID"></el-input>
        <el-select style="width: 100%"  v-model="dataForm.vehicleId" placeholder="请选择">
            <el-option v-for="item in vehicleApplication" :key="item.key" :label="item.label" :value="item.value"/>
          </el-select>
      </el-form-item> -->
      <el-form-item label="申请描述" prop="vehicleApplyId">
        <!-- <el-input v-model="dataForm.vehicleApplyId" placeholder="车辆申请单ID"></el-input> -->
        <el-select style="width: 100%"  v-model="dataForm.vehicleApplyId" placeholder="请选择" @change="queryVehicleApply">
          <el-option v-for="item in vehicleApplication" :key="item.key" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <!-- ---------------------------------- 静态框 监听车辆申请单ID变化---------------------------------------------  -->
       <el-row>
        <el-col :span="12">
          <el-form-item label="司机" prop="driver">
            <el-input v-model="queryVehicleApplyInfo.driverName" placeholder="司机姓名" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用车人" prop="user">
            <el-input v-model="queryVehicleApplyInfo.userName" placeholder="用车人姓名" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="随行人" prop="entourageName">
            <el-input v-model="queryVehicleApplyInfo.entourageName" placeholder="随行人" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="目的地" prop="destinationName">
            <el-input v-model="queryVehicleApplyInfo.destinationName" placeholder="目的地" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="用车开始时间" prop="startTime">
            <el-input v-model="queryVehicleApplyInfo.startTime" placeholder="随行人" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用车结束时间" prop="endTime">
            <el-input v-model="queryVehicleApplyInfo.endTime" placeholder="目的地" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row> 
      <!-- -----------------------------------------E---N---D-------------------------------------- -->
      <el-row>
        <el-col :span="12">
      <el-form-item label="起始公里表数" prop="startNumber">
        <el-input v-model="dataForm.startNumber" placeholder="起始公里表数"></el-input>
      </el-form-item>
        </el-col>
        <el-col :span="12">
      <el-form-item label="返回公里表数" prop="endNumber">
        <el-input v-model="dataForm.endNumber" placeholder="返回公里表数"></el-input>
      </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
      <el-form-item label="行驶里程数" prop="driverMileage">
        <el-input v-model="driverMileage" placeholder="行驶里程数"   :disabled="true"></el-input>
      </el-form-item>
        </el-col>
        <el-col :span="12">
      <el-form-item label="高速费用" prop="highCost">
        <el-input v-model="dataForm.highCost" placeholder="高速费用"></el-input>
      </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
      <el-form-item label="停车费用" prop="topCost">
        <el-input v-model="dataForm.topCost" placeholder="停车费用"></el-input>
      </el-form-item>
        </el-col>
        <el-col :span="12">
      <el-form-item label="加油费用" prop="oilCost">
        <el-input v-model="dataForm.oilCost" placeholder="加油费用"></el-input>
      </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
      <el-form-item label="其他费用" prop="otherCost">
        <el-input v-model="dataForm.otherCost" placeholder="其他费用"></el-input>
      </el-form-item>
        </el-col>
        <el-col :span="12">
      <el-form-item label="加油时剩余油量" prop="surplus">
        <el-input v-model="dataForm.surplus" placeholder="加油时剩余油量"></el-input>
      </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
      <el-form-item label="加油量" prop="fuelAmount">
        <el-input v-model="dataForm.fuelAmount" placeholder="加油量"></el-input>
      </el-form-item>
        </el-col>
        <el-col :span="12">
      <el-form-item label="油卡余额" prop="oilCardBalance">
        <el-input v-model="dataForm.oilCardBalance" placeholder="油卡余额"></el-input>
      </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="现金加油" prop="cash">
        <el-input v-model="dataForm.cash" placeholder="现金加油"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
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
    </el-form> 
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :disabled="isDisabled" >确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import API from '@/api'
  export default {
    data () {
      return {
        visible: false,
        isDisabled: false,
        vehicleData:'',
        vehicleApplication: '',
        queryVehicleApplyInfo: [],
        dataForm: {
          vehicleTravelId: 0,
          vehicleId: '',
          vehicleApplyId: '',
          reason: '',
          startNumber: '',
          endNumber: '',
          // driverMileage: '',
          highCost: '',
          topCost: '',
          oilCost: '',
          otherCost: '',
          surplus: '',
          fuelAmount: '',
          oilCardBalance: '',
          cash: '',
          remark: '',
          creator: '',
          creatorName: '',
          createTime: ''
        },
        dataRule: {
          vehicleId: [
            { required: true, message: '车辆ID不能为空', trigger: 'blur' }
          ],
          vehicleApplyId: [
            { required: true, message: '车辆申请单ID不能为空', trigger: 'blur' }
          ],
          reason: [
            { required: true, message: '用车事由不能为空', trigger: 'blur' }
          ],
          startNumber: [
            { required: true, message: '起始公里表数不能为空', trigger: 'blur' }
          ],
          endNumber: [
            { required: true, message: '返回公里表数不能为空', trigger: 'blur' }
          ],
          // driverMileage: [
          //   { required: true, message: '行驶里程数不能为空', trigger: 'blur' }
          // ],
          // highCost: [
          //   { required: true, message: '高速费用不能为空', trigger: 'blur' }
          // ],
          // topCost: [
          //   { required: true, message: '停车费用不能为空', trigger: 'blur' }
          // ],
          // oilCost: [
          //   { required: true, message: '加油费用不能为空', trigger: 'blur' }
          // ],
          // otherCost: [
          //   { required: true, message: '其他费用不能为空', trigger: 'blur' }
          // ],
          // surplus: [
          //   { required: true, message: '加油时剩余油量不能为空', trigger: 'blur' }
          // ],
          // fuelAmount: [
          //   { required: true, message: '加油量不能为空', trigger: 'blur' }
          // ],
          // oilCardBalance: [
          //   { required: true, message: '油卡余额不能为空', trigger: 'blur' }
          // ],
          // cash: [
          //   { required: true, message: '现金加油不能为空', trigger: 'blur' }
          // ],
          // remark: [
          //   { required: true, message: '备注不能为空', trigger: 'blur' }
          // ],
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
      this.geApplication()
    },
    computed: {
      driverMileage:function(){
        if(this.dataForm.endNumber - this.dataForm.startNumber < 0){
          this.isDisabled = true
          return '行驶里程不能小于0'
        }else{
          this.isDisabled = false
          return this.dataForm.endNumber - this.dataForm.startNumber
        }
      }
    },
    methods: {
      // ----------------查询用车申请内容
      queryVehicleApply(vehicleApplyId){
        this.$http({
          url: this.$http.adornUrl('/oa/oavehicleapply/info/' + vehicleApplyId),
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
            this.dataForm.vehicleId = data.oaVehicleApply.vehicleId
            this.queryVehicleApplyInfo = data.oaVehicleApply
          }
        })
      },
      // ----------------
      geApplication(){
        this.$http({
          url: this.$http.adornUrl('/oa/oavehicleapply/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': 1,
            'limit': 100000,
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            const vehicleApplication = []
            data.page.list.map((item, index) => {
              if(item.approvalStatus==1){

                vehicleApplication.push({
                  // key: item.vehicleId,
                  label: item.vehicleApplyName,
                  value: item.vehicleApplyId
                })
              }
            })
            this.vehicleApplication = vehicleApplication
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
                // key: item.vehicleId,
                label: item.vehicleType,
                value: item.vehicleId
              })
            })
            this.vehicleData = vehicleData
          }
        })
      },
      // ----------------
      init (id) {
        this.geApplication()
        this.dataForm.vehicleTravelId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.vehicleTravelId) {
            API.oavehicletravel.info(this.dataForm.vehicleTravelId).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.vehicleId = data.oaVehicleTravel.vehicleId
                this.dataForm.vehicleApplyId = data.oaVehicleTravel.vehicleApplyId
                this.dataForm.reason = data.oaVehicleTravel.reason
                this.dataForm.startNumber = data.oaVehicleTravel.startNumber
                this.dataForm.endNumber = data.oaVehicleTravel.endNumber
                // this.dataForm.driverMileage = data.oaVehicleTravel.endNumber - data.oaVehicleTravel.startNumber
                this.dataForm.highCost = data.oaVehicleTravel.highCost
                this.dataForm.topCost = data.oaVehicleTravel.topCost
                this.dataForm.oilCost = data.oaVehicleTravel.oilCost
                this.dataForm.otherCost = data.oaVehicleTravel.otherCost
                this.dataForm.surplus = data.oaVehicleTravel.surplus
                this.dataForm.fuelAmount = data.oaVehicleTravel.fuelAmount
                this.dataForm.oilCardBalance = data.oaVehicleTravel.oilCardBalance
                this.dataForm.cash = data.oaVehicleTravel.cash
                this.dataForm.remark = data.oaVehicleTravel.remark
                this.dataForm.creator = data.oaVehicleTravel.creator
                this.dataForm.creatorName = data.oaVehicleTravel.creatorName
                this.dataForm.createTime = data.oaVehicleTravel.createTime
              }
            })
          }
        })
        // this.$nextTick(()=>{
        //    this.geApplication()

        // })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
         
          if (valid) {
            this.isDisabled=true
            var params = {
              'vehicleTravelId': this.dataForm.vehicleTravelId || undefined,
              'vehicleId': this.dataForm.vehicleId,
              'vehicleApplyId': this.dataForm.vehicleApplyId,
              'reason': this.dataForm.reason,
              'startNumber': this.dataForm.startNumber,
              'endNumber': this.dataForm.endNumber,
              'driverMileage': this.dataForm.endNumber - this.dataForm.startNumber,
              'highCost': this.dataForm.highCost,
              'topCost': this.dataForm.topCost,
              'oilCost': this.dataForm.oilCost,
              'otherCost': this.dataForm.otherCost,
              'surplus': this.dataForm.surplus,
              'fuelAmount': this.dataForm.fuelAmount,
              'oilCardBalance': this.dataForm.oilCardBalance,
              'cash': this.dataForm.cash,
              'remark': this.dataForm.remark,
              'creator': this.dataForm.creator,
              'creatorName': this.dataForm.creatorName,
              'createTime': this.dataForm.createTime
            }
            var tick = !this.dataForm.vehicleTravelId ? API.oavehicletravel.add(params) : API.oavehicletravel.update(params)
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
            }).catch(()=>{

            })
          }
        })
      }
    }
  }
</script>
