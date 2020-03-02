<template>
  <el-form id="dealForm" :model="dealForm" ref="dealForm" label-width="80px" class="demo-demandForm">
    <el-form-item label="我的待办" prop="dataList">
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        style="width: 100%;">
        <el-table-column prop="index" label="序号" width="80">
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
          prop="username"
          header-align="center"
          align="center"
          label="办事人">
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
        dataList:[],
        dataListLoading:false,
        dialogId:undefined,
        dealForm:undefined,
        pageIndex:1,
        pageSize:10,
        totalCount:0,
      }
    },
    mounted() {
      // this.getRecordData();
    },
    created() {
    },
    methods: {
      init(id){
        this.dialogId = id
        this.$nextTick(() => {
          this.getDealData(id)
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDealData(this.dialogId)
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDealData(this.dialogId)
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
            this.dataList = data.page.list
          }
        })
      },
      back() {

      }
    }
  }
</script>
<style>

</style>
