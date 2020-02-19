<template>
<div>
        <el-form
          :model="dataForm"
          ref="dataForm"
          @keyup.enter.native="dataFormSubmit()"
          label-width="150px"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="项目" prop="projectId">
                <el-select
                  filterable
                  style="width: 100%"
                  v-model="dataForm.projectId"
                  placeholder="请选择"
                  :disabled="true"
                >
                  <el-option
                    v-for="item in selectData"
                    :key="item.key"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="采购名称" prop="purchaseName">
                <el-input v-model="dataForm.purchaseName" placeholder="请输入采购名称" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="采购时间" prop="purchaseTime">
                <el-date-picker
                  style="width: 100%"
                  :clearable="false"
                  v-model="dataForm.purchaseTime"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择采购时间"
                  :disabled="true"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="采购金额" prop="count">
                <el-input v-model="dataForm.count" placeholder="请输入采购金额" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="发票详情" prop="invoiceStatus">
                <el-select
                  style="width: 100%"
                  v-model="dataForm.invoiceStatus"
                  placeholder="请选择"
                  :disabled="true"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.dmId"
                    :label="item.dmsm"
                    :value="item.dmz"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="转款公司" prop="transferCompany">
                <el-input v-model="dataForm.transferCompany" placeholder="请输入转款公司" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="转款账号" prop="transferNumber">
                <el-input v-model="dataForm.transferNumber" placeholder="请输入转款账号" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="转款开户行" prop="transferBank">
                <el-input v-model="dataForm.transferBank" placeholder="请输入转款开户行" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="厂家联系人" prop="factoryContact">
                <el-input v-model="dataForm.factoryContact" placeholder="请输入厂家联系人" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="厂家电话" prop="factoryPhone">
                <el-input v-model="dataForm.factoryPhone" placeholder="请输入厂家电话" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 审批人 s -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="审批人" prop="approval">
                <el-select
                  style="width: 100%;"
                  v-model="dataForm.approval"
                  placeholder="请选择"
                  :disabled="true"
                >
                  <el-option
                    v-for="item in approvalData"
                    :key="item.key"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 审批人 e -->
          <!-- 审批备注 s-->
          <el-form-item label="审批备注" prop="approvalRemark">
            <el-input v-model="dataForm.approvalRemark" :disabled="true" />
          </el-form-item>
          <!-- 审批备注 e-->
          <el-row>
            <el-col :span="24">
              <!-- <el-form-item label="文件列表" prop="dataList">
                <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
                  <el-table-column prop="index" label="序号" width="80">
                    <template slot-scope="scope">
                      <span>{{(pageIndex - 1) * pageSize + scope.$index + 1}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="fileName"
                    label="文件名"
                    header-align="center"
                    align="center"
                  />
                </el-table>
                <el-pagination
                  @size-change="sizeChangeHandle"
                  @current-change="currentChangeHandle"
                  :current-page="pageIndex"
                  :page-sizes="[10, 20, 50, 100]"
                  :page-size="pageSize"
                  :total="totalCount"
                  layout="total, sizes, prev, pager, next, jumper"
                ></el-pagination>
              </el-form-item> -->
            </el-col>
          </el-row>
<!--          <el-row>-->
<!--            <el-col :span="12">-->
<!--              <el-form-item label="转款时间" prop="transpayTime">-->
<!--                <el-date-picker-->
<!--                  style="width: 100%"-->
<!--                  :clearable="false"-->
<!--                  v-model="dataForm.transpayTime"-->
<!--                  type="date"-->
<!--                  format="yyyy-MM-dd"-->
<!--                  value-format="yyyy-MM-dd"-->
<!--                  placeholder="选择转款时间"-->
<!--                  :disabled="true"-->
<!--                ></el-date-picker>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--              <el-form-item label="转款金额" prop="transpayAmount">-->
<!--                <el-input v-model="dataForm.transpayAmount" placeholder="请输入转款金额" :disabled="true"></el-input>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->
          <el-row>
            <el-col :span="12">
              <el-form-item label="是否全款" prop="transpayIsall">
                <el-select
                  style="width: 100%"
                  v-model="dataForm.transpayIsall"
                  placeholder="请选择"
                  :disabled="true"
                >
                  <el-option
                    v-for="item in isAll"
                    :key="item.dmId"
                    :label="item.dmsm"
                    :value="item.dmz"
                  />
                </el-select>
              </el-form-item>

            </el-col>
            <el-col :span="12">
            <el-form-item label="转款人" prop="transpayName">
                          <el-input v-model="dataForm.transpayName" :disabled="true" />
                        </el-form-item>
              </el-col>
          </el-row>
          <el-form-item label="详细信息" :required="true" prop="detailData">
            <el-table
              :data="dataForm.detailData"
              border
            >
              <el-table-column type="index" width="50"
                               label="序号" header-align="center" align="center">
              </el-table-column>
              <el-table-column width="180"
                               label="转款时间" header-align="center" align="center">
                <template slot-scope="scope">
                            <span v-if="true">
                                <el-date-picker
                                  style="max-width: 140px"
                                  disabled
                                  size="small"
                                  v-model="scope.row.time"
                                  type="date"
                                  value-format="yyyy-MM-dd"
                                  placeholder="选择日期时间">
                                  </el-date-picker>
                            </span>
                </template>
              </el-table-column>
              <el-table-column width="150"
                               label="转款金额" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-input size="small" disabled placeholder="请输入转款金额" v-model="scope.row.amount">
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="备注" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-input size="small" disabled placeholder="请输入备注" v-model="scope.row.remark">
                  </el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <!-- 转款备注 s-->
<!--          <el-form-item label="转款备注" prop="transpayRemark">-->
<!--            <el-input v-model="dataForm.transpayRemark" :disabled="true" />-->
<!--          </el-form-item>-->
          <!-- 转款备注 e-->
          <el-row>
            <el-col :span="12">
              <el-form-item label="确认时间" prop="confirmTime">
                <el-date-picker
                  style="width: 100%"
                  :clearable="false"
                  v-model="dataForm.confirmTime"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择确认时间"
                  :disabled="true"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发货时间" prop="deliverTime">
                <el-date-picker
                  style="width: 100%"
                  :clearable="false"
                  v-model="dataForm.deliverTime"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择发货时间"
                  :disabled="true"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="预计到货时间" prop="planArrivalTime">
                <el-date-picker
                  style="width: 100%"
                  :clearable="false"
                  v-model="dataForm.planArrivalTime"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择预计到货时间"
                  :disabled="true"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预计发票到达时间" prop="planInvoiceTime">
                <el-date-picker
                  style="width: 100%"
                  :clearable="false"
                  v-model="dataForm.planInvoiceTime"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择发票到达时间"
                  :disabled="true"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 确认备注 s-->
          <el-form-item label="确认备注" prop="confirmRemark">
            <el-input v-model="dataForm.confirmRemark" :disabled="true" />
          </el-form-item>
          <!-- 确认备注 e-->
          
          <el-row>
            <el-col :span="12">
              <el-form-item label="验收时间" prop="inspectionTime">
                <el-date-picker
                  style="width: 100%"
                  :clearable="false"
                  v-model="dataForm.inspectionTime"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择验收时间"
                  :disabled="true"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="实际到货时间" prop="actualArrivalTime">
                <el-date-picker
                  style="width: 100%"
                  :clearable="false"
                  v-model="dataForm.actualArrivalTime"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择实际到货时间"
                  :disabled="true"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="发票到达时间" prop="actualInvoiceTime">
                <el-date-picker
                  style="width: 100%"
                  :clearable="false"
                  v-model="dataForm.actualInvoiceTime"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择发票到达时间"
                  :disabled="true"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            
            <!-- <el-col :span="12">
              <el-form-item label="转款人" prop="transpay">
                <el-select
                  style="width: 100%;"
                  v-model="dataForm.transpay"
                  placeholder="请选择"
                  :disabled="true"
                >
                  <el-option
                    v-for="item in approvalData"
                    :key="item.key"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-form-item label="验收备注" prop="inspectionRemark">
            <el-input v-model="dataForm.inspectionRemark" :disabled="true" />
          </el-form-item>
        </el-form>
      
  </div>
</template>

<script>
import API from "@/api";
import { getMatterUserList } from "@/utils/options.js";
import { getOptions } from "@/utils/options.js";
import http from "@/utils/httpRequest.js";
import { connect } from "net";
export default {
  data() {
    return {
      dataList: [],
      showVisible: false,
      showApproval: true,
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
      totalCounted: 0,
      dialogVisible: false,
      fileList: [],
      isAll:[],
      typeOptions: [],
      approvalData: [],
      activeName: "",
      staffSelectData: [],
      visible: false,
      userOptions: [],
      selectData: [],
      options: [],
      isDisabled: false,
      dataForm: {
        purchaseId: 0,
        purchaseName: "",
        purchaseTime: undefined,
        projectId: "",
        count: "",
        transferCompany: "",
        transferNumber: "",
        transferBank: "",
        factoryContact: "",
        factoryPhone: "",
        purchaseAmount: "",
        projectName: "",
        invoiceStatus: "",
        approval: "",
        transferRemark: "",
        confirmRemark: '',
        approvalRemark: '',
        inspectionRemark: '',
        transpay: "",
        deliverTime: undefined,
        confirmTime: undefined,
        planArrivalTime: undefined,
        planInvoiceTime: undefined,
        inspectionTime: undefined,
        actualArrivalTime: undefined,
        actualInvoiceTime: undefined,
        detailData:[]
      },
    };
  },
  components: {},
  created() {
    this.getSelectData();
    getMatterUserList().then(({ data }) => {
      this.userOptions = data.userList;
    });
    // getOptions("KPZT").then(({ data }) => {
    //   this.options = data.dmlxList;
    // });
    // getOptions("QKZT").then(({ data }) => {
    //   this.isAll = data.dmlxList;
    // });
  },
  // activated() {
  //   this.getDataList();
  // },
  methods: {
    getApprovalData() {
      this.$http({
        url: this.$http.adornUrl("/sys/user/allList"),
        method: "get"
      }).then(({ data }) => {
        const approvalData = [];
        data.userList.map((item, index) => {
          approvalData.push({
            key: item.userId,
            label: item.name,
            value: item.userId
          });
        });
        this.approvalData = approvalData;
      });
    },
    //  获取项目列表
    getSelectData() {
      this.$http({
        url: this.$http.adornUrl("/oa/oaproject/list"),
        method: "get",
        params: this.$http.adornParams({
          page: 1,
          limit: 10000
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          const selectData = [];
          data.page.list.map((item, index) => {
            selectData.push({
              key: item.projectId,
              label: item.projectName,
              value: item.projectId
            });
          });
          this.selectData = selectData;
        }
      });
    },
    init(purchaseId) {
      this.options = this.$store.state.options.options['KPZT']
      this.isAll = this.$store.state.options.options['QKZT']
      this.showVisible = false;
      this.getApprovalData();
      this.activeName = "info";
      this.visible = true;
      this.dataForm.purchaseId = purchaseId;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        http({
          url: http.adornUrl("/oa/oapurchase/info/" + purchaseId),
          method: "get"
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.dataForm = data.oaPurchase;
            if (purchaseId) {
              this.showVisible = true;
            }
          }
        });
      });
    },
    // --------------------
    getFileList(purchaseId) {
      this.foreignId=purchaseId
      const param = {
        foreignId: purchaseId,
        foreignType: "5",
        page: this.pageIndex,
        limit: this.pageSize
      };
      this.$http({
        url: this.$http.adornUrl("/oa/oafile/list"),
        method: "get",
        params: this.$http.adornParams(param)
      }).then(({ data }) => {
        if (data.code == 0) {
          this.dataList = data.page.list;
          this.totalCount = data.page.totalCount;
        }
      });
    },
    // ---------------------
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getFileList(this.foreignId);
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getFileList(this.foreignId);
    }
    // ---------------------
  }
};
</script>
