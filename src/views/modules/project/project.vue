<template>
  <div>
    <div class="queryDiv">
      <span>年度</span>
      <el-date-picker
        v-model="inputYear"
        type="year"
        placeholder="选择年">
      </el-date-picker>
      <span>项目名称</span>
      <el-input class="el-input1" v-model="inputName" placeholder="请输入项目名称"></el-input>
      <span>项目所属单位</span>
      <el-input class="el-input1" v-model="inputUnit" placeholder="请输入项目所属单位"></el-input>
      <span>预计完成时间</span>
      <el-date-picker
        v-model="inputTime"
        type="daterange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['00:00:00', '23:59:59']">
      </el-date-picker>
      <el-button @click="query" type="primary">查询</el-button>
      <el-button @click="add" type="primary">添加</el-button>
    </div>
    <div style="margin-top: 20px">
      <el-divider content-position="left">项目信息列表</el-divider>
      <el-table
        :data="dataList"
        stripe
        v-loading="dataListLoading"
        :border="true"
        @row-dblclick="tableDbClickHandle"
        style="width: 100%">
        <el-table-column prop="index" label="序号" width="60">
          <template slot-scope="scope">
            <!--{{scope.$index}}-->
            <!--{{pageIndex}}-->
            <!--{{pageSize}}-->
            <span>{{(pageIndex - 1) * pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="projectName" label="项目名称" width="450"/>
        <el-table-column prop="skillFiledName" label="技术领域" width="250"/>
        <el-table-column prop="subUnit" label="项目所属单位" width="180"/>
        <el-table-column prop="actualTime" label="实际完成时间"/>
        <el-table-column prop="planTime" label="预计完成时间"/>
        <el-table-column prop="projectLeader" label="项目负责人"/>
        <el-table-column prop="submitter" label="添加人员"/>
        <el-table-column prop="submitTime" label="录入时间"/>
        <el-table-column fixed="right" header-align="center" align="center" width="80" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="updateHandle(scope.row.projectId)">修改</el-button>
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
    </div>
    <el-dialog width="80%" top="5vh" :visible.sync="dialogVisible" title="项目信息录入" :close-on-click-modal="false">
      <el-tabs v-model="activeName">
        <el-tab-pane label="信息录入" name="info">
          <el-form :disabled="!nextDis" :model="projectForm" ref="projectForm" label-width="150px" class="demo-projectForm">
            <el-row>
              <el-col :span="24">
                <el-form-item :required="true" label="需求关联" prop="dialogId">
                  <el-select style="width: 100%" filterable v-model="projectForm.dialogId" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item :required="true" label="项目名称" prop="projectName">
                  <el-input v-model="projectForm.projectName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="项目编码" prop="projectCode">
                  <el-input v-model="projectForm.projectCode"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item :required="true" label="技术领域" prop="skillFiled">
                  <el-select style="width: 100%" v-model="projectForm.skillFiled" placeholder="请选择">
                    <el-option v-for="item in skillFiledOptions" :key="item.dmId" :label="item.dmsm" :value="item.dmz"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :required="true" label="项目所属单位" prop="subUnit" >
                  <el-input v-model="projectForm.subUnit"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item :required="true" label="牵头单位" prop="leadUnit">
                  <el-input v-model="projectForm.leadUnit"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :required="true" label="项目负责人" prop="projectLeader">
                  <el-input v-model="projectForm.projectLeader"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="开始时间" prop="startTime"
                              :rules="[{ required: true, message: '请选择开始时间',trigger:'change'}]">
                  <el-date-picker type="date" placeholder="选择日期" v-model="projectForm.startTime"
                                  style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="预计完成时间" prop="planTime"
                              :rules="[{ required: true, message: '请选择预计完成时间',trigger:'change'}]">
                  <el-date-picker type="date" placeholder="选择日期" v-model="projectForm.planTime"
                                  style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="实际完成时间" prop="actualTime"
                              :rules="[{ required: true, message: '请选择实际完成时间',trigger:'change'}]">
                  <el-date-picker type="date" placeholder="选择日期" v-model="projectForm.actualTime"
                                  style="width: 100%;"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="申报金额" prop="declaredAmount">
                  <el-input v-model="projectForm.declaredAmount"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="下达金额" prop="issuedAmount">
                  <el-input v-model="projectForm.issuedAmount"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="中标金额" prop="targetAmount">
                  <el-input v-model="projectForm.targetAmount"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
<!-- 开始start —————————————————————————————————————————————————————————————— -->
            <el-row>
              <el-col :span="24">
            <el-form-item label="详细信息" prop="detailData">
              <el-table
                :data="projectForm.detailData"
                border
              >
                <el-table-column type="index" width="50"
                                 label="序号" header-align="center" align="center">
                </el-table-column>
                <el-table-column label="类型" width="200" header-align="center" align="center">
                  <template slot-scope="scope">
                    <el-select size="small" v-model="scope.row.fileType" placeholder="请选择">
                      <el-option v-for="item in typeOptions" :key="item.dmId" :label="item.dmsm"
                                 :value="item.dmz"/>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="数量" width="140" header-align="center" align="center">
                  <template slot-scope="scope">
                    <el-input size="small" placeholder="请输入数量" v-model="scope.row.count">
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
              <div class="el-table-add-row" @click="addDomains()" ><span>+ 添加</span></div>
            </el-form-item>
              </el-col>
            </el-row>
<!-- 结束  end —————————————————————————————————————————————————————————————— -->
            <el-row>
              <el-col :span="24">
                <el-form-item :required="true" label="主要研究内容" prop="mainContent">
                  <el-input type="textarea" :rows="4" v-model="projectForm.mainContent" placeholder="请输入主要研究内容" maxlength="2500" :show-word-limit="true"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item :required="true" label="预期目标" prop="expectTarget">
                  <el-input type="textarea" :rows="4" v-model="projectForm.expectTarget" placeholder="请输入预期目标" maxlength="250" :show-word-limit="true"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="备注" prop="remark">
                  <el-input type="textarea" :rows="4" v-model="projectForm.remark" placeholder="请输入备注信息" maxlength="2500" :show-word-limit="true"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <div v-if="nextDis" style="margin-left: 45%">
              <el-button style="margin-top: 12px;"  @click="next" :disabled="isDisabled">提交</el-button>
              <el-button style="margin-top: 12px;" @click="back">返回</el-button>
            </div>
          </el-form>
          <div v-if="!nextDis">
            <el-form label-width="150px" class="demo-projectForm">
              <el-form-item label="历史交流记录" prop="hisRecord">
                <ul v-if="hisList.length>0" class="infinite-list">
                  <li style="border: 1px solid #ccc;border-radius: 5px" v-for="(item,index) in hisList" class="infinite-list-item"  :key="index">
                    <span style="color: rgba(0, 0, 0, 0.45);font-size: 12px">&nbsp;{{item.userName}}</span>&nbsp;<span
                    style="color: #ccc;font-size: 12px">{{item.createTime}}</span><br/>
                    <span style="color: rgba(0, 0, 0, 0.65)">&nbsp;{{item.recordContent}}</span>
                  </li>
                </ul>
              </el-form-item>
              <el-form-item label="交流记录" prop="recordList">
                <ul v-if="recordList.length>0" class="infinite-list">
                  <li style="border: 1px solid #ccc;border-radius: 5px" v-for="(item,index) in recordList" class="infinite-list-item" :key="index" >
                    <span style="color: rgba(0, 0, 0, 0.45);font-size: 12px">&nbsp;{{item.userName}}</span>&nbsp;<span
                    style="color: #ccc;font-size: 12px">{{item.createTime}}</span><br/>
                    <span style="color: rgba(0, 0, 0, 0.65)">&nbsp;{{item.recordContent}}</span>
                  </li>
                </ul>
              </el-form-item>
              <el-form-item label="评论" prop="record">
                <el-input class="el-textarea1" type="textarea" :rows="2" v-model="record"></el-input>
              </el-form-item>
              <div style="margin-left: 45%">
                <el-button style="margin-top: 12px;"  @click="comment" :disabled="isDisabled">评论</el-button>
                <el-button style="margin-top: 12px;" @click="back">返回</el-button>
              </div>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <detail ref="detail" :detailVisible="detailVisible" z-index="10000"></detail>
    <update ref="update" :detailVisible="updateVisible" @refreshDataList="getDataList" z-index="10000"></update>
  </div>
</template>

<script>
  import {getOptions} from '@/utils/options.js'
  import detail from './detail'
  import update from './project-update'
  export default {
    components:{
      detail,
      update
    },
    data() {
      return {
        isDisabled: false,
        typeOptions:[],
        detailVisible:false,
        activeName:'info',
        record:'',
        recordList:[],
        hisList:[],
        inputTime:[undefined,undefined],
        nextDis: false,
        options: [],
        skillFiledOptions:[],
        inputYear: '2019',
        inputName: '',
        inputUnit: '',
        dialogVisible: false,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        projectForm: {
          dialogId: '',
          projectName: '',
          projectCode: '',
          skillFiled: '',
          subUnit: '',
          mainContent: '',
          expectTarget: '',
          leadUnit: '',
          projectLeader: '',
          startTime:'',
          actualTime: '',
          planTime: '',
          declaredAmount: '',
          issuedAmount: '',
          targetAmount: '',
          approvalNumber: '',
          remark: '',
          detailData:[],
        },
        dataList: [],
        updateVisible:false
      };
    },
    created() {
      this.getDataList()
      getOptions('WJLX').then(({data})=>{
        this.typeOptions = data.dmlxList
      })
    },
    methods: {
      updateHandle(id){
        this.updateVisible = true
        this.$nextTick(()=>{
          this.$refs.update.init(id)
        })
      },
      getHisRecordData(projectId) {
        this.$http({
          url: this.$http.adornUrl('/oa/oarecord/hisList/'+projectId),
          method: 'get',
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.hisList = data.hisList
          }
        })
      },
      comment() {
        if (this.record != null && this.record.trim() != '') {
          this.isDisabled=true
          this.$http({
            url: this.$http.adornUrl('/oa/oarecord/save'),
            method: 'post',
            data: this.$http.adornData({
              'foreignId': this.projectId,
              'recordContent': this.record,
              'recordType': '2'
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.isDisabled=false
              this.getRecordData(this.projectId)
            }else{
              this.isDisabled = false
              this.$message.error(data.msg)
            }
          })
        }
      },
      getRecordData(projectId) {
        this.$http({
          url: this.$http.adornUrl('/oa/oarecord/list'),
          method: 'get',
          params: this.$http.adornParams({
            'foreignId': projectId,
            'recordType': '2'
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.recordList = data.page.list
          }else{
            this.$message.error(data.msg)
          }
        })
      },
      tableDbClickHandle(row){
        this.handleDetailClick(row.projectId)
      },
      handleDetailClick(projectId) {
        // this.projectId = projectId
        // getOptions('JSLY').then(({data})=>{
        //   this.skillFiledOptions = data.dmlxList
        // })
        // this.dialogVisible = true
        // this.nextDis = false
        // this.$http({
        //   url: this.$http.adornUrl('/oa/oaproject/info/' + projectId),
        //   method: 'get'
        // }).then(({data}) => {
        //   if (data && data.code === 0) {
        //     this.projectForm = data.oaProject
        //     this.getHisRecordData(projectId)
        //     this.getRecordData(projectId)
        //   }
        // })
        this.detailVisible = true;
        this.$nextTick(()=>{
          this.$refs.detail.init(projectId);
        })
      },
      getDataList() {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/oa/oaproject/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'year': this.inputYear,
            'projectName': this.inputName,
            'subUnit': this.inputUnit,
            'planStartTime': this.inputTime[0],
            'planEndTime': this.inputTime[1]
          })
        }).then(({data}) => {
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
      add() {
        getOptions('JSLY').then(({data})=>{
          this.skillFiledOptions = data.dmlxList
        })
        this.$http({
          url: this.$http.adornUrl('/oa/oadialog/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': 1,
            'limit': 100000,
          })
        }).then(({data}) => {
          const options = [];
          data.page.list.map((item, index) => {
            options.push({value: item.dialogId, label: item.dialogName});
          });
          this.options = options;
        })
        this.activeName = 'info'
        this.dialogVisible = true;
        this.nextDis = true;
        if(this.$refs.projectForm!=null){
          this.$refs.projectForm.resetFields();
        }
      },
      next() {
        this.$refs.projectForm.validate((valid) => {
          if (valid) {
            this.isDisabled=true
            this.$http({
              url: this.$http.adornUrl('/oa/oaproject/save'),
              method: 'post',
              data: this.$http.adornData({
                ...this.projectForm
              })
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.isDisabled=false
                this.dialogVisible = false;
                this.query();
              } else {
            this.isDisabled=false
                this.$message.error(data.msg)
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      back() {
        this.dialogVisible = false;
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
      addDomains() {
        this.projectForm.detailData.push({
          fileType: '1',
          count: '1',
          remark: '',
        })
      },
      removeDomain(index) {
        this.projectForm.detailData.splice(index, 1)
      },
    }
  }
 
</script>

<style>

  .el-input1 {
    width: 12%;
  }
  .queryDiv {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .infinite-list {
    padding: 0;
    list-style: none;
    overflow: auto;
    width: 100%;
    margin: 0;
  }

  .infinite-list .infinite-list-item {
    margin: 5px 5px 5px 0px;
    line-height: 20px;
    font-size: 15px;
  }
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

