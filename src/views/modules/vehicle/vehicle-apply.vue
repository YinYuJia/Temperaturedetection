<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" >
      <el-form-item>
        <el-input v-model="dataForm.vehicleType" placeholder="请输入车型" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="query">查询</el-button>
        <el-button v-if="isAuth('oa:oavehicleapply:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      @row-dblclick="tableDbClickHandle"
      style="width: 100%;">
      <el-table-column prop="index" label="序号" width="80" header-align="center" align="center">
        <template slot-scope="scope">
          <span>{{(pageIndex - 1) * pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="vehicleApplyId"
        header-align="center"
        align="center"
        label="车辆申请单ID">
      </el-table-column> -->
      <el-table-column
        prop="vehicleApplyName"
        header-align="center"
        align="center"
        label="申请描述">
      </el-table-column>
      <el-table-column
        prop="vehicleType"  
        header-align="center"
        align="center"
        label="车型">
      </el-table-column>
      <el-table-column
        prop="driverName"
        header-align="center"
        align="center"
        label="司机">
      </el-table-column>
      <el-table-column
        prop="userName"
        header-align="center"
        align="center"
        label="用车人">
      </el-table-column>
      <el-table-column
        prop="entourageName"
        header-align="center"
        align="center"
        label="随行人">
      </el-table-column>
      <el-table-column
        prop="entourageCount"
        header-align="center"
        align="center"
        label="随行人数">
      </el-table-column>
      <el-table-column
        prop="destinationType"
        header-align="center"
        align="center"
        label="目的地">
         <template slot-scope="scope">
            {{scope.row.destinationType==1?'市区':'外省市'}}
          </template>
      </el-table-column>
      <el-table-column
        prop="destinationName"
        header-align="center"
        align="center"
        label="目的地">
      </el-table-column>
      <el-table-column
        prop="startTime"
        header-align="center"
        align="center"
        label="用车开始时间">
      </el-table-column>
      <el-table-column
        prop="endTime"
        header-align="center"
        align="center"
        label="用车结束时间">
      </el-table-column>
      <!-- <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="备注">
      </el-table-column> -->
      <!-- <el-table-column
        prop="approvalName"
        header-align="center"
        align="center"
        label="审批人">
      </el-table-column> -->
      <el-table-column
        prop="approvalStatus"
        header-align="center"
        align="center"
        label="审批状态">
        <template slot-scope="scope">
            {{scope.row.approvalStatus==null?'':scope.row.approvalStatus==0?'未审批':scope.row.approvalStatus==1?'审批通过':'审批不通过'}}
          </template>
      </el-table-column>
      <!-- <el-table-column
        prop="approvalRemark"
        header-align="center"
        align="center"
        label="审批备注">
      </el-table-column> -->
      <el-table-column
        prop="creatorName"
        header-align="center"
        align="center"
        label="创建人">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="创建时间"
        width="180"
        >
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.vehicleApplyId,scope.row.approvalStatus)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.vehicleApplyId,scope.row.approvalStatus)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <vehicle-apply-info v-if="detailVisible"  ref="vehicleApplyInfo" z-index="10000"></vehicle-apply-info>
  </div>
</template>

<script>
  import API from '@/api'
  import AddOrUpdate from './vehicle-apply-add-or-update'
  import vehicleApplyInfo from './vehicle-apply-info'
  export default {
    data () {
      return {
        dataForm: {
          vehicleType: ''
        },
        detailVisible: false,
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate,
      vehicleApplyInfo

    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        var params = {
          page: this.pageIndex,
          limit: this.pageSize,
          vehicleType: this.dataForm.vehicleType
        }
        API.oavehicleapply.list(params).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 双击弹窗
      tableDbClickHandle(oavehicleapply){
        this.handleDetailClick(oavehicleapply.vehicleApplyId)
        
      },
      handleDetailClick(vehicleApplyId) {
        this.detailVisible = true;
        this.$nextTick(()=>{
          this.$refs.vehicleApplyInfo.init(vehicleApplyId);
        })
      },
      // 查询
      query(){
        this.pageIndex = 1
        this.getDataList()
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id,status) {
        if( status == 0 || status == undefined ){
        this.addOrUpdateVisible = true
        this.$nextTick(()=>{
          this.$refs.addOrUpdate.getVehicleData()
        })
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
        }else{
          this.$message.warning('已进行审批，不能操作')
        }
      },
      // 删除
      deleteHandle (id,status) {
        if(status == 0 || status == undefined){
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.vehicleApplyId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          API.oavehicleapply.del(ids).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }else{
        this.$message.warning('已进行审批，不能操作')
      }
      }
    }
  }
</script>
