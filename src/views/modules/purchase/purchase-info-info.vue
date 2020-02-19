<template>
  <el-dialog title="详细" :close-on-click-modal="false" width="80%" :visible.sync="visible">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="info">
        <el-form
          :model="dataForm"
          :rules="dataRule"
          ref="dataForm"
          @keyup.enter.native="dataFormSubmit()"
          label-width="110px"
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
          <el-form-item label="审批备注" prop="approvalRemark">
            <el-input v-model="dataForm.approvalRemark" :disabled="true" />
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="是否全款" prop="transpayIsall">
                <el-select style="width: 100%" v-model="dataForm.transpayIsall" placeholder="请选择">
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
          <el-form-item label="转款详细" :required="true" prop="detailData">
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
                    <el-input size="small" placeholder="请输入转款金额" v-model="scope.row.amount">
                    </el-input>
                  </template>
                </el-table-column>
              <el-table-column label="备注" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-input size="small" placeholder="请输入备注" v-model="scope.row.remark">
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-button size="small" @click.prevent="removeDomain(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div v-if="dataForm.transpayIsall==2||dataForm.detailData.length==0" class="el-table-add-row" @click="addDomains()"><span>+ 添加</span></div>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <span v-if="showApproval" slot="footer" class="dialog-footer">
      <el-button type="primary" @click="approvalStatus(3)">确定转款</el-button>
    </span>
  </el-dialog>
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
      showVisible: false,
      showApproval: true,
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
      totalCounted: 0,
      dialogVisible: false,
      fileList: [],
      typeOptions: [],
      approvalData: [],
      activeName: "",
      staffSelectData: [],
      visible: false,
      userOptions: [],
      selectData: [],
      options: [],
      isAll: [],
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
        transpayRemark: "",
        transpay: "",
        transpayIsall: "",
        transpayAmount: "",
        transpayTime: undefined,
        transpayName: '',
        detailData:[]
      },
      dataRule: {
        transpayIsall: [
          { required: true, message: "是否全款不能为空", trigger: "blur" }
        ],
      }
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
  activated() {
    this.getDataList();
  },
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
      this.getDataList();
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
    getDataList() {
      this.dataListLoading = true;
      var params = {
        page: this.pageIndex,
        limit: this.pageSize,
        user_id: this.dataForm.userId
      };
      http({
        url: http.adornUrl("/oa/oapurchase/list"),
        method: "get",
        params: http.adornParams(params, "get")
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list;
          this.totalCount = data.page.totalCount;
        } else {
          this.$message.error(data.msg);
        }
        this.dataListLoading = false;
      });
    },
    // --------------------
    // --------转款状态----------
    approvalStatus(status) {

        this.$refs["dataForm"].validate(valid => {
          if (valid) {
            this.$confirm(`当前状态${this.dataForm.transpayIsall==1?'是':'不是'}全款,是否确认`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(()=>{
            this.$http({
              url: this.$http.adornUrl("/oa/oapurchase/approval"),
              method: "post",
              data: this.$http.adornData({
                purchaseId: this.dataForm.purchaseId,
                transpayRemark: this.dataForm.transpayRemark,
                transpay: this.dataForm.transpay,
                transpayIsall: this.dataForm.transpayIsall,
                transpayTime: this.dataForm.transpayTime,
                transpayAmount: this.dataForm.transpayAmount,
                approvalStatus: status,
                detailData: this.dataForm.detailData
                // transpayName: this.dataForm.transpayName
              })
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 500,
                  onClose: () => {
                    this.visible = false;
                    this.$emit("refreshDataList");
                  }
                });
                this.$parent.detailViewChange(false);
                this.$parent.getDataList();
              }
            });
            })
          }})
    },
    addDomains() {
      console.log(this.dataForm.detailData)
      this.dataForm.detailData.push({
        time: '',
        amount: '',
        remark:''
      })
    },
    removeDomain(index) {
      this.dataForm.detailData.splice(index, 1)
    },
    // ---------------------
  }
};
</script>

<style>
  .el-table-add-row {
    margin-top: 10px;
    width: 100%;
    height: 34px;
    border: 1px dashed #c1c1cd;
    border-radius: 3px;
    cursor: pointer;
    justify-content: center;
    display: flex;
    line-height: 34px;
  }
</style>
