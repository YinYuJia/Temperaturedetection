<template>
  <el-dialog
    width="80%"
    :title="dataForm.repayId == 0 ? '新增' : '修改'"
    :close-on-click-modal="false"
    top="5vh"
    :visible.sync="visible" >
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="info">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
                 label-width="80px">
          <el-row>
            <el-col :span="14">
              <el-form-item label-width="85px" label="项目/需求" prop="foreignType">
                <el-select style="width: 25%" @change="changTypeHandle" :value="dataForm.foreignType" placeholder="请选择">
                  <el-option v-for="item in typeOptions" :key="item.dmId" :label="item.dmsm" :value="item.dmz"/>
                </el-select>
                <el-select v-if="!(dataForm.foreignType==3)" filterable style="width: 70%" v-model="dataForm.foreignId" placeholder="请选择">
                  <el-option v-for="item in selectData" :key="item.key" :label="item.label" :value="item.value"/>
                </el-select>
                <el-input style="width: 70%" v-if="dataForm.foreignType==3" v-model="dataForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="随行人员" label-width="85px" prop="repayStaff">
                <el-select style="width: 100%" multiple v-model="dataForm.repayStaff" placeholder="请选择">
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
                               label="费用发生时间" header-align="center" align="center">
                <template slot-scope="scope">
                            <span v-if="true">
                                <el-date-picker
                                  style="max-width: 140px"
                                  size="small"
                                  v-model="scope.row.repayDetailTime"
                                  type="date"
                                  value-format="yyyy-MM-dd"
                                  placeholder="选择日期时间">
                                  </el-date-picker>
                            </span>
                </template>
              </el-table-column>
              <el-table-column width="150"
                               label="费用发生地点" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-input size="small" placeholder="请输入费用发生地点" v-model="scope.row.repayDetailPlace">
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column width="150"
                               label="费用类型" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-select size="small" v-model="scope.row.repayDetailType" placeholder="请选择">
                    <el-option v-for="item in repayDetailTypeOptions" :key="item.dmId" :label="item.dmsm"
                               :value="item.dmz"/>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column width="150"
                               label="单据类型" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-select size="small" v-model="scope.row.billType" placeholder="请选择">
                    <el-option v-for="item in billTypeOptions" :key="item.dmId" :label="item.dmsm"
                               :value="item.dmz"/>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column width="150"
                               label="金额" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-input size="small" @input="computeTotal" placeholder="请输入金额" v-model="scope.row.repayDetailAmount">
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="内容摘要" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-input size="small" placeholder="请输入内容摘要" v-model="scope.row.content">
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="备注" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-input size="small" placeholder="请输入备注" v-model="scope.row.repayDetailRemark">
                  </el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80" header-align="center" align="center">
                <template slot-scope="scope">
                  <el-button size="small" @click.prevent="removeDomain(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="el-table-add-row" @click="addDomains()"><span>+ 添加</span></div>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="审批人" prop="repayApproval">
                <el-select  style="width: 100%;" v-model="dataForm.repayApproval" placeholder="请选择">
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
      <el-tab-pane label="文件上传" name="file">
        <el-upload
          action=""
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :http-request="fileUploadHandle"
          ref="upload"
          :auto-upload="false">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog append-to-body :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
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
              <el-button type="text" @click="downFileHandle(scope.row)">下载</el-button>
              <el-button type="text" @click="deleteFileHandle(scope.row)">删除</el-button>
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
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :disabled="isDisabled">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import API from '@/api'
  import {getOptions} from '@/utils/options.js'

  export default {
    data() {
      const valType = (rule, value, callback)=>{
        if(value === ''){
          callback(new Error('请选择类型'));
        }else{
          if(this.dataForm.foreignId===''&&this.dataForm.name===''){
            callback(new Error('内容不能为空'));
          }else {
            callback();
          }
        }
      };
      return {
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0,
        dialogVisible: false,
        dialogImageUrl: '',
        activeName: '',
        staffSelectData: [],
        approvalData: [],
        selectData: [],
        visible: false,
        repayDetailTypeOptions: [],
        billTypeOptions:[],
        typeOptions: [],
        repayId: '',
        isDisabled: false,
        fileList: [],
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
          foreignId: '',
          foreignType: '',
          name:'',
          total:undefined
        },
        dataRule: {
          foreignType: [
            // {required: true, message: '项目/需求不能为空', trigger: 'change'}
            {validator:valType, trigger:'change'}
          ],
          detailData: [
            {required: true, message: '报销详细不能为空', trigger: 'blur'}
          ],
          // repayStaff: [
          //   {required: true, message: '随行人员不能为空', trigger: 'blur'}
          // ],
          repayApproval: [
            {required: true, message: '审批人不能为空', trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      init(id) {
        this.activeName = 'info'
        this.dataForm.foreignType = ''
        this.dataForm.name = ''
        this.dataForm.foreignId = ''
        this.selectData = []
        const gcode = this.$store.state.user.gCode
        if (gcode == '03') {
          this.dataForm.repayApproval = '31'
        } else {
          this.dataForm.repayApproval = '33'
        }
        this.repayDetailTypeOptions = this.$store.state.options.options['FYLX'] 
        // getOptions('FYLX').then(({data}) => {
        //   this.repayDetailTypeOptions = data.dmlxList
        // })
        this.typeOptions = this.$store.state.options.options['BXGLLX']
        // getOptions('BXGLLX').then(({data}) => {
        //   this.typeOptions = data.dmlxList
        // })
        this.billTypeOptions = this.$store.state.options.options['DJLX']
        // getOptions('DJLX').then(({data}) => {
        //   this.billTypeOptions = data.dmlxList
        // })
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
                if (data.oaRepay.repayStaff != null) {
                  data.oaRepay.repayStaff.split(",").map((item, index) => {
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
                this.repayId = this.dataForm.repayId
                this.getFileList(this.dataForm.repayId)
                this.getSelectData(this.dataForm.foreignType)
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
        this.isDisabled=true
            var params = {
              'repayId': this.dataForm.repayId || undefined,
              'repayStaff': this.dataForm.repayStaff == null ? '' : this.dataForm.repayStaff.toString(),
              'repayApproval': this.dataForm.repayApproval,
              'detailData': this.dataForm.detailData,
              'foreignId': this.dataForm.foreignId,
              'foreignType': this.dataForm.foreignType,
              'name': this.dataForm.name,
              'total': this.dataForm.total,
            }
            var tick = !this.dataForm.repayId ? API.oarepay.add(params) : API.oarepay.update(params)
            tick.then(({data}) => {
              if (data && data.code === 0) {
                this.repayId = data.oaRepay.repayId
                this.$nextTick(() => {
                  this.$refs.upload.submit();
                  this.$refs.upload.clearFiles();
                })
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 500,
                  onClose: () => {
                    this.visible = false
                    this.$nextTick(()=>{
                        this.isDisabled=false
                      })
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
                 this.$nextTick(()=>{
                        this.isDisabled=false
                      })
              }
            })
          }
        })
      },
      addDomains() {
        this.dataForm.detailData.push({
          repayDetailTime: '',
          repayDetailPlace: '',
          repayDetailType: '1',
          repayDetailAmount: '',
          repayDetailRemark: '',
          billType: '1',
          content:''
        })
      },
      removeDomain(index) {
        this.dataForm.detailData.splice(index, 1)
      },
      changTypeHandle(value) {
        this.dataForm.foreignId = ''
        this.dataForm.foreignType = value
        this.dataForm.name = ''
        this.getSelectData(value)
      },
      getStaffSelectData() {
        this.$http({
          url: this.$http.adornUrl('/sys/user/allList'),
          method: 'get',
        }).then(({data}) => {
          if (data && data.code === 0) {
            const staffSelectData = []
            data.userList.map((item, index) => {
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
        } else if (value == 1) {
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
        }
      },
      getApprovalData() {
        this.$http({
          url: this.$http.adornUrl('/sys/user/allList'),
          method: 'get',
        }).then(({data}) => {
          const approvalData = []
          data.userList.map((item, index) => {
            approvalData.push({key: item.userId.toString(), label: item.name, value: item.userId.toString()})
          })
          this.approvalData = approvalData
        })
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      fileUploadHandle(content) {
        let form = new FormData();
        form.append("file", content.file);
        form.append("foreignId", this.repayId);
        form.append("foreignType", "4");
        this.$http({
          url: this.$http.adornUrl("/oa/oafile/upload"),
          method: "post",
          data: form
        });
      },
      downFileHandle(row) {
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
          }else{
            that.$message.error("下载失败，请联系管理人员")
          }
        };
        xhr.send(formData);
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
      deleteFileHandle(row) {
        this.$http({
          url: this.$http.adornUrl('/oa/oafile/delete/' + row.fileId),
          method: 'get'
        }).then(({data}) => {
          if (data.code == 0) {
            this.$message.success("删除成功")
            this.getFileList(this.repayId)
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      computeTotal(){
        let sum = 0
        this.dataForm.detailData.map((item,index)=>{
          sum = sum + parseFloat(item.repayDetailAmount==""?0:item.repayDetailAmount)
        })
        this.dataForm.total = sum
      }
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
