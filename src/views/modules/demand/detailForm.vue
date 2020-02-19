<template>
  <el-dialog width="80%" :visible.sync="detailVisible" title="需求信息详细" top="5vh" @close="back" :close-on-click-modal="false">
    <el-form id="detailForm" :model="detailForm" ref="detailForm" label-width="180px" class="demo-demandForm">
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
      <el-form-item :required="true" label="已有材料" prop="existData">
        <el-input class="el-textarea1" type="textarea" :rows="3" v-model="detailForm.existData"></el-input>
        <!--<el-upload-->
        <!--class="upload-demo"-->
        <!--ref="upload"-->
        <!--action=""-->
        <!--:disabled="true"-->
        <!--:file-list="detailForm.fileList"-->
        <!--:auto-upload="false">-->
        <!--<span>已上传文件</span>-->
        <!--</el-upload>-->

      </el-form-item>
      <el-form-item v-if="detailForm.fileList.length!=0" label="已上传文件列表" prop="fileList">
        <ul style="margin:0">
          <li v-for="item in detailForm.fileList">
            <el-button @click="fileLiClickHandle(item.fileId)"
                       type="text">{{item.fileName}}
            </el-button>
          </li>
        </ul>
      </el-form-item>
      <!--<el-form-item :required="true" label="重点需求" prop="important">-->
      <!--<el-radio-group v-model="detailForm.important">-->
      <!--<el-radio label="1" border>重要</el-radio>-->
      <!--<el-radio label="0" border>一般</el-radio>-->
      <!--</el-radio-group>-->
      <!--</el-form-item>-->
      <el-form-item label="@" prop="matter">
        <el-row>
          <el-col :span="8">
            <el-select style="width: 95%" multiple v-model="userIdList" placeholder="办事人">
              <el-option v-for="item in userOptions" :key="item.userId" :label="item.name" :value="item.userId"/>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-date-picker style="width: 95%"
                            v-model="startTime"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择开始日期">
            </el-date-picker>
          </el-col>
          <el-col :span="8">
            <el-date-picker style="width: 95%"
                            v-model="planTime"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择计划完成日期">
            </el-date-picker>
          </el-col>
          <el-col style="margin-top: 5px" :span="20">
            <el-input v-model="matterContent" placeholder="事项内容"></el-input>
          </el-col>
          <el-col style="margin-top: 5px" :span="4">
            <el-button style="width: 80%; margin-left: 10%" type="primary" plain @click="addMatterHandle">添加</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="交流记录" prop="recordList">
        <ul v-if="dataList.length>0" class="infinite-list">
          <li style="border: 1px solid #ccc;border-radius: 5px" 
          v-for="(item,index) in dataList" 
          :key="index" 
          class="infinite-list-item">
            <span style="color: rgba(0, 0, 0, 0.45);font-size: 12px">&nbsp;{{item.userName}}</span>&nbsp;<span
            style="color: #ccc;font-size: 12px">{{item.createTime}}</span><br/>
            <span style="color: rgba(0, 0, 0, 0.65)">&nbsp;{{item.recordContent}}</span>
          </li>
        </ul>
      </el-form-item>
      <el-form-item label="评论" prop="record">
        <el-input class="el-textarea1" type="textarea" :rows="2" v-model="record"></el-input>
      </el-form-item>
      <div style="margin-left: 45%">
        <el-button style="margin-top: 12px;" @click="next" :disabled="isDisabled">评论</el-button>
        <el-button style="margin-top: 12px;" @click="back">返回</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>
<script>
  import API from '@/api'
  import {getMatterUserList} from '@/utils/options.js'

  export default {
    name: 'detailForm',
    props: {
      detailForm: {
        type: Object,
        required: true,
      },
      detailVisible: {
        type: Boolean,
        required: true
      }
    },
    data() {
      return {
        startTime:undefined,
        isDisabled:false,
        planTime:undefined,
        dataList: [],
        record: '',
        matterContent: '',
        userIdList: [],
        userOptions: [],
      }
    },
    mounted() {
      // this.getRecordData();
    },
    watch: {
      'detailForm': function (newVal) {
        this.getRecordData(newVal.dialogId)
        this.userIdList = []
        this.matterContent = ''
        this.record = ''
        this.dataList = []
        this.startTime=undefined
          this.planTime=undefined
      },
    },
    created() {
      getMatterUserList().then(({data}) => {
        this.userOptions = data.userList
      })
    },
    methods: {
      addMatterHandle() {
        if (this.userIdList == null || this.userIdList.length == 0) {
          this.$message.warning("请添加事项办事人")
          return
        }
        if (this.matterContent == null || this.matterContent == '') {
          this.$message.warning("请添加事项内容")
          return
        }
        if (this.startTime == null || this.startTime == '') {
          this.$message.warning("请选择开始时间")
          return
        }
        if (this.planTime == null || this.planTime == '') {
          this.$message.warning("请选择计划完成时间")
          return
        }
        var params = {
          'foreignId': this.detailForm.dialogId,
          'foreignType':'1',
          'matterContent': this.matterContent,
          'userIdList': this.userIdList,
          'startTime': this.startTime,
          'planTime': this.planTime
        }
        API.oamatter.add(params).then(({data}) => {
          if (data && data.code == 0) {
            this.$message.success('事项已提交')
          } else {
            this.$message.error(data.msg)
          }
          this.userIdList = []
          this.matterContent = ''
          this.startTime=undefined
          this.planTime=undefined
        })
      },
      fileLiClickHandle(fileId) {
        // axios.post(window.SITE_CONFIG['baseUrl']+"/oa/oafile/down?tunnel_token="+this.$cookie.get("tunnel_token"),{fileId:fileId})
        //   .then(({data})=>{
        //   if (data && data.code != 0) {
        //     this.$message.error(data.msg)
        //   }
        // })
      },
      getRecordData(dialogId) {
        this.$http({
          url: this.$http.adornUrl('/oa/oarecord/list'),
          method: 'get',
          params: this.$http.adornParams({
            'foreignId': dialogId,
            'recordType': '1'
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
          }
        })
      },
      next() {
        if (this.record != null && this.record.trim() != '') {
          this.isDisabled=true
          this.$http({
            url: this.$http.adornUrl('/oa/oarecord/save'),
            method: 'post',
            data: this.$http.adornData({
              'foreignId': this.detailForm.dialogId,
              'recordContent': this.record,
              'recordType': '1'
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.isDisabled=false
              this.getRecordData(this.detailForm.dialogId)
            }else{
              this.$message.error(data.msg)
                this.$nextTick(()=>{
                        this.isDisabled=false
                      })
            }
          })
        }
      },
      back() {
        this.$parent.detailViewChange(false)
        // this.detailVisible = false
      }
    }
  }
</script>
<style>
  #detailForm .el-form-item {
    margin-bottom: 5px
  }

  .upload-demo {
    width: 100%
  }

  .infinite-list {
    height: 200px;
    padding: 0;
    list-style: none;
    overflow: auto;
    width: 100%;
    margin: 0;
  }

  .infinite-list .infinite-list-item {
    margin: 5px 5px 5px 0px;
    line-height: 20px;
    font-size: 15px;
  }
</style>
