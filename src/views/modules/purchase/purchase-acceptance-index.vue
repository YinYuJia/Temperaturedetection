<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.projectName" placeholder="请输入项目名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="query">查询</el-button>
        <el-button type="primary" @click="approvalHandleButton" ref="projectUpload">验收通过</el-button>
      </el-form-item>
      <!-- <el-row>
        <el-col :span="24">
          <el-form-item label="确认人:">
            <el-button @click="()=>{
        this.dataForm.creator = this.$store.state.user.userId;
        this.getDataList();
        }">{{this.$store.state.user.name}}
            </el-button>
            <el-button @click="()=>{
        this.dataForm.creator = '';
        this.getDataList();
        }">全部
            </el-button>
          </el-form-item>
        </el-col>
      </el-row> -->
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @row-dblclick="tableDbClickHandle"
      @current-change="handleCurrentChange"
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="选择" width="50" align="center">
        <template slot-scope="scope">
          <el-radio class="radio" v-model="radio" :label="scope.row.purchaseId">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="index" header-align="center" align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span>{{(pageIndex - 1) * pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="purchaseName"
        header-align="center"
        align="center"
        label="采购名称"
        :show-overflow-tooltip="true"
        width="300"
      ></el-table-column>
      <el-table-column
        prop="projectName"
        header-align="center"
        align="center"
        label="项目名称"
        :show-overflow-tooltip="true"
        width="300"
      ></el-table-column>
      <el-table-column prop="purchaseTime" header-align="center" align="center" label="采购时间"></el-table-column>
      <el-table-column prop="count" header-align="center" align="center" label="采购金额"></el-table-column>
      <el-table-column prop="invoiceStatus" header-align="center" align="center" label="发票情况">
        <template slot-scope="scope">{{scope.row.invoicesStatus == 1 ? '已开票':'未开票'}}</template>
      </el-table-column>
      <el-table-column
        prop="approvalStatusName"
        header-align="center"
        align="center"
        label="采购流程状态"
        width="110"
      ></el-table-column>
      <el-table-column prop="approvalName" header-align="center" align="center" label="审批人"></el-table-column>
      <el-table-column prop="transpayName" header-align="center" align="center" label="转款人"></el-table-column>
      <el-table-column prop="creatorName" header-align="center" align="center" label="创建人"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="approvalHandle(scope.row)">验收</el-button>
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
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <!-- 审批按钮弹出框 -->
    <approval-info v-if="approvalInfoV" ref="approvalInfoButton" @refreshDataList="getDataList"></approval-info>
    <!-- 双击弹窗 -->
    <approval-detail
      v-if="approvalStatusVisible"
      ref="approvalStatus"
      @refreshDataList="getDataList"
    ></approval-detail>
  </div>
</template>

<script>
import API from "@/api";
import approvalDetail from "./detail";
import approvalInfo from "./purchase-acceptance-info";
import http from "@/utils/httpRequest.js";
export default {
  data() {
    return {
      dataForm: {
        projectName: "",
        creator:''
      },
      radio: "",
      selected: {},
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      approvalStatus: '4',
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      detailVisible: false,
      approvalInfoV: false,
      approvalStatusVisible: false
    };
  },
  components: {
    approvalDetail,
    approvalInfo
  },

  created() {
    this.getDataList();
  },
  methods: {
    //   单选选择事件
    handleCurrentChange(val) {
      this.dataListSelections = val;
      if (val == null) {
        this.radio = null;
      } else if (val != null) {
        this.radio = val.purchaseId;
      }
    },
    // 新增审批单独事件
    approvalHandleButton() {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.approvalHandle(this.dataListSelections);
      });
    },

    approvalHandle(row) {
      if(row.creator != this.$store.state.user.userId){
        return this.$message.warning("验收人与当前用户不符，无法验收")
      }
      if (row.approvalStatus == null) {
        this.$message.warning("请选择一个项目");
      } else if (row.approvalStatus < 4) {
        this.$message.warning("请等待前置操作");
      } else if (row.approvalStatus == 5) {
        this.$message.warning("该条信息已进行操作");
      } else {
        this.approvalInfoV = true;
        this.$nextTick(() => {
          if (row.approvalStatus == 5) {
            this.$refs.approvalInfoButton.showApproval = false;
          } else {
            this.$refs.approvalInfoButton.showApproval = true;
          }
          this.$refs.approvalInfoButton.init(row.purchaseId);
        });
      }
    },

    detailViewChange(flag) {
      this.addOrUpdateVisible = flag;
    },

    tableDbClickHandle(oapurchase) {
      this.handleDetailClick(oapurchase);
    },
    handleDetailClick(oapurchase) {
      this.approvalStatusVisible = true;
      this.$nextTick(() => {
        if (oapurchase.transferStatus == 5) {
          this.$refs.approvalStatus.showApproval = false;
        } else {
          this.$refs.approvalStatus.showApproval = true;
        }
        // this.$refs.approvalStatus.getFileList(oapurchase.purchaseId);

        this.$refs.approvalStatus.init(oapurchase.purchaseId);
      });
    },
    getDataList() {
      this.dataListLoading = true;
      var params = {
        page: this.pageIndex,
        limit: this.pageSize,
        projectName: this.dataForm.projectName,
        creator: this.isAuth('oa:purchase:all')?'':this.$store.state.user.userId,
        approvalStatus: this.approvalStatus,
      };
      this.$http({
        url: this.$http.adornUrl("/oa/oapurchase/list"),
        method: "get",
        params: http.adornParams(params, "get")
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list;
          this.totalPage = data.page.totalCount;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
        this.dataListLoading = false;
      });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    //  查询
    query() {
      this.pageIndex = 1;
      this.getDataList();
    }
  }
};
</script>
