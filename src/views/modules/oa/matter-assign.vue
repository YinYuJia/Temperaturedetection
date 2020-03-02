<template>
  <el-form id="assignForm" :model="assignForm" ref="assignForm" label-width="80px" class="demo-demandForm">
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
          <el-button style="width: 82%; margin-left: 10%" type="primary" plain @click="addAssignHandle">添加</el-button>
        </el-col>
      </el-row>
    </el-form-item>
  </el-form>
</template>
<script>
  import API from '@/api'
  import {getMatterUserList} from '@/utils/options.js'

  export default {
    data() {
      return {
        foreignType:undefined,
        foreignId:undefined,
        dealId:undefined,
        dealOptions:[],
        userOptions:[],
        dataList:[],
        dataListLoading:false,
        dialogId:undefined,
        assignForm:undefined,
        userIdList:[],
        matterContent: '',
        startTime:undefined,
        planTime:undefined,
        pageIndex:1,
        pageSize:10,
        totalCount:0,
      }
    },
    mounted() {
      // this.getRecordData();
    },
    created() {
      getMatterUserList().then(({data}) => {
        this.userOptions = data.userList
      })
    },
    methods: {
      init(row){
        this.dealId = row.matterId
        this.foreignId = row.foreignId
        this.foreignType = row.foreignType
      },
      addAssignHandle(){
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
          'foreignId': this.foreignId,
          'foreignType':this.foreignType,
          'supId':this.dealId,
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
          this.dealId = undefined
          this.userIdList = []
          this.matterContent = ''
          this.startTime=undefined
          this.planTime=undefined
        })
      },
    }
  }
</script>
<style>

</style>
