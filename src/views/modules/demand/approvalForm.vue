<template>
  <el-dialog width="80%" :visible.sync="detailVisible" title="需求信息详细" top="5vh" @close="back" :close-on-click-modal="false">
    <el-form :model="detailForm" ref="detailForm" label-width="180px" class="demo-demandForm">
      <el-form-item :required="true" label="现状描述分析" prop="backDescrip">
        <el-input class="el-textarea1" type="textarea" :rows="4" v-model="detailForm.backDescrip"></el-input>
      </el-form-item>
      <el-form-item :required="true" label="客户的解决方案" prop="solution">
        <el-input class="el-textarea1" type="textarea" :rows="4" v-model="detailForm.solution"></el-input>
      </el-form-item>
      <!--<el-form-item :required="true" label="问题总结" prop="problem">-->
      <!--<el-input class="el-textarea1" type="textarea" :rows="3" v-model="detailForm.problem"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item :required="true" label="技术难点" prop="skill">
        <el-input class="el-textarea1" type="textarea" :rows="4" v-model="detailForm.skill"></el-input>
      </el-form-item>
      <!--<el-form-item :required="true" label="问题存在的普遍性" prop="problemUniversal">-->
      <!--<el-input class="el-textarea1" type="textarea" :rows="3" v-model="detailForm.problemUniversal"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item :required="true" label="同类产品分析" prop="productAnaly">-->
      <!--<el-input class="el-textarea1" type="textarea" :rows="3" v-model="detailForm.productAnaly"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item :required="true" label="现有产品的照片及缺陷" prop="defect">-->
      <!--<el-input class="el-textarea1" type="textarea" :rows="3" v-model="detailForm.defect"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item :required="true" label="局方落地部门及联系人" prop="localContact">-->
      <!--<el-input class="el-textarea1" type="textarea" :rows="1" v-model="detailForm.localContact"></el-input>-->
      <!--</el-form-item>-->
      <el-form-item label="其他需求" prop="checkList">
        <el-checkbox-group v-model="detailForm.checkList">
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
      <el-form-item :required="true" label="局方已有材料" prop="existData">
        <el-input class="el-textarea1" type="textarea" :rows="3" v-model="detailForm.existData"></el-input>
        <el-upload
          class="upload-demo"
          ref="upload"
          :disabled="true"
          action=""
          :file-list="detailForm.fileList"
          :auto-upload="false">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item :required="true" label="重点需求" prop="important">
        <el-radio-group v-model="detailForm.important">
          <el-radio label="1" border>重要</el-radio>
          <el-radio label="0" border>一般</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="交流记录" prop="record">
        <ul v-if="dataList.length>0" class="infinite-list">
          <li style="border: 1px solid #ccc;border-radius: 5px" v-for="item in dataList" class="infinite-list-item">
            <span style="color: rgba(0, 0, 0, 0.45);font-size: 12px">&nbsp;{{item.userName}}</span>&nbsp;<span style="color: #ccc;font-size: 12px">{{item.createTime}}</span><br/>
            <span style="color: rgba(0, 0, 0, 0.65)">&nbsp;{{item.recordContent}}</span>
          </li>
        </ul>
      </el-form-item>
      <div v-if="flag" style="margin-left: 40%">
        <el-button style="margin-top: 12px;" @click="next(2)">审批不通过</el-button>
        <el-button style="margin-top: 12px;" @click="next(1)">审批通过</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>
<script>
  export default {
    name:'approvalForm',
    props:{
      detailForm:{
        type: Object,
        required: true,
      },
      detailVisible:{
        type: Boolean,
        required: true
      },
      flag:{
        type: Boolean
      }
    },
    data() {
      return {
        dataList:[],
      }
    },
    mounted(){
      // this.getRecordData();
    },
    watch: {
      'detailForm': function(newVal){
        this.getRecordData(newVal.dialogId)
      },
    },
    methods:{
      back(){
        this.$parent.detailViewChange(false)
        // this.detailVisible = false
      },
      getRecordData(dialogId){
        this.$http({
          url: this.$http.adornUrl('/oa/oarecord/list'),
          method: 'get',
          params: this.$http.adornParams({
            'foreignId': dialogId,
            'recordType': '1',
          })
        }).then(({data})=>{
          if (data && data.code === 0) {
            this.dataList = data.page.list
          }
        })
      },
      next(status){
        this.$http({
          url: this.$http.adornUrl('/oa/oadialog/approval'),
          method: 'post',
          data: this.$http.adornData({
            'dialogId':this.detailForm.dialogId,
            'approvalStatus':status
          })
        }).then(({data})=>{
          if (data && data.code === 0) {
            this.$parent.detailViewChange(false)
            this.$parent.getDataList()
          }
        })
      }
    }
  }
</script>
<style>
  .upload-demo{width: 100%}
  .infinite-list{
    padding:0;list-style:none;overflow:auto;
    width: 93%;
    margin: 0;
  }
  .infinite-list .infinite-list-item{
    margin:5px 5px 5px 0px;
    line-height:20px;
    font-size: 15px;
  }
</style>
