<template>
  <el-dialog width="80%" :visible.sync="visible" title="需求信息修改" top="5vh" :close-on-click-modal="false" >
    <el-form id="infoForm" :model="infoForm" ref="infoForm" label-width="120px" class="demo-demandForm">
      <el-row>
        <el-col :span="12">
          <el-form-item :required="true" label="需求名称" prop="dialogName">
            <el-input style="width: 100%" class="el-input3" v-model="infoForm.dialogName" placeholder="请输入需求名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :required="true" label="所属地区" prop="belongArea">
            <el-input style="width: 100%" class="el-input3" v-model="infoForm.belongArea" placeholder="请输入地区"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :required="true" label="客户负责人" prop="customLeader">
            <el-input style="width: 100%" class="el-input3" v-model="infoForm.customLeader" placeholder="请输入客户负责人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :required="true" label="联系电话" prop="phone">
            <el-input style="width: 100%" class="el-input3" v-model="infoForm.phone" placeholder="请输入联系电话"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item :required="true" label="现状描述分析" prop="backDescrip">
        <el-input class="el-textarea1" type="textarea" :rows="4" v-model="infoForm.backDescrip"></el-input>
      </el-form-item>
      <el-form-item :required="true" label="客户的解决方案" prop="solution">
        <el-input class="el-textarea1" type="textarea" :rows="4" v-model="infoForm.solution"></el-input>
      </el-form-item>
      <el-form-item :required="true" label="技术难点" prop="skill">
        <el-input class="el-textarea1" type="textarea" :rows="4" v-model="infoForm.skill"></el-input>
      </el-form-item>
      <el-form-item label="其他需求" prop="checkList">
        <el-checkbox-group v-model="infoForm.checkList">
          <el-checkbox label="论文"></el-checkbox>
          <el-checkbox label="专利"></el-checkbox>
          <el-checkbox label="软著"></el-checkbox>
          <el-checkbox label="查新"></el-checkbox>
          <el-checkbox label="第三方测试"></el-checkbox>
          <el-checkbox label="典型性经验"></el-checkbox>
          <el-checkbox label="管理创新"></el-checkbox>
          <el-checkbox label="QC"></el-checkbox>
          <el-checkbox label="报奖汇报PPT"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item :required="true" label="已有材料" prop="existData">
        <el-input class="el-textarea1" type="textarea" :rows="3" v-model="infoForm.existData"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="infoFormSubmit()" :disabled="isDisabled">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  export default {
    components:{
    },
    data() {
      return {
        visible:false,
        isDisabled: false,
        infoForm:{
          dialogId:undefined,
          dialogName:'',
          belongArea:'',
          customLeader:'',
          phone:'',
          backDescrip: '',
          solution: '',
          skill: '',
          existData: '',
          checkList: [],
        }
      }
    },
    mounted() {
    },
    created() {
    },
    methods: {
      init(id){
        this.visible = true
        this.$nextTick(()=>{
          this.$refs.infoForm.resetFields()
          this.$http({
            url: this.$http.adornUrl('/oa/oadialog/info/' + id),
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.infoForm = data.oaDialog
              const otherRequirement = data.oaDialog.otherRequirement
              const list = otherRequirement == null ? [] : otherRequirement.split(",");
              this.infoForm.checkList = list
            }
          })
        })
      },
      infoFormSubmit(){
        this.$refs.infoForm.validate((valid)=>{
          if (valid) {
            this.isDisabled=true
            this.$http({
              url: this.$http.adornUrl('/oa/oadialog/update'),
              method: 'post',
              data: this.$http.adornData({
                ...this.infoForm,
                otherRequirement: this.infoForm.checkList.toString()
              })
            }).then(({data})=>{
              if(data.code==0){
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration: 500,
                  onClose: () => {
                    this.visible = false
                    this.isDisabled=false
                    this.$emit('refreshDataList')
                  }
                })
              }else{
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
<style>
  #detailForm .el-form-item {
    margin-bottom: 5px
  }
</style>
