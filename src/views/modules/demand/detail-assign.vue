<template>
  <el-form id="assignForm" :model="assignForm" ref="assignForm" label-width="80px" class="demo-demandForm">
    <el-form-item label="@" prop="matter">
      <el-row>
        <el-col :span="6">
          <el-select style="width: 95%" :filterable="true" v-model="dealId" placeholder="我的待办(可不填)">
            <el-option v-for="item in dealOptions" :key="item.matterId" :label="item.matterContent" :value="item.matterId"/>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select style="width: 95%" multiple v-model="userIdList" placeholder="办事人">
            <el-option v-for="item in userOptions" :key="item.userId" :label="item.name" :value="item.userId"/>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-date-picker style="width: 95%"
                          v-model="startTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择开始日期">
          </el-date-picker>
        </el-col>
        <el-col :span="6">
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
    <el-form-item label="我的分派" prop="dataList">
      <el-table
        :data="dataList"
        border
        row-key="matterId"
        v-loading="dataListLoading"
        style="width: 100%;">
        <el-table-column prop="index" header-align="center"
                         align="center" label="序号" width="80">
          <template slot-scope="scope">
            <!--{{scope.$index}}-->
            <!--{{pageIndex}}-->
            <!--{{pageSize}}-->
            <span>{{(pageIndex - 1) * pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="foreignName"
          header-align="center"
          align="center"
          label="需求名称"
          width="400">
        </el-table-column>
        <el-table-column
          prop="matterContent"
          header-align="center"
          align="center"
          label="事项内容"
          width="400">
        </el-table-column>
        <el-table-column
          prop="matterStatusName"
          header-align="center"
          align="center"
          label="事项状态"
          width="180">
        </el-table-column>
        <el-table-column
          prop="username"
          header-align="center"
          align="center"
          label="办事人">
        </el-table-column>
        <el-table-column
          prop="planTime"
          header-align="center"
          align="center"
          label="计划完成时间"
          width="180">
        </el-table-column>
        <el-table-column
          prop="actualTime"
          header-align="center"
          align="center"
          label="实际完成时间"
          width="180">
        </el-table-column>
        <el-table-column
          prop="creatorName"
          header-align="center"
          align="center"
          label="创建人">
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalCount"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </el-form-item>
  </el-form>
</template>
<script>
  import API from '@/api'
  import {getMatterUserList} from '@/utils/options.js'

  export default {
    data() {
      return {
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
      init(id){
        this.dialogId = id
        this.$nextTick(() => {
          this.getAssignData(id)
          this.getDealData(id)
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getAssignData(this.dialogId)
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getAssignData(this.dialogId)
      },
      getAssignData(id){
        this.dataListLoading = true
        var params = {
          creator:this.$store.state.user.userId,
          foreignId:id,
          foreignType:'1',
          page: this.pageIndex,
          limit: this.pageSize,
        }
        API.oamatter.assignByUser(params).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalCount = data.page.totalCount
          } else {
            this.dataList = []
            this.totalCount = 0
          }
          this.dataListLoading = false
        })
      },
      getDealData(id){
        var params = {
          user_id:this.$store.state.user.userId,
          foreignId:id,
          foreignType:'1',
          page: 1,
          limit: 100000
        }
        API.oamatter.listByUser(params).then(({data}) => {
          if (data && data.code === 0) {
            this.dealOptions = data.page.list
          }
        })
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
          'foreignId': this.dialogId,
          'foreignType':'1',
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
          this.getAssignData(this.dialogId)
        })
      },
      back() {

      }
    }
  }
</script>
<style>

</style>
