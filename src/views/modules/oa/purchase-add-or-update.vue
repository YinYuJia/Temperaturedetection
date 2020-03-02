<template>
  <el-dialog
    :title="showVisible == false ? '新增' : '修改'"
    :close-on-click-modal="false"
    width="80%"
    :visible.sync="visible"
  >
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
                <el-input v-model="dataForm.purchaseName" placeholder="请输入采购名称"></el-input>
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
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="采购金额" prop="count">
                <el-input v-model="dataForm.count" placeholder="请输入采购金额"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="发票详情" prop="invoiceStatus">
                <el-select style="width: 100%" v-model="dataForm.invoiceStatus" placeholder="请选择">
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
                <el-input v-model="dataForm.transferCompany" placeholder="请输入转款公司"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="转款账号" prop="transferNumber">
                <el-input v-model="dataForm.transferNumber" placeholder="请输入转款账号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="转款开户行" prop="transferBank">
                <el-input v-model="dataForm.transferBank" placeholder="请输入转款开户行"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="厂家联系人" prop="factoryContact">
                <el-input v-model="dataForm.factoryContact" placeholder="请输入厂家联系人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="厂家电话" prop="factoryPhone">
                <el-input v-model="dataForm.factoryPhone" placeholder="请输入厂家电话"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="审批人" prop="approval">
                <el-select style="width: 100%;" v-model="dataForm.approval" placeholder="请选择">
                  <el-option v-for="item in approvalData" :key="item.key" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="附件上传" name="file" v-if="showVisible">
        <up-file ref="detailFile"></up-file>
      </el-tab-pane>
    </el-tabs>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :disabled="isDisabled">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import API from "@/api";
import { getMatterUserList } from "@/utils/options.js";
import { getOptions } from "@/utils/options.js"; 
import upFile from "./purchase-file";
import http from "@/utils/httpRequest.js";
import { connect } from "net";
export default {
  data() {
    return {
      showVisible: false,
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
        approval:''
      },
      dataRule: {
        purchaseTime: [
          { required: true, message: "采购时间不能为空", trigger: "blur" }
        ],
        count: [
          { required: true, message: "采购金额不能为空", trigger: "blur" }
        ],
        purchaseName: [
          { required: true, message: "采购名称不能为空", trigger: "blur" }
        ],
        invoiceStatus: [
          { required: true, message: "发票状态不能为空", trigger: "blur" }
        ],
        projectId: [
          { required: true, message: "项目名称不能为空", trigger: "blur" }
        ],
        approval:[
          {required: true, message: "审批人不能为空", trigger: "change"}
        ],
      }
    };
  },
  components: {
    upFile
  },
  created() {
    this.getSelectData();
    getMatterUserList().then(({ data }) => {
      this.userOptions = data.userList;
    });
    // getOptions("KPZT").then(({ data }) => {
    //   this.options = data.dmlxList;
    // });
    
  },
activated () {
      this.getDataList()
    }, 
  methods: {
    getApprovalData() {
      this.$http({
        url: this.$http.adornUrl('/sys/user/allList'),
        method: 'get',
      }).then(({data}) => {
        const approvalData = []
        data.userList.map((item, index) => {
          approvalData.push({key: item.userId, label: item.name, value: item.userId})
        })
        this.approvalData = approvalData
      })
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
      this.showVisible = false
      this.getDataList()
      this.getApprovalData()
      this.activeName = "info"
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
              this.$nextTick(() => {
                this.$refs.detailFile.init(purchaseId);
              });
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
    // 表单提交
    dataFormSubmit() {
      
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
      this.isDisabled=true
          var params = {
            purchaseId: this.dataForm.purchaseId || undefined,
            purchaseName: this.dataForm.purchaseName,
            purchaseTime: this.dataForm.purchaseTime,
            projectId: this.dataForm.projectId,
            count: this.dataForm.count,
            transferCompany: this.dataForm.transferCompany,
            transferNumber: this.dataForm.transferNumber,
            transferBank: this.dataForm.transferBank,
            factoryContact: this.dataForm.factoryContact,
            factoryPhone: this.dataForm.factoryPhone,
            invoiceStatus: this.dataForm.invoiceStatus,
            approval:this.dataForm.approval
          };
          var tick = !this.dataForm.purchaseId
            ? API.oapurchase.add(params)
            : API.oapurchase.update(params);
          tick.then(({ data }) => {
           

            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  // this.$nextTick(()=>{
                  //  var beforeTotalCount=this.totalCount.toString()
                  //  console.log(beforeTotalCount)
                  //   // this.getDataList()
                  //   this.totalCounted == data.page.totalCount;
                  //   // console.log(this.totalCounted)
                  //   if(this.totalCounted==beforeTotalCount){
                  //     this.isDisabled=true
                  //   }else{
                  //     this.isDisabled=false
                  //   }
                  // })
                  this.$nextTick(()=>{
                        this.isDisabled=false
                      })
                  this.$emit("refreshDataList");
                }
              });
            } else {
              this.$message.error(data.msg);
               this.$nextTick(()=>{
                        this.isDisabled=false
                      })
            }
          });
        }
      });
    }
    // --------------------
    // ---------------------
  }
};
</script>
