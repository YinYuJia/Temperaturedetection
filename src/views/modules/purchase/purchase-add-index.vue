<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.projectName" placeholder="请输入项目名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="query">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
      <el-row v-show="this.isAuth('oa:purchase:all')">
        <el-col :span="24">
          <el-form-item label="创建人:">
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
      </el-row>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @row-dblclick="tableDbClickHandle"
      highlight-current-row
      style="width: 100%;"
    >
      <!-- <el-table-column
        v-if="isAuth('oa:oarepay:delete')"
        type="selection"
        header-align="center"
        align="center"
        width="50"
        >
      </el-table-column> -->
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
      <!--      <el-table-column-->
      <!--        prop="createTime"-->
      <!--        header-align="center"-->
      <!--        align="center"-->
      <!--        label="创建时间"-->
      <!--        width="200"-->
      <!--      ></el-table-column>-->
      <el-table-column prop="approvalName" header-align="center" align="center" label="审批人"></el-table-column>
      <el-table-column prop="transpayName" header-align="center" align="center" label="转款人"></el-table-column>
      <el-table-column prop="creatorName" header-align="center" align="center" label="创建人"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="addOrUpdateHandle(scope.row)"
          >修改
          </el-button>
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
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
      z-index="10001"
    ></add-or-update>
    <add-detail v-if="detailVisible" ref="addInfo"></add-detail>
  </div>
</template>

<script>
    import API from "@/api";
    import http from "@/utils/httpRequest.js";
    import addOrUpdate from "./purchase-add";
    import addDetail from "./detail";
    import {constants} from "fs";

    export default {
        data() {
            return {
                dataForm: {
                    projectName: "",
                    creator: ''
                },
                userId: "",
                dataList: [],
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                dataListLoading: false,
                dataListSelections: [],
                addOrUpdateVisible: false,
                detailVisible: false
            };
        },
        components: {
            addOrUpdate,
            addDetail
        },
        created() {
            this.dataForm.creator = this.$store.state.user.userId
            this.getDataList();
        },
        methods: {
            // //   单选选择事件
            // handleCurrentChange (val) {
            //   this.dataListSelections = val
            // },
            // 新增 / 修改
            addOrUpdateHandle(row) {
                if (row != null) {
                    if (row.creator != this.$store.state.user.userId) {
                        return this.$message.warning("创建人与当前用户不符，无法修改")
                    }
                }
                const id = row == null ? null : row.purchaseId;
                const approvalStatus = row == null ? null : row.approvalStatus
                if (approvalStatus > 0 && approvalStatus != 2) {
                    this.$message.warning("该项目已进行操作，不能修改");
                } else if (approvalStatus == 2 || approvalStatus == 0 || approvalStatus == null) {
                    this.addOrUpdateVisible = true;
                    this.$nextTick(() => {
                        this.$refs.addOrUpdate.init(id);
                    });
                }
            },
            //   approvalHandle (row) {
            //     if(row.approvalStatus!='0'){
            //       this.$message.error("该条信息已审核")
            //     }else{
            //       this.detailVisible = true
            //       this.$nextTick(() => {
            //         if(row.approvalStatus!=0){
            //           this.$refs.purchaseTitle.showApproval = false
            //         }else{
            //           this.$refs.purchaseTitle.showApproval = true
            //         }
            //         this.$refs.purchaseTitle.init(row.purchaseId)
            //       })
            //     }
            //   },
            tableDbClickHandle(oaPurchase) {
                this.detailVisible = true;
                this.handleDetailClick(oaPurchase.purchaseId);
            },
            handleDetailClick(purchaseId) {
                this.detailVisible = true;
                this.$nextTick(() => {
                    this.$refs.addInfo.init(purchaseId);
                });
            },
            getDataList() {
                // console.log(this.isAuth('oa:purchase:all'))
                this.dataListLoading = true;
                var params = {
                    page: this.pageIndex,
                    limit: this.pageSize,
                    projectName: this.dataForm.projectName,
                    creator: this.dataForm.creator,
                };
                this.$http({
                    url: this.$http.adornUrl("/oa/oapurchase/list"),
                    method: "get",
                    params: http.adornParams(params, "get")
                }).then(({data}) => {
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
