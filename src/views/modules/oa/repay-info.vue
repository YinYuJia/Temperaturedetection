<template>
  <el-dialog
    width="70%"
    title="财务报销详细"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="info">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm"
             label-width="80px">
      <el-row>
        <el-col :span="14">
          <el-form-item label-width="85px" label="项目/需求" >
            <el-select :disabled="true" style="width: 25%" :value="dataForm.foreignType" placeholder="请选择">
              <el-option v-for="item in typeOptions" :key="item.dmId" :label="item.dmsm" :value="item.dmz"/>
            </el-select>
            <el-select v-if="!(dataForm.foreignType==3)" :disabled="true" style="width: 70%" v-model="dataForm.foreignId" placeholder="请选择">
              <el-option v-for="item in selectData" :key="item.key" :label="item.label" :value="item.value"/>
            </el-select>
            <el-input :disabled="true" style="width: 70%" v-if="dataForm.foreignType==3" v-model="dataForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="随行人员" label-width="85px" prop="repayStaff">
            <el-select style="width: 100%" multiple v-model="dataForm.repayStaff" placeholder="请选择" :disabled="true">
              <el-option v-for="item in staffSelectData" :key="item.key" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="详细信息" :required="true" label-width="85px" prop="detailData">
        <el-table
          :data="dataForm.detailData"
          border
        >
          <el-table-column type="index" width="50"
                           label="序号" header-align="center" align="center">
          </el-table-column>
          <el-table-column width="180"
                           label="费用发生时间" header-align="center" align="center" prop="repayDetailTime">
          </el-table-column>
          <el-table-column width="150"
                           label="费用发生地点" header-align="center" align="center" prop="repayDetailPlace">
          </el-table-column>
          <el-table-column width="150"
                           label="费用类型" header-align="center" align="center" prop="repayDetailTypeName" >
          </el-table-column>
          <el-table-column width="150"
                           label="单据类型" header-align="center" align="center" prop="billTypeName" >
          </el-table-column>
          <el-table-column width="150"
                           label="金额" header-align="center" align="center" prop="repayDetailAmount">
          </el-table-column>
          <el-table-column label="内容摘要" header-align="center" align="center" prop="content">
          </el-table-column>
          <el-table-column label="备注" header-align="center" align="center" prop="repayDetailRemark">
          </el-table-column>
          
        </el-table>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="审批人" prop="repayApproval">
            <el-select :disabled="true" style="width: 100%;" v-model="dataForm.repayApproval" placeholder="请选择">
              <el-option v-for="item in approvalData" :key="item.key" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="金额总计" prop="total">
            <el-input disabled v-model="dataForm.total"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
      </el-tab-pane>
      <el-tab-pane name="file" label="文件信息">
        <el-table
          v-if="dataForm.repayId != 0"
          :data="fileList"
          border
          style="width: 100%;">
          <el-table-column prop="index" label="序号" width="80">
            <template slot-scope="scope">
              <span>{{(pageIndex - 1) * pageSize + scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="fileName" label="文件名" header-align="center" align="center"/>
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="150"
            label="操作">
            <template slot-scope= "scope">
              <el-button type="text" @click="downFileHandle(scope.row,2)">预览</el-button>
              <el-button type="text" @click="downFileHandle(scope.row,1)">下载</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-if="dataForm.repayId != 0"
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalCount"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
    <file-preview ref="filePreview" v-if="previewVisible"></file-preview>
  </el-dialog>
</template>

<script>
  import API from '@/api'
  import filePreview from '../../common/file-preview'
  export default {
    components:{
      filePreview
    },
    data() {
      return {
        url:'',
        previewVisible:'',
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0,
        fileList:[],
        activeName:'info',
        staffSelectData:[],
        approvalData: [],
        selectData: [],
        visible: false,
        repayDetailTypeOptions:[],
        typeOptions:[],
        dmsm:'',
        dataForm: {
          type: '',
          id: '',
          detailData: [],
          repayId: 0,
          repayStaff: '',
          dialogId: '',
          dialogName: '',
          projectId: '',
          projectName: '',
          repayApproval: '',
          repayCreateTime: '',
          repayCreatePerson: '',
          foreignId:'',
          foreignType:''
        },
        dataRule: {
          foreignId: [
            {required: true, /*message: '项目/需求不能为空', trigger: 'change'*/}
          ],
          detailData: [
            {required: true,/* message: '报销详细不能为空', trigger: 'blur'*/}
          ],
          // repayStaff: [
          //   {required: true, /*message: '随行人员不能为空', trigger: 'blur'*/}
          // ],
          repayApproval: [
            {required: true, /*message: '审批人不能为空', trigger: 'blur'*/}
          ],
        }
      }
    },
    methods: {
      init(id) {
        this.dataForm.foreignType = ''
        this.selectData = []
        this.repayDetailTypeOptions = this.$store.state.options.options['FYLX']
        this.typeOptions = this.$store.state.options.options['BXGLLX']
        this.getStaffSelectData()
        this.getApprovalData()
        this.dataForm.repayId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.repayId) {
            API.oarepay.info(this.dataForm.repayId).then(({data}) => {
              if (data && data.code === 0) {
                const list = []
                if(data.oaRepay.repayStaff!=null){
                  data.oaRepay.repayStaff.split(",").map((item,index)=>{
                    list.push(parseInt(item))
                  })
                }
                this.dataForm.repayStaff = list
                this.dataForm.repayApproval = data.oaRepay.repayApproval
                this.dataForm.detailData = data.oaRepay.detailData
                // if (data.oaRepay.projectId != null) {
                //   this.dataForm.type = '1'
                //   this.dataForm.id = data.oaRepay.projectId
                // } else {
                //   this.dataForm.type = '2'
                //   this.dataForm.id = data.oaRepay.dialogId
                // }
                this.dataForm.foreignId = data.oaRepay.foreignId
                this.dataForm.foreignType = data.oaRepay.foreignType
                this.dataForm.name = data.oaRepay.name
                this.dataForm.total = data.oaRepay.total
                this.getSelectData(this.dataForm.foreignType)
                this.getFileList(this.dataForm.repayId)
              }
            })
          }
        })
      },
      // 表单提交
      getStaffSelectData(){
        this.$http({
          url: this.$http.adornUrl('/sys/user/allList'),
          method: 'get',
        }).then(({data})=>{
          if (data && data.code === 0) {
            const staffSelectData = []
            data.userList.map((item,index)=>{
              staffSelectData.push({
                key: item.userId,
                label: item.name,
                value: item.userId
              })
            })
            this.staffSelectData = staffSelectData
          }
        })
      },
      getSelectData(value) {
        if (value == 2) {
          this.$http({
            url: this.$http.adornUrl('/oa/oaproject/list'),
            method: 'get',
            params: this.$http.adornParams({
              'page': 1,
              'limit': 10000,
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              const selectData = []
              data.page.list.map((item, index) => {
                selectData.push({
                  key: item.projectId,
                  label: item.projectName,
                  value: item.projectId
                })
              })
              this.selectData = selectData
            }
          })
        } else if(value == 1){
          this.$http({
            url: this.$http.adornUrl('/oa/oadialog/list'),
            method: 'get',
            params: this.$http.adornParams({
              'page': 1,
              'limit': 10000,
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              const selectData = []
              data.page.list.map((item, index) => {
                selectData.push({
                  key: item.dialogId,
                  label: item.dialogName,
                  value: item.dialogId
                })
              })
              this.selectData = selectData
            }
          })
        }else{
          const selectData = []
          selectData.push({
            key:1,
            label:'其他',
            value:1
          })
          this.selectData = selectData
        }
      },
      downFileHandle(row,type) {
        const that = this
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        xhr.open('get', window.SITE_CONFIG['baseUrl'] + '/oa/oafile/down/' + row.fileId);  //url填写后台的接口地址，如果是post，在formData append参数（参考原文地址）
        xhr.setRequestHeader("tunnel_token", this.$cookie.get("tunnel_token"));
        xhr.responseType = 'blob';
        xhr.onload = function (e) {
          if (this.status == 200&&this.response!=null&&this.response.size>0) {
            const blob = this.response;
            const filename = row.fileName;
            // let blob1 = new Blob([this.response]);
            // that.url = window.URL.createObjectURL(blob1);
            // console.log(that.url)
            if(type == 1){
              if (window.navigator.msSaveOrOpenBlob) {
                navigator.msSaveBlob(blob, filename);
              } else {
                const a = document.createElement('a');
                const url = URL.createObjectURL(blob);
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
              }
            }else if(type == 2){
              const url = window.URL.createObjectURL(blob)
              that.previewVisible = true
              that.$nextTick(()=>{
                that.$refs.filePreview.init(url)
              })
            }
          }else{
            if(type == 1){
              that.$message.error("下载失败，请联系管理人员")
            }else{
              that.$message.error("预览失败，请联系管理人员")
            }
          }
        };
        xhr.send(formData);
      },
      getApprovalData() {
        this.$http({
          url: this.$http.adornUrl('/sys/user/allList'),
          method: 'get',
        }).then(({data}) => {
          const approvalData = []
          data.userList.map((item, index) => {
            approvalData.push({key: item.userId.toString(), label: item.name,value:item.userId.toString()})
          })
          this.approvalData = approvalData
        })
      },
      getFileList(repayId) {
        const param = {
          foreignId: repayId,
          foreignType: '4',
          page: this.pageIndex,
          limit: this.pageSize
        }
        this.$http({
          url: this.$http.adornUrl('/oa/oafile/list'),
          method: 'get',
          params: this.$http.adornParams(param)
        }).then(({data}) => {
          if (data.code == 0) {
            this.fileList = data.page.list
            this.totalCount = data.page.totalCount
          }
        })
      },
      // 每页数
      sizeChangeHandle(val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getFileList(this.repayId)
      },
      // 当前页
      currentChangeHandle(val) {
        this.pageIndex = val
        this.getFileList(this.repayId)
      },
    }
  }
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
