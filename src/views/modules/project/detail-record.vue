<template>
  <el-form id="recordForm" :model="recordForm" ref="recordForm" label-width="120px" class="demo-demandForm">
    <el-form-item label="历史交流记录" prop="hisRecord">
      <ul v-if="hisList.length>0" class="infinite-list">
        <li style="border: 1px solid #ccc;border-radius: 5px" v-for="(item,index) in hisList" :key="index" class="infinite-list-item">
          <span style="color: rgba(0, 0, 0, 0.45);font-size: 12px">&nbsp;{{item.userName}}</span>&nbsp;<span
          style="color: #ccc;font-size: 12px">{{item.createTime}}</span><br/>
          <span style="color: rgba(0, 0, 0, 0.65)">&nbsp;{{item.recordContent}}</span>
        </li>
      </ul>
    </el-form-item>
    <el-form-item label="交流记录" prop="recordList">
      <ul v-if="recordList.length>0" class="infinite-list">
        <li style="border: 1px solid #ccc;border-radius: 5px" v-for="(item,index) in recordList" :key="index" class="infinite-list-item">
          <span style="color: rgba(0, 0, 0, 0.45);font-size: 12px">&nbsp;{{item.userName}}</span>&nbsp;<span
          style="color: #ccc;font-size: 12px">{{item.createTime}}</span><br/>
          <span style="color: rgba(0, 0, 0, 0.65)">&nbsp;{{item.recordContent}}</span>
        </li>
      </ul>
    </el-form-item>
    <el-form-item label="评论" prop="record">
      <el-input class="el-textarea1" type="textarea" :autosize="{minRows:6}" v-model="record"></el-input>
    </el-form-item>
    <div style="margin-left: 45%">
      <el-button style="margin-top: 12px;"  @click="comment">评论</el-button>
    </div>
  </el-form>
</template>
<script>
  export default {
    data() {
      return {
        projectId:undefined,
        recordForm:undefined,
        dataList:[],
        hisList:[],
        recordList:[],
        record:''
      }
    },
    mounted() {
      // this.getRecordData();
    },
    created() {
    },
    methods: {
      init(projectId){
        this.projectId = projectId
        this.$nextTick(() => {
          this.getHisRecordData(projectId)
          this.getRecordData(projectId)
        })
      },
      getHisRecordData(projectId) {
        this.$http({
          url: this.$http.adornUrl('/oa/oarecord/hisList/'+projectId),
          method: 'get',
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.hisList = data.hisList
          }
        })
      },
      getRecordData(projectId) {
        this.$http({
          url: this.$http.adornUrl('/oa/oarecord/list'),
          method: 'get',
          params: this.$http.adornParams({
            'foreignId': projectId,
            'recordType': '2'
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.recordList = data.page.list
          }
        })
      },
      comment() {
        if (this.record != null && this.record.trim() != '') {
          this.$http({
            url: this.$http.adornUrl('/oa/oarecord/save'),
            method: 'post',
            data: this.$http.adornData({
              'foreignId': this.projectId,
              'recordContent': this.record,
              'recordType': '2'
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.getRecordData(this.projectId)
            }
          })
        }
      },
    }
  }
</script>
<style>
  .infinite-list {
    max-height: 480px;
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
