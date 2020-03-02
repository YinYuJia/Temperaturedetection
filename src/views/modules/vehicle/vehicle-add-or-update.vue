<template>
  <el-dialog
    :title="!dataForm.vehicleId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-row>
        <el-col :span="12">
      <el-form-item label="车型" prop="vehicleType">
        <el-input v-model="dataForm.vehicleType" placeholder="车型"></el-input>
      </el-form-item>
        </el-col>
        <el-col :span="12">
      <el-form-item label="车牌" prop="plate">
        <el-input v-model="dataForm.plate" placeholder="车牌"></el-input>
      </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <!-- <el-form-item label="专管员" prop="commissioner">
            <el-input v-model="dataForm.commissioner" placeholder="专管员"></el-input>
          </el-form-item> -->
        </el-col>
        <el-col :span="12">
          <el-form-item label="专管姓名"  prop="commissioner">
            <!-- <el-input v-model="dataForm.commissionerName" placeholder="专管员姓名"></el-input> -->
            <el-select style="width: 100%"  v-model="dataForm.commissioner" placeholder="专管员姓名">
              <el-option v-for="item in staffSelectData" :key="item.key" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="油卡" prop="oilCard">
            <el-input v-model="dataForm.oilCard" placeholder="油卡"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="ETC" prop="etc">
            <el-input v-model="dataForm.etc" placeholder="ETC"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
      <!-- <el-form-item label="审批人" prop="vehicelApproval">
        <el-select  style="width: 100%;" v-model="dataForm.vehicelApproval" placeholder="请选择">
          <el-option v-for="item in approvalData" :key="item.key" :label="item.label" :value="item.value"/>
        </el-select>
        <el-input v-model="dataForm.vehicelApproval" placeholder="审批人"></el-input>
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
  export default {
    data () {
      return {
        visible: false,
        isDisabled: false,
        staffSelectData: '',
        dataForm: {
          vehicleId: 0,
          vehicleType: '',
          plate: '',
          commissioner: '',
          commissionerName: '',
          oilCard: '',
          etc: '',
          remark: '',
          vehicelApproval: '',
        },
        dataRule: {
          vehicleType: [
            { required: true, message: '车型不能为空', trigger: 'blur' }
          ],
          plate: [
            { required: true, message: '车牌不能为空', trigger: 'blur' }
          ],
          commissioner: [
            { required: true, message: '专管员不能为空', trigger: 'blur' }
          ],
          commissionerName: [
            { required: true, message: '专管员姓名不能为空', trigger: 'blur' }
          ],
          oilCard: [
            { required: true, message: '油卡不能为空', trigger: 'blur' }
          ],
          etc: [
            { required: true, message: 'ETC不能为空', trigger: 'blur' }
          ],
          // remark: [
          //   { required: true, message: '备注不能为空', trigger: 'blur' }
          // ]
          // vehicelApproval: [
          //   { required: true, message: '审批人不能为空', trigger: 'blur' }
          // ]
        }
      }
    },
    created () {
      this.getStaffSelectData()
    },
    methods: {
      init (id) {
        this.dataForm.vehicleId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.vehicleId) {
            API.oavehicle.info(this.dataForm.vehicleId).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.vehicleType = data.oaVehicle.vehicleType
                this.dataForm.plate = data.oaVehicle.plate
                this.dataForm.commissioner = data.oaVehicle.commissioner
                this.dataForm.commissionerName = data.oaVehicle.commissionerName
                this.dataForm.oilCard = data.oaVehicle.oilCard
                this.dataForm.etc = data.oaVehicle.etc
                this.dataForm.remark = data.oaVehicle.remark
              }
            })
          }
        })
      },
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
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.isDisabled=true
            var params = {
              'vehicleId': this.dataForm.vehicleId || undefined,
              'vehicleType': this.dataForm.vehicleType,
              'plate': this.dataForm.plate,
              'commissioner': this.dataForm.commissioner,
              'commissionerName': this.dataForm.commissionerName,
              'oilCard': this.dataForm.oilCard,
              'etc': this.dataForm.etc,
              'remark': this.dataForm.remark,
            }
            var tick = !this.dataForm.vehicleId ? API.oavehicle.add(params) : API.oavehicle.update(params)
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
            })
          }
        })
      }
    }
  }
</script>
