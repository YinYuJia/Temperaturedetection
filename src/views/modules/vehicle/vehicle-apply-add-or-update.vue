<template>
  <el-dialog
    :title="!dataForm.vehicleId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="车型" prop="vehicleId">
            <!-- <el-input v-model="dataForm.vehicleId" placeholder="车辆ID"></el-input> -->
            <el-select style="width: 100%"  v-model="dataForm.vehicleId" placeholder="请选择">
              <el-option v-for="item in vehicleData" :key="item.key" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="申请描述" prop="vehicleApplyName">
            <el-input v-model="dataForm.vehicleApplyName" placeholder="申请描述" ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="司机" prop="driver">
            <!-- <el-input v-model="dataForm.driver" placeholder="司机"></el-input> -->
            <el-select style="width: 100%"  v-model="dataForm.driver" placeholder="请选择">
              <el-option v-for="item in staffSelectData" :key="item.key" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用车人" prop="user">
            <!-- <el-input v-model="dataForm.user" placeholder="用车人"></el-input> -->
            <el-select style="width: 100%"  v-model="dataForm.user" placeholder="请选择">
              <el-option v-for="item in staffSelectData" :key="item.key" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="随行人" prop="entourage" >
        <!-- <el-input v-model="dataForm.entourage" placeholder="随行人"></el-input> -->
        <el-select style="width: 100%" multiple v-model="dataForm.entourage" placeholder="请选择" @change="peopleNum">
          <el-option v-for="item in staffSelectData" :key="item.key" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="随行人姓名" prop="entourageName">
        <el-input v-model="dataForm.entourageName" placeholder="随行人姓名"></el-input>
      </el-form-item> -->
      <el-form-item label="随行人数" prop="entourageCount">
        <el-input v-model="dataForm.entourageCount" placeholder="随行人数" :disabled="true"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="24">
      <el-form-item label="目的地" prop="destinationName" >
        <!-- <el-input v-model="dataForm.destinationType" placeholder="目的地类型（1:市内；2：外省市）"></el-input> -->
        <el-select style="width: 20%" v-model="dataForm.destinationType" placeholder="请选择" prop="destinationType" >
                  <el-option
                    v-for="item in options"
                    :key="item.dmId"
                    :label="item.dmsm"
                    :value="item.dmz"
                  />
                </el-select>
          <el-input v-model="dataForm.destinationName" placeholder="目的地" style="width:75%" prop="destinationType"></el-input>
      </el-form-item>
        </el-col>
        <!-- <el-col :span="17">
          <el-form-item prop="destinationName">
            <el-input v-model="dataForm.destinationName" placeholder="目的地" ></el-input>
          </el-form-item>
        </el-col> -->
      </el-row>
      <el-row>
        <el-col :span="12">
      <el-form-item  label="用车开始时间" prop="startTime" >
        <!-- <el-input v-model="dataForm.startTime" placeholder="用车开始时间"></el-input> -->
        <span v-if="true">
            <el-date-picker
              style="width: 100%"
              size="small"
              v-model="dataForm.startTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间">
              </el-date-picker>
        </span>
      </el-form-item>
        </el-col>
        <el-col :span="12">
      <el-form-item label="用车结束时间" prop="endTime" >
        <!-- <el-input v-model="dataForm.endTime" placeholder="用车结束时间"></el-input> -->
        <span v-if="true">
            <el-date-picker
              style="width: 100%;"
              size="small"
              v-model="dataForm.endTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间">
              </el-date-picker>
        </span>
      </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="审批人" prop="approval">
        <!-- <el-input v-model="dataForm.approval" placeholder="审批人"></el-input> -->
        <el-select style="width: 100%"  v-model="dataForm.approval" placeholder="请选择">
          <el-option v-for="item in staffSelectData" :key="item.key" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <!-- <el-form-item label="审批人姓名" prop="approvalName">
        <el-input v-model="dataForm.approvalName" placeholder="审批人姓名"></el-input>
      </el-form-item> -->

      <!----------------------------------------------------------- 分割线 --------------------------------------------------->
      <!----------------------------------------------------------- 分割线 --------------------------------------------------->
      <!----------------------------------------------------------- 分割线 --------------------------------------------------->
      <!----------------------------------------------------------- 分割线 --------------------------------------------------->
      <!----------------------------------------------------------- 分割线 --------------------------------------------------->
      <!----------------------------------------------------------- 分割线 --------------------------------------------------->

      <!-- <el-form-item label="审批状态" prop="approvalStatus">
        <el-input v-model="dataForm.approvalStatus" placeholder="审批状态"></el-input>
      </el-form-item>
      <el-form-item label="审批备注" prop="approvalRemark">
        <el-input v-model="dataForm.approvalRemark" placeholder="审批备注"></el-input>
      </el-form-item>
      <el-form-item label="创建人" prop="creator">
        <el-input v-model="dataForm.creator" placeholder="创建人"></el-input>
      </el-form-item>
      <el-form-item label="创建人姓名" prop="creatorName">
        <el-input v-model="dataForm.creatorName" placeholder="创建人姓名"></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
        <span v-if="true">
            <el-date-picker
              style="width: 100%;"
              size="small"
              v-model="dataForm.createTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间">
              </el-date-picker>
        </span>
      </el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :disabled="isDisabled">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import API from '@/api'
  import { getOptions } from "@/utils/options.js"
  export default {
    data () {
      return {
        visible: false,
        staffSelectData: '',
        vehicleData: '',
        isDisabled: false,
        options: [],
        dataForm: {
          vehicleApplyId: 0,
          vehicleId: '',
          vehicleType: '',
          driver: '',
          driverName: '',
          user: '',
          userName: '',
          entourage: [],
          entourageName: '',
          entourageCount: '',
          destinationType: '',
          destinationName: '',
          startTime: '',
          endTime: '',
          remark: '',
          approval: '',
          approvalName: '',
          approvalStatus: '',
          approvalRemark: '',
          creator: '',
          creatorName: '',
          createTime: '',
          vehicleType: '',
          vehicleApplyName: ''
        },
        dataRule: {
          vehicleId: [
            { required: true, message: '车型不能为空', trigger: 'blur' }
          ],
          vehicleApplyName: [
            { required: true, message: '申请描述不能为空', trigger: 'blur' }
          ],
          driver: [
            { required: true, message: '司机不能为空', trigger: 'blur' }
          ],
          driverName: [
            { required: true, message: '司机姓名不能为空', trigger: 'blur' }
          ],
          user: [
            { required: true, message: '用车人不能为空', trigger: 'blur' }
          ],
          userName: [
            { required: true, message: '用车人姓名不能为空', trigger: 'blur' }
          ],
          entourage: [
            { required: true, message: '随行人不能为空', trigger: 'blur' }
          ],
          entourageName: [
            { required: true, message: '随行人姓名不能为空', trigger: 'blur' }
          ],
          entourageCount: [
            { required: true, message: '随行人数不能为空', trigger: 'blur' }
          ],
          destinationType: [
            { required: true, message: '目的地类型（1:市内；2：外省市）不能为空', trigger: 'blur' }
          ],
          destinationName: [
            { required: true, message: '目的地不能为空', trigger: 'blur' }
          ],
          startTime: [
            { required: true, message: '用车开始时间不能为空', trigger: 'blur' }
          ],
          endTime: [
            { required: true, message: '用车结束时间不能为空', trigger: 'blur' }
          ],
          // remark: [
          //   { required: true, message: '备注不能为空', trigger: 'blur' }
          // ],
          approval: [
            { required: true, message: '审批人不能为空', trigger: 'blur' }
          ],
          approvalName: [
            { required: true, message: '审批人姓名不能为空', trigger: 'blur' }
          ],
          approvalStatus: [
            { required: true, message: '审批状态不能为空', trigger: 'blur' }
          ],
          approvalRemark: [
            { required: true, message: '审批备注不能为空', trigger: 'blur' }
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
      getOptions("MDDLX").then(({ data }) => {
      this.options = data.dmlxList;
      this.getStaffSelectData() 
      this.getVehicleData()
    });
    },
    methods: {
      peopleNum(value){
        this.dataForm.entourageCount = value.length
      },
      init (id) {
        this.dataForm.vehicleApplyId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.vehicleApplyId) {
            API.oavehicleapply.info(this.dataForm.vehicleApplyId).then(({data}) => {
              if (data && data.code === 0) {
                 const vdataList = []
                  const carType = 0
                if (data.oaVehicleApply.entourage != null) {
                  data.oaVehicleApply.entourage.split(",").map((item, index) => {
                    vdataList.push(parseInt(item))
                  })
                }
                if (data.oaVehicleApply.destinationType != null){
                  data.oaVehicleApply.destinationType.split(",").map((item, index) => {
                      carType=parseInt(item)
                    })
                }
                this.dataForm.entourage = vdataList
                this.dataForm.destinationType = carType
                this.dataForm.vehicleId = data.oaVehicleApply.vehicleId
                this.dataForm.vehicleType = data.oaVehicleApply.vehicleType
                this.dataForm.driver = data.oaVehicleApply.driver
                this.dataForm.driverName = data.oaVehicleApply.driverName
                this.dataForm.user = data.oaVehicleApply.user
                this.dataForm.userName = data.oaVehicleApply.userName
                this.dataForm.entourageName = data.oaVehicleApply.entourageName
                this.dataForm.entourageCount = data.oaVehicleApply.entourageCount
                // this.dataForm.destinationType = data.oaVehicleApply.destinationType
                this.dataForm.destinationName = data.oaVehicleApply.destinationName
                this.dataForm.startTime = data.oaVehicleApply.startTime
                this.dataForm.endTime = data.oaVehicleApply.endTime
                this.dataForm.remark = data.oaVehicleApply.remark
                this.dataForm.approval = data.oaVehicleApply.approval
                this.dataForm.approvalName = data.oaVehicleApply.approvalName
                this.dataForm.approvalStatus = data.oaVehicleApply.approvalStatus
                this.dataForm.approvalRemark = data.oaVehicleApply.approvalRemark
                this.dataForm.creator = data.oaVehicleApply.creator
                this.dataForm.creatorName = data.oaVehicleApply.creatorName
                this.dataForm.createTime = data.oaVehicleApply.createTime
                this.dataForm.vehicleApplyName = data.oaVehicleApply.vehicleApplyName
                
              }
            })
          }
        })
      },
      // 获取随行人员
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
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.isDisabled=true
            var params = {
              'vehicleApplyId': this.dataForm.vehicleApplyId || undefined,
              'vehicleId': this.dataForm.vehicleId,
              'vehicleType': this.dataForm.vehicleType,
              'driver': this.dataForm.driver,
              'driverName': this.dataForm.driverName,
              'user': this.dataForm.user,
              'userName': this.dataForm.userName,
              'entourages': this.dataForm.entourage,
              'entourageName': this.dataForm.entourageName,
              'entourageCount': this.dataForm.entourageCount,
              'destinationType': this.dataForm.destinationType,
              'destinationName': this.dataForm.destinationName,
              'startTime': this.dataForm.startTime,
              'endTime': this.dataForm.endTime,
              'remark': this.dataForm.remark,
              'approval': this.dataForm.approval,
              'approvalName': this.dataForm.approvalName,
              'approvalStatus': this.dataForm.approvalStatus,
              'approvalRemark': this.dataForm.approvalRemark,
              'creator': this.dataForm.creator,
              'creatorName': this.dataForm.creatorName,
              'createTime': this.dataForm.createTime,
              'vehicleApplyName': this.dataForm.vehicleApplyName
            }
            var tick = !this.dataForm.vehicleApplyId ? API.oavehicleapply.add(params) : API.oavehicleapply.update(params)
            tick.then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                      this.$nextTick(()=>{
                          this.isDisabled=false
                        })
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
