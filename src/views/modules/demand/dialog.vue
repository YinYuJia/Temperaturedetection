<template>
  <div>
    <div class="queryDiv">
      <span>年度</span>
      <el-date-picker v-model="inputYear" type="year" placeholder="选择年"></el-date-picker>
      <span>名称</span>
      <el-input class="el-input1" v-model="inputName" placeholder="请输入名称"></el-input>
      <span>地区</span>
      <el-input class="el-input1" v-model="inputArea" placeholder="请输入地区"></el-input>
      <span>提交人</span>
      <el-select v-model="submitter" filterable :clearable="true" placeholder="请选择提交人">
        <el-option
          v-for="item in selectOptions"
          :key="item.key"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button @click="query" type="primary">查询</el-button>
      <el-button @click="add" type="primary">新增</el-button>
    </div>
    <div style="margin-top: 20px" >
      <el-divider content-position="left">需求信息列表</el-divider>
      <el-table
        :data="dataList"
        stripe
        v-loading="dataListLoading"
        :border="true"
        @row-dblclick="tableDbClick"
        style="width: 100%"
        
      >
        <el-table-column prop="index" label="序号" width="100">
          <template slot-scope="scope">
            <!--{{scope.$index}}-->
            <!--{{pageIndex}}-->
            <!--{{pageSize}}-->
            <span>{{(pageIndex - 1) * pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dialogId" label="序号" v-if="false" width="60" />
        <el-table-column prop="dialogName" label="需求名称" width="450" :show-overflow-tooltip="true" />
        <el-table-column prop="belongArea" label="所属地区" />
        <el-table-column prop="customLeader" label="客户负责人"  :show-overflow-tooltip="true"/>
        <el-table-column prop="phone" label="联系电话" />
        <el-table-column prop="submitter" label="提交人" />
        <el-table-column prop="submitTime" label="提交时间" />
        <el-table-column prop="approvalStatus" label="审批状态">
          <template
            slot-scope="scope"
          >{{scope.row.approvalStatus==null?'':scope.row.approvalStatus==0?'未审批':scope.row.approvalStatus==1?'审批通过':'审批不通过'}}</template>
        </el-table-column>
        <el-table-column fixed="right" header-align="center" align="center" width="80" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="updateHandle(scope.row.dialogId)">修改  </el-button>
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
    </div>
    <el-dialog width="80%" :visible.sync="dialogVisible" title="需求信息录入" :close-on-click-modal="false" >
      <el-steps style="width: 50%;margin-left: 25%" :active="active" finish-status="success">
        <el-step title="需求信息"></el-step>
        <el-step title="详细信息"></el-step>
        <el-step title="审批人"></el-step>
      </el-steps>
      <el-form :model="demandForm" ref="demandForm" label-width="100px" class="demo-demandForm">
        <div style="margin-left: 25%" v-show="active==0">
          <el-form-item :required="true" label="需求名称" prop="dialogName" >
            <el-input class="el-input3" v-model="demandForm.dialogName" placeholder="请输入需求名称" :show-word-limit="true"  maxlength="50" ></el-input>
          </el-form-item>
          <el-form-item :required="true" label="所属地区" prop="belongArea">
            <el-input class="el-input3" v-model="demandForm.belongArea" placeholder="请输入地区" :show-word-limit="true"  maxlength="25"></el-input>
          </el-form-item>
          <el-form-item :required="true" label="客户负责人" prop="customLeader">
            <el-input class="el-input3" v-model="demandForm.customLeader" placeholder="请输入客户负责人" :show-word-limit="true"  maxlength="10"></el-input>
          </el-form-item>
          <el-form-item :required="true" label="联系电话" prop="phone">
            <el-input class="el-input3" v-model="demandForm.phone" placeholder="请输入联系电话"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <el-form :model="detailForm" ref="detailForm" label-width="180px" class="demo-demandForm">
        <div v-show="active==1">
          <el-form-item :required="true" label="现状描述分析" prop="backDescrip">
            <el-input
              class="el-textarea1"
              type="textarea"
              :autosize="{minRows:6,maxRows:100}"
              v-model="detailForm.backDescrip"
              placeholder="请输入描述分析"
              :show-word-limit="true"
              maxlength="2500"
            ></el-input>
          </el-form-item>
          <el-form-item :required="true" label="客户的解决方案" prop="solution">
            <el-input
              class="el-textarea1"
              type="textarea"
              :autosize="{minRows:6,maxRows:100}"
              v-model="detailForm.solution"
              placeholder="请输入客户的解决方案"
              :show-word-limit="true"
              maxlength="2500"
            ></el-input>
          </el-form-item>
          <!--<el-form-item :required="true" label="问题总结" prop="problem">-->
          <!--<el-input class="el-textarea1" type="textarea" :rows="3" v-model="detailForm.problem"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item :required="true" label="技术难点" prop="skill" >
            <el-input
              class="el-textarea1"
              type="textarea"
              :autosize="{minRows:6,maxRows:100}"
              v-model="detailForm.skill"
              placeholder="请输入技术难点"
              :show-word-limit="true"
              maxlength="2500"
            ></el-input>
          </el-form-item>
          <!--<el-form-item :required="true" label="问题存在的普遍性" prop="problemUniversal">-->
          <!--<el-input class="el-textarea1" type="textarea" :rows="3" v-model="detailForm.problemUniversal"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item :required="true" label="同类产品分析" prop="productAnaly">-->
          <!--<el-input class="el-textarea1" type="textarea" :rows="3" v-model="detailForm.productAnaly"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item :required="true" label="现有产品的照片及缺陷" prop="defect">-->
          <!--<el-input class="el-textarea1" type="textarea" :rows="3" v-model="detailForm.defect"></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item :required="true" label="局方落地部门及联系人" prop="localContact">-->
          <!--<el-input class="el-textarea1" type="textarea" :rows="1" v-model="detailForm.localContact"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="其他需求" prop="checkList">
            <el-checkbox-group v-model="detailForm.checkList">
              <el-checkbox label="论文"></el-checkbox>
              <el-checkbox label="专利"></el-checkbox>
              <el-checkbox label="软著"></el-checkbox>
              <el-checkbox label="查新"></el-checkbox>
              <el-checkbox label="第三方测试"></el-checkbox>
              <el-checkbox label="典型性经验"></el-checkbox>
              <el-checkbox label="管理创新"></el-checkbox>
              <el-checkbox label="QC"></el-checkbox>
              <el-checkbox label="报奖汇报PPT"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item :required="true" label="已有材料" prop="existData">
            <el-input
              class="el-textarea1"
              type="textarea"
              :autosize="{minRows:6,maxRows:100}"
              v-model="detailForm.existData"
              placeholder="请输入已有材料"
              :show-word-limit="true"
              maxlength="2500"
            ></el-input>
            <el-upload
              class="upload-demo"
              ref="upload"
              :drag="true"
              action
              :http-request="fileUploadHandle"
              :on-preview="handlePreview"
              :on-change="handleChange"
              :auto-upload="false"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
            </el-upload>
          </el-form-item>
          <!--<el-form-item :required="true" label="重要标志" prop="important">-->
          <!--<el-radio-group v-model="detailForm.important">-->
          <!--<el-radio label="1" border>重要</el-radio>-->
          <!--<el-radio label="0" border>一般</el-radio>-->
          <!--</el-radio-group>-->
          <!--</el-form-item>-->
        </div>
      </el-form>
      <el-form
        v-show="active==2"
        style="margin-left: 25%"
        :model="approvalForm"
        ref="approvalForm"
        label-width="100px"
        class="demo-demandForm"
      >
        <el-form-item
          label="审批人"
          prop="approvalList"
          :rules="[{ required: true, message: '审批人不能为空',trigger:'change'}]"
        >
          <el-transfer
            :titles="['待选', '已选']"
            :button-texts="['取消', '选择']"
            v-model="approvalForm.approvalList"
            :data="approvalData"
          ></el-transfer>
        </el-form-item>
      </el-form>
      <div style="margin-left: 45%">
        <el-button style="margin-top: 12px;" @click="back">{{stepBackMessge}}</el-button>
        <el-button style="margin-top: 12px;" @click="next" :disabled="isDisabled">{{stepNextMessge}}</el-button>
      </div>
    </el-dialog>
    <detail ref="detail" :detailVisible="detailVisible" z-index="10000" ></detail>
    <update ref="update" :detailVisible="updateVisible" @refreshDataList="getDataList" z-index="10000"></update>
  </div>
</template>

<script>
import detail from "./detail";
import update from "./dialog-update";

export default {
  components: {
    detail,
    update
  },
  data() {
    return {
      activeName:"info",
      isDisabled: false,
      updateVisible: false,
      submitter: "",
      selectOptions: [],
      approvalData: [],
      detailVisible: false,
      dialogId: undefined,
      inputYear: "2019",
      inputArea: "",
      inputName: "",
      dialogVisible: false,
      active: 0,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      stepNextMessge: "下一步",
      stepBackMessge: "返回",
      demandForm: {
        dialogName: "",
        belongArea: "",
        customLeader: "",
        phone: ""
      },
      detailForm: {
        backDescrip: "",
        solution: "",
        problem: "",
        skill: "",
        problemUniversal: "",
        productAnaly: "",
        defect: "",
        localContact: "",
        existData: "",
        checkList: [],
        important: ""
      },
      detailFormData: { checkList: [], fileList: [] },
      dataList: [],
      approvalForm: {
        approvalList: []
      },
    };
  },
  created() {
    this.$http({
      url: this.$http.adornUrl("/sys/user/allList"),
      method: "get"
    }).then(({ data }) => {
      if (data && data.code === 0) {
        const selectOptions = [];
        data.userList.map((item, index) => {
          selectOptions.push({
            key: item.userId.toString(),
            label: item.name,
            value: item.userId.toString()
          });
        });
        this.selectOptions = selectOptions;
      }
    });
    this.getDataList();
    this.getApprovalData();
  },
  methods: {
    // 点击修改按钮弹出事件
    updateHandle(id) {
      this.updateVisible = true;
      this.$nextTick(() => {
        this.$refs.update.init(id);
        this.id=id
      });
    },
    download(data, row) {
      if (!data) {
        return;
      }
      let url = window.URL.createObjectURL(new Blob([data]));
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      // 获取文件名
      // download 属性定义了下载链接的地址而不是跳转路径
      link.setAttribute("download", row);
      document.body.appendChild(link);
      link.click();
    },
    fileUploadHandle(content) {
      let form = new FormData();
      form.append("file", content.file);
      form.append("foreignId", this.dialogId);
      form.append("foreignType", "1");
      this.$http({
        url: this.$http.adornUrl("/oa/oafile/upload"),
        method: "post",
        data: form
      });
    },
    getApprovalData() {
      this.$http({
        url: this.$http.adornUrl("/sys/user/approvalList"),
        method: "get"
      }).then(({ data }) => {
        const approvalData = [];
        data.userList.map((item, index) => {
          approvalData.push({ key: item.userId, label: item.name });
        });
        this.approvalData = approvalData;
      });
    },
    detailViewChange(flag) {
      this.detailVisible = flag;
    },
    //   点击弹出详细框
    tableDbClick(row,column) {
      //  此状态下的form表单全部禁用 
      //  点击外部不会消失表单
      this.detailVisible = true;
      this.$nextTick(() => {
        this.$refs.detail.init(row.dialogId);
        
      });
      
      // 调用表单禁用函数
    },
    //   表单禁用函数

    /* 不合乎规范 
     killTableForm(){
      let input=document.getElementsByTagName("el-input")
      input.style=("disabled","ture")
    },
     */
   
    handlePreview(file) {
      // this.$http({
      //   url: this.$http.adornUrl('/oa/oafile/down/31'),
      //   method: 'get',
      // }).then((response)=>{
      //   this.download(response.data,file.name)
      // })
      // axios.get(this.$http.adornUrl('/oa/oafile/down/16?tunnel_token='+this.$cookie.get('tunnel_token')))
    },
    handleChange(file, fileList) {
      // console.log(fileList)
      // fileList.map((item,index)=>{
      //   if(item.name == file.name){
      //     this.$message.warning("存在重复的文件名，请检查后再上传")
      //   }
      // })
    },
    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/oa/oadialog/list"),
        method: "get",
        params: this.$http.adornParams({
          page: this.pageIndex,
          limit: this.pageSize,
          year: this.inputYear,
          dialogName: this.inputName,
          belongArea: this.inputArea,
          submitter: this.submitter
        })
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
    query() {
      this.pageIndex = 1;
      this.getDataList();
    },
    // 新增
    add() {
      this.dialogVisible = true;
      this.active = 0;
      this.stepNextMessge = "下一步";
    },
    // 上一步
    back() {
      if (this.active == 0) {
        this.dialogVisible = false;
      } else if (this.active == 2) {
        this.active--;
        this.stepBackMessge = "上一步";
        this.stepNextMessge = "下一步";
      } else {
        this.active--;
        this.stepBackMessge = "返回";
        this.stepNextMessge = "下一步";
      }
    },
    // 下一步
    next() {
      if (this.active == 0) {
        this.$refs.demandForm.validate(valid => {
          if (valid) {
            this.stepNextMessge = "下一步";
            this.stepBackMessge = "上一步";
            this.active++;
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else if (this.active == 1) {
        this.$refs.detailForm.validate(valid => {
          if (valid) {
            this.stepNextMessge = "提交";
           
            this.stepBackMessge = "上一步";
            this.active++;
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else if (this.active == 2) {
        // this.$refs.upload.submit();
        this.$refs.approvalForm.validate(valid => {
          if (valid) {
            this.isDisabled=true
            this.$http({
              url: this.$http.adornUrl("/oa/oadialog/save"),
              method: "post",
              data: this.$http.adornData({
                ...this.demandForm,
                ...this.detailForm,
                approvalList: this.approvalForm.approvalList.toString(),
                otherRequirement: this.detailForm.checkList.toString()
              })
            }).then(({ data }) => {
              if (data && data.code === 0) {
                //     this.$message({
                //   message: '提交成功',
                //   type: 'success',
                //   duration: 1500,
                //   onClose: () => {
                //     this.visible = false
                //     this.$nextTick(()=>{
                //       this.isDisabled=false
                //     })
                //     this.$emit('refreshDataList')
                //   }
                // })
                // console.log(this.$refs.upload);
                // this.$refs.upload.$options.propsData.action = this.$refs.upload.action+data.oaDialog.dialogId
                // this.$refs.upload.action = this.$refs.upload.action+data.oaDialog.dialogId
                // console.log(this.$refs.upload);
                this.dialogId = data.oaDialog.dialogId;
                //    弹窗关闭
                this.dialogVisible = false;
                this.query();
                this.$refs.demandForm.resetFields();
                this.$refs.detailForm.resetFields();
                this.$refs.approvalForm.resetFields();
                this.active = 0;
                this.stepBackMessge = "返回";
                this.stepNextMessge = "下一步";
                this.$refs.upload.submit();
                this.$refs.upload.clearFiles();
                 this.$nextTick(()=>{
                      this.isDisabled=false
                    })
              }else{
                this.isDisabled = false
                this.$message.error(data.msg)
              }
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    }
  }
};
</script>

<style>
.mod-home {
  line-height: 1.5;
}

.el-input1 {
  width: 12%;
}

.el-input3 {
  width: 55%;
}

.el-textarea1 {
  width: 100%;
}

.queryDiv {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>

